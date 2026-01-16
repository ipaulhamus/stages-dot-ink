/*
 * Viewing console logs:
 * - Main process logs (console.log in this file) appear in the terminal that launched the Electron app.
 * - Renderer logs (console.log inside the loaded page) appear in the renderer DevTools:
 *     - Open DevTools from the app menu or use the keyboard shortcut (Ctrl+Shift+I on Windows/Linux, Cmd+Option+I on macOS).
 *     - Programmatically open DevTools for the created window: win.webContents.openDevTools().
 * - To forward renderer logs to the terminal during development, run Electron with logging enabled (e.g. set ELECTRON_ENABLE_LOGGING=1 or use --enable-logging).
 */
import { fetchScedule, parseSceduleData, returnRotationByType } from './workspace/js/api.js';
import { app, BrowserWindow } from 'electron';

const dataTypes = ["regularSchedules", "bankaraSchedules", "bankaraSchedules-series", "xSchedules", "festSchedules"];

const htmlElementIds = ["regular-battle-info", "bankara-battle-info", "bankara-series-battle-info", "xmatch-battle-info", "fest-battle-info"];

//== Window Creation and App Lifecycle ==//

//Creating a window that functions like a desktop widget to display the current schedule data from the API. This will be the main window of the app and will load the main.html file.
const createWindow = () => {
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false
    })

    win.loadFile('./main.html');
    //win.webContents.openDevTools();
}

// When a window finishes loading, fetch schedule in the main process and update the renderer DOM
app.on('browser-window-created', (event, window) => {
    window.webContents.on('did-finish-load', () => {
        fetchScedule()
            .then(data => {
                if (data) {
                   //Iterate through each data type and update the corresponding element in the renderer
                    let regularData;
                    let bankaraData;
                    let bankaraSeriesData;
                    let xData;
                    let festData;

                   for(let i = 0; i < dataTypes.length; i++) {

                        switch(dataTypes[i]) {
                            case 'festSchedules':
                                festData = "";
                                
                                window.webContents.executeJavaScript(
                                    `const festEl = document.getElementById('${htmlElementIds[i]}'); 
                                    if (festEl) festEl.innerText = 'No Splatfest Data Currently';`
                                ).catch(err => console.error('executeJavaScript error:', err));

                                break;

                            case 'bankaraSchedules':
                                
                                bankaraData = parseSceduleData(data, dataTypes[i]);
                                console.log('Parsed Bankara Schedule:', bankaraData);
                                if(bankaraData) {
                                    console.log('Passed Bankara Data Check!');  
                                    const currentBankaraRotation = returnRotationByType(bankaraData, dataTypes[i], 0);
                                    if(currentBankaraRotation) {
                                        bankaraData = `Current Bankara Battle Rotation:\nMode: ${currentBankaraRotation.mode}\nStart Time: ${currentBankaraRotation.startTime}\nEnd Time: ${currentBankaraRotation.endTime}\nStages:\n${currentBankaraRotation.stages.map(stage => `- ${stage.name}`).join('\n')}`;
                                    }
                                }
                                
                                console.log('Bankara Data to Display:', htmlElementIds[i]);
                                window.webContents.executeJavaScript(
                                    `const bankaraEl = document.getElementById('${htmlElementIds[i]}'); 
                                    if (bankaraEl) bankaraEl.innerText = ${JSON.stringify(bankaraData)};`
                                ).catch(err => console.error('executeJavaScript error:', err));

                                break;

                            case 'bankaraSchedules-series':
                                bankaraSeriesData = parseSceduleData(data, 'bankaraSchedules-series');
                                console.log('Parsed Bankara Series Schedule:', bankaraSeriesData);
                                if(bankaraSeriesData) {
                                    console.log('Passed Bankara Series Data Check!');  
                                    const currentBankaraSeriesRotation = returnRotationByType(bankaraSeriesData, 'bankaraSchedules-series', 0);
                                    if(currentBankaraSeriesRotation) {
                                        bankaraSeriesData = `Current Bankara Series Battle Rotation:\nMode: ${currentBankaraSeriesRotation.mode}\nStart Time: ${currentBankaraSeriesRotation.startTime}\nEnd Time: ${currentBankaraSeriesRotation.endTime}\nStages:\n${currentBankaraSeriesRotation.stages.map(stage => `- ${stage.name}`).join('\n')}`;
                                    }
                                }
                                
                                console.log('Bankara Series Data to Display:', htmlElementIds[i]);
                                window.webContents.executeJavaScript(
                                    `const bankaraSeriesEl = document.getElementById('${htmlElementIds[i]}'); 
                                    if (bankaraSeriesEl) bankaraSeriesEl.innerText = ${JSON.stringify(bankaraSeriesData)};`
                                ).catch(err => console.error('executeJavaScript error:', err));

                                break;
                            
                            case 'regularSchedules':

                                regularData = parseSceduleData(data, dataTypes[i]);
                                if(regularData) {
                                    const currentRegularRotation = returnRotationByType(regularData, dataTypes[i], 0);
                                    if(currentRegularRotation) {
                                        regularData = `Current Regular Battle Rotation:\nMode: ${currentRegularRotation.mode}\nStart Time: ${currentRegularRotation.startTime}\nEnd Time: ${currentRegularRotation.endTime}\nStages:\n${currentRegularRotation.stages.map(stage => `- ${stage.name}`).join('\n')}`;
                                    }
                                }
                                
                                window.webContents.executeJavaScript(
                                    `const regularEl = document.getElementById('${htmlElementIds[i]}'); 
                                    if (regularEl) regularEl.innerText = ${JSON.stringify(regularData)};`
                                ).catch(err => console.error('executeJavaScript error:', err));
                                break;

                            case 'xSchedules':
                                xData = parseSceduleData(data, dataTypes[i]);
                                if(xData) {
                                    const currentXRotation = returnRotationByType(xData, dataTypes[i], 0);
                                    if(currentXRotation) {
                                        xData = `Current X Match Battle Rotation:\nMode: ${currentXRotation.mode}\nStart Time: ${currentXRotation.startTime}\nEnd Time: ${currentXRotation.endTime}\nStages:\n${currentXRotation.stages.map(stage => `- ${stage.name}`).join('\n')}`;
                                    }
                                }
                                
                                window.webContents.executeJavaScript(
                                    `const xEl = document.getElementById('${htmlElementIds[i]}'); 
                                    if (xEl) xEl.innerText = ${JSON.stringify(xData)};`
                                ).catch(err => console.error('executeJavaScript error:', err));

                                break;
                            default:
                                console.error(`Unknown data type: ${dataTypes[i]}`);
                                break;
                        }
                   }
                }
            })
            .catch(error => {
                console.error('Error fetching schedule:', error);
                window.webContents.executeJavaScript(
                    `const errorEl = document.getElementById('error-div'); 
                    if (errorEl) errorEl.style.display = 'block';`
                ).catch(err => console.error('executeJavaScript error:', err));

            });
    });
});

app.whenReady().then(() => { 
    createWindow();

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
});

//Ending the app's process if all windows are closed and we're on Windows or Linux
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
    else {
        console.log('All windows closed, but not quitting on macOS');
    }
});

//== Window Setup End ==//
