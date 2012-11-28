var serverUrl = 'http://localhost:64291/Service/ChatService.asmx/';
//var serverUrl = './Service/ChatService.asmx/';
$(document).ready(function () {
    $.support.cors = true;

    $(".logoutForm").bind("click", function () {
        if (isLoggedIn()) {
            $.mobile.changePage("#chat");
            showVisibleContent();
        }
    });
});

//For persistent footer
$('[data-role=page]').live('pageshow', function (event, ui) {

    $("#" + event.target.id).find("[data-role=footer]").load("footer.html", function () {
    });
});

//For parameters
$(document).bind("pagebeforechange", function (event, data) {
    $.mobile.pageData = (data && data.options && data.options.pageData)
        ? data.options.pageData
        : null;
});

function isLoggedIn() {
    var loggedIn = false;
    $.ajax({
        type: "POST",
        url: serverUrl + "IsLoggedIn",
        data: '{ }',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            loggedIn = response.d;
        }
    });
    return loggedIn;
}

function showVisibleContent() {
    if(isLoggedIn()) {
        $(".loginForm").hide();
        $(".logoutForm").show();
    }
    else {
        $(".loginForm").show();
        $(".logoutForm").hide();
    }
}