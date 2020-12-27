import { LocalStore } from '../storage/localStorage'
import { Setting } from '../settings/Setting'
import { Color } from '../color/Color'
const store = new LocalStore()

export class Path {

  constructor(canvas, canvasScratch, clear) {
    this.ctx = canvas.getContext("2d")
    this.scratchCtx = canvasScratch.getContext("2d")
    this.clear = clear
    this.paths = []
    this.redo = []
    this.canvas = canvas
    this.canvasScratch = canvasScratch
    // setting defaults
    this.settings = new Setting(new Color(20, 45, 200), 5, 1)
    this.restorePath()
  }

  undo() {
    this.clear(this.ctx)
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
        this.drawLine(path, this.settings, this.scratchCtx, this.clear)
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
    if (typeof clear === "function" && points.length) {
      clear(ctx)
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
    console.log('finished build', Date.now())
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
    this.clear(this.ctx)
    this.clear(this.scratchCtx)
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

  drawAllPaths(paths) {
    if (!paths || !paths.length) {
      return
    }
    paths.forEach((pathDef) => {
      let settings = Setting.fromObject(pathDef.settings)
      this.drawLine(pathDef.path, settings)
    })
  }

  clearBackstack() {
    this.paths = [];
  }
}

