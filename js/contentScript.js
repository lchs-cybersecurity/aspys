const vStatuses = ['b', 'u', 'uv', 'dv']; 
const classes = ['blacklisted', 'unverified', 'user-verified', 'domain-verified']; 

function addVClass($iconElement, data) { // adds the correct class based on verification status
    let emailAddress = getEmail($iconElement.parent().parent())
    // let vStatus = checkIfVerifiedEmail(emailAddress, data); 
    let vStatus = checkIfVerifiedEmail(data[emailAddress])

    $iconElement.removeClass(classes); // clears the verification classes on the element

    alts={
        'b': 'Blacklisted user',
        'u': 'Unknown user',
        'uv': 'Verified user (whitelisted by you)',
        'dv': 'Verified user'
    }
    
    if (vStatus == vStatuses[3]) {
        $iconElement.addClass(classes[3]); 
    } else if (vStatus == vStatuses[2]) {
        $iconElement.addClass(classes[2]); 
    } else if (vStatus == vStatuses[0]) {
        $iconElement.addClass(classes[0]); 
    } else {
        $iconElement.addClass(classes[1]); 
    } 

    $iconElement.attr('title', alts[vStatus]);
} 

function unverifiedButtons($emailElement, $iconElement, $nameElement, data) { // the buttons to be put on a neutral email
    let $report = $('<button class="gmail-button report">Report</button>')
    let $whitelist= $('<button class="gmail-button whitelist">Whitelist</button>'); 
    
    $nameElement.append($report)
    $nameElement.append($whitelist)

    $report.click(function(event) {
        event.stopPropagation()
        openReport($emailElement, data)
        // console.log($emailElement)
    })
    $whitelist.click(function(event) {
        event.stopPropagation()
        whitelist($emailElement)
    })
} 

function userVerifiedButtons($emailElement, $iconElement, $nameElement) { // the buttons to be put on a verified email
    let $unwhitelist = $('<button class="gmail-button unwhitelist">Unwhitelist</button>'); 

    $nameElement.append($unwhitelist); 

    $unwhitelist.click(function(event) {
        event.stopPropagation()
        unwhitelist($emailElement)
    })
} 

function placeButtons(data) { // adds the appropriate buttons
    let expanded = getElementsByClass("adn"); 

    $('button.gmail-button').remove(); // removes all the previous buttons added

    for (let $emailElement of expanded) {
        let $iconElement = getIconElement($emailElement); 
        let $nameElement = getNameElement($emailElement); 

        if ($iconElement.hasClass(classes[1])) {
            unverifiedButtons($emailElement, $iconElement, $nameElement, data); 
        } else if ($iconElement.hasClass(classes[2])) {
            userVerifiedButtons($emailElement, $iconElement, $nameElement); 
        }
    } 
}

function changeElements(data) {
    // console.log(data); 

    let icons = getElementsByClass("aCi"); 

    for (let $iconElement of icons) {
        addVClass($iconElement, data); 
    } 

    placeButtons(data); 
}

function verifyEmail() {
    chrome.storage.sync.get(['domains', 'user_whitelist', 'feedback_countdown', 'sent_feedback', 'org_id'], function(data) {

        // add back once we fix the feedback timer
        // askFeedbackMaybe(data['sent_feedback'], data['feedback_countdown'])
        
        // email_elements = document.getElementsByClassName("gD")[0].getAttribute("email")
        email_elements = document.getElementsByClassName("gD")
        emails = []

        console.log(data); 

        for (let element of email_elements) {
            email = element.getAttribute("email")
            if (!(emails.includes(email))) { // redundnacy check
                emails.push(email)
            }
        }

        let ver_request = $.ajax({
            type: "GET",
            url: config['host'] + config['verify-emails'], 
            dataType: "json", 
            traditional: true,
            data: {
                org_id: data.org_id, 
                key: config["backend-key"],
                addresses: emails
            }
        }); 

        ver_request.done(function(msg) {
            console.log(msg) 

            // Check against client whitelist
            for (var emailkey in msg) {
                if (msg[emailkey] == 0) { // if unverified server-side
                    for (let w of data['user_whitelist']) {
                        if (emailkey == w) {
                            msg[emailkey] = 3
                        }
                    }
                }
            }
            // console.log(msg)

            // data = {status: msg['status'], user_whitelist: data['user_whitelist']}; 
            changeElements(msg); 
        }); 

        ver_request.fail(function( jqXHR, textStatus ) {
            // console.log(jqXHR); 
            // console.log(textStatus); 

            data = []; 
            changeElements(data); 
        })

    })
}


