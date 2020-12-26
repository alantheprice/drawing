import { e } from '../templater/renderer'
import modal from './modal'
import {tab, tabs} from './tabs'
import swatches from '../color/swatches'
import { Color } from '../color/Color'

const { div, input, button, p, label } = e.elements
const getHandle = e.getHandle

const ID_MAP = {
    'red': 'r',
    'green': 'g',
    'blue': 'b',
    'opacity': 'a'
}

/**
 * @export
 * @param {{ colorSelected: function(Color), currentColor: Color}} config
 * @returns {ElementDefinition}
 */
export function colorPicker(config) {
    return modal(
        div({
                class: 'c-color-picker__tabs', 
                v_color: config.currentColor, 
                e_onColorChanged: function(color) {
                    this.v_color = color
                    config.colorSelected(color)
                }
            },
            tabs({},
                tab({title: 'swatches', active: true },
                    div({class: 'c-color-swatches__container'},
                        colorPickerDisplay(),
                        div({class: 'c-color-swatches'},
                            swatches.map(colorSwatch)
                        )
                    )
                ),
                tab({title: 'custom', active: false},
                    div({class: 'c-color-picker'},
                        colorPickerDisplay(),
                        div({class: 'c-color-picker__sliders'},
                            Object.keys(ID_MAP).map(getColorSliders)
                        )
                    )
                )
            )
        )
    )
}

function colorPickerDisplay() {
    return div({
        class: 'c-color-picker__display',  
        style: '',
        v_color: null,
        set_color: function(color) {
            this.style = `background-color: ${this.v_color.getAsCssValue()}`
        }
    })
}

function getColorSliders(propName) {
    let key = ID_MAP[propName]
    let max = (propName === 'opacity') ? 1 : 256
    let step = (propName === 'opacity') ? .01 : 1
    return div({class: 'c-color-picker__option'},
        label({class: 'c-color-picker__range-label'}, propName),
        input({
            class: 'c-color-picker__range', 
            type: 'range', 
            min: 0, 
            max: max, 
            step: step,
            v_color: null,
            set_color: function(color) { this.value = color[key] },
            value: '', 
            oninput: rangeValueChanged(key)
        })
    )
}

/**
 * 
 * @param {{r:number, g: number, b: number, a: number}} color 
 * @returns {ElementDefinition}
 */
function colorSwatch(color) {
    let c = Color.fromObject(color)
    return button({
        class: 'btn circle',
        onclick: setColor(c),
        style: `background-color: ${c.getAsCssValue()};`
    })
}


function setColor(color) {
    return function(ev) {
        this.emit('onColorChanged', color)
    }
}

function rangeValueChanged(colorKey) {
    return function(ev) {
        this.value = Number(ev.target.value)
        let color = Color.fromObject(Object.assign({} , this.v_color, {[colorKey]: this.value}))
        this.emit('onColorChanged', color)
    }
}