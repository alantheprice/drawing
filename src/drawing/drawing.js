import { Path } from './path'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const path = new Path(canvas, ctx)

export function init() {
    canvas.setAttribute('width', window.innerWidth + '')
    canvas.setAttribute('height', window.innerHeight + '')
    attachEvents('mousedown', 'mousemove', 'mouseup')
    attachEvents('touchstart', 'touchmove', 'touchend')

}

export function clear() {
  ctx.clearRect(0,0, canvas.width, canvas.height)
}

export function undo() {
  path.undo()
}

function attachEvents(start, move, end) {
  canvas.addEventListener(start, (ev) => {
    let draw = path.startDrawing(ev)
    canvas.addEventListener(end, (mouseupEv) => {
      draw.finish()
      canvas.removeEventListener(move, draw.next)
    })
    canvas.addEventListener(move, draw.next)
  })
}


// function load(canvas) {
//   let ctx = canvas.getContext('2d')
//   ctx.fillStyle = 'blue';
//   ctx.fillRect(10, 10, 100, 100);
//   ctx.fillStyle = 'rgba(23,45,50,.4)'
//   ctx.fillRect(50, 50, 120, 120)
// }
