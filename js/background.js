function openSetup() {
    chrome.tabs.create({url: chrome.extension.getURL('../html/welcome.html')})
}

function setDefaultSettings() {
    chrome.storage.sync.set({domains:['lcusd.net', 'mylcusd.net'], whitelist:[], feedback_countdown:30, sent_feedback:false})
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
        } else if (request.action == "open-info") {
            chrome.tabs.create({url:config['host']+config['info-page']})
        } else if (request.action == "site-analysis") {
            sendResponse(siteChecker)
        }
});

chrome.tabs.onActivated.addListener(function(info) {
    chrome.tabs.get(info.tabId, function (tab) {
        siteChecker.update(tab)
    });
});

chrome.tabs.onUpdated.addListener(function (id, info, tab) {
    if (info.status == 'complete') {
        siteChecker.update(tab)
    }
});

