const TOUCH_EVENT_MAP = {
  click: 'touchstart',
  mousedown: 'touchstart',
  mouseup: 'touchend',
  mousemove: 'touchmove'
}

export const CUSTOM_DRAG_EVENT = 'customDragEvent'

/**
 * 
 * 
 * @export
 * @param {HTMLElement} element 
 * @param {{start: function({x: number, y: number}, Event, HTMLElement), move: function({x: number, y: number}, Event, HTMLElement), finish: function({x: number, y: number}, Event, HTMLElement)}} handler
 */
export function addDragHandler(element, handler) {
  addEvent(element, 'mousedown', (tl, ev, elem) => {
    handler.start(tl, ev, elem)
    let finishTimeout = null
    let _finish = (endTl, endEv, elem) => {
      clearTimeout(finishTimeout)
      handler.finish(endTl, endEv, elem)
      removeMoveEvent()
      removeStopEvent()
    }

    let removeStopEvent = addEvent(element, 'mouseup', _finish)
    let removeMoveEvent = addEvent(element,  'mousemove', (mXY, mEV, elem) => {
      clearTimeout(finishTimeout)
      handler.move(mXY, mEV, elem)
      finishTimeout = setTimeout(() => {
        _finish(mXY, mEV, elem)
      }, 500)
    })
  })
}

/**
 * 
 * 
 * @export
 * @param {HTMLElement} element 
 * @param {string} eventName 
 * @param {function({x: number, y: number}, Event, HTMLElement)} handler 
 * @returns {function()} remove
 */
export function addEvent(element, eventName, handler) {
  let handle = (ev) => {
    ev.preventDefault()
    let xy = getXY(ev)
    if (!xy) { return }
    handler(xy, ev, element)
  }
  element.addEventListener(eventName, handle)
  if (!TOUCH_EVENT_MAP[eventName] || TOUCH_EVENT_MAP[eventName] === eventName) {
    return function remove() {
      element.removeEventListener(eventName, handle)
    }
  }
  element.addEventListener(TOUCH_EVENT_MAP[eventName], handle)

  return function remove() {
    element.removeEventListener(eventName, handle)
    element.removeEventListener(TOUCH_EVENT_MAP[eventName], handle)
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