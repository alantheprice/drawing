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

    return div({class: 'o-relative', v_dragging: false, e_dragging: setDragging },
        mainButton,
        div({class: 'c-drag-overlay', oncustomdrag: getDragHandler(mainButton) },
            overlayContent
        ),
        mainButton.clone('dragbutton', { onRender: function() {
            this.addClass('o-fixed o-none')
            this.setAttribute('style', '')
            this.setAttribute('set_dragging', function(dragging) {
                this.setActive(dragging)
            })
        }})
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
            sPoint.win = this.parent.windowOffset()
            setFinishDelay.call(this, ev, elem, xy, 500)
            this.emit('dragging', true)
            this.style = `left: ${sPoint.win.x}px; top: ${sPoint.win.y}px;`
        },
        move: function(ev, elem, xy) {
            if (!moving || !xy) { return }
            setFinishDelay.call(this, ev, elem, xy, 500)
            let move = xy.x - sPoint.view.x
            let moveInWin = move + sPoint.win.x
            if (Math.abs(move) > 10) {
                isClick = false
            }
            this.emit('onMove', ev, xy.x)
            this.style = `left: ${moveInWin}px; top: ${sPoint.win.y}px;`
        },
        finish: function(ev, elem, xy) {
            clearTimeout(timeoutId)
            if (!moving) { return }
            moving = false
            this.emit('dragging', false)
            if (isClick) {
                this.emit('onlick', ev, mainButton)
            }
            this.style = ''
        }
    }
    function setFinishDelay(ev, elem, xy, timeout) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => eventHandles.finish.call(this, ev, elem, xy), timeout)
    }
    return eventHandles
}

    // /**
    //  * 
    //  * 
    //  * @param {any} ev 
    //  */
    // function triggerClick(ev) {

    //     config['@click'](ev, mainButton)
    // }

    // function setDragging(dragging) {
    //     mainButton[(dragging) ? 'addClass' : 'removeClass']('o-hide')
    //     dragButton.setActive(dragging)
    //     getHandle(dragOverlayId).setActive(dragging)
    // }

function setDragging(dragging) {
    this.v_dragging = dragging
} 
