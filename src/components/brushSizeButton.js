import { e, ElementDefinition } from '../templater/ElementDefinition'
import { dragButton } from './dragButton'
const { button, i, div } = e

/**
 * Brush Size Button selector component
 * 
 * @export
 * @param {{'@sizeSelected': function(number), ':currentSize': number}} config 
 * @returns 
 */
export function brushSizeButton(config) {
    return dragButton({'@move': handleMove, '@click': handleClick},
        button({class: 'btn circle brush-size-btn'},
            i({ class: 'material-icons md-light md-18', innerText: 'brush' }),
            i({ class: 'material-icons md-light md-36', innerText: 'brush' }),
        ),
        div({innerText: 'helloWorld!'})
    )

    function handleMove(ev, moveX) {
        console.warn(ev, moveX)
    }

    function handleClick(ev, scope) {
        console.warn('clicked!!!')
    }

}
    /*
    let sPoint = {win: {x: 0, y: 0}, view: {x: 0, y:0}}
    let dragHandle = handleDrag()

    let dragOverlay = div({class: 'o-none c-drag-overlay', mousemove: dragHandle.move, mouseup: dragHandle.finish},
    )

    let dragButton = div({class: 'o-fixed o-hide btn circle brush-size-btn', style: ''},
        i({ class: 'material-icons md-light md-18', innerText: 'brush' }),
        i({ class: 'material-icons md-light md-36', innerText: 'brush' })
    )
    let _button = button({class: 'btn circle brush-size-btn', mousedown: dragHandle.start},
        i({ class: 'material-icons md-light md-18', innerText: 'brush' }),
        i({ class: 'material-icons md-light md-36', innerText: 'brush' }),
    )

    let container =  div({},
        _button,
        dragOverlay,
        dragButton
    )

    return container

    function handleDrag() {
        let moving = false
        let timeoutId
        return {
            start: (ev, elem, xy) => {
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
                timeoutId = setTimeout(() => dragHandle.finish(ev, elem, mXY), 200)
                let move = (mXY.x - sPoint.view.x) + sPoint.win.x
                dragButton.style = `left: ${move}px; top: ${sPoint.win.y}px;`
            },
            finish: (fRE, elem, fXY) => {
                if (!moving) { return }
                moving = false
                setDragging(false)
                dragButton.style = ''
            }
        }
    }

    function setDragging(dragging) {
        _button[(dragging) ? 'addClass' : 'removeClass']('o-hide')
        dragButton.setActive(dragging)
        dragOverlay.setActive(dragging)
    }
} */
