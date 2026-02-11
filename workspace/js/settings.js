import settings from 'electron-settings';
import { ColorSettings, SizeSettings } from './settingsReferences.js';

//Functions to edit settings
export async function loadWindowPosition(window) {
    try {
        const x = await settings.get('windowPosition.x');
        const y = await settings.get('windowPosition.y');

        if (typeof x !== 'number' || typeof y !== 'number') {
            return null;
        }

        const currentBounds = window.getBounds();
        window.setBounds({
            x,
            y,
            width: currentBounds.width,
            height: currentBounds.height
        });

        console.log(`Loaded window position: x=${x}, y=${y}`);
        return { x, y };
    } catch (error) {
        console.error('Error loading window position:', error);
        return null;
    }
}

export async function loadWindowColors() {
    try {
        const backgroundColor = await settings.get('colorSettings.backgroundColor');
        const primaryText = await settings.get('colorSettings.primaryText');
        const secondaryText = await settings.get('colorSettings.secondaryText');
        const shadowColor = await settings.get('colorSettings.shadowColor');

        if (!backgroundColor || !primaryText || !secondaryText || !shadowColor) {
            return null;
        }

        return new ColorSettings(backgroundColor, primaryText, secondaryText, shadowColor);
    } catch (error) {
        console.error('Error loading color settings:', error);
        return null;
    }
}

export async function saveWindowPosition(window, x, y) {
    if(x === undefined || y === undefined) {
        console.error("X or Y position is undefined.");
        return;
    }

    if(typeof x !== 'number' || typeof y !== 'number') {
        console.error("X and Y positions must be numbers.");
        return;
    }

    //Saving the position to localStorage
    await settings.set(`windowPosition.x`, x).then(() => {
        console.log(`Window X position set to: ${x}`);
    }).catch((error) => {
        console.error("Error setting window X position:", error);
    });

    await settings.set(`windowPosition.y`, y).then(() => {
        console.log(`Window Y position set to: ${y}`);
    }).catch((error) => {
        console.error("Error setting window Y position:", error);
    });
}

export async function saveWindowColors(window, colorSettings) {
    if(!(colorSettings instanceof ColorSettings)) {
        console.error("colorSettings is not an instance of ColorSettings.");
        return;
    }

    //Saving the color settings to localStorage
    await settings.set(`colorSettings.backgroundColor`, colorSettings.backgroundColor).catch((error) => {
        console.error("Error setting background color:", error);
    });

    await settings.set(`colorSettings.primaryText`, colorSettings.primaryText).catch((error) => {
        console.error("Error setting primary text color:", error);
    });

    await settings.set(`colorSettings.secondaryText`, colorSettings.secondaryText).catch((error) => {
        console.error("Error setting secondary text color:", error);
    });

    await settings.set(`colorSettings.shadowColor`, colorSettings.shadowColor).catch((error) => {
        console.error("Error setting shadow color:", error);
    });
}

export async function saveWindowSize(window, sizeSetting) {
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