//var serverUrl = 'http://sifsv-80018.hsr.ch/Service/ChatService.asmx/';
var serverUrl = './Service/ChatService.asmx/';
(function($) {
    $.support.cors = true;

})(jQuery);

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