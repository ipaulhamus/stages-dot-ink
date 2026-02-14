/*
 * Viewing console logs:
 * - Main process logs (console.log in this file) appear in the terminal that launched the Electron app.
 * - Renderer logs (console.log inside the loaded page) appear in the renderer DevTools:
 *     - Open DevTools from the app menu or use the keyboard shortcut (Ctrl+Shift+I on Windows/Linux, Cmd+Option+I on macOS).
 *     - Programmatically open DevTools for the created window: win.webContents.openDevTools().
 * - To forward renderer logs to the terminal during development, run Electron with logging enabled (e.g. set ELECTRON_ENABLE_LOGGING=1 or use --enable-logging).
 */

import { fetchScedule, parseSceduleData, returnRotationByType } from './workspace/js/api.js';
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { ColorSettingsIndex } from './workspace/js/settingsReferences.js';
import { saveWindowPosition, saveWindowColors, saveWindowSize, loadWindowColors, loadWindowPosition } from './workspace/js/settings.js';
import { execSync } from 'child_process';
import { Console } from 'console';
import { platform } from 'os';

const dataTypes = ["regularSchedules", "bankaraSchedules", "bankaraSchedules-series", "xSchedules", "festSchedules"];

//== Window Creation and App Lifecycle ==//

//Creating a window that functions like a desktop widget to display the current schedule data from the API. This will be the main window of the app and will load the main.html file.
const createWindow = () => {
    const win = new BrowserWindow({
        //width: 480,
        width: 480,
        height: 1000,
        focusable: true,
        fullscreenable: false,
        skipTaskbar: true,
        frame: false,
        transparent: true,
        alwaysOnTop: false,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadFile("./main.html");
    //win.webContents.openDevTools();
}

// When a window finishes loading, fetch schedule in the main process and update the renderer DOM
app.on("browser-window-created", (event, window) => {
    window.webContents.on("did-finish-load", async () => {

        //Loading in settings upon opening the page//
        await loadWindowPosition(window);

        const savedColors = await loadWindowColors();
        window.webContents.send('update-colors', savedColors ?? ColorSettingsIndex.DEFAULT);
        //=========================================//
        
        handleFetchSchedule(window);

        setInterval(() => {
            console.log("===== Filling Scedule Data! =====");
            handleFetchSchedule(window);
        }, 100_000);
    });
});

app.whenReady().then(() => { 
    createWindow();

    app.on("activate", () => {
        if(BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
});

//== IPC Event Listeners for Settings ==//

ipcMain.on('fetch-schedule', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) {
        console.error('Window not found for fetch-schedule');
        return;
    }

    handleFetchSchedule(window);
});

ipcMain.on('save-window-position', (event, data) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    
    if (!window) {
        console.error('Window not found');
        return;
    }
    
    if (data.x === undefined || data.y === undefined) {
        console.error('Position data is missing x or y:', data);
        return;
    }
    
    const clampedPosition = clampWindowPosition(window, data.x, data.y);

    console.log('Received position data:', data);
    console.log('Clamped window position to: x=' + clampedPosition.x + ', y=' + clampedPosition.y);
    
    saveWindowPosition(window, clampedPosition.x, clampedPosition.y);
    
    // Get current bounds and update position
    const currentBounds = window.getBounds();
    window.setBounds({
        x: clampedPosition.x,
        y: clampedPosition.y,
        width: currentBounds.width,
        height: currentBounds.height
    });
    
    if(process.platform == 'linux') {
        //Had to ask AI to figure out why this wasn't working on Linux
        //These commands use the package 'wmctrl' and 'xdotool' to move the windows, only usable on X11
        try {
            const windowId = window.getMediaSourceId();
            execSync(`wmctrl -r "main-view" -b remove,maximized_vert,maximized_horz -e "0,${clampedPosition.x},${clampedPosition.y},-1,-1"`);
            console.log('Moved window using wmctrl');
        } catch (e) {
            console.warn('wmctrl not available or failed, trying xdotool...');
            try {
                // Alternative: try xdotool
                execSync(`xdotool getactivewindow windowmove ${clampedPosition.x} ${clampedPosition.y}`);
                console.log('Moved window using xdotool');
            } catch (e2) {
                console.warn('xdotool also failed - GNOME may be blocking window movement');
            }
        }
    }
    
    setTimeout(() => {
        const bounds = window.getBounds();
        console.log('Window position after setBounds (Applicable to windows & mac): ', bounds.x, bounds.y);
    }, 100);
});

ipcMain.on('save-window-colors', (event, themeName) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    const colorSettings = ColorSettingsIndex[themeName.toUpperCase()];
    if (colorSettings) {
        saveWindowColors(window, colorSettings);
        window.webContents.send('update-colors', colorSettings);
    } else {
        console.error(`Unknown theme: ${themeName}`);
    }
});

ipcMain.on('save-window-size', (event, sizeName) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    saveWindowSize(window, sizeName);
});

