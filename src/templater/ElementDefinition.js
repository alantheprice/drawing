import { renderElement } from './renderUtils.js'
import { addDragHandler, addEvent, CUSTOM_DRAG_EVENT, TOUCH_EVENT_MAP } from '../eventHandling/event'
import { ELEMENTS, EVENTS } from './constants.js'

const ATTRIBUTE_MAP = EVENTS.reduce((obj, next) => {
        obj[next] = 'handlers'
        return obj
    }, {})

class ElementDefinition {
    /**
     * Creates an instance of ElementDefinition.
     * @param {string} tagName
     * @param {{attributes: Object, innerText: string, handlers: Object}} config
     * @param {ElementDefinition[]} [children] 
     * @memberof ElementDefinition
     */
    constructor(tagName, config, children) {
        this.tagName = tagName
        this.attr = config.attributes || {}
        this.handlers = config.handlers
        this.innerText = config.innerText || ''
        this.children = (!children || !children.length || !children[0]) ? null : children
    }

    /**
     * 
     * @param {HTMLElement} [parentElement] 
     * @returns {HTMLElement}
     * @memberof ElementDefinition
     */
    render(parentElement) {
        if (!this.tagName) {
            throw new Error('tagName must be defined')
        }
        let scope = {element: renderElement(this.tagName, this.attr, this.innerText, parentElement)}  
        if (this.children) {
            scope.children = this.children.map((child) => {
                if (!(child instanceof ElementDefinition)) {
                    child = Object.assign(ElementDefinition.prototype, child)
                }
                return child.render(scope.element)
            })
        }
        addEventHandlers(scope.element, this.handlers)
        this.element = scope.element
        return scope.element
    }

    /**
     * Add specified class to the element
     * 
     * @param {any} className 
     * @memberof ElementDe*ideafinition
     */
    addClass(className) {
        if (this.element) {
            this.element.classList.add(className)
        }
        this.attr = this.attr || {}
        this.attr.class = this.attr.class || ''
        this.attr.class = [this.attr.class, className].join(' ')
    }

    /**
     * Remove specified class from the element
     * 
     * @param {any} className 
     * @memberof ElementDefinition
     */
    removeClass(className) {
        if (!this.attr || this.attr.class.indexOf(className) === -1){
            return
        }
        this.attr.class = this.attr.class.split(' ').filter((cn) => cn !== className).join(' ')
        if (this.element) {
            this.element.className = this.attr.class
        } 
    }

    remove() {
        if (this.element) {
            this.element.parentNode.removeChild(this.element)
        }
    }
}



function addEventHandlers(elem, handlers) {
    if (handlers) {
        debugger
        Object.keys(handlers).map((domEventName) => {
            return {name: domEventName, handler: handlers[domEventName]}
        }).forEach((ev) => {
            if (ev.name === CUSTOM_DRAG_EVENT) {
                addDragHandler(elem, ev.handler)
            } else if (Object.keys(TOUCH_EVENT_MAP).indexOf(ev.name) > -1) {
                addEvent(elem, ev.name, ev.handler)
            } else {
                document.addEventListener(ev.name, ev.handler)
            }
        })
    }
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
     * 
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



export default exportable