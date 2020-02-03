function loadSettings() {
    chrome.storage.sync.get(null, function (data) {
        $('#domains').val(data['domains'].join('\n'))
        $('#report-token').val(data['report-token'])
    })
}

$(document).ready(function() {
    loadSettings()
    $('#save').click(function() {
        let options = {
            'domains':$('#domains').val().split(/[\s|,]+/),
            'report-token':$('#report-token').val()
        }
        chrome.storage.sync.set(options)
    })
})