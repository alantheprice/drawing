
export default {
    $, $$
}

function $(query) {
    return document.querySelector(query)
}

function $$(query) {
    return Array.from(document.querySelectorAll(query))
}

export function isIOS() {
    return ['iPhone', 'iPad', 'iPod'].includes(navigator.platform)
}