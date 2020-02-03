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
    console.log('send')
})

//update this with your $form selector
var form_id = "jquery_form";
var data = {};

function onSuccess() {
    console.log('success')
}

function onError(error) {
    console.log(error)
}

var $sendButton = $("#" + form_id + " [name='send']");

function send() {
    $sendButton.val('Sending…');
    $sendButton.prop('disabled',true);

    var subject = $("#" + form_id + " [name='subject']").val();
    var message = $("#" + form_id + " [name='text']").val();
    data['subject'] = subject;
    data['text'] = message;

    chrome.storage.sync.get('report-token', function(storage) {
        data['access_token'] = storage['report-token'];

        $.post('https://postmail.invotes.com/send',
            data,
            onSuccess
        ).fail(onError);
    })

    return false;
}

$sendButton.on('click', send);

var $form = $("#" + form_id);
$form.submit(function( event ) {
    event.preventDefault();
});