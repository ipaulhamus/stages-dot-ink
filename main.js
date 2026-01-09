/**
 * Main process entry for the Electron application.
 *
 * Responsibilities:
 * - Create the main BrowserWindow and load the renderer (main.html).
 * - On renderer 'did-finish-load', fetch schedule data (via fetchScedule),
 *   parse it (via parseSceduleData) and safely inject text into the renderer DOM
 *   using webContents.executeJavaScript.
 * - Manage application lifecycle events (activate, window-all-closed).
 *
 * @module main
 *
 * @function createWindow
 * @description Create a BrowserWindow sized 800x600 and load './main.html'.
 * @returns {import('electron').BrowserWindow} The created BrowserWindow instance.
 *
 * @constant {Object} dataTypes
 * @description Keys used to identify schedule data types to avoid typos when calling parseSceduleData.
 * @property {string} regular - 'regularSchedules'
 * @property {string} ranked - 'ranked'
 * @property {string} xmatch - 'xmatch'
 * @property {string} salmonRun - 'salmonRun'
 * @property {string} fest - 'fest'
 *
 * @remarks
 * - The code listens for the 'browser-window-created' event and attaches a
 *   'did-finish-load' handler to the window's webContents to perform the fetch/parse/inject flow.
 * - Errors during fetching or executeJavaScript are logged to the console.
 *
 * Viewing console logs:
 * - Main process logs (console.log in this file) appear in the terminal that launched the Electron app.
 * - Renderer logs (console.log inside the loaded page) appear in the renderer DevTools:
 *     - Open DevTools from the app menu or use the keyboard shortcut (Ctrl+Shift+I on Windows/Linux, Cmd+Option+I on macOS).
 *     - Programmatically open DevTools for the created window: win.webContents.openDevTools().
 * - To forward renderer logs to the terminal during development, run Electron with logging enabled (e.g. set ELECTRON_ENABLE_LOGGING=1 or use --enable-logging).
 */
import { fetchScedule, parseSceduleData } from './workspace/js/api.js';
import { app, BrowserWindow } from 'electron';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile('./main.html');
}

// When a window finishes loading, fetch schedule in the main process and update the renderer DOM
app.on('browser-window-created', (event, window) => {
    window.webContents.on('did-finish-load', () => {
        fetchScedule()
            .then(data => {
                if (data) {
                    const regularSchedules = parseSceduleData(data, dataTypes.regular);
                    const text = JSON.stringify(regularSchedules);
                    // Safely set the element's innerText in the renderer
                    window.webContents.executeJavaScript(
                        `const el = document.getElementById('regular-battle-info'); if (el) el.innerText = ${JSON.stringify(text)};`
                    ).catch(err => console.error('executeJavaScript error:', err));
                    console.log('Regular Schedules:', regularSchedules);
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
    ranked: 'ranked',
    xmatch: 'xmatch',
    salmonRun: 'salmonRun',
    fest: 'fest'
}