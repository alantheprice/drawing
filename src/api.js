
import { LocalStore } from './storage/localStorage.js'
const store = new LocalStore()
const INSTANCE_ID_KEY = 'instanceId'
const URL = 'http://localhost:3007/'
let instanceId = null

store.load(INSTANCE_ID_KEY).then(id => instanceId = id)

export function sendPath(path) {

}

export function sendClear() {

}

export function pop() {

}

function makeRequest(request) {
    request.url = URL
    if (instanceId) {
        request.body.instanceId = instanceId
        request.method = 'PUT'
    }
    fetch(request)
        .then((response) => {
            return response.json()
        })
        .then((responseData) => {
            instanceId = responseData.body.instanceId
            store.save(INSTANCE_ID_KEY, instanceId)
        })
}
