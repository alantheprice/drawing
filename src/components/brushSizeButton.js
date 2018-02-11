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
    let currentSize = config[':currentSize']
    let sizeDisplay = div({class: 'circle o-bkg--black o-margin--h-auto o-margin--b-20', style: `width: ${currentSize}px; height: ${currentSize}px;`})
    let sizeDescription = div({class: 'hdg hdg--2', innerText: `${currentSize}px line width`})

    return dragButton({'@move': handleMove, '@click': handleClick},
        button({class: 'btn circle brush-size-btn o-flex'},
            i({ class: 'material-icons md-light md-18', innerText: 'brush' }),
            i({ class: 'material-icons md-light md-36', innerText: 'brush' }),
        ),
        div({class: 'o-width--100 o-height--100 o-relative'}, 
            div({class: 'o-flex--column o-width--100 o-height--100'},
                div({class: 'o-flex--column o-margin--auto'},
                    div({class: 'c-brush-size__editing-overlay'},
                        sizeDisplay,
                        sizeDescription
                    )
                )
            ),
            div({class: ''})
        )
    )

    function handleMove(ev, moveX) {
        let width = window.innerWidth - 150
        let multiplier = width / 50
        if (moveX > width) { return }
        let brushSize = (width - moveX) / multiplier
        updateSize(brushSize)
        console.warn(ev, moveX, brushSize, multiplier)
    }

    function handleClick(ev, scope) {
        console.warn('clicked!!!')
    }

    function updateSize(size) {
        size = Math.round(Math.max(size, 1))
        sizeDisplay.style =`width: ${size}px; height: ${size}px;`
        sizeDescription.innerText = `${size}px line width`
        config['@sizeSelected'](size)
    }

}
