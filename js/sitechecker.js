"use strict";

class SiteChecker {

    constructor() {
        this.currentDomain = ""
        this.currentRank = -1
    }

    update(tab) {
        this.setPageRating(-1)
        var tabDomain = domain(tab);
        if (!tabDomain || !tabDomain.includes(".")) {
            chrome.browserAction.setBadgeText({text:'', tabId:tab.id})
            chrome.browserAction.disable(tab.id)
        } else if (this.currentDomain || this.currentDomain != tabDomain) {
            this.currentDomain = tabDomain
            loadPageRating(tabDomain)
        }
   }

   setPageRating(r) {
       this.currentRank = r
       if (r < 0) {
        chrome.browserAction.setBadgeBackgroundColor({color:"#444444"});
        chrome.browserAction.setBadgeText({text:"?"});
       } else if (r < 3) {
        chrome.browserAction.setBadgeBackgroundColor({color:"#dd2244"});
        chrome.browserAction.setBadgeText({text:"!"});
       } else if (r >= 3) {
        chrome.browserAction.setBadgeBackgroundColor({color:"#00bb66"});
        chrome.browserAction.setBadgeText({text:"✓"});
       }
   }

}
const siteChecker = new SiteChecker()

function domain(tab) {
	try {
		var tmp = new URL(tab.url);
		return tmp.hostname;
	}
	catch (error) {
		console.log("Invalid URL");
	}
	return "";
    //return getDomain(tab.url, false)
}
/*
function getDomain(url, subdomain) {
    subdomain = subdomain || false;
    url = url.replace(/(https?:\/\/)?(www.)?/i, '');
    if (!subdomain) {
        url = url.split('.');
        url = url.slice(url.length - 2).join('.');
    }
    if (url.indexOf('/') !== -1) {
        return url.split('/')[0];
    }
    return url;
}
*/

function loadPageRating(domain) {
    if (config['top-domains'].includes(domain)) {
        console.log('top')
        siteChecker.setPageRating(10)
    } else {
        requestPageRank(domain)
    }
}

function requestPageRank(domain) {
    let request = $.ajax({
        type: "GET",
        url: "https://openpagerank.com/api/v1.0/getPageRank",
        headers: {
            "API-OPR": config['openpagerank-api-key']
        },
        data: $.param({domains: [domain]})
    })
    request.done(function( msg ) {
        let data = msg.response[0]
        console.log(data)
        let r = data.page_rank_decimal
        siteChecker.setPageRating(r === '' ? -1 : r)
    })
    request.fail(function( jqXHR, textStatus ) {
        siteChecker.setPageRating(-1)
        console.log("Error from requestPageRank")
        console.log(jqXHR)
    })
}
