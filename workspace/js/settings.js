import settings from 'electron-settings';
import { ColorSettings, SizeSettings, SizeSettingsIndex } from './settingsReferences.js';
import { error } from 'console';

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

export async function loadWindowSize() {
    try{
        const savedKey = await settings.get('sizeSettings.selected');

        if(typeof savedKey === 'string' && SizeSettingsIndex[savedKey.toUpperCase()]) {
            return SizeSettingsIndex[savedKey.toUpperCase()];
        }

        const legacySize = await settings.get('sizeSettings.settingsObject');
        if(legacySize && typeof legacySize === 'object') {
            return normalizeLegacySizeSettings(legacySize);
        }

        return null;
    }
    catch(error) {
        console.error('Error loading window saved window size: ', error);
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
    if(typeof sizeSetting === 'string') {
        const sizeKey = sizeSetting.toUpperCase();
        if(!SizeSettingsIndex[sizeKey]) {
            console.error("Unknown size setting:", sizeSetting);
            return;
        }

        await settings.set(`sizeSettings.selected`, sizeKey).catch((error) =>{
            console.error("Error saving the sizing settings: ", error);
        });
        return;
    }

    if(!(sizeSetting instanceof SizeSettings)) {
        console.error("Size setting is not a valid SizeSettings instance.");
        return;
    }

    await settings.set(`sizeSettings.settingsObject`, sizeSetting).catch((error) =>{
        console.error("Error saving the sizing settings: ", error);
    });
}

export async function loadAutoLaunchSetting() {
    try {
        const enabled = await settings.get('app.autoLaunch');
        if (typeof enabled !== 'boolean') {
            return null;
        }
        return enabled;
    } catch (error) {
        console.error('Error loading auto launch setting:', error);
        return null;
    }
}

export async function saveAutoLaunchSetting(enabled) {
    if (typeof enabled !== 'boolean') {
        console.error('Auto launch setting must be a boolean.');
        return;
    }

    await settings.set('app.autoLaunch', enabled).catch((error) => {
        console.error('Error saving auto launch setting:', error);
    });
}

function normalizeLegacySizeSettings(legacySize) {
    const needsRemConversion = Number(legacySize.sceduleImgWidth) > 10 || Number(legacySize.windowPadding) > 6;
    const rem = (value) => (needsRemConversion ? Number(value) / 16 : Number(value));

    return new SizeSettings(
        Number(legacySize.windowX),
        Number(legacySize.windowY),
        rem(legacySize.windowPadding),
        rem(legacySize.borderWidth),
        Number(legacySize.borderRadius),
        rem(legacySize.pFontSize),
        rem(legacySize.titleFontSize),
        rem(legacySize.clickableFontSize),
        rem(legacySize.textLeftBuffer),
        rem(legacySize.sceduleMarginLeft),
        rem(legacySize.scheduleMarginTop),
        rem(legacySize.sceduleImgWidth),
        rem(legacySize.sceduleImgHeight),
        rem(legacySize.scheduleImgMargin)
    );
}