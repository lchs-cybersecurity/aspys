function openSetup() {
    chrome.tabs.create({url: chrome.extension.getURL('../html/welcome.html')})
}

function setDefaultSettings() {
    chrome.storage.sync.set({domains:[], whitelist:[], feedback_countdown:30, sent_feedback:false})
}

chrome.runtime.onInstalled.addListener(function (info) {
    if (info.reason == "install") {
        setDefaultSettings()
        openSetup()
    }
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "open-report") {
            chrome.tabs.create({url:`../html/report.html?${request.encodedData}`})
        } else if (request.action == "open-feedback") {
            chrome.tabs.create({url:`../html/feedback.html`})
        }
});
