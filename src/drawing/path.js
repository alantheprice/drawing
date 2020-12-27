import { LocalStore } from '../storage/localStorage'
import { Setting } from '../settings/Setting'
import { Color } from '../color/Color'
const store = new LocalStore()

export class Path {

  constructor(canvas, canvasScratch, clear, clearScratch) {
    this.ctx = canvas.getContext("2d")
    this.scratchCtx = canvasScratch.getContext("2d")
    this.clear = clear
    this.clearScratch = clearScratch
    this.paths = []
    this.redo = []
    this.canvas = canvas
    this.canvasScratch = canvasScratch
    // setting defaults
    this.settings = new Setting(new Color(20, 45, 200), 5, 1)
    this.restorePath()
  }

  undo() {
    this.clear()
    this.redo.push(this.paths.pop())
    this.drawAllPaths(this.paths)
  }

  /**
   * Updates the line settings for the path
   * 
   * @param {{[x: string]: any}}  nameValueSetting 
   * @memberof Path
   */
  updateSettings(nameValueSetting) {
    this.settings = Object.assign(this.settings, nameValueSetting)
    if (nameValueSetting.color && nameValueSetting.color.a !== 1) {
      this.settings.opacity = nameValueSetting.color.a
    }
  }

  /**
   * 
   * @memberof Path
   */
  startDrawing() {
    let path = []
    let lastEvent = null
    return {
      start: (ev, elem, xy) => {
        path = [xy]
        lastEvent = Object.assign({}, xy)
      },
      move: (moveRE, moveElem, moveXY) => {
        moveRE.preventDefault()
        moveRE.stopPropagation()
        path.push(moveXY)
        this.drawLine(path.slice(-2), this.settings, this.scratchCtx, this.clearScratch)
      },
      finish: () => {
        this.savePath(path, this.settings)
      }
    }
  }

  /**
   * Draw Line
   * 
   * @param {any} points 
   * @param {Setting} settings 
   * @param {}
   * @memberof Path
   */
  drawLine(points, settings, context, clear) {
    const ctx = context || this.ctx
    if (!points || !points.length) {
      return
    }
    points = points.filter(f => !!f)
    if (typeof clear === "function") {
      // clear()
    }
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    points.forEach((points) => {
      ctx.lineTo(points.x, points.y)
    })
    ctx.lineWidth = settings.lineWidth
    ctx.lineCap = 'round'
    ctx.strokeStyle = settings.color.getAsCssValue()
    ctx.stroke()
  }

  /**
   * 
   * 
   * @param {any} path 
   * @param {Setting} settings 
   * @memberof Path
   */
  savePath(path, settings) {
    this.paths.push({ path: path, settings: settings.copy() })
    this.clear()
    this.drawAllPaths(this.paths)
    store.save('paths', this.paths)
  }

  restorePath() {
    store.load('paths')
      .then((paths) => {
        this.paths = paths || []
        this.drawAllPaths(paths)
      })
  }

  drawAllPaths(paths, context) {
    if (!paths || !paths.length) {
      return
    }
    paths.forEach((pathDef) => {
      console.log(pathDef)
      let settings = Setting.fromObject(pathDef.settings)
      this.drawLine(pathDef.path, settings, context)
    })
  }

  clearBackstack() {
    this.paths = [];
  }
}