function askFeedbackMaybe(alreadySent, countdown) {
    if (!alreadySent) {
        if (countdown <= 0) {
            askFeedback()
        } else {
            chrome.storage.sync.set({"feedback_countdown": countdown-1})
        }
    }
}

function askFeedback() {
    if (!$('.aspys-feedback').length) {
        $(document.body).append(`
        <div class="aspys-feedback">
            <div class="aspys-icon"></div>
            <span>Greetings from LC Cybersecurity Club! You've been using Aspys for a while. Would you kindly like to give us feedback?</span>
            </br>
            <div class="aspys-buttons">
                <button class="aspys-feedback-yes">Sure!</button>
                <button class="aspys-feedback-no">Later...</button>
            </div>
        </div>
        `); 
    
        $(".aspys-feedback-yes").click(function() {
            openFeedback()
            chrome.storage.sync.set({"feedback_countdown": 30})
            hideFeedbackRequest()
        }); 
        $(".aspys-feedback-no").click(function() {
            chrome.storage.sync.set({"feedback_countdown": 30})
            hideFeedbackRequest()
        }); 
    } 
}

function hideFeedbackRequest() {
    $('.aspys-feedback').remove(); 
}

function getElementsByClass(className) {
    let list = []
    let $element = $('.' + className)
    for (i = 0; i < $element.length; i++) {
        list.push($element.eq(i))
    }
    return list
}

function getEmail($emailElement) {
    return getNameElement($emailElement).attr('email')
}
function getIconElement($emailElement) {
    return $emailElement.find('div.aCi')
}
function getNameElement($emailElement) {
    return $emailElement.find('span.gD')
}
function getContents($emailElement) {
    return $emailElement.find('div.a3s').prop('outerHTML')
}
function getUserEmail() {
    return $(document).find('div.gb_sb').prop('innerHTML')
}

function checkIfVerifiedEmail(data) {
    //console.log(data) 

    // whitelisted (1) --> 3
    if (data == '1') { console.log("VERIFIED"); return vStatuses[3]; }

    // user-whitelisted (3) --> 2
    else if (data == '3') { return vStatuses[2]; }

    // blacklisted (2) --> 0
    else if (data == '2') { return vStatuses[0]; }
    
    // unidentified (0) --> 1
    return vStatuses[1];
}

function encodeEmailData($emailElement, data) {
    return jQuery.param({
        reporter:getUserEmail(),
        reportee:getEmail($emailElement),
        contents:getContents($emailElement), 
        org_id: data.org_id, 
    })
}

function openReport($emailElement, data) {
    chrome.runtime.sendMessage({
        action: "open-report",
        encodedData: encodeEmailData($emailElement, data)
    })
}

function openFeedback() {
    chrome.runtime.sendMessage({
        action: "open-feedback"
    })
}

function whitelist($emailElement) {
    let emailAddress = getEmail($emailElement)
    let $whitelist = $emailElement.find('button.whitelist')
    chrome.storage.sync.get('user_whitelist', function(data) {
        let whitelist = data['user_whitelist']

        if (!whitelist.includes(emailAddress) && emailAddress.length > 3) {
            whitelist.push(emailAddress); 

            chrome.storage.sync.set({'user_whitelist': whitelist}, function() {
                verifyEmail()
            }); 
        } 
    }); 
} 

function unwhitelist($emailElement) {
    let emailAddress = getEmail($emailElement)
    let $unwhitelist = $emailElement.find('button.unwhitelist')
    chrome.storage.sync.get('user_whitelist', function(data) {
        let whitelist = data['user_whitelist']

        for (let i = whitelist.length - 1; i >= 0; i--) {
            if (whitelist[i] === emailAddress) {
                whitelist.splice(i, 1);
            } 

            chrome.storage.sync.set({'user_whitelist': whitelist}, function() {
                verifyEmail()
            }); 
        } 
    }); 
}

function checkNodesThenVerify(mutationsList) {
    for (let mutation of mutationsList) {
        const addedNodes = Array.from(mutation.addedNodes)
        if ( addedNodes && addedNodes.some( node =>
                node.classList && (node.classList.contains("Bs") || node.classList.contains("aap")) )) {
            verifyEmail()
        }
    }
} 

function checkLinks(mutationsList) {
    neuterLinks(); 
}

const observer = new MutationObserver(checkNodesThenVerify); 

observer.observe(document.body, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true
}); 

const linkObs = new MutationObserver(checkLinks); 

linkObs.observe(document.body, {
    attributes: true,
    attributeFilter: ['href'], 
    characterData: false,
    childList: true,
    subtree: true
}); 