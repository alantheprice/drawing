import { renderElement } from './renderUtils.js'

/**
 * Function to simplify building an ElementDefinition
 * 
 * @export
 * @param {string} tagName 
 * @param {string} className 
 * @param {function(event, HTMLElement)} [clickHandle] 
 * @returns {{tag: {attributes: Object, innerText: string}}}
 */
export function buildElement(tagName, className, clickHandle) {
    var elementDef = {}
    elementDef[tagName] = {
        attributes: {class: className}
    }
    if (clickHandle) {
        elementDef[tagName].handlers = {
            click: clickHandle
        }
    }
    return elementDef
}

export class ElementDefinition {
    /**
     * Creates an instance of ElementDefinition.
     * @param {{tag: {attributes: Object, innerText: string}}} config
     * @param {ElementDefinition[]} [children] 
     * @memberof ElementDefinition
     */
    constructor(config, children) {
        this.tagName = Object.keys(config)[0]
        this.attr = config[this.tagName].attributes || config.attributes
        this.handlers = config[this.tagName].handlers || config.handlers || null
        this.innerText = config[this.tagName].innerText || config.innerText || ''
        this.children = children
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
            elem.addEventListener(ev.name, ev.handler)
        })
    }
}