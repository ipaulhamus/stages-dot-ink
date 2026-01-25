import settings from 'electron-settings';

export const SizeSettings = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large'
}

export class ColorSettings {
    
    constructor(backgroundColor, primaryText, secondaryText, shadowColor) {

        if(!backgroundColor || !primaryText || !secondaryText || !shadowColor) {
            console.error("One or more color settings are undefined.");
            return;
        }

        this.backgroundColor = backgroundColor;
        this.primaryText = primaryText;
        this.secondaryText = secondaryText;
        this.shadowColor = shadowColor;
    }

}

//Functions to edit settings
export async function setWindowPosition(window, x, y) {
    if(x === undefined || y === undefined) {
        console.error("X or Y position is undefined.");
        return;
    }

    if(typeof x !== 'number' || typeof y !== 'number') {
        console.error("X and Y positions must be numbers.");
        return;
    }

    //Saving the position to localStorage
    settings.set(`windowPosition.x`, x).then(() => {
        console.log(`Window X position set to: ${x}`);
    }).catch((error) => {
        console.error("Error setting window X position:", error);
    });

    settings.set(`windowPosition.y`, y).then(() => {
        console.log(`Window Y position set to: ${y}`);
    }).catch((error) => {
        console.error("Error setting window Y position:", error);
    });

    //Setting the window position
    window.setPosition(x, y);
}

export async function setWindowColors(window, colorSettings) {
    if(!(colorSettings instanceof ColorSettings)) {
        console.error("colorSettings is not an instance of ColorSettings.");
        return;
    }

    //Saving the color settings to localStorage
    settings.set(`colorSettings.backgroundColor`, colorSettings.backgroundColor).catch((error) => {
        console.error("Error setting background color:", error);
    });

    settings.set(`colorSettings.primaryText`, colorSettings.primaryText).catch((error) => {
        console.error("Error setting primary text color:", error);
    });

    settings.set(`colorSettings.secondaryText`, colorSettings.secondaryText).catch((error) => {
        console.error("Error setting secondary text color:", error);
    });

    settings.set(`colorSettings.shadowColor`, colorSettings.shadowColor).catch((error) => {
        console.error("Error setting shadow color:", error);
    });

    //Sending the color settings to the renderer process to update the UI
    window.webContents.send('update-colors', colorSettings);
}

export async function setWindowSize(window, sizeSetting) {
    switch(sizeSetting) {
        case SizeSettings.SMALL:
            break;
        case SizeSettings.MEDIUM:
            break;
        case SizeSettings.LARGE:
            break;
        default:
            console.error("Unknown size setting:", sizeSetting);
            return;
    }
}