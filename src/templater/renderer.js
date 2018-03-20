import { override, getHandle} from '../../node_modules/ele-mint/src/eleMint.js'
import { addDragHandler, addEvent, CUSTOM_DRAG_EVENT } from '../eventHandling/event'

const overrides = function() {}
overrides.prototype.addEventListener = addEventListener
overrides.prototype.windowOffset = windowOffset
overrides.prototype.setActive = setActive
overrides.prototype.addClass = addClass
overrides.prototype.removeClass = removeClass
overrides.prototype.clone = clone

const register = override(overrides.prototype)
const elements = 'a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|data|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|header|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|meta|meter|nav|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|rtc|ruby|s|samp|script|section|select|slot|small|source|span|strong|style|sub|summary|sup|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr'.split('|').reduce((agg, next) => {agg[next] = register(next); return agg;}, {})
elements.virtual = register('virtual', { 
    attach: function attach(parentElement) {
        this.parentElement = parentElement
        return this.parentElement
    }
})

export const e = {
    register,
    elements: elements,
    getHandle: getHandle
}

function addEventListener(evName, handler) {
    // slice needed because the base library removes the 'on' from the event name.
    if (evName === CUSTOM_DRAG_EVENT.slice(2)) {
        addDragHandler(this, handler)
        return
    }
    addEvent(this, evName, handler)
}

function setActive(active) {
    this[(active) ? 'addClass' : 'removeClass']('active')
}

/**
 * Gets X and Y offset from window.
 * 
 * @returns {{x: number, y: number}}
 * @memberof ElementDefinition
 */
function windowOffset() {
    let offset = {x: this.elem.offsetLeft, y: this.elem.offsetTop}
    let current = this.parentElement
    while (current.parentElement) {
        offset.x += current.offsetLeft
        offset.y += current.offsetTop
        current = current.parentElement
    }
    return offset
}

function clone(handle, attrOverrides) {
    let chs = (this.children || []).map((el) => el.clone())
    let ne = register(this.tagName)(Object.assign({}, this.attr, attrOverrides), chs)
    this.handle = handle
    return ne
}
/**
 * Add specified class to the element
 * 
 * @param {string} className 
 * @memberof ElementDefinition
 */
function addClass(className) {
    if (!this.className) {
        this.setAttribute(this.elem, 'className', className)
        return
    }
    if (this.className.split(' ').indexOf(className) > -1) {
        return
    }
    this.className = [this.className, className].join(' ')
}

/**
 * Remove specified class from the element
 * 
 * @param {string} className 
 * @memberof ElementDefinition
 */
function removeClass(className) {
    if (!this.className || this.className.indexOf(className) === -1){
        return
    }
    this.className = this.className.split(' ').filter((cn) => cn !== className).join(' ')
}
