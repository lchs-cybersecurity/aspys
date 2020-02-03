function verifyEmail() {
    chrome.storage.sync.get('domains', function(data) {
        var list = getElementsByClass("Bk")
        console.log(list.length)
        for (i = 0; i < list.length; i++) {
            var $emailElement = list[i]
            let emailAddress = $emailElement.find('span.gD').attr('email')
            let $iconElement = $emailElement.find('div.aCi')
            console.log(emailAddress)
            let isVerified = checkIfVerifiedEmail(emailAddress, data['domains'])
            if (isVerified) {
                $iconElement.addClass('verified')
            } else {
                $iconElement.addClass('unverified')
                $iconElement.click(function() {
                    chrome.runtime.sendMessage({
                        greeting: "good day, can you open report page please? thanks",
                        encodedData: encodeEmailData($emailElement)
                    });
                })
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

function checkIfVerifiedEmail(emailAddress, domains) {
    console.log(emailAddress)
    for (let d of domains) {
        if (emailAddress.endsWith('@'+d)) {
            return true;
        }
    }
    return false
}

function encodeEmailData($emailElement) {
    let user = $(document).find('div.gb_qb').prop('innerHTML')
    let emailAddress = $emailElement.find('span.gD').attr('email')
    let contents = $emailElement.find('div.a3s').prop('outerHTML')
    return jQuery.param({
        user:user,
        sender:emailAddress,
        contents:contents
    })
}

waitForKeyElements('table.Bs', verifyEmail)