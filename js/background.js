function openSetup() {
    chrome.tabs.create({url: chrome.extension.getURL('../html/options.html')})
}

function setDefaultSettings() {
    chrome.storage.sync.set({domains:[], whitelist:[]})
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
        }
});
