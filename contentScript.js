let emailDict = {'James Cartnal':'jcartnal@lcusd.net', 'Jamie Lewsadder':'jlewsadder@lcusd.net'} 
let trustedEmails = ['.*@lcusd.net', '.*@mylcusd.net']; 

let getNameEmail = function(element){
    let name = element.getAttribute('name')
    let email = element.getAttribute('email')
    checkEmail(element, name, email) 
} 

let checkEmail = function(element, name, email){
    if(name in emailDict){
        if(emailDict[name] == email){
            verified(element)
        }
        else{
            unVerified(element)
        }
    }
    else {
        for (let exp of trustedEmails) {
            let regex = new RegExp(exp); 
            
            if (regex.test(email)) {
                return verified(element); 
            } 
        } 
    } 
        /*
        //splits all the parts of the name
        let nameList = name.split(' '); 
        //part before the domain and the domain
        let [preDomain, domain] = email.split('@'); 
        
        //finds the first non-number element (since the pre-domain part has a number at the end) 
        let index = preDomain.length - 1; 
        
        for (; index >= 0 && !Number.isNaN(parseInt(preDomain[index])); index--) {} 
        
        //pre-domain without the number at the end
        let strippedPD = preDomain.slice(0, index + 1); 
        
        //name in first-last format
        let fLast = (name[0]+nameList[nameList.length - 1]).toLowerCase(); 
        
        //alert(strippedPD); 
        
        //stripped pre-domain should equal fLast and the domain should be a trusted domain
        if (strippedPD == fLast && trustedDomains.indexOf(domain) >= 0) {
            verified(); 
        } 
        */ 
}
let verified = function(){
    //alert('e'); 
    
    element.insertAdjacentHTML('beforeend', '<svg height="10pt" viewBox="0 0 512 512" width="10pt" xmlns="http://www.w3.org/2000/svg"><path d="m256 0c-141.164062 0-256 114.835938-256 256s114.835938 256 256 256 256-114.835938 256-256-114.835938-256-256-256zm0 0" fill="#2196f3"/><path d="m385.75 201.75-138.667969 138.664062c-4.160156 4.160157-9.621093 6.253907-15.082031 6.253907s-10.921875-2.09375-15.082031-6.253907l-69.332031-69.332031c-8.34375-8.339843-8.34375-21.824219 0-30.164062 8.339843-8.34375 21.820312-8.34375 30.164062 0l54.25 54.25 123.585938-123.582031c8.339843-8.34375 21.820312-8.34375 30.164062 0 8.339844 8.339843 8.339844 21.820312 0 30.164062zm0 0" fill="#fafafa"/></svg>')
}
let unVerified = function(){
    element.insertAdjacentHTML('beforeend', '<?xml version="1.0" encoding="iso-8859-1"?><svg version="1.1" id="Capa_1" height="10pt" width="10pt" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 511.999 511.999" style="enable-background:new 0 0 511.999 511.999;" xml:space="preserve"><path style="fill:#E50027;" d="M501.449,368.914L320.566,66.207C306.751,43.384,282.728,29.569,256,29.569	s-50.752,13.815-64.567,36.638L10.55,368.914c-13.812,23.725-14.113,51.954-0.599,75.678c13.513,23.723,37.836,37.838,65.165,37.838	h361.766c27.329,0,51.653-14.115,65.165-37.838C515.563,420.868,515.262,392.639,501.449,368.914z"/><path style="fill:#C1001F;" d="M502.049,444.592c-13.513,23.723-37.836,37.838-65.165,37.838H256V29.57	c26.727,0,50.752,13.815,64.567,36.638L501.45,368.915C515.262,392.639,515.563,420.868,502.049,444.592z"/><path style="fill:#FD003A;" d="M75.109,452.4c-16.628,0-30.851-8.27-39.063-22.669c-8.211-14.414-8.065-31.087,0.469-45.72	L217.23,81.549c8.27-13.666,22.816-21.951,38.769-21.951s30.5,8.284,38.887,22.157l180.745,302.49	c8.388,14.4,8.534,31.072,0.322,45.485c-8.211,14.4-22.435,22.669-39.063,22.669H75.109V452.4z"/><path style="fill:#E50027;" d="M436.891,452.4c16.628,0,30.851-8.27,39.063-22.669c8.211-14.414,8.065-31.087-0.322-45.485	L294.886,81.754c-8.388-13.871-22.933-22.157-38.887-22.157V452.4H436.891z"/><path style="fill:#E1E4FB;" d="M286.03,152.095v120.122c0,16.517-13.514,30.03-30.03,30.03s-30.031-13.514-30.031-30.03V152.095	c0-16.517,13.514-30.031,30.031-30.031S286.03,135.578,286.03,152.095z"/><path style="fill:#C5C9F7;" d="M286.03,152.095v120.122c0,16.517-13.514,30.03-30.03,30.03V122.064	C272.516,122.064,286.03,135.578,286.03,152.095z"/><path style="fill:#E1E4FB;" d="M256,332.278c-24.926,0-45.046,20.119-45.046,45.046c0,24.924,20.119,45.046,45.046,45.046	s45.046-20.121,45.046-45.046C301.046,352.398,280.925,332.278,256,332.278z"/><path style="fill:#C5C9F7;" d="M301.046,377.323c0,24.924-20.119,45.046-45.046,45.046v-90.091	C280.925,332.278,301.046,352.398,301.046,377.323z"/><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>')
}

alert('start'); 

$(this).ready(function() {
    alert('start of ready'); 
    
    $('span.gD').on('load', function(e) {
        alert('e'); 

        element = e.currentTarget; 

        getNameEmail(element); 
    }); 
    
    $('span.gD').trigger('load'); 
    
    alert('end of ready'); 
}); 

const callback = function(record, observer) {
    const target = record.target; 
    
    if (record.type === 'attributes') {
        if (record.attributeName === 'name' || record.attributeName === 'email') {
            getNameEmail(target); 
        } 
    } 
    
    /*
    if (record.type === 'childList') {
        const removed = record.removedNodes; 

        for (let element of removed) {
            if (element.extensionSymbol) {
                getNameEmail(target); 
            } 
        } 
    } else if (record.type
    */ 
} 

const observer = new MutationObserver(callback); 

//waitForKeyElements('span.gD', getNameEmail)