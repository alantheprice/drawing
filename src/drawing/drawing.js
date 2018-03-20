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

export function clear() {
  ctx.clearRect(0,0, canvas.width, canvas.height)
  store.clear()
}

export function undo() {
  path.undo()
}

export function updateSettings(newSetting) {
  path.updateSettings(newSetting)
}
