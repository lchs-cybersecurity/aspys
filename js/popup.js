$(document).ready(function() {
    $('#options').click(function() {
        chrome.tabs.create({url: chrome.extension.getURL('html/options.html')});
    })
    $('#bug').click(function() {
        chrome.tabs.create({url: chrome.extension.getURL('html/bug.html')});
    })
})