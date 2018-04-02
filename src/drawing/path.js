import { LocalStore } from '../storage/localStorage'
import { Setting } from '../settings/Setting'
import { Color } from '../color/Color'
const store = new LocalStore()

export class Path {

  constructor(canvas, context, clear) {
    this.ctx = context
    this.clear = clear
    this.paths = []
    this.redo = []
    this.canvas = canvas
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
        this.drawLine(path.slice(-2), this.settings)
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
   * @memberof Path
   */
  drawLine(points, settings) {
    if (!points || !points.length) {
      return
    }
    points = points.filter(f => !!f)
    this.ctx.beginPath()
    this.ctx.moveTo(points[0].x, points[0].y)
    points.forEach((points) => {
      this.ctx.lineTo(points.x, points.y)
    })
    this.ctx.lineWidth = settings.lineWidth
    // this.ctx.lineCap = 'round'
    this.ctx.strokeStyle = settings.color.getAsCssValue()
    this.ctx.stroke()
  }

  /**
   * 
   * 
   * @param {any} path 
   * @param {Setting} settings 
   * @memberof Path
   */
  savePath(path, settings) {
    this.paths.push({path: path, settings: settings.copy()})
    this.clear()
    this.drawAllPaths(this.paths)
    store.save('paths', this.paths)
  }

  restorePath() {
    store.load('paths')
      .then((paths) => this.drawAllPaths(paths))
  }

  drawAllPaths(paths) {
    if (!paths || !paths.length) {
      return
    }
    paths.forEach((pathDef) => {
      let settings = Setting.fromObject(pathDef.settings)
      this.drawLine(pathDef.path, settings)
    })
    this.paths = paths
  }

  clearBackstack() {
    this.paths = [];
  }
}

