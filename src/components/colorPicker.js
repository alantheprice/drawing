import { e, ElementDefinition } from '../templater/ElementDefinition'
import modal from './modal'
import tabLayout from './tabLayout'
import {tab, tabs} from './tabs'
import swatches from '../color/swatches'
import { Color } from '../color/Color'

const { div, input, button, p, label } = e
const ID_MAP = {
    'red': 'r',
    'green': 'g',
    'blue': 'b',
    'opacity': 'a'
}
let selectedColor = new Color(25, 40, 120)

/**
 * @export
 * @param {{'@colorSelected': function(Color), ':currentColor': Color}} config
 * @returns {ElementDefinition}
 */
export default function getColorPicker(config) {
    selectedColor.update(config[':currentColor'])

    let displayColor = div({class: 'c-color-picker__display', style: `background-color: ${selectedColor.getAsCssValue()}`})
    let swatchDisplayColor = div({class: 'c-color-picker__display', style: `background-color: ${selectedColor.getAsCssValue()}`})
    let sliders = Object.keys(ID_MAP).map(getColorSliders)

    let cpModal = modal(
        div({class: 'c-color-picker__tabs'},
            tabs({},
                tab({':title': 'swatches', ':active': true },
                    div({class: 'c-color-swatches__container'},
                        swatchDisplayColor,
                        div({class: 'c-color-swatches'},
                            swatches.map(colorSwatch)
                        )
                    )
                ),
                tab({':title': 'custom', ':active': false},
                    div({class: 'c-color-picker'},
                        displayColor,
                        div({class: 'c-color-picker__sliders'},
                            sliders
                        )
                    )
                )
            )
        )
    )

    return cpModal
        
    function valueChanged(id) {
        return (ev) => {
            selectedColor[ev.target.id] = ev.target.value
            showChange()
        }
    }

    function setColor(color) {
        return (ev) => {
            selectedColor.update(color)
            sliders.forEach((item) => {
                item.children[1].value = selectedColor[item.children[1].id]
                console.log(item)
            })
            showChange()
        }
    }

    function showChange() {
        config['@colorSelected'](selectedColor.copy())
        displayColor.style = `background-color: ${selectedColor.getAsCssValue()}`
        swatchDisplayColor.style = `background-color: ${selectedColor.getAsCssValue()}`
    }

    function getColorSliders(propName) {
        let key = ID_MAP[propName]
        let max = (propName === 'opacity') ? 1 : 256
        let step = (propName === 'opacity') ? .01 : 1
        // this really should be it's own component.
        return div({class: 'c-color-picker__option'},
            label({class: 'c-color-picker__range-label', innerText: propName}),
            input({class: 'c-color-picker__range', type: 'range', min: 0, max: max, step: step, id: key, value: selectedColor[key], input: valueChanged(key)})
        )
    }

    /**
     * 
     * @param {{r:number, g: number, b: number, a: number}} color 
     * @returns {ElementDefinition}
     */
    function colorSwatch(color) {
        let c = new Color(color.r, color.g, color.b, 1)
        return button({
            class: 'btn circle', 
            click: setColor(c),
            style: `background-color: ${c.getAsCssValue()};`
        })
    }
}
