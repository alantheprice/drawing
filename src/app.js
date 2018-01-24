import { init, clear } from './drawing/drawing'
import ElementDefinition from './templater/ElementDefinition'

// initialize drawing.
init()
createOverlay()

function createOverlay() {
  let clearButton = new ElementDefinition({
    button: {
      attributes: {class: 'btn clear-btn'},
      handlers: {
        click: (ev, elem) => {
          clear()
          console.log('clear-button clicked')
        }
      }
    }
  }, [{i: {
    attributes: {class: "material-icons md-light md-48"},
    innerText: "clear"
  }
  }])
  let settingButton = new ElementDefinition({
    button: {
      attributes: {class: 'btn setting-btn'}
    }
  }, [{i: {
    attributes: {class: "material-icons md-light md-48"},
    innerText: "settings"
  }
  }])
  let overlay = new ElementDefinition({
    div: {
      attributes: {class: 'overlay-container'}
    }
  }, [clearButton, settingButton])
  overlay.render(document.body)
}