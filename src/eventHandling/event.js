export const TOUCH_EVENT_MAP = {
  click: 'click',
  mousedown: 'touchstart',
  mouseup: 'touchend',
  mousemove: 'touchmove'
}

export const CUSTOM_DRAG_EVENT = 'oncustomdrag'

/**
 * 
 * 
 * @export
 * @param {{element: HTMLElement}} context
 * @param {{start: function(Event, {element: HTMLElement}, {x: number, y: number}), move: function(Event, {element: HTMLElement}, {x: number, y: number}), finish: function(Event, {element: HTMLElement}, {x: number, y: number})}} handler
 */
export function addDragHandler(context, handler) {
  addEvent(context, 'mousedown', (ev, elem, xy) => {
    handler.start.call(context, ev, context, xy)
    let finishTimeout = null
    let _finish = (endEv, elem, endXY) => {
      clearTimeout(finishTimeout)
      handler.finish.call(context, endEv, elem, endXY)
      removeMoveEvent()
      removeStopEvent()
    }

    let removeStopEvent = addEvent(context, 'mouseup', _finish)
    let removeMoveEvent = addEvent(context,  'mousemove', (mEV, elem, mXY) => {
      clearTimeout(finishTimeout)
      handler.move.call(context, mEV, elem, mXY)
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
 * @param {{element: HTMLElement}} context
 * @param {string} eventName 
 * @param {function(Event, {element: HTMLElement}, {x: number, y: number})} handler 
 * @returns {function()} remove
 */
export function addEvent(context, eventName, handler) {
  let handle = (ev) => {
    ev.preventDefault()
    handler.call(context, ev, context, getXY(ev))
  }
  context.element.addEventListener(eventName, handle)
  if (!TOUCH_EVENT_MAP[eventName] || TOUCH_EVENT_MAP[eventName] === eventName) {
    return function remove() {
      context.element.removeEventListener(eventName, handle)
    }
  }
  context.element.addEventListener(TOUCH_EVENT_MAP[eventName], handle)

  return function remove() {
    context.element.removeEventListener(eventName, handle)
    context.element.removeEventListener(TOUCH_EVENT_MAP[eventName], handle)
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