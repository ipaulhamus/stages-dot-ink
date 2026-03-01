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

//Object to store window scaling data
export class SizeSettings {
    constructor(windowX, windowY, windowPadding, borderWidth, borderRadius, pFontSize, titleFontSize, clickableFontSize, textLeftBuffer, sceduleMarginLeft, sceduleMarginTop, sceduleImgWidth, sceduleImgHeight, scheduleImgMargin) {
        
        this.windowX = windowX;
        this.windowY = windowY;

        this.windowPadding = windowPadding;
        this.borderWidth = borderWidth;
        this.borderRadius = borderRadius;
        this.pFontSize = pFontSize;
        this.titleFontSize = titleFontSize;
        this.clickableFontSize = clickableFontSize;
        this.textLeftBuffer = textLeftBuffer;
        this.sceduleMarginLeft = sceduleMarginLeft;
        this.scheduleMarginTop = sceduleMarginTop;
        this.sceduleImgWidth = sceduleImgWidth;
        this.sceduleImgHeight = sceduleImgHeight;
        this.scheduleImgMargin = scheduleImgMargin;
    }
}

export class XYSizes {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//fake "enums" that are passed into the settings functions
export const SizeSettingsIndex = {
    SMALL: new SizeSettings(
        240, 315, 0.75, 0.075, 5, 0.5, 0.6, 0.5, 0.25, 0.25, 0.25, 1.5, 1.5, 0.25
    ),
    MEDIUM: new SizeSettings(
        360, 472.5, 1.125, 0.1125, 7.5, 0.75, 0.9, 0.75, 0.375, 0.375, 0.375, 2.25, 2.25, 0.375
    ),
    LARGE: new SizeSettings(
        480, 630, 1.5, 0.15, 10, 1, 1.2, 1, 0.5, 0.5, 0.5, 3, 3, 0.5
    ),
    EX_LARGE: new SizeSettings(
        720, 945, 2.25, 0.225, 15, 1.5, 1.8, 1.5, 0.75, 0.75, 0.75, 4.5, 4.5, 0.75
    )
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

