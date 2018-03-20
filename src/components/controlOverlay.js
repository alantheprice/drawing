import { init, clear, undo, updateSettings } from '../drawing/drawing'
import { e } from '../templater/renderer'
import { colorButton } from './colorButton'
import { brushControl } from './brushControl'
import { Setting } from '../settings/Setting'
import { Color } from '../color/Color'

const { button, i, div } = e.elements
const getHandle = e.getHandle

let settingsShowing = false
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
    return div({class:'c-overlay-container', 
                v_settings: new Setting(startingColor, 5, 1), 
                set_settings: settingsChanged,
                v_color: startingColor,
                v_size: 5,
                e_updateColor: colorChanged,
                e_updateSize: sizeChanged
            },
        // button({class:'btn circle setting-btn', click: () => showSettings([])},
        //     i({class:'material-icons md-light md-36', textContent: 'settings'})
        // ),
        div({class:'c-editing-buttons'},
            button({class: 'btn circle clear-btn', onclick: clear},
                i({class: 'material-icons md-light md-36'}, 'delete_forever')
            ),
            button({class:'btn circle undo-btn', onclick: undo},
                i({class:'material-icons md-light md-36'}, 'undo')
            ),
            brushControl()
        )
    )
}

function settingsChanged(newSetting) {
    this.v_settings = newSetting
    updateSettings(newSetting)
}

function colorChanged(newColor) {
    this.v_color = newColor
    this.v_settings = new Setting(newColor, this.v_settings.lineWidth)
}

function sizeChanged(lineWidth) {
    this.v_size = lineWidth
    this.v_settings = new Setting(this.v_settings.color, lineWidth)
}
