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
                _updateSettings: function() { updateSettings(this.v_settings) },
                v_settings: new Setting(startingColor, 5, 1), 
                set_settings: settingsChanged,
                v_color: startingColor,
                v_size: 5,
                e_updateColor: setChange('v_color'),
                e_updateSize: setChange('v_size')
            },
        // button({class:'btn circle setting-btn', click: () => showSettings([])},
        //     i({class:'material-icons md-light md-36', textContent: 'settings'})
        // ),
        div({class:'c-editing-buttons'},
            button({class: 'btn circle clear-btn', onclick: function() { clear(true) } },
                i({class: 'material-icons md-light md-36'}, 'delete_forever')
            ),
            button({class:'btn circle undo-btn', onclick: undo},
                i({class:'material-icons md-light md-36'}, 'undo')
            ),
            brushControl()
        )
    )
}

function setChange(key) {
    return function setValue(newVal) {
        this[key] = newVal
        this.v_settings = new Setting(this.v_color, this.v_size, this.v_color.a)
        this._updateSettings()
    }
}

function settingsChanged(newSetting) {
    this.v_settings = newSetting
    this._updateSettings()
}
