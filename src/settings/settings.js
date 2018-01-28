import { ElementDefinition, buildElement } from '../templater/ElementDefinition'

export const SETTING_EVENTS = {
    BRUSH_SIZE: 'brush-size',
    COLOR: 'color',
    SAVE: 'save'
}
let subscriptions = []
let customColor = {r: 40, g: 40, b: 40, a: 1}

export function getBrushLayout() {
    // let overlay = buildElement('div', 'brush-container')
    // return new ElementDefinition(overlay, [])
    return {}
}

export function getColorLayout() {
    let r = buildElement('button', 'btn red-btn', colorClicked('red'))
    let g = buildElement('button', 'btn green-btn', colorClicked('green'))
    let b = buildElement('button', 'btn blue-btn', colorClicked('blue'))

    let custom = buildElement('button', 'btn custom-color-btn')
    custom.handlers = {
        mousedown: (ev) => handleCustomClick(ev),
        touchstart: (ev) => handleCustomTap(ev)
    }

    let colorLayout = buildElement('div', 'color-container')
    let innerColorLayout = new ElementDefinition(buildElement('div', 'inner-color-container'), [r, g, b])

    return new ElementDefinition(colorLayout, [custom, innerColorLayout])
}

export function subscribe(key, handler) {
    subscriptions[key] = handler
}

function colorClicked(color) {
    return (ev) => {
        updateColor(color)
    }
}

function updateColor(color) {
    if (subscriptions[SETTING_EVENTS.COLOR]) {
        subscriptions[SETTING_EVENTS.COLOR](color)
    }
}

/**
 * 
 * 
 * @param {MouseEvent} ev 
 */
function handleCustomClick(ev) {
    let elem = ev.currentTarget
    let startingPoint = {x: ev.clientX, y: ev.clientY}
    // b: 90, g: 170, r: 250
    let color = Object.assign({}, customColor)
    let m = 2.8
    let handleMove = (ev) => {
        let move = startingPoint.x - ev.clientX
        if (move > 90  && move < 170) {
            color.g = ((move - 90) * m) + 40
            color.b = 250 - ((move - 90) * m)
        } else if (move > 170  && move < 250) {
            color.r = ((move - 170) * m) + 40
            color.g = (250 - ((move - 170) * m))
        } else if (move > 250) {
            color.b = ((move - 250) * m) + 40
            color.r = 250 - ((move - 250) * m)
        }
        elem.style.marginRight = move + 'px'
        elem.style.backgroundColor = `rgb(${color.r.toFixed()}, ${color.g.toFixed()}, ${color.b.toFixed()})`
    }
    let finishMove = (ev) => {
        customColor = color
        updateColor(`rgb(${color.r.toFixed()}, ${color.g.toFixed()}, ${color.b.toFixed()})`)//`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`)
        elem.style.marginRight = ''
        elem.removeEventListener('mousemove', handleMove)
        elem.removeEventListener('mouseup', finishMove)
        // TODO: finish
    }
    elem.addEventListener('mouseup', finishMove)
    elem.addEventListener('mousemove', handleMove)
}

/**
 * 
 * 
 * @param {TouchEvent} ev 
 */
function handleCustomTap(ev) {

}

function openOpacitySlider() {
    console.log('open an opacity slider here.')
}