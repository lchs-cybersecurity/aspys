function loadSettings() {
    chrome.storage.sync.get(null, function (data) {
        $('#domains').val(data['domains'].join('\n'))
        $('#whitelist').val(data['whitelist'].join('\n'))
        $('#report-to').val(data['report-to'])
    })
}

function updateSave() {
    $('#save').click(function() {
        if (inputsAreValid()) {
            saveOptions()
        } else {
            alert("Make sure all fields are valid!")
        }
    })
    $('input,textarea').change(function() {
        $('#save').text('Save')
    })
}

function saveOptions() {
    let options = {
        'domains':$('#domains').val().split(/[\s|,]+/),
        'whitelist':$('#whitelist').val().split(/[\s|,]+/),
        'report-to':$('#report-to').val()
    }
    chrome.storage.sync.set(options, function() {
        $('#save').text('Saved')
    })
}

$(document).ready(function() {
    loadSettings()
    updateSave()
})