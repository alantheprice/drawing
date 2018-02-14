import { e } from '../templater/ElementDefinition'
import { dragButton } from './dragButton'
const { button, i, div, E, ElementDefinition } = e

/**
 * Brush Size Button selector component
 * 
 * @export
 * @param {{'@sizeSelected': function(number), ':currentSize': number}} config 
 * @returns 
 */
export function brushSizeButton(config) {
    let currentSize = config[':currentSize']
    
    return dragButton({'@move': handleMove, '@click': handleClick},
        button({class: 'btn circle brush-size-btn o-flex'},
            i({ class: 'material-icons md-light md-18', textContent: 'brush' }),
            i({ class: 'material-icons md-light md-36', textContent: 'brush' }),
        ),
        div({class: 'o-width--100 o-height--100 o-relative'}, 
            div({class: 'o-flex--column o-width--100 o-height--100'},
                div({class: 'o-flex--column o-margin--auto'},
                    div({class: 'c-brush-size__editing-overlay'},
                        div({class: 'circle o-bkg--black o-margin--h-auto o-margin--b-20', 
                            style: `width: ${currentSize}px; height: ${currentSize}px;`, 
                            handle: 'sizeDisplay'}),
                        div({class: 'hdg hdg--2', 
                            textContent: `${currentSize}px line width`,
                            handle: 'sizeDescription'})
                    )
                )
            ),
            div({class: 'c-brush-size__indicator-container'},
                div({class: 'c-brush-size__indicator'},
                    [50, 39, 27, 15, 3].map((size) => {
                        return div({class: 'circle o-bkg--black o-margin--t-auto', style: `width: ${size}px; height: ${size}px`})
                    })
                ),
                div({class: 'c-brush-size__indicator-line o-bkg--black'})
            )
        )
    )

    function handleMove(ev, moveX) {
        let width = window.innerWidth - 150
        let multiplier = width / 50
        if (moveX > width) { return }
        let brushSize = (width - moveX) / multiplier
        updateSize(brushSize)
    }

    function handleClick(ev, scope) {
        console.warn('clicked!!!')
        return false
    }

    function updateSize(size) {
        size = Math.round(Math.max(size, 1))
        E.getHandle('sizeDisplay').style =`width: ${size}px; height: ${size}px;`
        E.getHandle('sizeDescription').textContent = `${size}px line width`
        config['@sizeSelected'](size)
    }

}
