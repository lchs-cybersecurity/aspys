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

function listify($element) {
    let rawList = $element.val().split(/[\n\r\s,]+/)
    let list = []
    for (let e of rawList) {
        if (e.length > 0 && !list.includes(e)) {
            list.push(e)
        }
    }
    return list
}

function saveOptions() {
    let options = {
        'domains':listify($('#domains')),
        'whitelist':listify($('#whitelist')),
        'report-to':$('#report-to').val()
    }
    chrome.storage.sync.set(options, function() {
        $('#save').text('Saved')
        loadSettings()
    })
}

$(document).ready(function() {
    loadSettings()
    updateSave()
})