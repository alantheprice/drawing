
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
        this.r = Math.round(r)
        this.g = Math.round(g)
        this.b = Math.round(b)
        this.a = (isNaN(a)) ? 1 : a
    }

    /**
     * Sets the color's opacity
     * 
     * @param {number} opacity - Number between 0 and 1, 1 being full opacity
     * @memberof Color
     */
    setOpacity(opacity) {
        let op = isNaN(opacity) ? 1 : opacity
        this.a = Math.min(op, 1)
    }

    /**
     * 
     * 
     * @param {{r:number, g: number, b: number, a: number}} colorConfig 
     * @memberof Color
     */
    update(colorConfig) {
        this.r = Math.round(colorConfig.r || this.r)
        this.g = Math.round(colorConfig.g || this.g)
        this.b = Math.round(colorConfig.b || this.b)
        this.a = isNaN(colorConfig.a) ? 1 : this.a
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
var template = new Color(1,1,1)

Color.fromObject = function fromObject(color) {
    let proto = template.copy()
    proto.update(color)
    return proto
}