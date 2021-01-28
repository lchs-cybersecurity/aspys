function createPopup($this) {
    const href = $this.attr('href'); // gets the href of the a element

    $this.addClass('highlighted-link'); // it highlights the link in a cool border so you know the popup is about that one

    let popup = $(`
    <div class="aspys-link-confirm">
        <div class="aspys-icon"></div>
        <p class='link-confirm-text'>Since this is a potential phishing email, the links may lead to malicious sites! Proceed with caution. This link goes to: </p>
        <p class='link-confirm-href'>${href}</p> 
        </br>
        <div class="aspys-buttons">
            <button class="aspys-button aspys-cancel">Cancel</button>
            <button class="aspys-button aspys-proceed">Proceed</button>
        </div>
    </div>
    `); // creates the popup element
    
    popup.insertAfter($this); // places it after the a element

    popup.find('.aspys-cancel').click(function(e) { // when you click the cancel button
        popup.remove(); 
        $this.removeClass('highlighted-link'); // removes the cool border

        e.preventDefault(); // prevents the click from opening the link (the default behavior) 
        e.stopPropagation(); // prevents the event from propagating up the DOM tree
    }); 

    popup.find('.aspys-proceed').click(function(e) { // when you click the proceed button
        window.open(href); 

        popup.remove(); 
        $this.removeClass('highlighted-link'); // removes the cool border

        e.preventDefault(); // prevents the click from opening the link (the default behavior) 
        e.stopPropagation(); // prevents the event from propagating up the DOM tree
    })
}

function neuterLinks() {
    let as = $('.adn').find('div.a3s').find('a'); // finds all the a elements in each email body

    //console.log(as); 

    as.addClass('epic'); 

    as.click(function(e) {
        let $this = $(this); 

        const next = $this.next('.aspys-link-confirm'); // does it already have a corresponding popup? 

        //console.log(next); 

        if (!next.length) { // if not, create one
            createPopup($this); 
        } 

        e.preventDefault(); // prevents the click from opening the link (the default behavior) 
        e.stopPropagation(); // prevents the event from propagating up the DOM tree
    })
} 