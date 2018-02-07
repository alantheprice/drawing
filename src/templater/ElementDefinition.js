import { renderElement } from './renderUtils.js'
import { addDragHandler, addEvent, CUSTOM_DRAG_EVENT, TOUCH_EVENT_MAP } from '../eventHandling/event'
import { ELEMENTS, EVENTS } from './constants.js'
const DIRECT_SET_ATTRIBUTES = ['innerText', 'className', 'value']

const ATTRIBUTE_MAP = EVENTS.reduce((obj, next) => {
        obj[next] = 'handlers'
        return obj
    }, {})

export class ElementDefinition {
    /**
     * Creates an instance of ElementDefinition.
     * @param {string} tagName
     * @param {{attributes: Object, innerText: string, handlers: Object}} config
     * @param {ElementDefinition[]} [children] 
     * @memberof ElementDefinition
     */
    constructor(tagName, config, children) {
        this.tagName = tagName
        let parsedOut = Object.keys(config.attributes).reduce(parse, 
            {attrs: {class: ''}, subscriptions: {}, passThrough: {}, o: config.attributes})
        this.passThrough = parsedOut.passThrough
        this.subscriptions = parsedOut.subscriptions
        this.attrs = parsedOut.attrs
        this.handlers = config.handlers
        this.innerText = config.innerText || ''
        define(this, 'innerText', this.innerText)
        Object.keys(this.attrs).forEach((key) => define(this, key, this.attrs[key]))
        Object.keys(this.passThrough).forEach((key) => {
            define(this, key, this.passThrough[key], 
                (val) => setPassThrough(this, key, val))
        })
        this.children = (!children || !children.length || !children[0]) ? null : children
    }

    /**
     * Renders the element and children to the DOM
     * 
     * @param {HTMLElement} parentElement
     * @param {ElementDefinition} [parentScope] 
     * @returns {HTMLElement}
     * @memberof ElementDefinition
     */
    render(parentElement, elementDef) {
        if (!this.tagName) {
            throw new Error('tagName must be defined')
        }
        let scope = {element: renderElement(this.tagName, this.attrs, this.innerText, parentElement)}  
        if (this.children) {
            scope.children = this.children.map((child) => {
                if (!(child instanceof ElementDefinition)) {
                    throw new Error("children must be of type ElementDefinition")
                }
                return child.render(scope.element, this)
            })
        }
        addEventHandlers(scope.element, this.handlers, this)
        this.element = scope.element
        if (elementDef) {
            this.parent = elementDef
        }
        return scope.element
    }

    /**
     * 
     * 
     * @param {string} messageName 
     * @param {any} [messageContent]
     * @memberof ElementDefinition
     */
    emit(messageName, messageContent) {
        debugger
        if (typeof this.subscriptions[messageName] === 'function') {
            this.subscriptions[messageName](messageContent)
        }
    }

    querySelector(selector) {
        throw new Error('querySelector has yet to be implemented')
    }

    /**
     * Add specified class to the element
     * 
     * @param {string} className 
     * @memberof ElementDefinition
     */
    addClass(className) {
        if ((this.className || '').split(' ').indexOf(className) > -1) {
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
    removeClass(className) {
        if (!this.className || this.className.indexOf(className) === -1){
            return
        }
        this.className = this.className.split(' ').filter((cn) => cn !== className).join(' ')
    }

    setActive(active) {
        let classFunc = (active) ? 'addClass' : 'removeClass'
        this[classFunc]('active')
    }

    remove() {
        if (this.element) {
            this.element.parentNode.removeChild(this.element)
        }
        this.parent = null
    }
}

function parse(agg, key) {
    if (key.indexOf(':') === 0) {
        agg.passThrough[key.replace(':', '')] = agg.o[key]
    } else if (key.indexOf('@') === 0) {
        agg.subscriptions[key.replace('@', '')] = agg.o[key]
    } else {
        agg.attrs[key] = agg.o[key]
    }
    return agg
}

function setPassThrough(obj, key, value) {
    let innerName = `_${key}`
    if (obj[innerName] === value) { return }
    obj[innerName] = value
    if (!obj.children) { return }
    obj.children.forEach((child) => {
        if (child.passThrough[key]) {
            child.passThrough[key] = value  
        }
    })
}
/**
 * Define property, used to set 
 * 
 * @param {any} obj 
 * @param {string} key
 * @param {any} value -- initial value
 * @param {function(any)} [setter]
 */
function define(obj, key, value, setter) {
    let mKey = (key === 'class') ? 'className' : key
    let innerName = `_${mKey}`
    var settings = {
      set: (val) => {
          if (obj[innerName] === val) { return }
          if (obj.element && DIRECT_SET_ATTRIBUTES.indexOf(mKey) > -1) {
            obj.element[mKey] = val + ''
          } else if (obj.element && obj.attrs[key]) {
            obj.element.setAttribute(key, val)
          }
          obj[innerName] = val
      },
      get: () => obj[innerName]
    }
    if (setter) {
        settings.set = setter
    }
    Object.defineProperty(obj, mKey, settings)
    obj[mKey] = value
}


function addEventHandlers(elem, handlers, scope) {
    if (!handlers) { return }
    Object.keys(handlers).map((domEventName) => {
        return {name: domEventName, handler: handlers[domEventName]}
    }).forEach((ev) => {
        if (ev.name === CUSTOM_DRAG_EVENT) {
            addDragHandler(elem, ev.handler)
        } else if (Object.keys(TOUCH_EVENT_MAP).indexOf(ev.name) > -1) {
            addEvent(elem, ev.name, ev.handler)
        } else {
            document.addEventListener(ev.name, (e) => {
                ev.handler(e, scope)
            })
        }
    })
}


/**
 * Returns a function closure for building different html elements.
 * 
 * @param {string} tagName 
 * @returns 
 */
function getBuilder(tagName) {

    /**
     * Create an element definition for tagName and input attributes
     * @param {any} attributes 
     * @param {ElementDefinition[]} [children] 
     * @returns {ElementDefinition}
     */
    return function createElementDefinition(attributes, ...children) {
        let config = Object.keys(attributes).reduce((obj, next) => {
            if (next === 'innerText') {
                obj.innerText = attributes[next]
                return obj
            }
            let name = ATTRIBUTE_MAP[next] || 'attributes'
            obj[name][next] = attributes[next]
            return obj
        }, {attributes: {}, handlers: {}})
        let childs = children || []
        // if the first element is an array, it was passed in as an array instead of arguments
        if (Array.isArray(childs[0])) {
            childs = childs[0]
        }
        return new ElementDefinition(tagName, config, childs)
    }
}

let exportable = {
    ElementDefinition: ElementDefinition
}

exportable = ELEMENTS.reduce((agg, next) => {
    agg[next] = getBuilder(next)
    return agg
}, exportable)

export const e = exportable