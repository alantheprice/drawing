import { LocalStore } from '../storage/localStorage'
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
    this.settings = {
      lineWidth: 5,
      color: new Color(20, 45, 200, .5)
    }
    this.restorePath()
  }

  undo() {
    console.log('begin undo')
    this.clear()
    this.redo.push(this.paths.pop())
    this.drawAllPaths(this.paths)
  }

  /**
   * Updates the line settings for the path
   * 
   * @param {{lineWidth: number, color: string}} settings 
   * @memberof Path
   */
  updateSettings(settings) {
    this.settings = Object.assign(this.settings, settings)
  }

  /**
   * 
   * @memberof Path
   */
  startDrawing() {
    let path = []
    let lastEvent = null
    return {
      start: (xy, ev, elem) => {
        path = [xy]
        console.log('start:', xy)
        lastEvent = Object.assign({}, xy)
      },
      move: (moveXY, moveRE, moveElem) => {
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
   * 
   * 
   * @param {any} points 
   * @param {{lineWidth: number, color: Color}} settings 
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
    this.ctx.strokeStyle = settings.color.getAsCssValue()
    this.ctx.stroke()
  }

  /**
   * 
   * 
   * @param {any} path 
   * @param {{lineWidth: number, color: Color}} settings 
   * @memberof Path
   */
  savePath(path, settings) {
    this.paths.push({path: path, settings: Object.assign({}, settings)})
    // this.clear()
    // this.drawAllPaths(this.paths)
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
      this.drawLine(pathDef.path, pathDef.settings)
    })
    this.paths = paths
  }

}

