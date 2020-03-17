function isEmailFormat(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function inputsAreValid() {
    var isValid = true
    $('.verify-email').each(function(i) {
        isValid = isEmailFormat($(this).val())
        if (!isValid) {
            return false
        }
    })
    return isValid 
}

$(document).ready(function() {
    $('.verify-email').on('input', function() {
        if (isEmailFormat($(this).val())) {
            $(this).attr("class", "verify-email green")
        } else {
            $(this).attr("class", "verify-email red")
        }

    })

    $('.verify-email').on('focusout', function() {
        $(this).removeClass('green')
    })
})