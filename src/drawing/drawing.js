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
  store.save('paths', null)
}

export function undo() {
  path.undo()
}

export function downloadImage() {
  // THIS DOESN'T work, it likely needs the anchor tag to be clicked by the user, rather than via function
  let downloader = a({href: '#', target: '_blank', onclick: function() {
    this.elem.href = getCanvasAsDataURL()
    this.elem.download = 'drawing.png'
  }})
  .render(document.body)
  downloader.elem.click()
}

export function updateSettings(newSetting) {
  path.updateSettings(newSetting)
}

function getCanvasAsDataURL() {
  canvas.toDataURL("image/png").replace(/^data:image\/png/,'data:application/octet-stream')
}
