import { init, clear, undo } from './drawing/drawing'
import { ElementDefinition, buildElement } from './templater/ElementDefinition'

// initialize drawing.
init()
createOverlay()

function showSettings() {
  console.log('settings-clicked')
}

function createOverlay() {
  let overlay = buildElement('div', 'overlay-container')
  let undoButton = getButton('btn undo-btn', undo, 'undo')
  let settingButton = getButton('btn setting-btn', showSettings, 'settings')
  let clearButton = getButton('btn clear-btn', clear, 'clear')

  let overlayDef = new ElementDefinition(overlay, [undoButton, clearButton, settingButton])
  overlayDef.render(document.body)
}

function getButton(className, clickHandler, iconName) {
  let button = buildElement('button', className, clickHandler)
  let icon = buildElement('i', 'material-icons md-light md-48')
  icon.i.innerText = iconName
  return new ElementDefinition(button, [icon])
}