
/**
 * renders an htmlElement
 * 
 * @export
 * @param {{tagName: string, attrs: string[], directSetProps: string[]}} elementDef
 * @param {HTMLElement} [parentElement] 
 * @returns {HTMLElement}
 */
export function renderElement(elementDef, parentElement) {
    let elem = create(elementDef.tagName);
    // debugger
    (elementDef.attrs || [])
    .filter((key) => elementDef[key])
        .forEach((attName) => {
            elem.setAttribute(attName, elementDef[attName])
        });
    (elementDef.directSetProps || [])
        .filter((key) => {
            // debugger
            return elementDef[key]
        })
        .forEach((attName) => {
            elem[attName] = elementDef[attName]
        })
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