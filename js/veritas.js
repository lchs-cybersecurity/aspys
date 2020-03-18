$(document).ready(function() {
    $('.logo').click(function() {
        chrome.tabs.create({url: config['host']});
    })
})