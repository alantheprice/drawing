import { init, clear, undo, updateSettings } from './drawing/drawing'
import { e, ElementDefinition } from './templater/ElementDefinition'
import { colorButton } from './components/colorButton'
import { getBrushLayout, getColorLayout, subscribe, SETTING_EVENTS} from './settings/settings'
let settingsShowing = false
const {div, button, i } = e

// initialize drawing
setup()

function setup() {
  init()
  createOverlay()
  addServiceWorker()
}

// function showSettings(layouts) {
//   settingsShowing = !settingsShowing
//   layouts.forEach((layout) => layout.setActive(settingsShowing))
//   console.log('settings-clicked')
// }

// Overlay should be it's own component, and settings should be only for settings, not for color pickers.
function createOverlay() {
  div({class:'overlay-container'},
    button({class:'btn circle undo-btn', click: undo},
      i({class:'material-icons md-light md-36', innerText: 'undo'})
    ),
    colorButton({'@colorSelected': (color) => updateSettings({color: color})}),
    // button({class:'btn circle setting-btn', click: () => showSettings([colorLayout])},
    //   i({class:'material-icons md-light md-36', innerText: 'settings'})
    // ),
    button({class: 'btn circle clear-btn', click: clear},
      i({class: 'material-icons md-light md-36', innerText: 'delete_forever'})
    )
  ).render(document.body)
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