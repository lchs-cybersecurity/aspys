function verifyEmail() {
    chrome.storage.sync.get('domains', function(data) {
        var list = getElementsByClass("Bk")
        for (i = 0; i < list.length; i++) {
            var $emailElement = list[i]
            let emailAddress = $emailElement.find('span.gD').attr('email')
            let $iconElement = $emailElement.find('div.aCi')
            let isVerified = checkIfVerifiedEmail(emailAddress, data['domains'])
            if (isVerified) {
                $iconElement.addClass('verified')
            } else {
                $iconElement.addClass('unverified')
                $iconElement.click(function() {
                    chrome.runtime.sendMessage(
                        {
                            greeting: "good day, can you open report page please? thanks",
                            encodedData: "hi"
                        }, function(response) {
                        console.log(response);
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
    for (i = 0; i < domains.length; i++) {
        var domain = domains[i]
        if (emailAddress.endsWith('@'+domain)) {
            return true
        }
    }
    return false
}

waitForKeyElements('span.gD', verifyEmail)