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
    let sPoint = {win: {x: 0, y: 0}, view: {x: 0, y:0}}
    let dragHandle = getDragHandler()

    let dragOverlay = div({class: 'c-drag-overlay', customDragEvent: dragHandle}, 
        overlayContent
    )

    let dragButton = mainButton.clone()
    dragButton.addClass('o-fixed o-none')

    let container = div({class: 'o-relative'},
        mainButton,
        dragOverlay,
        dragButton
    )

    return container

    function getDragHandler() {
        // here we need to detect quick exit and assume that it is a click
        let moving = false
        let isClick = true
        let timeoutId = null
        function setFinishDelay(ev, elem, xy, timeout) {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => dragHandle.finish(ev, elem, xy), timeout)
        }
        return {
            start: (ev, elem, xy) => {
                isClick = true
                moving = true
                sPoint.view = xy
                sPoint.win = container.windowOffset()
                setFinishDelay(ev, elem, xy, 500)
                setDragging(true)
                dragButton.style = `left: ${sPoint.win.x}px; top: ${sPoint.win.y}px;`
            },
            move: (ev, elem, xy) => {
                if (!moving || !xy) { return }
                setFinishDelay(ev, elem, xy, 500)
                let move = xy.x - sPoint.view.x
                let moveInWin = move + sPoint.win.x
                if (Math.abs(move) > 10) {
                    isClick = false
                }
                config['@move'](ev, xy.x)
                dragButton.style = `left: ${moveInWin}px; top: ${sPoint.win.y}px;`
            },
            finish: (ev, elem, xy) => {
                clearTimeout(timeoutId)
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
