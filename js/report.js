let org_id; 

function getUrlVars() {
    let vars = {}
    let regex = /[?&]+([^=&]+)=([^&]*)/gi
    window.location.href.replace(regex, function(m, key, value) {
        vars[key] = decodeURIComponent(value.replace(/\+/g, ' '))
    })
    return vars
}

$(document).ready(function() {
    let urlData = getUrlVars()
    $('#reporter').val(urlData['reporter'])
    $('#reportee').val(urlData['reportee'])
    $('#contents').append($($.parseHTML(urlData['contents'])))
    chrome.storage.sync.get('report-to', function(storageData) {
        $('#receiver').val(storageData['report-to'])
    }) 

    // org_id = urlData.org_id; 
    chrome.storage.sync.get('org_id', function(data){
        org_id = data['org_id']
    })
})

$('#send').click(function() {
    if (!($(this).hasClass('gray'))) {
        if (inputsAreValid()) {
            sendReport()
        } else {
            alert("Make sure all fields are valid!")
        }
    }
})

function sendReport() {
    $(this).text('Sending...')  
    $(this).prop('disabled', true)  
    let request = $.ajax({
        type: "POST",
        url: config['host'] + config['post-report'],
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(getReportData())
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
    let exit = confirm("Report sent! Exit tab?")
    if (exit) {
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id, function() { });
        });
    }
}

function onError(message) {
    let manualSend = confirm(`Uh oh, error occurred: ${message}\nWould you like to send report manually?`)
    if (manualSend) {
        emailData = getReportData()
        let encodedData = jQuery.param({
            subject:`Reporting email from ${emailData.reportee}`,
            body:"Screenshot:"
        })
        window.location.href = `mailto:${emailData.receiver}?${encodedData}`;
    }
}

function getReportData() {
    return {
        report_data: {
            reportee: $('#reportee').val(),
            reporter: $('#reporter').val(),
            receiver: $('#receiver').val(),
            note: $('#note').val(),
            body: $('#contents').prop('outerHTML'), 
        }, 
        org_id: org_id, 
        key: config['backend-key']
    }
}

function captureContents() {
    let captureElement = $("#contents")[0]
    let w = 600
    let h = captureElement.scrollHeight
    html2canvas(captureElement, {allowTaint:true, windowWidth:w, windowHeight:h, width:w, height:h}).then(canvas => {
        document.body.appendChild(canvas)
        let imgData = canvas.toDataURL('image/jpeg');
        console.log(imgData)
    });
}

$("#mail-form").submit(function( event ) {
    event.preventDefault()  
})  