import { e } from '../templater/renderer'
import { Color } from '../color/Color'
import { colorButton } from './colorButton'
import { brushSizeButton } from './brushSizeButton'
import { Setting } from '../settings/Setting'

const { div, button, i, virtual } = e.elements
const getHandle = e.getHandle

/**
 * Brush control virtual component
 * 
 * @export
 * @returns {ElementDefinition}
 */
export function brushControl() {

    return virtual({},
        colorButton(),
        brushSizeButton()
    )
}

