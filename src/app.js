import { controlOverlay } from './components/controlOverlay'
import u from './utils'
import "../app.css"

// initialize drawing
setup()

function setup() {
  controlOverlay().render(u.$('#app'))
  addServiceWorker()
}

function addServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      console.log('Service worker registration succeeded:', registration);

    }).catch(function (error) {
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
    function (pushSubscription) {
      console.log(pushSubscription.endpoint);
      // The push subscription details needed by the application
      // server are now available, and can be sent to it using,
      // for example, an XMLHttpRequest.
    }, function (error) {
      // During development it often helps to log errors to the
      // console. In a production environment it might make sense to
      // also report information about errors back to the
      // application server.
      console.log(error);
    }
  );
}