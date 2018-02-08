import { init, clear, undo, updateSettings } from '../drawing/drawing'
import { e, ElementDefinition } from '../templater/ElementDefinition'
import { colorButton } from './colorButton'
// import { getBrushLayout, getColorLayout, subscribe, SETTING_EVENTS} from './settings/settings'
let settingsShowing = false
const {div, button, i } = e

// initialize drawing
init()

// function showSettings(layouts) {
//   settingsShowing = !settingsShowing
//   layouts.forEach((layout) => layout.setActive(settingsShowing))
//   console.log('settings-clicked')
// }


// button({class:'btn circle setting-btn', click: () => showSettings([colorLayout])},
//   i({class:'material-icons md-light md-36', innerText: 'settings'})
// ),

/**
 * 
 * 
 * @export
 * @returns {ElementDefinition}
 */
export function controlOverlay(config) {
    return div({class:'c-overlay-container'},
        div({class:'c-editing-buttons'},
            button({class: 'btn circle clear-btn', click: clear},
                i({class: 'material-icons md-light md-36', innerText: 'delete_forever'})
            ),
            button({class:'btn circle undo-btn', click: undo},
                i({class:'material-icons md-light md-36', innerText: 'undo'})
            ),
            colorButton({'@colorSelected': (color) => updateSettings({color: color})})
        )
    )
}
