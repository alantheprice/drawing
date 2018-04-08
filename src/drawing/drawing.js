import { Path } from './path'
import { LocalStore } from '../storage/localStorage'
import { addDragHandler } from '../eventHandling/event'
import { e } from '../templater/renderer'
const store = new LocalStore()

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const path = new Path(canvas, ctx, clear)
const { a } = e.elements

export function init() {
  addDragHandler({element: canvas}, path.startDrawing())
}

export function clear(all) {
  if (all) {
    path.clearBackstack()
  }
  ctx.clearRect(0,0, canvas.width, canvas.height)
  ctx.fillStyle = "#eee";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  store.save('paths', null)
}

export function undo() {
  path.undo()
}

export function downloadImage(ev) {
    // ev.preventDefault = false
  // this.download = 'image.jpg'
  this.href = getCanvasAsDataURL() //canvas.toDataURL('image/jpg')
  // debugger
}

export function updateSettings(newSetting) {
  path.updateSettings(newSetting)
}

function getCanvasAsDataURL() {
  return canvas.toDataURL("image/png").replace(/^data:image\/png/,'data:application/octet-stream')
}
