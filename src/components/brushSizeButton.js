import { e } from '../templater/renderer'
import { dragButton } from './dragButton'
const { button, i, div } = e.elements
const getHandle = e.getHandle

/**
 * Brush Size Button selector component
 * 
 * @export
 * @param {{'@sizeSelected': function(number), ':currentSize': number}} config 
 * @returns 
 */
export function brushSizeButton(config) {
    
    return dragButton({e_onMove: handleMove, e_onclick: handleClick, _updateSize: updateSize},
        button({class: 'btn circle brush-size-btn o-flex'},
            i({ class: 'material-icons md-light md-18'}, 'brush'),
            i({ class: 'material-icons md-light md-36'}, 'brush'),
        ),
        div({class: 'o-width--100 o-height--100 o-relative'}, 
            div({class: 'o-flex--column o-width--100 o-height--100'},
                div({class: 'o-flex--column o-margin--auto'},
                    div({class: 'c-brush-size__editing-overlay'},
                        div({
                            class: 'circle o-bkg--black o-margin--h-auto o-margin--b-20', 
                            v_size: 1,
                            set_size: function(newSize) { this.style = `width: ${newSize}px; height: ${newSize}px;` },
                            style: '',
                            handle: 'sizeDisplay'
                        }),
                        div({
                            class: 'hdg hdg--2',
                            v_size: 1,
                            set_size: function(newSize) { this.textContent = `${newSize}px line width` },
                        }, '')
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

}

function handleMove(ev, moveX) {
    console.log('handlingMove')
    let width = window.innerWidth - 150
    let multiplier = width / 50
    if (moveX > width) { return }
    let brushSize = (width - moveX) / multiplier
    this._updateSize(brushSize)
}

function handleClick(ev, elem) {
    console.warn('clicked!!!')
    return false
}

function updateSize(size) {
    size = Math.round(Math.max(size, 1))
    // getHandle('sizeDisplay').style =`width: ${size}px; height: ${size}px;`
    // getHandle('sizeDescription').textContent = `${size}px line width`
    this.emit('updateSize', size)
    // config.v_sizeSelected(size)
}
