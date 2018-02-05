import e from '../templater/ElementDefinition'
const { div, button } = e

/**
 * 
 * 
 * @export
 * @param {{title: string, active: boolean, layout: ElementDefinition}[]} tabs
 * @returns {ElementDefintion}
 */
export default function (tabs) {
    return createTabs(tabs)
}

/**
 * Create a tabLayout
 * 
 * @param {{title: string, active: boolean, layout: ElementDefinition}[]} tabs
 * @returns 
 */
function createTabs(tabs) {
    let tabLayouts = tabs.map(getTabLayout)

    let tabButtons = div({class: 'c-tab-layout__buttons'}, 
        tabs.map((t, idx) => getButton(t, idx, setTab))
    )

    function setTab(index) {
        return (ev) => {
            tabButtons.forEach((btn, idx) => btn.setActive(idx === index))
            tabLayouts.forEach((tab, idx) => tab.setActive(idx === index))
        }
    }

    return div({class:'c-tab-layout'},
        tabLayouts,
        tabButtons
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
 * @param {any} tab 
 * @param {any} index 
 * @param {function(number)} setTab 
 */
function getButton(tab, index, setTab) {
    let btn = button({
        class: `c-tab-layout__button${(tab.active)? ' active' : ''}`,
        click: setTab(index)
    })
}