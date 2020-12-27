import { Path } from './path'
import { LocalStore } from '../storage/localStorage'
import { addDragHandler } from '../eventHandling/event'
const store = new LocalStore()

const canvas = document.getElementById('canvas')
const canvasScratch = document.getElementById('canvas-scratch-pad')
const ratio = window.devicePixelRatio;
const canvasHeight = window.innerHeight;
const canvasWidth = window.innerWidth;
setupCanvas(canvas)
setupCanvas(canvasScratch)

function setupCanvas(cs) {
  // fill screen with canvas
  cs.width = canvasWidth * ratio;
  cs.height = canvasHeight * ratio;
  cs.style.width = canvasWidth + "px";
  cs.style.height = canvasHeight + "px";
  const ctx = cs.getContext("2d");
  ctx.scale(ratio, ratio);
  return cs
}
const path = new Path(setupCanvas(canvas), setupCanvas(canvasScratch), clear)

export function init() {
  addDragHandler({ element: canvasScratch }, path.startDrawing())
}

export function clearAll() {
  path.clearBackstack()
  clear(canvas.getContext("2d"))
  clear(canvasScratch.getContext("2d"))
}

function clear(ctx) {
  ctx.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio)
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
