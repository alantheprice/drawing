import { e } from '../templater/renderer'

const { div, button } = e.elements
const eTab = e.register('d-tab')

/**
 *  
 * @export
 * @param {{title: string, active: boolean}} tabConfig 
 * @param {ElementDefinition[]} tabContents
 * @returns {ElementDefinition}
 */
export function tab(tabConfig, ...tabContents) {
    return eTab({
            _id: tabConfig.id || Symbol('tab'), 
            class: `c-tab-layout__tab${(tabConfig.active)? ' active' : ''}`,
            _active: tabConfig.active,
            _title: tabConfig.title
        },
        tabContents
    )
}
/**
 * 
 * 
 * @export
 * @param {any} config 
 * @param {{_title: string, _active: boolean, setActive: function(boolean)}[]} tabs 
 */
export function tabs(config, ...tabs) {
    let tabButtons = tabs.map((t, idx) => getButton(t, idx, setTab))

    function setTab(index) {
        return (ev) => {
            tabs.forEach((tab, idx) => tab.setActive(idx === index))
            tabButtons.forEach((btn, idx) => btn.setActive(idx === index))
        }
    }

    return div({class:'c-tab-layout'},
        div({class: 'c-tab-layout__button-container'}, 
            tabButtons
        ),
        div({class: 'c-tab-layout__container'},
            tabs
        )
    )
}

/**
 * 
 * 
 * @param {{_title: string, _active: boolean}} tab 
 * @param {number} index 
 * @param {function(number)} setTab 
 */
function getButton(tab, index, setTab) {

    return button({
        class: `c-tab-layout__button${(tab.attr._active)? ' active' : ''}`,
        onclick: setTab(index)
    }, tab.attr._title)
}