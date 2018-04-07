let instanceId = null

export function sendPath(path) {

}

export function sendClear() {

}

export function pop() {

}

function makeRequest(request) {
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
        })
}
