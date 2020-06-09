function openSetup() {
    chrome.tabs.create({url: chrome.extension.getURL('../html/welcome.html')})
} 

function setDefaultSettings() {
    chrome.identity.getProfileUserInfo(function(userInfo) {
        const address = userInfo.email; 

        let request = $.ajax({
            type: "GET",
            url: config['host'] + config['get-org'], 
            contentType: 'application/json', 
            dataType: "json", 
            data: {
                address: address, 
            }, 
        }); 

        let org_id; 
    
        request.done(function(msg) {
            console.log(msg); 

            org_id = msg.ID

            writeDefault(org_id); 
        }); 
    
        request.fail(function( jqXHR, textStatus ) {
            console.log(jqXHR); 
            console.log(textStatus); 
    
            org_id = ""; 

            writeDefault(org_id); 
        }); 
    }); 
}

function writeDefault(org_id) {
    chrome.storage.sync.set({domains:['lcusd.net', 'mylcusd.net'], whitelist:[], feedback_countdown:30, sent_feedback:false, org_id: org_id,})
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

