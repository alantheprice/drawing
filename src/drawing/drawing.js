import { Path } from './path'
import { LocalStore } from '../storage/localStorage'
import { addDragHandler } from '../eventHandling/event'
const store = new LocalStore()

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const path = new Path(canvas, ctx, clear)

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
  this.download = 'image.png'
  this.href = canvas.toDataURL('image/png')
}

export function updateSettings(newSetting) {
  path.updateSettings(newSetting)
}
