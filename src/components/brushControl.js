import { e } from '../templater/ElementDefinition'
import { Color } from '../color/Color'
import { colorButton } from './colorButton'
import { brushSizeButton } from './brushSizeButton'
import { Setting } from '../settings/Setting'
const {div, button, i, virtual, ElementDefinition } = e

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
            '@colorSelected': updateSettings('color')
        }),
        brushSizeButton({
            ':currentSize': currentSettings.lineWidth, 
            '@sizeSelected': updateSettings('lineWidth')
        })
    )

    /**
     * @param {string} name 
     */
    function updateSettings(name) {
        return (value) => {
            config['@updateSettings']({[name]: value})
        }
    }
}
