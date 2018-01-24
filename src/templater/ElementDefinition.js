import { renderElement } from './renderUtils.js'

export default class ElementDefinition {
    /**
     * Creates an instance of ElementDefinition.
     * @param {{tag: {attributes: Object, innerText: string}}} config
     * @param {ElementDefinition[]} children 
     * @memberof ElementDefinition
     */
    constructor(config, children) {
        this.tagName = Object.keys(config)[0]
        this.attributes = config[this.tagName].attributes || null
        this.handlers = config[this.tagName].handlers || null
        this.innerText = config[this.tagName].innerText || null
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
        let scope = {element: renderElement(this.tagName, this.attributes, this.innerText, parentElement)}  
        if (this.children) {
            scope.children = this.children.map((child) => {
                if (!(child instanceof ElementDefinition)) {
                    child = new ElementDefinition(child, child.children)
                }
                return child.render(scope.element)
            })
        }
        this.addEventHandlers(scope.element)
        this.element = scope.element
        return scope.element
    }

    addEventHandlers(elem) {
        if (this.handlers) {
            Object.keys(this.handlers).map((domEventName) => {
                return {name: domEventName, handler: this.handlers[domEventName]}
            }).forEach((ev) => {
                elem.addEventListener(ev.name, ev.handler)
            })
        }
    }
}