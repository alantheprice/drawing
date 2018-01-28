const TOUCH_EVENT_MAP = {
  click: 'click',
  mousedown: 'touchstart',
  mouseup: 'touchend',
  mousemove: 'touchmove'
}

export const CUSTOM_DRAG_EVENT = 'custom-drag-event'

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
    return {
      x: ev.touches[0].clientX,
      y: ev.touches[0].clientY
    }
  }
  return null
}