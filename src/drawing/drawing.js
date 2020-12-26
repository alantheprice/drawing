import { Path } from './path'
import { LocalStore } from '../storage/localStorage'
import { addDragHandler } from '../eventHandling/event'
const store = new LocalStore()

const canvas = document.getElementById('canvas')
const ratio = window.devicePixelRatio;
const canvasHeight = window.innerHeight;
const canvasWidth = window.innerWidth;

// fill screen with canvas
canvas.width = canvasWidth * ratio;
canvas.height = canvasHeight * ratio;
canvas.style.width = canvasWidth + "px";
canvas.style.height = canvasHeight + "px";
const ctx = canvas.getContext("2d");
ctx.scale(ratio, ratio);
const path = new Path(canvas, ctx, clear)

export function init() {
  addDragHandler({ element: canvas }, path.startDrawing())
}

export function clear(all) {
  if (all) {
    path.clearBackstack()
  }
  ctx.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio)
  ctx.fillStyle = "#eee";
  ctx.fillRect(0, 0, canvas.width / ratio, canvas.height / ratio);
  store.remove('paths')
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
