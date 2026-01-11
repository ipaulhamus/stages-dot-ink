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

//Creating a window that functions like a desktop widget to display the current schedule data from the API. This will be the main window of the app and will load the main.html file.
const createWindow = () => {
    const win = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false
    })

    win.loadFile('./main.html');
}

// When a window finishes loading, fetch schedule in the main process and update the renderer DOM
app.on('browser-window-created', (event, window) => {
    window.webContents.on('did-finish-load', () => {
        fetchScedule()
            .then(data => {
                if (data) {
                    console.log('Schedule data fetched successfully:', data);
                    console.log('Data types.fest:' , dataTypes.fest);
                    const festSchedule = parseSceduleData(data, dataTypes.fest);
                    //const text = JSON.stringify(festSchedule);
                    console.log('Parsed Fest Schedule:', festSchedule);
                    const currentFestRotation = returnRotationByType(festSchedule, dataTypes.fest, 0);
                    if(currentFestRotation) {
                        console.log('Current Fest Rotation:', currentFestRotation);
                        //Use returned Roation object to create a string to display in the renderer
                        const text = `Current Fest Rotation:\nMode: ${currentFestRotation.mode}\nStart Time: ${currentFestRotation.startTime}\nEnd Time: ${currentFestRotation.endTime}\nStages:\n${currentFestRotation.stages.map(stage => `- ${stage.name}`).join('\n')}`;
                        window.webContents.executeJavaScript(
                            `const el = document.getElementById('regular-battle-info'); if (el) el.innerText = ${JSON.stringify(text)};`
                        ).catch(err => console.error('executeJavaScript error:', err));
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching schedule:', error);
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
});

//Object to make data types easier to manage and avoid typos when calling the parseSceduleData function
const dataTypes = {
    regular: 'regularSchedules',
    ranked: 'bankaraSchedules',
    xmatch: 'xSchedules',
    fest: 'festSchedules'
} 