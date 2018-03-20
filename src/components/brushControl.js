import { e } from '../templater/renderer'
import { Color } from '../color/Color'
import { colorButton } from './colorButton'
import { brushSizeButton } from './brushSizeButton'
import { Setting } from '../settings/Setting'

const { div, button, i, virtual } = e.elements
const getHandle = e.getHandle

/**
 * Brush control virtual component
 * 
 * @export
 * @returns {ElementDefinition}
 */
export function brushControl() {

    return virtual({},
        colorButton(),
        brushSizeButton()
        // colorButton({
        //     v_settings: null,
        //     set_settings: setCurrentSetting,
        //     v_color: null, 
        //     v_size: null,
        //     // _colorSelected: '',
        //     // _colorSelected: updateSettings('color')
        // }),
        // brushSizeButton()
        //{
            // v_size: null, 
            // set_sizeSelected: updateSettings('lineWidth')
        //})
    )

    // /**
    //  * @param {string} name 
    //  */
    // function updateSettings(name) {
    //     return (value) => {
    //         config.v_updateSettings({[name]: value})
    //     }
    // }
}

