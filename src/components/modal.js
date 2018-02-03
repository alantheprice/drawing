import e from '../templater/ElementDefinition'
const div = e.div

/**
 * 
 * 
 * @export
 * @param {ElementDefinition} element 
 */
export default function (element) {
    let modal = getModal(element)
    modal.render(document.body)
}

/**
 * Create a modal with 
 * 
 * @param {ElementDefinition} elementContent 
 * @returns 
 */
function createModal(elementContent) {
    return div({clas:'c-modal'}, 
        div({class: 'c-modal__overlay'}, 
            div({class: 'c-modal__content'},
                elementContent
            )
        )
    )
}