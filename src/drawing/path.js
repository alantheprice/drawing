import { LocalStore } from '../storage/localStorage'
const store = new LocalStore()

export class Path {

  constructor(canvas, context) {
    this.ctx = context
    this.paths = []
    this.redo = []
    this.canvas = canvas
    // setting defaults
    this.settings = {
      lineWidth: 5,
      color: 'rgba(20,45,200,.5)'
    }
    this.restorePath()
  }

  undo() {
    console.log('begin undo')
    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
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

  startDrawing(startEvent) {
    let path = [getTopLeftFromEvent(startEvent)]
    console.log('start:', getTopLeftFromEvent(startEvent))
    let lastEvent = getTopLeftFromEvent(startEvent)
    return {
      next: (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        path.push(getTopLeftFromEvent(ev))
        this.drawLine(path.slice(-2), this.settings)
      },
      finish: () => {
        this.savePath(path, this.settings)
      }
    }
  }

  drawLine(points, settings) {
    if (!points || !points.length) {
      return
    }
    points = points.filter(f => !!f)
    // this.ctx.save()
    this.ctx.beginPath()
    this.ctx.moveTo(points[0].t, points[0].l)
    points.forEach((points) => {
      this.ctx.lineTo(points.t, points.l)
    })
    this.ctx.lineWidth = settings.lineWidth
    this.ctx.strokeStyle = settings.color
    console.log(`color: ${this.ctx.strokeStyle}, ${settings.color}`)
    this.ctx.stroke()
    // this.ctx.restore()
  }

  savePath(path, settings) {
    this.paths.push({path: path, settings: {
        color: settings.color, 
        lineWidth: settings.lineWidth
      }
    })
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
      console.log(`storedSetting: ${pathDef.settings.color}`)
      this.drawLine(pathDef.path, pathDef.settings)
    })
    this.paths = paths
  }

}

function getTopLeftFromEvent(ev) {
  if (ev.clientX) {
    return {
      t: ev.clientX,
      l: ev.clientY
    }
  } else if (ev.type.indexOf('touch') > -1) {
    return {
      t: ev.touches[0].clientX,
      l: ev.touches[0].clientY
    }
  }
}
