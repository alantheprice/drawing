import { e, ElementDefinition } from '../templater/ElementDefinition'
import { addDragHandler, addEvent, CUSTOM_DRAG_EVENT} from '../eventHandling/event'
import colorPicker from './colorPicker'
import { Color } from '../color/Color'
const { div, button, i } = e

/**
 * Color Button component
 * Handles setting color
 * 
 * @export
 * @param {{'@colorSelected': function(Color), ':currentColor': Color}} config
 * @returns {ElementDefinition}
 */
export function colorButton(config) {
    let currentColor = config[':currentColor']
    config = Object.assign(config, { class: 'btn circle custom-color-btn', click: openColorPicker, style: 'background-color: rgb(40,40,40)' })
    let colorBtn = button(config,
        i({ class: 'material-icons md-light md-36', textContent: 'brush' })
    )

    return colorBtn

    /**
     * 
     * 
     * @param {Color} color 
     */
    function updateColor(color) {
        colorBtn.style.backgroundColor = `${color.getAsCssValue()}`
        colorBtn.emit('colorSelected', color)
    }

    function openColorPicker() {
        colorPicker({'@colorSelected': updateColor, ':currentColor': currentColor})
    }
}
