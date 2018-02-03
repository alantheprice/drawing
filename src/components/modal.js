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
 * 
 * 
 * @param {any} element 
 * @returns 
 */
function getModal(element) {
    return E(div('c-modal'), 
        E(div('c-modal__overlay'), 
            E(div('c-modal__content'),
                element)
        )
    )
}