//Classes must be defined before they are used
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

export class SizeSettings {
    constructor(xPos, yPos) {

        if(!xPos || !yPos) {
            console.error("One or more sizing settings are undefined");
            return;
        }

        this.xPos = xPos;
        this.yPos = yPos;
    }
}

//fake "enums" that are passed into the settings functions
export const SizeSettingsIndex = {
    //SMALL: new SizeSettings()
    //MEDIUM: new SizeSettings()
    //LARGE: new SizeSettings()
}

export const ColorSettingsIndex = {
    DEFAULT: new ColorSettings('#0E0E11', '#FFFFFF', '#FFD400', '#00FF9C'),

    OCEAN:    new ColorSettings('#051824', '#E6F7FF', '#00CFFF', '#00FFC6'),

    OCTO:     new ColorSettings('#150012', '#FFE6F2', '#FF2A8A', '#FF6FD8'),

    ANARCHY:  new ColorSettings('#0B0B0B', '#FFFFFF', '#FF005C', '#39FF14'),

    CALLIE:   new ColorSettings('#2A0018', '#FFF0F7', '#FF5FA2', '#FF86D5'),

    MARIE:    new ColorSettings('#001E14', '#E6FFF1', '#1AFF64', '#00FF9C'),

    SENDOU: new ColorSettings('#0D0A17', '#EDEBFF', '#8B8CFF',  '#5B5FFF'),
}

