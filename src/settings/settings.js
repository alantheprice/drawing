import { ElementDefinition, buildElement } from '../templater/ElementDefinition'

export const SETTING_EVENTS = {
    BRUSH_SIZE: 'brush-size',
    COLOR: 'color',
    SAVE: 'save'
}
let subscriptions = []

export function getBrushLayout() {
    // let overlay = buildElement('div', 'brush-container')
    // return new ElementDefinition(overlay, [])
    return {}
}

export function getColorLayout() {
    let overlay = buildElement('div', 'brush-container')
    let r = buildElement('button', 'btn red-btn', setColor('red'))
    let g = buildElement('button', 'btn green-btn', setColor('green'))
    let b = buildElement('button', 'btn blue-btn', setColor('blue'))
    let opacity = buildElement('button', 'btn opacity-btn', openOpacitySlider)
    return new ElementDefinition(overlay, [r, g, b, opacity])
}

export function subscribe(key, handler) {
    subscriptions[key] = handler
}

function setColor(color) {
    return (ev) => {
        updateColor(color)
    }
}

function updateColor(color) {
    if (subscriptions[SETTING_EVENTS.COLOR]) {
        subscriptions[SETTING_EVENTS.COLOR](color)
    }
}

function openOpacitySlider() {
    console.log('open an opacity slider here.')
}