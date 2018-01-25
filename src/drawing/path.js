import { LocalStore } from '../storage/localStorage'
const store = new LocalStore()

export class Path {

  constructor(canvas, context) {
    this.ctx = context
    // setting defaults
    this.updateSettings({
      lineWidth: 1,
      color: 'rgba(23,45,130,.8)'
    })
    this.restorePath()
  }



  /**
   * Updates the line settings for the path
   * 
   * @param {{lineWidth: number, color: string}} settings 
   * @memberof Path
   */
  updateSettings(settings) {
    this.lineWidth = settings.lineWidth || this.lineWidth
    this.color = settings.color || this.color
  }

  startDrawing(startEvent) {
    let path = [getTopLeftFromEvent(startEvent)]
    return {
      next: (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        path.push(getTopLeftFromEvent(ev))
        this.drawLine(path)
      },
      finish: () => {
        this.savePath(path)
      }
    }
  }

  drawLine(points) {
    if (!points || !points.length) {
      return
    }
    points = points.filter(f => !!f)
    this.ctx.beginPath()
    this.ctx.moveTo(points[0].t, points[0].l)
    this.ctx.lineWidth = this.lineWidth
    this.ctx.fillStyle = this.color
    points.forEach((points) => {
      this.ctx.lineTo(points.t, points.l)
    })
    this.ctx.stroke()
    this.ctx.restore()
  }

  savePath(path) {
    store.save('path', path)
  }

  restorePath() {
    store.load('path')
      .then((path) => {
        if (!path) {
          return
        }
        this.drawLine(path)
      })
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
