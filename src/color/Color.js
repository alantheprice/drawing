
export class Color {

    /**
     * Creates an instance of Color.
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} [a]
     * @memberof Color
     */
    constructor(r,g,b,a) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a || 1
    }

    /**
     * Sets the color's opacity
     * 
     * @param {number} opacity - Number between 0 and 1, 1 being full opacity
     * @memberof Color
     */
    setOpacity(opacity) {
        this.a = Math.min(opacity, 1)
    }
    /**
     * 
     * 
     * @param {{r:number, g: number, b: number, a: number}} colorConfig 
     * @memberof Color
     */
    update(colorConfig) {
        this.r = colorConfig.r || this.r
        this.g = colorConfig.g || this.g
        this.b = colorConfig.b || this.b
        this.a = colorConfig.a || colorConfig.a
    }

    getAsCssValue() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    }
    
    /**
     * 
     * 
     * @returns 
     * @memberof Color
     */
    copy() {
        return Object.assign(Color.prototype, this)
    }
}