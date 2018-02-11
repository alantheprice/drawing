import { e, ElementDefinition } from '../templater/ElementDefinition'
import { Color } from '../color/Color'
import { colorButton } from './colorButton'
import { brushSizeButton } from './brushSizeButton'
import { Setting } from '../settings/Setting'
const {div, button, i, virtual } = e

/**
 * Brush control virtual component
 * 
 * @export
 * @param {{'@updateSettings': function({[x:string]: any}), ':currentSettings': Setting}} config
 * @returns {ElementDefinition}
 */
export function brushControl(config) {
    let currentSettings = config[':currentSettings']
    return virtual({},
        colorButton({
            ':currentColor': currentSettings.color, 
            '@colorSelected': (color) => updateSettings('color', color)
        }),
        brushSizeButton({
            ':currentSize': currentSettings.lineWidth, 
            '@sizeSelected': (size) => updateSettings('lineWidth', size)
        })
    )

    /**
     * 
     * @param {string} name 
     * @param {any} value 
     */
    function updateSettings(name, value) {
        config['@updateSettings']({[name]: value})
    }
}
