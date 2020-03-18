function verifyEmail() {
    chrome.storage.sync.get(['domains', 'whitelist'], function(data) {

        let icons = getElementsByClass("aCi")
        for (i = 0; i < icons.length; i++) {
            let $iconElement = icons[i]
            let alreadyChecked = $iconElement.hasClass('verified') || $iconElement.hasClass('unverified')
            if (alreadyChecked) continue 
            let emailAddress = getEmail($iconElement.parent().parent())
            let isVerified = checkIfVerifiedEmail(emailAddress, data)
            if (isVerified) {
                $iconElement.addClass('verified')
            } else {
                $iconElement.addClass('unverified')
            }
        } 

        let expanded = getElementsByClass("adn")
        for (i = 0; i < expanded.length; i++) {
            let $emailElement = expanded[i]
            let $iconElement = getIconElement($emailElement)

            if ($iconElement.hasClass('unverified')) {
                let $report = $('<button class="gmail-button report">Report</button>')
                let $whitelist= $('<button class="gmail-button whitelist">Whitelist</button>')
                let $nameElement = getNameElement($emailElement)
                $nameElement.not(":has(button.report)").append($report)
                $nameElement.not(":has(button.whitelist)").append($whitelist)

                $iconElement.click(function(event) {
                    event.stopPropagation()
                    openReport($emailElement)
                })
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
        }
    })
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
    for (let w of data['whitelist']) {
        if (emailAddress == w) {
            return true
        }
    }
    for (let d of data['domains']) {
        if (emailAddress.endsWith('@'+d)) {
            return true
        }
    }
    return false
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

function whitelist($emailElement) {
    let emailAddress = getEmail($emailElement)
    let $whitelist = $emailElement.find('button.whitelist')
    chrome.storage.sync.get('whitelist', function(data) {
        let whitelist = data['whitelist']

        if ($whitelist.html() == "Whitelist") {
            if (!whitelist.includes(emailAddress) && emailAddress.length > 3) {
                whitelist.push(emailAddress)
                chrome.storage.sync.set({'whitelist':whitelist}, function() {
                    let list = getElementsByClass('unverified')
                    for (let element of list) {
                        element.removeClass('unverified')
                    }
                    verifyEmail()
                })
            }
            $whitelist.html('Unwhitelist')
        } else if ($whitelist.html() == "Unwhitelist") {
            for (let i = whitelist.length - 1; i >= 0; i--) {
                if (whitelist[i] === emailAddress) {
                    whitelist.splice(i, 1);
                }
                chrome.storage.sync.set({'whitelist':whitelist}, function() {
                    let list = getElementsByClass('verified')
                    for (let element of list) {
                        element.removeClass('verified')
                    }
                    verifyEmail()
                })
            }
            $whitelist.html('Whitelist')
        }
    })
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