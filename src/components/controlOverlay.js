import { init, clear, undo, updateSettings } from '../drawing/drawing'
import { e, ElementDefinition } from '../templater/ElementDefinition'
import { colorButton } from './colorButton'
import { brushControl } from './brushControl'
import { Setting } from '../settings/Setting'
import { Color } from '../color/Color'
// import { getBrushLayout, getColorLayout, subscribe, SETTING_EVENTS} from './settings/settings'
let settingsShowing = false
const {div, button, i } = e
let startingColor = new Color(40,40,40, 1)

// initialize drawing
init()

function showSettings(layouts) {
  settingsShowing = !settingsShowing
  layouts.forEach((layout) => layout.setActive(settingsShowing))
  console.log('settings-clicked')
}


/**
 * 
 * 
 * @export
 * @returns {ElementDefinition}
 */
export function controlOverlay(config) {
    let brushSettings = new Setting(startingColor, 5, 1)
    return div({class:'c-overlay-container'},
        // button({class:'btn circle setting-btn', click: () => showSettings([])},
        //     i({class:'material-icons md-light md-36', innerText: 'settings'})
        // ),
        div({class:'c-editing-buttons'},
            button({class: 'btn circle clear-btn', click: clear},
                i({class: 'material-icons md-light md-36', innerText: 'delete_forever'})
            ),
            button({class:'btn circle undo-btn', click: undo},
                i({class:'material-icons md-light md-36', innerText: 'undo'})
            ),
            brushControl({'@updateSettings': updateSettings, ':currentSettings': brushSettings})
        )
    )
}
