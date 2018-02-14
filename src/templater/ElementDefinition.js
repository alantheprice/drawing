import { renderElement } from './renderUtils.js'
import { addDragHandler, addEvent, CUSTOM_DRAG_EVENT, TOUCH_EVENT_MAP } from '../eventHandling/event'
import { ELEMENTS, EVENTS } from './constants.js'
const DIRECT_SET_ATTRIBUTES = ['textContent', 'className', 'value', 'style']
const MAPPED_ATTRIBUTE = {
    class: 'className'
}
const VIRTUAL_ELEMENT = 'virtual'
const ATTRIBUTE_MAP = EVENTS.reduce((obj, next) => {
        obj[next] = 'handlers'
        return obj
    }, {})
let handles = {}

export class ElementDefinition {
    /**
     * Creates an instance of ElementDefinition.
     * @param {string} tagName
     * @param {{attributes: Object}} config
     * @param {ElementDefinition[]} [children] 
     * @memberof ElementDefinition
     */
    constructor(tagName, config, children) {
        this.tagName = tagName
        this.config = config
        handles[config['handle'] || config.id || 'last'] = this
        let parsed = Object.keys(config).reduce(parse, {
            attrs: {}, 
            directSetProps: {textContent: '', style: '', className: ''}, 
            handlers: {}, 
            subscriptions: {}, 
            passThrough: {}, 
            o: config
        })
        this.subscriptions = parsed.subscriptions
        this.handlers = parsed.handlers
        this.classList = {add: (cn) => this.addClass(cn), remove: (cn) => this.removeClass(cn)}
        
        this.attrs = Object.keys(parsed.attrs).map((key) => { 
            define(this, key, parsed.attrs[key])
            return key
        }, {})
        this.directSetProps = Object.keys(parsed.directSetProps).map((key) => {
            define(this, key, parsed.directSetProps[key])
            return key
        }, {})
        this.passThrough = Object.keys(parsed.passThrough).map((key) => {
            define(this, key, parsed.passThrough[key], (val) => setPassThrough(this, key, val))
            return key
        }, {})
        this.children = (!children || !children.length || !children[0]) ? null : children
    }

    /**
     * Renders the element and children to the DOM
     * 
     * @param {HTMLElement} parentElement
     * @param {ElementDefinition} [elementDef] 
     * @returns {HTMLElement}
     * @memberof ElementDefinition
     */
    render(parentElement, elementDef) {
        if (!this.tagName) {
            throw new Error('tagName must be defined')
        }
        let scope = { element: getElement(this, parentElement) }  
        if (this.children) {
            scope.children = this.children.map((child) => {
                if (!(child instanceof ElementDefinition)) {
                    throw new Error("children must be of type ElementDefinition")
                }
                return child.render(scope.element, this)
            })
        }
        this.element = scope.element
        Object.keys(this.handlers).forEach((domEventName) => {
            this.addEventListener(domEventName, this.handlers[domEventName])
        })
        if (elementDef) {
            this.parent = elementDef
        }
        return scope.element
    }

    addEventListener(evName, handler) {
        if (!this.element) {
            this.handlers[evName] = handler
            return
        }
        if (evName === CUSTOM_DRAG_EVENT) {
            addDragHandler(this, handler)
            return  
        }
        addEvent(this, evName, handler)
    }

    /**
     * Emits events to subscribers.  
     * -- Subscribers are defined on the instance as attributes(attrs) whose property names begin with: '@'
     * - When actually referencing subscribers, we no longer use the '@' part of the property name since it only exists to map subscriptions
     * 
     * @param {string} messageName 
     * @param {any} [messageContent]
     * @memberof ElementDefinition
     */
    emit(messageName, messageContent) {
        if (typeof this.subscriptions[messageName] === 'function') {
            this.subscriptions[messageName](messageContent)
        }
    }

    querySelector(selector) {
        throw new Error('querySelector has yet to be implemented')
    }

    isVirtual() {
        return this.tagName === VIRTUAL_ELEMENT
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
        this.classList[(active) ? 'add' : 'remove']('active')
    }

    remove() {
        if (this.element) {
            this.element.parentNode.removeChild(this.element)
        }
        this.parent = null
    }

    /**
     * Gets X and Y offset from window.
     * 
     * @returns {{x: number, y: number}}
     * @memberof ElementDefinition
     */
    windowOffset() {
        let offset = {x: this.element.offsetLeft, y: this.element.offsetTop}
        let current = this.element.parentElement
        while (current.parentElement) {
            offset.x += current.offsetLeft
            offset.y += current.offsetTop
            current = current.parentElement
        }
        return offset
    }

    clone(handle) {
        let chs = (this.children || []).map((el) => el.clone())
        let ne = new ElementDefinition(this.tagName, this.config, chs)
        handles[handle || 'last'] = ne
        return ne
    }

    setHandle(handle) {
        handles[handle] = this
    }
}

function getElement(elementDef, parentElement) {
    if (elementDef.isVirtual()) {
        return parentElement
    }
    return renderElement(elementDef, parentElement)
}

function parse(agg, key) {
    if (key === 'handle') {
        // TODO: Change 'handle' to ':id'
        return agg
    }
    // TODO: tighten this up to remove the need for the if statement.
    let mKey = MAPPED_ATTRIBUTE[key] || key
    if (key.indexOf(':') === 0) {
        agg.passThrough[key.replace(':', '')] = agg.o[key]
    } else if (key.indexOf('@') === 0) {
        agg.subscriptions[key.replace('@', '')] = agg.o[key]
    } else if (typeof agg.o[key] === 'function' || key === CUSTOM_DRAG_EVENT) {
        agg.handlers[mKey] = agg.o[key]
    } else if (DIRECT_SET_ATTRIBUTES.indexOf(mKey) > -1) {
        agg.directSetProps[mKey] = agg.o[key]
    } else {
        agg.attrs[mKey] = agg.o[key]
    }
    return agg
}

function setPassThrough(obj, key, value) {
    let innerName = `_${key}`
    if (obj[innerName] === value) { return }
    obj[innerName] = value
    if (!obj.children) { return }
    obj.children.forEach((child) => {
        if (typeof child.passThrough[key] !== 'undefined') {
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
    let mKey = MAPPED_ATTRIBUTE[key] || key
    var settings = {
      set: (val) => {
          if (value === val) { return }
          if (obj.element && DIRECT_SET_ATTRIBUTES.indexOf(mKey) > -1) {
            obj.element[mKey] = val + ''
          } else if (obj.element && typeof obj.attrs[key] !== 'undefined') {
            obj.element.setAttribute(key, val)
          }
          value = val
      },
      get: () => (key === 'style' && obj.element) ? obj.element.style || value : value
    }
    if (setter) {
        settings.set = setter
    }
    Object.defineProperty(obj, mKey, settings)
    obj[mKey] = value
    return obj[mKey]
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
        if (typeof children[0] === 'string') {
            attributes.textContent = children[0]
            children = children.slice(1)
        }        
        // if the first element is an array, it was passed in as an array instead of arguments
        children = Array.isArray(children[0]) ?  children[0] : children
        return new ElementDefinition(tagName, attributes, children)
    }
}

ElementDefinition.getHandle = (id) => {
    return handles[id]
}

let exportable = {
    ElementDefinition: ElementDefinition,
    E: ElementDefinition,
    virtual: getBuilder('virtual')
}

exportable = ELEMENTS.reduce((agg, next) => {
    agg[next] = getBuilder(next)
    return agg
}, exportable)

export const e = exportable