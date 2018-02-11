export const TOUCH_EVENT_MAP = {
  click: 'click',
  mousedown: 'touchstart',
  mouseup: 'touchend',
  mousemove: 'touchmove'
}

export const CUSTOM_DRAG_EVENT = 'customDragEvent'

/**
 * 
 * 
 * @export
 * @param {{element: HTMLElement}} elementDef
 * @param {{start: function(Event, {element: HTMLElement}, {x: number, y: number}), move: function(Event, {element: HTMLElement}, {x: number, y: number}), finish: function(Event, {element: HTMLElement}, {x: number, y: number})}} handler
 */
export function addDragHandler(elementDef, handler) {
  addEvent(elementDef, 'mousedown', (ev, elem, xy) => {
    handler.start(ev, elementDef, xy)
    let finishTimeout = null
    let _finish = (endEv, elem, endXY) => {
      clearTimeout(finishTimeout)
      handler.finish(endEv, elem, endXY)
      removeMoveEvent()
      removeStopEvent()
    }

    let removeStopEvent = addEvent(elementDef, 'mouseup', _finish)
    let removeMoveEvent = addEvent(elementDef,  'mousemove', (mEV, elem, mXY) => {
      clearTimeout(finishTimeout)
      handler.move(mEV, elem, mXY)
      finishTimeout = setTimeout(() => {
        _finish(mEV, elem, mXY)
      }, 500)
    })
  })
}

/**
 * 
 * 
 * @export
 * @param {{element: HTMLElement}} elementDef
 * @param {string} eventName 
 * @param {function(Event, {element: HTMLElement}, {x: number, y: number})} handler 
 * @returns {function()} remove
 */
export function addEvent(elementDef, eventName, handler) {
  let handle = (ev) => {
    ev.preventDefault()
    handler(ev, elementDef, getXY(ev))
  }
  elementDef.element.addEventListener(eventName, handle)
  if (!TOUCH_EVENT_MAP[eventName] || TOUCH_EVENT_MAP[eventName] === eventName) {
    return function remove() {
      elementDef.element.removeEventListener(eventName, handle)
    }
  }
  elementDef.element.addEventListener(TOUCH_EVENT_MAP[eventName], handle)

  return function remove() {
    elementDef.element.removeEventListener(eventName, handle)
    elementDef.element.removeEventListener(TOUCH_EVENT_MAP[eventName], handle)
  }
}

function getXY(ev) {
  if (ev.clientX) {
    return {
      x: ev.clientX,
      y: ev.clientY
    }
  } else if (ev.type.indexOf('touch') > -1 && ev.touches && ev.touches[0]) {
    return getTouchXY(ev)
  }
  return null
}

/**
 * Get the x an y coords of a touch event.
 * 
 * @param {TouchEvent} ev 
 * @returns {{x: number, y: number}}
 */
function getTouchXY(ev) {
  let touchX = ev.touches[0].clientX
  let touchY = ev.touches[0].clientY
  
  // Here to attempt to ignore inadvertent edge clicks
  if (ev.touches.length > 1) {
    let touches = Array.from(ev.touches).filter((touch) => {
      return insideEdgeThreshold(touch.clientX, window.innerWidth) &&
        insideEdgeThreshold(touch.clientY, window.innerHeight)
    })
    debugger
    if (touches.length) {
      touchX = touches[0].clientX
      touchY = touches[0].clientY
    }
  }
  return {
    x: touchX,
    y: touchY
  }
}

/**
 * 
 * 
 * @param {number} point 
 * @param {number} totalDist
 */
function insideEdgeThreshold(point, totalDist) {
  let threshold = 70
  return (point > threshold && point < (totalDist  - threshold))
}