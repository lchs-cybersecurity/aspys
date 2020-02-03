function loadSettings() {
    chrome.storage.sync.get(null, function (data) {
        $('#domains').val(data['domains'].join('\n'))
    })
}

$(document).ready(function() {
    loadSettings()
    $('#save').click(function() {
        let options = {
            "domains":$('#domains').val().split(/[\s|,]+/)
        }
        chrome.storage.sync.set(options)
    })
})