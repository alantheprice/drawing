import { e } from '../templater/renderer'
import { addDragHandler, addEvent, CUSTOM_DRAG_EVENT} from '../eventHandling/event'
import colorPicker from './colorPicker'
import { Color } from '../color/Color'
const { button, i, div } = e.elements
const getHandle = e.getHandle
/**
 * Color Button component
 * Handles setting color
 * 
 * @export
 * @returns {ElementDefinition}
 */
export function colorButton() {
    return button({
            class: 'btn circle custom-color-btn', 
            onclick: function (ev, elem) {
                // Tying these two disparate components together
                openColorPicker(this.v_color, (newColor) => {
                    this.emit('updateColor', newColor)
                })
            },
            v_color: null,
            set_color: setBackground,
            style: 'background-color: rgb(40,40,40)' 
        },
        i({ class: 'material-icons md-light md-36'}, 'brush')
    )

}

function setBackground() {
    this.style.backgroundColor = `${this.v_color.getAsCssValue()}`
}

function openColorPicker(currentColor, updateColor) {
    colorPicker({e_colorSelected: function (color) {
        this.v_color = color
        updateColor(color)
    }, v_color: currentColor})
}


