
/**
 * renders an htmlElement
 * 
 * @export
 * @param {string} tagName 
 * @param {Object} [attributes]
 * @param {string} [innerText]
 * @param {HTMLElement} [parentElement] 
 * @returns {HTMLElement}
 */
export function renderElement(tagName, attributes, innerText, parentElement) {
    let elem = create(tagName)
    let handlers = null
    debugger
    if (attributes) {
        Object.keys(attributes).map((attName) => {
            return {name: attName, val: attributes[attName]}
        }).forEach((att) => {
            elem.setAttribute(att.name, att.val)
        })
    }
    elem.innerText = innerText
    if (parentElement) {
        parentElement.appendChild(elem)
    }
    return elem
}

/**
 * Creates an element
 * 
 * @param {string} tagName 
 * @returns {HTMLElement}
 */
function create(tagName) {
    return document.createElement(tagName)
}