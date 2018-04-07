import { e } from '../templater/renderer'
const { button, i, div } = e.elements
const getHandle = e.getHandle

/**
 * Brush Size Button selector component
 * 
 * @export
 * @param {any} config 
 * @param {ElementDefinition} mainButton
 * @param {ElementDefinition[]} [overlayContent]
 * @returns 
 */
export function dragButton(config, mainButton, ...overlayContent) {

    // div({class: 'c-brush-size__drag-arrows'},
    //     i({ class: 'material-icons md-dark md-48', textContent: 'keyboard_arrow_left' }),
    //     i({ class: 'material-icons md-dark md-48', textContent: 'keyboard_arrow_left' })
    // )
    mainButton.setAttribute('v_dragging', false)
    mainButton.setAttribute('set_dragging', function(dragging) {
        this[(dragging) ? 'addClass' : 'removeClass']('o-hide')
    })
    config = Object.assign(config, {
        class: 'o-relative', 
        v_dragging: false, 
        e_dragging: setDragging,
        v_dragLocation: null,
        e_onDragLocationChanged: function(dragLocation) {
            this.v_dragLocation = dragLocation
        }
     })
    
    return div(config,
        mainButton,
        div({
            class: 'c-drag-overlay', 
            v_dragging: false,
            set_dragging: function(dragging) { this.setActive(dragging) },
            oncustomdrag: getDragHandler(mainButton),
        }, overlayContent),
        mainButton.clone('dragbutton', { 
            onRender: function() {
                this.addClass('o-fixed o-none')
                this.setAttribute('style', '')
                this.setAttribute('v_dragLocation', null)
                this.addEmitHandler('set_dragging', function(dragging) {
                    this.setActive(dragging)
                })
                this.addEmitHandler('set_dragLocation', function(xy) {
                    if (!xy) { 
                        this.style = ''
                        return
                    }
                    this.style = `left: ${xy.x}px; top: ${xy.y}px;`
                })
            }
        })
    )
}

function getDragHandler(mainButton) {
    // here we need to detect quick exit and assume that it is a click
    let sPoint = {win: {x: 0, y: 0}, view: {x: 0, y:0}}
    let moving = false
    let isClick = true
    let timeoutId = null
    let eventHandles = {
        start: function (ev, elem, xy) {
            isClick = true
            moving = true
            sPoint.view = xy
            sPoint.win = this.windowOffset()
            // sPoint.win.y = 300
            setFinishDelay.call(this, ev, elem, xy, 500)
            this.emit('onDragLocationChanged', {x: sPoint.win.x,  y: sPoint.win.y})
            this.emit('dragging', true)
        },
        move: function(ev, elem, xy) {
            if (!moving || !xy) { return }
            setFinishDelay.call(this, ev, elem, xy, 500)
            let move = xy.x - sPoint.view.x
            let moveInWin = move + sPoint.win.x
            if (Math.abs(move) > 10) {
                isClick = false
            }
            this.emit('onDragLocationChanged', {x: moveInWin,  y: sPoint.win.y})
            this.emit('onMove', ev, xy.x)            
        },
        finish: function(ev, elem, xy) {
            clearTimeout(timeoutId)
            if (!moving) { return }
            moving = false
            this.emit('dragging', false)
            if (isClick) {
                this.emit('onlick', ev, mainButton)
            }
            this.emit('onDragLocationChanged', null)
        }
    }
    function setFinishDelay(ev, elem, xy, timeout) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => eventHandles.finish.call(this, ev, elem, xy), timeout)
    }
    return eventHandles
}

function setDragging(dragging) {
    this.v_dragging = dragging
} 
