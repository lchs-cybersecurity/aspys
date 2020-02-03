function verifyEmail() {
    var list = getElementsByClass("Bk")
    for (i = 0; i < list.length; i++) {
        var $emailElement = list[i]
        let emailAddress = $emailElement.find('span.gD').attr('email')
        let isVerified = checkIfVerifiedEmail(emailAddress)
        let $iconElement = $emailElement.find('div.aCi')
        $iconElement.addClass(isVerified ? 'verified' : 'unverified')
    }
}

function getElementsByClass(className) {
    var list = []
    var $element = $('.' + className)
    for (i = 0; i < $element.length; i++) {
        list.push($element.eq(i))
    }
    return list
}

function checkIfVerifiedEmail(emailAddress) {
    return emailAddress.endsWith('@lcusd.net')
}

waitForKeyElements('span.gD', verifyEmail)