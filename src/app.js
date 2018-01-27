import { init, clear, undo, updateSettings } from './drawing/drawing'
import { ElementDefinition, buildElement } from './templater/ElementDefinition'
import { getBrushLayout, getColorLayout, subscribe, SETTING_EVENTS} from './settings/settings'
let settingsShowing = false

// initialize drawing
setup()

function setup() {
  init()
  createOverlay()
  
  subscribe(SETTING_EVENTS.COLOR, (newColor) => {
    updateSettings({color: newColor})
  })
}

function showSettings(layouts) {
  let classModifier = (settingsShowing) ? 'removeClass' : 'addClass'
  layouts.forEach((layout) => layout[classModifier]('active'))
  settingsShowing = !settingsShowing
  console.log('settings-clicked')
}

function createOverlay() {
  // settings elements
  let colorLayout = getColorLayout()

  let overlay = buildElement('div', 'overlay-container')
  let undoButton = getButton('btn undo-btn', undo, 'undo')
  let settingButton = getButton('btn setting-btn', () => showSettings([colorLayout]), 'settings')
  let clearButton = getButton('btn clear-btn', clear, 'delete_forever')
  let overlayDef = new ElementDefinition(overlay, [undoButton, clearButton, settingButton, colorLayout])
  overlayDef.render(document.body)
}

function getButton(className, clickHandler, iconName) {
  let button = buildElement('button', className, clickHandler)
  let icon = buildElement('i', 'material-icons md-light md-36')
  icon.i.innerText = iconName
  return new ElementDefinition(button, [icon])
}