$(document).ready(function() {
    makeIconsClickable()
    displaySiteAnalysis()
})

function makeIconsClickable() {
    $('#options').click(function() {
        chrome.tabs.create({url: chrome.extension.getURL('html/options.html')});
    })
    $('#bug').click(function() {
        chrome.tabs.create({url: chrome.extension.getURL('html/bug.html')});
    })
    $('#info').click(function() {
        chrome.tabs.create({url: config['info-page-link']});
    })
}

function displaySiteAnalysis() {
    chrome.runtime.sendMessage({ action: "site-analysis" }, function(data) {
        let rating = data.currentRank == -1 ? "?" : data.currentRank
        $('#domain').html(data.currentDomain)
        $('#rating').html(rating)
    })
}