//Ending the app's process if all windows are closed and we're on Windows or Linux
app.on("window-all-closed", () => {
    if(process.platform !== "darwin") {
        app.quit();
    }
    else {
        console.log("All windows closed, but not quitting on macOS");
    }
});

//== Window Setup End ==//

function handleFetchSchedule(window) {
    fetchScedule()
        .then(data => {
            if (data) {
                let regularData;
                let bankaraData;
                let bankaraSeriesData;
                let xData;
                let festData;

                FillScheduleData(window, dataTypes, data, bankaraData, bankaraSeriesData, regularData, xData, festData);
            }
        })
        .catch(error => {
            console.error("Error fetching schedule:", error);
            window.webContents.executeJavaScript(
                `const errorEl = document.getElementById("error-div"); 
                if (errorEl) errorEl.style.display = "block";
                const mainDiv = document.getElementById("main-content");
                if(mainDiv) mainDiv.style.display = "none";`
            ).catch(err => console.error("executeJavaScript error:", err));
        });
}

function clampWindowPosition(window, desiredX, desiredY) {
    const bounds = window.getBounds();
    const display = screen.getDisplayMatching(bounds);
    const { x, y, width, height } = display.workArea;

    const maxX = x + width - bounds.width;
    const maxY = y + height - bounds.height;

    const clampedX = Math.min(Math.max(desiredX, x), maxX);
    const clampedY = Math.min(Math.max(desiredY, y), maxY);

    return { x: clampedX, y: clampedY };
}

function FillScheduleDiv(window, titleEl, timeEl, stagesEl, mode, startTime, endTime, stages) {
    window.webContents.executeJavaScript(
        `  
            document.getElementById("${titleEl}").innerText = "${mode}";
            document.getElementById("${timeEl}").innerText = "${startTime} - ${endTime}";
            document.getElementById("${stagesEl}").innerText = "${stages.map(stage => `${stage.name}`).join(' / ')}";
        `
    ).catch(err => console.error('executeJavaScript error:', err));
}

function FillScheduleData(window, dataTypes, data, bankaraData, bankaraSeriesData, regularData, xData, festData) {

    for(let i = 0; i < dataTypes.length; i++) {

        switch(dataTypes[i]) {
            case "festSchedules":
                festData = "";
                //TODO: Implement fetching and displaying fest schedule data
                break;

            case "bankaraSchedules":
                
                bankaraData = parseSceduleData(data, dataTypes[i]);
                console.log("Parsed Bankara Schedule:", bankaraData);
                if(bankaraData) {
                    console.log("Passed Bankara Data Check!");  
                    const currentBankaraRotation = returnRotationByType(bankaraData, dataTypes[i], 0);
                    if(currentBankaraRotation) {
                        FillScheduleDiv(window, "bankara-mode", "bankara-times", "bankara-maps", 
                            currentBankaraRotation.mode, currentBankaraRotation.startTime, currentBankaraRotation.endTime, currentBankaraRotation.stages);
                    }
                }

                break;

            case "bankaraSchedules-series":
                bankaraSeriesData = parseSceduleData(data, "bankaraSchedules-series");
                console.log("Parsed Bankara Series Schedule:", bankaraSeriesData);
                if(bankaraSeriesData) {
                    console.log("Passed Bankara Series Data Check!");  
                    const currentBankaraSeriesRotation = returnRotationByType(bankaraSeriesData, "bankaraSchedules-series", 0);
                    if(currentBankaraSeriesRotation) {
                        FillScheduleDiv(window, "bankara-series-mode", "bankara-series-times", "bankara-series-maps", 
                            currentBankaraSeriesRotation.mode, currentBankaraSeriesRotation.startTime, currentBankaraSeriesRotation.endTime, currentBankaraSeriesRotation.stages);
                    }
                }

                break;
            
            case 'regularSchedules':

                regularData = parseSceduleData(data, dataTypes[i]);
                if(regularData) {
                    const currentRegularRotation = returnRotationByType(regularData, dataTypes[i], 0);
                    if(currentRegularRotation) {
                        FillScheduleDiv(window, "regular-mode", "regular-times", "regular-maps", 
                            currentRegularRotation.mode, currentRegularRotation.startTime, currentRegularRotation.endTime, currentRegularRotation.stages);
                    }
                }

                break;

            case 'xSchedules':
                xData = parseSceduleData(data, dataTypes[i]);
                if(xData) {
                    const currentXRotation = returnRotationByType(xData, dataTypes[i], 0);
                    if(currentXRotation) {
                        FillScheduleDiv(window, "x-mode", "x-times", "x-maps", 
                            currentXRotation.mode, currentXRotation.startTime, currentXRotation.endTime, currentXRotation.stages);
                    }
                }

                break;
            default:
                console.error(`Unknown data type: ${dataTypes[i]}`);
                break;
        }
    }
}

