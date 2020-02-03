function openSetup() {
    chrome.tabs.create({url: chrome.extension.getURL('../html/options.html')})
}

function setDefaultSettings() {
    chrome.storage.sync.set({domains:[]})
}

chrome.runtime.onInstalled.addListener(function (info) {
    if (info.reason == "install") {
        setDefaultSettings()
        openSetup()
    }
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.greeting == "good day, can you open report page please? thanks") {
        chrome.tabs.create({url:`../html/report.html?${request.encodedData}`})
        sendResponse({farewell: "ok"})
      }
    });
