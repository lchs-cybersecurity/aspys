function verifyEmail() {
    console.log('verifyEmail')
    chrome.storage.sync.get(['domains', 'whitelist'], function(data) {
        var list = getElementsByClass("ads")
        console.log(list.length)
        var addedMaily = false
        for (i = 0; i < list.length; i++) {
            var $emailElement = list[i]
            let emailAddress = $emailElement.find('span.gD').attr('email')
            let $iconElement = $emailElement.find('div.aCi')
            if ($iconElement.hasClass('verified') || $iconElement.hasClass('unverified')) {
                return
            }
            let isVerified = checkIfVerifiedEmail(emailAddress, data)
            if (isVerified) {
                $iconElement.addClass('verified')
            } else {
                $iconElement.addClass('unverified')
                let $report = $('<button class="gmail-button report">Report</button>')
                let $whitelist= $('<button class="gmail-button whitelist">Whitelist</button>')
                $emailElement.find('span.gD').append($report)
                $emailElement.find('span.gD').append($whitelist)
                $iconElement.click(function() {
                    openReport($emailElement)
                })
                $report.click(function() {
                    openReport($emailElement)
                })
                $whitelist.click(function() {
                    whitelist($emailElement)
                })
                if (!addedMaily) {
                    addedMaily = true
                    // TODO: Display maily like clippy
                    // $iconElement.parent().append('<img src="https://raw.githubusercontent.com/lchs-cybersecurity/email-domain-verifier/master/assets/icon-128.png" class="maily-warning" height=48/>')
                }
            }
        }
    })
}

function getElementsByClass(className) {
    var list = []
    var $element = $('.' + className)
    for (i = 0; i < $element.length; i++) {
        list.push($element.eq(i))
    }
    return list
}

function checkIfVerifiedEmail(emailAddress, data) {
    console.log(emailAddress)
    console.log(data['whitelist'])
    console.log(data['domains'])
    for (let w of data['whitelist']) {
        if (emailAddress == w) {
            return true;
        }
    }
    for (let d of data['domains']) {
        if (emailAddress.endsWith('@'+d)) {
            return true;
        }
    }
    return false
}

function encodeEmailData($emailElement) {
    let reporter = $(document).find('div.gb_qb').prop('innerHTML')
    let reportee = $emailElement.find('span.gD').attr('email')
    let contents = $emailElement.find('div.a3s').prop('outerHTML')
    return jQuery.param({
        reporter:reporter,
        reportee:reportee,
        contents:contents
    })
}

function openReport($emailElement) {
    chrome.runtime.sendMessage({
        action: "open-report",
        encodedData: encodeEmailData($emailElement)
    });
}

function whitelist($emailElement) {
    let emailAddress = $emailElement.find('span.gD').attr('email')
    chrome.storage.sync.get('whitelist', function(data) {
        let whitelist = data['whitelist']
        whitelist.push(emailAddress)
        chrome.storage.sync.set({'whitelist':whitelist}, function() {
            let $iconElement = $emailElement.find('div.aCi')
            $iconElement.removeClass('unverified')
            $iconElement.addClass('verified')
        })
    })
}

function checkNodesThenVerify(mutationsList) {
    for (let mutation of mutationsList) {
        const addedNodes = Array.from( mutation.addedNodes) ;
        if ( addedNodes && addedNodes.some( node => node.classList && node.classList.contains("Bs") ) ) {
            verifyEmail()
        }
    }
}

const observer = new MutationObserver(checkNodesThenVerify)
observer.observe(document.body, {
    attributes: true,
    characterData: false,
    childList: true,
    subtree: true
})