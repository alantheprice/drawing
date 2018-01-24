import drawing from './drawing/drawing'
import ElementDefinition from './templater/ElementDefinition'

// initialize drawing.
drawing()
createOverlay()

function createOverlay() {
  let clearButton = {
    button: {
      attributes: {class: 'btn clear-btn'},
      handlers: {
        click: (ev, elem) => {
          console.log('clear-button clicked')
        }
      }
    }
  }
  let settingButton = new ElementDefinition({
    button: {
      attributes: {class: 'btn setting-btn'}
    }
  })
  let overlay = new ElementDefinition({
    div: {
      attributes: {class: 'overlay-container'}
    }
  }, [clearButton, settingButton])
  overlay.render(document.body)
}