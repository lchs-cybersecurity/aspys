function getUrlVars() {
    let vars = {}
    let regex = /[?&]+([^=&]+)=([^&]*)/gi
    window.location.href.replace(regex, function(m, key, value) {
        vars[key] = decodeURIComponent(value.replace(/\+/g, ' '))
    })
    return vars
}

$(document).ready(function() {
    var data = getUrlVars()
    $('#user').val(data['user'])
    $('#sender').val(data['sender'])
    $('#contents').append($($.parseHTML(data['contents'])))
})


$('#send').click(function() {
    $(this).text('Sending...')  
    $(this).prop('disabled', true)  

    chrome.storage.sync.get('report-token', function(storage) {
        $.post('https://postmail.invotes.com/send',
            {
                subject: "Phish Report - " + $('#sender').val(),
                text: [
                    `This email has been sent through Gmail Domain Verifier.`,
                    `Note from reporter (${$('#user').val()}):`,
                    $('#note').val(),
                    `\nEMAIL CONTENTS:\n`,
                    $('#contents').prop('outerHTML')
                ].join('\n'),
                access_token: storage['report-token']
            },
            onSuccess
        ).fail(onError)  
    })

    return false  
})

function onSuccess() {
    console.log('success')
    $('#send').text("Sent!")
}

function onError(error) {
    $('#send').text("Error")
    console.log(error)
}

$("#mail-form").submit(function( event ) {
    event.preventDefault()  
})  