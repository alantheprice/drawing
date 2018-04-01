import { e } from '../templater/renderer'

const { div, button } = e.elements

/**
 * 
 * 
 * @export
 * @param {ElementDefinition} element 
 * @returns {ElementDefinition}
 */
export default function (element) {
    return div({
            class:'c-modal', 
                e_onremove: function() {
                this.remove()
            }
        },
        div({class: 'c-modal__overlay o-flex'},
            div({class: 'c-modal__inner-container'},
                div({class: 'c-modal__content'},
                    element
                ),
                div({class: 'c-modal__btn-container'},
                    button({class: 'btn c-modal__btn-close', onclick: function() { this.emit('onremove') }}, 'OK')
                ) 
            )
        )
    ).render(document.body)
    // return modal
}