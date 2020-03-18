"use strict"

class LinearPages {

    constructor() {
        this.endAction = function() { console.log("endAction") }
        this.index = 0
    }

    static setButtons(pages) {
        $("#prev-page").click(function() {
            pages.prevPage()
        })
        $("#next-page").click(function() {
            pages.nextPage()
        })
    }

    load() {
        this.setPage()
        LinearPages.setButtons(this)
    }

    setPage() {
        this.hidePages()
        let pages = $(".linear-page")
        let i = this.index
        if (i < pages.length) {
            $(pages[i]).removeClass("hidden")

            if (i == 0) {
                $("#prev-page").css("visibility", "hidden")
            } else {
                $("#prev-page").css("visibility", "visible")
            }

            if (pages[i-1]) {
                $("#prev-page>span").html($(pages[i-1]).find(".page-title").html())
            } else {
                $("#prev-page>span").html("")
            }
            if (pages[i+1]) {
                console.log("set next button html")
                $("#next-page>span").html($(pages[i+1]).find(".page-title").html())
            } else {
                $("#next-page>span").html("")
            }

        } else {
            this.endAction()
        }
    }

    nextPage() {
        this.index++
        this.setPage()
    }

    prevPage() {
        if (this.index > 0) {
            this.index--
            this.setPage()
        }
    }

    hidePages() {
        for (let page of $(".linear-page")) {
            $(page).addClass("hidden")
        }
    }
}