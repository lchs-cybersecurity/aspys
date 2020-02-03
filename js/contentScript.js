function verifyEmail() {
    chrome.storage.sync.get('domains', function(data) {
        var list = getElementsByClass("Bk")
        for (i = 0; i < list.length; i++) {
            var $emailElement = list[i]
            let emailAddress = $emailElement.find('span.gD').attr('email')
            let isVerified = checkIfVerifiedEmail(emailAddress, data['domains'])
            let $iconElement = $emailElement.find('div.aCi')
            $iconElement.addClass(isVerified ? 'verified' : 'unverified')
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
    for (i = 0; i < domains.length; i++) {
        var domain = domains[i]
        console.log(emailAddress)
        console.log(domain)
        if (emailAddress.endsWith('@'+domain)) {
            return true
        }
    }
    return false
}

waitForKeyElements('span.gD', verifyEmail)