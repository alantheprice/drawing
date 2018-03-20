import { e } from '../templater/renderer'

const { div, button } = e.elements

// DEPRECATED, USE NEW TABS PATTERN ONCE COMPLETE.
/**
 * 
 * 
 * @export
 * @param {{title: string, active: boolean, layout: ElementDefinition}[]} tabs
 * @returns {ElementDefinition}
 */
export default function (tabs) {
    return createTabs(tabs)
}

/**
 * Create a tabLayout
 * 
 * @param {{title: string, active: boolean, layout: ElementDefinition}[]} tabs
 * @returns {ElementDefinition}
 */
function createTabs(tabs) {
    let tabLayouts = tabs.map(getTabLayout)
    let tabButtons = tabs.map((t, idx) => getButton(t, idx, setTab))

    function setTab(index) {
        return (ev) => {
            tabLayouts.forEach((tab, idx) => tab.setActive(idx === index))
            tabButtons.forEach((btn, idx) => btn.setActive(idx === index))
        }
    }

    return div({class:'c-tab-layout'},
        div({class: 'c-tab-layout__button-container'}, 
            tabButtons
        ),
        div({class: 'c-tab-layout__container'},
            tabLayouts
        )
    )
}

/**
 * @param {{title: string, active: boolean, layout: ElementDefinition}} tab
 * @returns {ElementDefinition}
 */
function getTabLayout(tab) {
    let tabLayout = div({class: `c-tab-layout__tab${(tab.active)? ' active' : ''}`},
        tab.layout
    )
    return tabLayout
}
/**
 * 
 * 
 * @param {{title: string, active: boolean, layout: ElementDefinition}} tab 
 * @param {number} index 
 * @param {function(number)} setTab 
 */
function getButton(tab, index, setTab) {
    return button({
        class: `c-tab-layout__button${(tab.active)? ' active' : ''}`,
        click: setTab(index)
    }, tab.title)
}