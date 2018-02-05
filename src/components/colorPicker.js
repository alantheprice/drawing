import e from '../templater/ElementDefinition'
import modal from './modal'
import tabLayout from './tabLayout'

const { div, input, button, p, label } = e
const ID_MAP = {
    'red': 'r',
    'green': 'g',
    'blue': 'b',
    'opacity': 'a'
}
let selectedColor = { r: 25, g: 40, b: 120, a: 1 }

/**
 * @export
 * @param {{r: number, g: number, b: number, a: number}} currentColor 
 * @param {function({r: number, g: number, b: number, a: number})} onColorChanged 
 * @returns 
 */
export default function getColorPicker(currentColor, onColorChanged) {
    selectedColor = Object.assign({}, currentColor)
    let displayColor = div({class: 'c-color-picker__display', style: `background-color: ${selectedColorToDisplay()}`})
    let sliders = Object.keys(ID_MAP).map(getColorSliders)

    let cpModal = modal(
        tabLayout([{
            title: 'custom color',
            active: false,
            layout: div({class: 'c-color-picker'},
                displayColor,
                div({class: 'c-color-picker__sliders'},
                    sliders
                )
            )
        },
        {
            title: 'color swatches',
            active: true,
            layout: div({class: 'c-color-swatches'},
                button({class: 'btn circle btn-red', click: setColor({r: 250, g: 80, b: 80}) }),
                button({class: 'btn circle btn-green', click: setColor({r: 80, g: 250, b: 80}) }),
                button({class: 'btn circle btn-blue', click: setColor({r: 80, g: 80, b: 250}) })
            )
        }])
    )

    return cpModal
        
    function valueChanged(id) {
        return (ev) => {
            let mapped = ID_MAP[ev.target.id]
            selectedColor[mapped] = ev.target.value
            showChange()
        }
    }

    function setColor(color) {
        return (ev) => {
            selectedColor = Object.assign(selectedColor, color)
            sliders.forEach((item) => {
                item.children[1].value = selectedColor[item.children[1].id]
                console.log(item)
            })
            showChange()
        }
    }

    function showChange() {
        // don't mutate
        onColorChanged(Object.assign({}, selectedColor))
        displayColor.element.style.backgroundColor = selectedColorToDisplay()
    }

    function selectedColorToDisplay() {
        return `rgba(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b}, ${selectedColor.a})`
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
}
