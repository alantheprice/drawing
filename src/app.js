import { init, clear, undo, updateSettings } from './drawing/drawing'
import e from './templater/ElementDefinition'
import { getBrushLayout, getColorLayout, subscribe, SETTING_EVENTS} from './settings/settings'
let settingsShowing = false
const div = e.div
const button = e.button
const i = e.i
const E = e.E

// initialize drawing
setup()

function setup() {
  init()
  createOverlay()
  addServiceWorker()
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

  let overlayDef = div({class:'overlay-container'},
    button({class:'btn undo-btn', click: undo},
      i({class:'material-icons md-light md-36', innerText: 'undo'})
    ),
    button({class:'btn setting-btn', click: () => showSettings([colorLayout])},
      i({class:'material-icons md-light md-36', innerText: 'settings'})
    ),
    button({class: 'btn clear-btn', click: clear},
      i({class: 'material-icons md-light md-36', innerText: 'delete_forever'})
    ),
    colorLayout
  )
  // let overlay = div('overlay-container')
  // let undoButton = getButton('btn undo-btn', undo, 'undo')
  // let settingButton = getButton('btn setting-btn', () => showSettings([colorLayout]), 'settings')
  // let clearButton = getButton('btn clear-btn', clear, 'delete_forever')
  // let overlayDef = E(overlay, undoButton, clearButton, settingButton, colorLayout)
  overlayDef.render(document.body)
}

function addServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      console.log('Service worker registration succeeded:', registration);
      
    }).catch(function(error) {
      console.log('Service worker registration failed:', error);
    });
  } else {
    console.log('Service workers are not supported.');
  }
}

function enablePush(serviceRegistration) {    
  let options = {
    userVisibleOnly: true,
    applicationServerKey: 'TESTDATA'
  }
  serviceRegistration.pushManager.subscribe(options).then(
    function(pushSubscription) {
      console.log(pushSubscription.endpoint);
      // The push subscription details needed by the application
      // server are now available, and can be sent to it using,
      // for example, an XMLHttpRequest.
    }, function(error) {
      // During development it often helps to log errors to the
      // console. In a production environment it might make sense to
      // also report information about errors back to the
      // application server.
      console.log(error);
    }
  );
}