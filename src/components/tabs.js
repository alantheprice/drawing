import { e } from '../templater/renderer'

const { div, button } = e.elements


/*
USAGE: 
tabs({?},
    tab({':title': 'color swatches', ':active': true},
        content
    ),
    tab({':title': 'custom color', ':active': true},
        content
    )
)
**/

/**
 *  
 * @export
 * @param {{':title': string, ':active': boolean}} tabConfig
 * @param {ElementDefinition[]} tabContents
 * @returns {ElementDefinition}
 */
export function tab(tabConfig, ...tabContents) {
    // Create a mapping pattern to map passThrough props to strings, but need a mechanism to map them and to evaluate them, on second thought might not actually be worth it.
    let config = Object.assign(tabConfig, {class: `c-tab-layout__tab${(tabConfig[':active'])? ' active' : ''}`})
    return div(config,
        tabContents
    )
}
/**
 * 
 * 
 * @export
 * @param {any} config 
 * @param {{title: string, active: boolean, setActive: function(boolean)}[]} tabs 
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
 * @param {{title: string, active: boolean}} tab 
 * @param {number} index 
 * @param {function(number)} setTab 
 */
function getButton(tab, index, setTab) {
    return button({
        class: `c-tab-layout__button${(tab.active)? ' active' : ''}`,
        textContent: tab.title,
        click: setTab(index)
    })
}