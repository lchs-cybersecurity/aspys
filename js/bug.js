let fieldIds = ["issue"]

$(document).ready(function() {
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
        url: config['host'] + config['post-bug'],
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
    return {
        data: {
            issue: $("#issue").val(),
        },
        discord: {
            title: "Bug Report",
            color: "16720990",
            fields: [
                {
                    label: $("label[for='issue'").html(),
                    value: $("#issue").val(),
                }
            ]

        },
        key: config["backend-key"]
    }
}

function exitTab() {
    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() { });
    });
}
