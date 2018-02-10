import { e, ElementDefinition } from '../templater/ElementDefinition'
const { button, i, div } = e

/**
 * Brush Size Button selector component
 * 
 * @export
 * @param {{'@move': function(Event, number), '@click': function(Event, ElementDefinition)}} config 
 * @param {ElementDefinition} mainButton
 * @param {ElementDefinition[]} [overlayContent]
 * @returns 
 */
export function dragButton(config, mainButton, ...overlayContent) {
    debugger
    let sPoint = {win: {x: 0, y: 0}, view: {x: 0, y:0}}
    let dragHandle = handleDrag()

    let dragOverlay = div({class: 'o-none c-drag-overlay', mousemove: dragHandle.move, mouseup: dragHandle.finish},
        overlayContent
    )

    let dragButton = mainButton.clone()
    dragButton.addClass('o-fixed')
    dragButton.addClass('o-hide')
    mainButton.addEventListener('mousedown', dragHandle.start)

    let container = div({},
        mainButton,
        dragOverlay,
        dragButton
    )

    return container

    function handleDrag() {
        // here we need to detect quick exit and assume that it is a click
        let moving = false
        let isClick = true
        let timeoutId
        return {
            start: (ev, elem, xy) => {
                isClick = true
                moving = true
                sPoint.view = xy
                sPoint.win = container.windowOffset()
                timeoutId = setTimeout(() => dragHandle.finish(ev, elem, xy), 500)
                setDragging(true)
                dragButton.style = `left: ${sPoint.win.x}px; top: ${sPoint.win.y}px;`
            },
            move: (ev, elem, mXY) => {
                if (!moving) { return }
                clearTimeout(timeoutId)
                timeoutId = setTimeout(() => dragHandle.finish(ev, elem, mXY), 300)
                let move = mXY.x - sPoint.view.x
                let moveInWin = move + sPoint.win.x
                if (Math.abs(move) > 10) {
                    isClick = false
                }
                config['@move'](ev, move)
                dragButton.style = `left: ${moveInWin}px; top: ${sPoint.win.y}px;`
            },
            finish: (ev, elem, fXY) => {
                if (!moving) { return }
                moving = false
                setDragging(false)
                if (isClick) {
                    triggerClick(ev)
                }
                dragButton.style = ''
            }
        }
    }

    /**
     * 
     * 
     * @param {any} ev 
     */
    function triggerClick(ev) {
        config['@click'](ev, mainButton)
    }

    function setDragging(dragging) {
        mainButton[(dragging) ? 'addClass' : 'removeClass']('o-hide')
        dragButton.setActive(dragging)
        dragOverlay.setActive(dragging)
    }
}
