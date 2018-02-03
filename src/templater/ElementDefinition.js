import { renderElement } from './renderUtils.js'
import { addDragHandler, addEvent, CUSTOM_DRAG_EVENT } from '../eventHandling/event'
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
        this.attr = config.attributes
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
                    child = new ElementDefinition(child, child.children)
                }
                return child.render(scope.element)
            })
        }
        addEventHandlers(scope.element, this.handlers)
        this.element = scope.element
        return scope.element
    }

    addClass(className) {
        if (this.element) {
            this.element.classList.add(className)
        } else {
            this.attr = this.attr || {}
            this.attr.class = this.attr.class || ''
            this.attr.class = [this.attr.class, className].join(' ')
        }
    }

    removeClass(className) {
        if (this.element) {
            this.element.classList.remove(className)
        } else if (this.attr && this.attr.class.indexOf(className) > -1){
            this.attr.class = this.attr.class.split(' ').filter((cn) => cn !== className).join(' ')
        }
    }
}

function addEventHandlers(elem, handlers) {
    if (handlers) {
        Object.keys(handlers).map((domEventName) => {
            return {name: domEventName, handler: handlers[domEventName]}
        }).forEach((ev) => {
            if (ev.name === CUSTOM_DRAG_EVENT) {
                addDragHandler(elem, ev.handler)
            } else {
                addEvent(elem, ev.name, ev.handler)
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

        return new ElementDefinition(tagName, config, children)
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