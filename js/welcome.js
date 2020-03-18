$(document).ready(function() {
    let pages = new LinearPages()
    pages.endAction = function() {
        window.location.href = chrome.extension.getURL('html/options.html');
    }
    pages.load()
})