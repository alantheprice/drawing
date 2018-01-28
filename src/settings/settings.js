import {
  ElementDefinition,
  buildElement
} from '../templater/ElementDefinition'
import {
  addDragHandler,
  addEvent,
  CUSTOM_DRAG_EVENT
} from '../eventHandling/event'

export const SETTING_EVENTS = {
  BRUSH_SIZE: 'brush-size',
  COLOR: 'color',
  SAVE: 'save'
}
let subscriptions = []
let customColor = {
  r: 40,
  g: 40,
  b: 40,
  a: 1
}

export function getBrushLayout() {
  // let overlay = buildElement('div', 'brush-container')
  // return new ElementDefinition(overlay, [])
  return {}
}

export function getColorLayout() {
  let r = buildElement('button', 'btn red-btn', colorClicked('rgb(163, 64, 64)'))
  let g = buildElement('button', 'btn green-btn', colorClicked('rgb(91, 184, 91)'))
  let b = buildElement('button', 'btn blue-btn', colorClicked('rgb(69, 69, 163)'))

  let custom = buildElement('button', 'btn custom-color-btn')
  custom.handlers = {}
  custom.handlers[CUSTOM_DRAG_EVENT] = handleColorDrag()

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
 * @returns {{start: function(any), move: function(any), finish: function(any)}}
 */
function handleColorDrag() {  
  let sPoint = {}
  // b: 90, g: 170, r: 250
  let color = Object.assign({}, customColor)
  let m = 2.8
  return {
    start: (stXY, sRawEvent, elem) => {
      sPoint = stXY
    },
    move: (mXY, mRE, elem) => {
      let move = sPoint.x - mXY.x
      if (move > 90 && move < 170) {
        color.g = ((move - 90) * m) + 40
        color.b = 250 - ((move - 130)  * (m * 2))
      } else if (move > 170 && move < 250) {
        color.r = ((move - 170) * m) + 40
        color.g = 250 - ((move - 210) * (m * 2))
      } else if (move > 250) {
        color.b = ((move - 250) * m) + 40
        color.r = 250 - ((move - 290) * (m * 2))
      }
      elem.style.marginRight = move + 'px'
      elem.style.backgroundColor = `rgb(${color.r.toFixed()}, ${color.g.toFixed()}, ${color.b.toFixed()})`
    },
    finish: (fTL, fRE, elem) => {
      customColor = color
      updateColor(`rgb(${color.r.toFixed()}, ${color.g.toFixed()}, ${color.b.toFixed()})`) //`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`)
      elem.style.marginRight = ''  
    }
  }
}

function openOpacitySlider() {
  console.log('open an opacity slider here.')
}