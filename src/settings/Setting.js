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
        this.color = color
        this.lineWidth = lineWidth
        this.opacity = opacity
        this.color.setOpacity(opacity)
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