import { e } from '../templater/ElementDefinition'
const { div, button, ElementDefinition } = e

/**
 * 
 * 
 * @export
 * @param {ElementDefinition} element 
 * @returns {ElementDefinition}
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
    let modal = div({class:'c-modal'},
        div({class: 'c-modal__overlay o-flex'},
            div({class: 'c-modal__inner-container'},
                div({class: 'c-modal__content'},
                    elementContent
                ),
                div({class: 'c-modal__btn-container'},
                    button({class: 'btn c-modal__btn-close', textContent: 'OK', click: () => modal.remove()})
                ) 
            )
        )
    )
    return modal
}