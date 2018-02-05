import e from '../templater/ElementDefinition'
import { addDragHandler, addEvent, CUSTOM_DRAG_EVENT} from '../eventHandling/event'
import colorPicker from '../components/colorPicker'
const { div, button, i } = e

const DEFAULT_STARTING_COLOR = {
  r: 40,
  g: 40,
  b: 40,
  a: 1
}
export const SETTING_EVENTS = {
  BRUSH_SIZE: 'brush-size',
  COLOR: 'color',
  SAVE: 'save'
}

let subscriptions = []
// copy instead of reference to keep original static
let customColor = Object.assign({}, DEFAULT_STARTING_COLOR)
let colorBtn = null

export function getBrushLayout() {
  return {}
}

export function getColorLayout() {
  colorBtn = button({class: 'btn circle custom-color-btn', click: openColorPicker, style: 'background-color: rgb(40,40,40)'},
    i({class: 'material-icons md-light md-36', innerText: 'brush'})
  )
  return div({class:'color-container'},
          colorBtn
        )
}

export function subscribe(key, handler) {
  subscriptions[key] = handler
}

function colorChange(color) {
  return (ev) => {
    updateColor(color)
  }
}

function updateColor(color) {
  // TODO: find a better pattern, maybe use getters/setters
  colorBtn.element.style.backgroundColor = color
  if (subscriptions[SETTING_EVENTS.COLOR]) {
    subscriptions[SETTING_EVENTS.COLOR](color)
  }
}

function openColorPicker() {
  colorPicker(customColor, (newColor) => {
    customColor = newColor
    console.log(newColor)
    updateColor(`rgba(${newColor.r}, ${newColor.g}, ${newColor.b}, ${newColor.a})`)
  })
}

/**
 * Handler for the 
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
      color = Object.assign({}, DEFAULT_STARTING_COLOR)
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
