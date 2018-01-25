const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
window.canvas = canvas
window.ctx = ctx

export function init() {
    canvas.setAttribute('width', window.innerWidth)
    canvas.setAttribute('height', window.innerHeight)
    
    attachEvents('mousedown', 'mousemove', 'mouseup')
    attachEvents('touchstart', 'touchmove', 'touchend')
    load(canvas)
    restorePath()
}

export function clear() {
  ctx.clearRect(0,0, canvas.width, canvas.height)
}

function attachEvents(start, move, end) {
  canvas.addEventListener(start, (ev) => {
    let draw = startDrawing(ev)
    canvas.addEventListener(end, (mouseupEv) => {
      draw.finish()
      canvas.removeEventListener(move, draw.next)
    })
    canvas.addEventListener(move, draw.next)
  })
}

function startDrawing(startEvent) {
  let path = [getTopLeftFromEvent(startEvent)]
  return {
    next: (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      path.push(getTopLeftFromEvent(ev))
      drawLine(path)
    },
    finish: () => {
      savePath(path)
    }
  }
}

function getTopLeftFromEvent(ev) {
  if (ev.clientX) {
    return {
      t: ev.clientX,
      l: ev.clientY
    }
  } else if (ev.type.indexOf('touch') > -1) {
    return {
      t: ev.touches[0].clientX,
      l: ev.touches[0].clientY
    }
  }
}

function load(canvas) {
  let ctx = canvas.getContext('2d')
  ctx.fillStyle = 'blue';
  ctx.fillRect(10, 10, 100, 100);
  ctx.fillStyle = 'rgba(23,45,50,.4)'
  ctx.fillRect(50, 50, 120, 120)
}

function drawLine(points) {
  if (!points || !points.length) {
    return
  }
  points = points.filter(f => !!f)
  ctx.beginPath()
  ctx.moveTo(points[0].t, points[0].l)
  ctx.lineWidth = 3
  points.forEach((points) => {
    ctx.lineTo(points.t, points.l)
  })
  ctx.stroke()
  ctx.restore()
}

function savePath(path) {
  localStorage.setItem('path', JSON.stringify(path))
}

function restorePath() {
  let path = localStorage.getItem('path')
  if (path) {
    drawLine(JSON.parse(path))
  }

}
