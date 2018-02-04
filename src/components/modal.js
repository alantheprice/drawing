import e from '../templater/ElementDefinition'
const div = e.div

/**
 * 
 * 
 * @export
 * @param {ElementDefinition} element 
 * @returns {ElementDefintion}
 */
export default function (element) {
    let modal = createModal(element)
    modal.render(document.body)
    return modal
}

/**
 * Create a modal with 
 * 
 * @param {ElementDefinition} elementContent 
 * @returns 
 */
function createModal(elementContent) {
    return div({class:'c-modal'}, 
        div({class: 'c-modal__overlay'}, 
            div({class: 'c-modal__content'},
                elementContent
            )
        )
    )
}