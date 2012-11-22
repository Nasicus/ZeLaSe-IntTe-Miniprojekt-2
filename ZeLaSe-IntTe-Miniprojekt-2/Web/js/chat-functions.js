$(document).delegate("#chat", "pageinit", function () {

    if ($.mobile.pageData && $.mobile.pageData.username) {
        console.log("Parameter username=" + $.mobile.pageData.username);
    }    
});