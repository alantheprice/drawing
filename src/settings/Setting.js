import { Color } from '../color/Color'

export class Setting {

    /**
     * Creates an instance of Color.
     * @param {Color} color
     * @param {number} lineWidth
     * @param {number} [opacity]
     * @memberof Color
     */
    constructor(color, lineWidth, opacity) {
        if (isNaN(opacity)) {
            opacity = color.a || 1
        }
        this.color = color
        this.lineWidth = lineWidth
        this.opacity = opacity
        if (!isNaN(opacity)) {
            this.color.setOpacity(opacity)
        }
    }

    /**
     * Copy to new
     * 
     * @returns {Setting}
     * @memberof Setting
     */
    copy() {
        return new Setting(this.color.copy(), this.lineWidth, this.opacity)
    }
}

Setting.fromObject = function fromObject (settings) {
    return new Setting(Color.fromObject(settings.color), settings.lineWidth || 5)
}
