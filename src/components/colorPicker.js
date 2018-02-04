import e from '../templater/ElementDefinition'
import modal from './modal'
const { div, input, button, p, label } = e
const ID_MAP = {
    'red': 'r',
    'green': 'g',
    'blue': 'b',
    'opacity': 'a'
}
let selectedColor = {
    r: 25,
    g: 40,
    b: 120,
    a: .7
}
/**
 * 
 * 
 * @export
 * @param {{r: number, g: number, b: number, a: number}} currentColor 
 * @param {function({r: number, g: number, b: number, a: number})} onColorChanged 
 * @returns 
 */
export default function getColorPicker(currentColor, onColorChanged) {
    selectedColor = Object.assign({}, currentColor)
    let displayColor = div({class: 'c-color-picker__display', style: `background-color: ${selectedColorToDisplay()}`})
    function valueChanged(id) {
        return (ev) => {
            console.log(ev, id)
            selectedColor[id] = ev.target.value
            // don't mutate
            onColorChanged(Object.assign({}, selectedColor))
            displayColor.element.style.backgroundColor = selectedColorToDisplay()
        }
    }

    function selectedColorToDisplay() {
        return `rgba(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b}, ${selectedColor.a})`
    }

    let cpModal = modal(
            div({class: 'c-color-picker'},
                displayColor,
                div({class: 'c-color-picker__sliders'},
                    Object.keys(ID_MAP).map((propName) => {
                        let key = ID_MAP[propName]
                        let max = (propName === 'opacity') ? 1 : 256
                        let step = (propName === 'opacity') ? .01 : 1
                        return div({class: 'c-color-picker__option'},
                            label({class: 'c-color-picker__range-label', innerText: propName}),
                            input({class: 'c-color-picker__range', type: 'range', min: 0, max: max, step: step, id: propName, value: selectedColor[key], change: valueChanged(key)})
                        )
                    })
                ),
                div({class: 'c-color-picker__button-container'},
                    button({class: 'btn', innerText: 'OK', click: () => cpModal.remove()})
                )
            )
        )

    return cpModal
}
