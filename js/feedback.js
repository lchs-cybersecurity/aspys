let fieldIds = ["improve", "comments"]

$(document).ready(function() {
    $('#chrome-webstore').attr('href', config['chrome-webstore-link'])
    $('#send').click(function() {
        if (!($(this).hasClass('gray'))) {
            if (fieldsNotEmpty()) {
                sendFeedback()
            } else {
                alert("Please write something to send something!")
            }
        }
    })
})

function fieldsNotEmpty() {
    return fieldIds.every(f => !fieldIsEmpty(f))
}

function fieldIsEmpty(id) {
    return $("#"+id).val().trim().length < 1
}

function sendFeedback() {
    let request = $.ajax({
        type: "POST",
        url: config['host'] + config['post-feedback'],
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(getFeedbackData())
    })
    request.done(function( msg ) {
        console.log(msg)
        onSuccess()
    })
    request.fail(function( jqXHR, textStatus ) {
        console.log(jqXHR)
        onError(textStatus)
    })
}

function onSuccess() {
    $('#send').text("Sent!")
    $('#send').attr("disabled", true)
    if (confirm("Thank you for the feedback! Exit tab?")) {
        exitTab()
    }
}

function onError(message) {
    if (confirm("Oops, something went wrong. Exit tab?")) {
        exitTab()
    }
}

function getFeedbackData() {
    let data = {}
    for (let id of fieldIds) {
        data[id] = {
            label: $("label[for='"+id+"'").html(),
            value: $("#"+id).val()
        }

    }
    return data
}

function exitTab() {
    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() { });
    });
}
