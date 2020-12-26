
import { LocalStore } from './storage/localStorage.js'
const store = new LocalStore()
const INSTANCE_ID_KEY = 'instanceId'
const API_URL = window.location.origin

let instanceId = null
store.load(INSTANCE_ID_KEY).then(id => instanceId = id)
let canvas

export function sendPath(path) {
    let request = new Request()
}

export function sendClear() {

}

export function pop() {

}

function getCanvasSize() {
    if (!canvas) {
        canvas = document.getElementById('canvas')
    }
    return {width: canvas.width, height: canvas.height}
}

function makeRequest(request) {
    if (instanceId) {
        request.body.instanceId = instanceId
        request.method = 'POST'
    }
    fetch(request)
        .then((response) => {
            return response.json()
        })
        .then((responseData) => {
            instanceId = responseData.body.instanceId
            if (responseData.body.needsHistory) {
                // TODO: maybe eventually
            }
            store.save(INSTANCE_ID_KEY, instanceId)
        })
}
