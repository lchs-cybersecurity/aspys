var config = {
    "host": "https://lcusd-net.tk/",
    "post-report": "api/report",
    "post-feedback": "api/feedback",
    "post-bug": "api/bug", 
    "get-blacklist": "api/get_blacklist", 
    "info-page": "info",
    "chrome-webstore-link": "https://http.cat/404",
    "top-domains": [
        "google.com",
        "youtube.com",
        "wikipedia.org",
        "facebook.com",
        "amazon.com"
    ],
    "openpagerank-api-key":"c0000oo0kcsso8gog8skcsssskwokw808sg4ccoc"
    //Derek (derek.l.jiang@gmail.com)'s API key
}  

const vStatuses = ['b', 'u', 'uv', 'dv']; 
const classes = ['blacklisted', 'unverified', 'user-verified', 'domain-verified']; 

function addVClass($iconElement, data) { // adds the correct class based on verification status
    let emailAddress = getEmail($iconElement.parent().parent())
    let vStatus = checkIfVerifiedEmail(emailAddress, data); 

    $iconElement.removeClass(classes); // clears the verification classes on the element
    
    if (vStatus == vStatuses[2]) {
        $iconElement.addClass(classes[2]); 
    } else if (vStatus == vStatuses[3]) {
        $iconElement.addClass(classes[3]); 
    } else if (vStatus == vStatuses[0]) {
        $iconElement.addClass(classes[0]); 
    } else {
        $iconElement.addClass(classes[1]); 
    } 
} 

function unverifiedButtons($emailElement, $iconElement, $nameElement) { // the buttons to be put on a neutral email
    let $report = $('<button class="gmail-button report">Report</button>')
    let $whitelist= $('<button class="gmail-button whitelist">Whitelist</button>'); 
    
    $nameElement.append($report)
    $nameElement.append($whitelist)

    $report.click(function(event) {
        event.stopPropagation()
        openReport($emailElement)
        console.log($emailElement)
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

function placeButtons() { // adds the appropriate buttons
    let expanded = getElementsByClass("adn"); 

    $('button.gmail-button').remove(); // removes all the previous buttons added

    for (let $emailElement of expanded) {
        let $iconElement = getIconElement($emailElement); 
        let $nameElement = getNameElement($emailElement); 

        if ($iconElement.hasClass(classes[1])) {
            unverifiedButtons($emailElement, $iconElement, $nameElement); 
        } else if ($iconElement.hasClass(classes[2])) {
            userVerifiedButtons($emailElement, $iconElement, $nameElement); 
        }
    } 
}

function changeElements(data) {
    console.log(data); 

    let icons = getElementsByClass("aCi"); 

    for (let $iconElement of icons) {
        addVClass($iconElement, data); 
    } 

    placeButtons(); 
}

function verifyEmail() {
    chrome.storage.sync.get(['domains', 'whitelist', 'feedback_countdown', 'sent_feedback'], function(data) {

        askFeedbackMaybe(data['sent_feedback'], data['feedback_countdown'])

        let request = $.ajax({
            type: "GET",
            url: config['host'] + config['get-blacklist'], 
            dataType: "json", 
        }); 
    
        request.done(function(msg) {
            console.log(msg); 

            data['blacklist'] = msg.data; 

            changeElements(data); 
        }); 

        request.fail(function( jqXHR, textStatus ) {
            console.log(jqXHR); 
            console.log(textStatus); 

            data['blacklist'] = []; 

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
    $(document.body).append(`
    <div class="veritas-feedback" id="veritas-feedback">
        <div class="veritas-icon"></div>
        <span>Greetings from LC Cybersecurity Club! You've been using Veritas for a while. Would you kindly like to give us feedback?</span>
        </br>
        <div class="veritas-buttons">
            <button id="veritas-feedback-yes">Sure!</button>
            <button id="veritas-feedback-no">Later...</button>
        </div>
    </div>
    `)
    $("#veritas-feedback-yes").click(function() {
        openFeedback()
        chrome.storage.sync.set({"feedback_countdown": 30})
        hideFeedbackRequest()
    })
    $("#veritas-feedback-no").click(function() {
        chrome.storage.sync.set({"feedback_countdown": 30})
        hideFeedbackRequest()
    })
}

function hideFeedbackRequest() {
    let $feedback = $("#veritas-feedback")
    if ($feedback) {
        $feedback.css("display", "none")
    }
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
    return $(document).find('div.gb_qb').prop('innerHTML')
}

function checkIfVerifiedEmail(emailAddress, data) {
    for (let b of data['blacklist']) {
        if (emailAddress == b) {
            return vStatuses[0]; 
        }
    } 

    for (let w of data['whitelist']) {
        if (emailAddress == w) {
            return vStatuses[2]; 
        }
    }
    for (let d of data['domains']) {
        if (emailAddress.endsWith('@'+d)) {
            return vStatuses[3]; 
        }
    }
    return vStatuses[1]; 
}

function encodeEmailData($emailElement) {
    return jQuery.param({
        reporter:getUserEmail(),
        reportee:getEmail($emailElement),
        contents:getContents($emailElement)
    })
}

function openReport($emailElement) {
    chrome.runtime.sendMessage({
        action: "open-report",
        encodedData: encodeEmailData($emailElement)
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
    chrome.storage.sync.get('whitelist', function(data) {
        let whitelist = data['whitelist']

        if (!whitelist.includes(emailAddress) && emailAddress.length > 3) {
            whitelist.push(emailAddress); 

            chrome.storage.sync.set({'whitelist': whitelist}, function() {
                verifyEmail()
            }); 
        } 
    }); 
} 

function unwhitelist($emailElement) {
    let emailAddress = getEmail($emailElement)
    let $unwhitelist = $emailElement.find('button.unwhitelist')
    chrome.storage.sync.get('whitelist', function(data) {
        let whitelist = data['whitelist']

        for (let i = whitelist.length - 1; i >= 0; i--) {
            if (whitelist[i] === emailAddress) {
                whitelist.splice(i, 1);
            } 

            chrome.storage.sync.set({'whitelist': whitelist}, function() {
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

const observer = new MutationObserver(checkNodesThenVerify)
observer.observe(document.body, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true
})