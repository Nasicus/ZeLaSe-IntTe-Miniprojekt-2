$(document).delegate("#chat", "pageinit", function () {


    var playerToken;
    var username;
    var channel;
    if ($.mobile.pageData && $.mobile.pageData.username) {
        username = $.mobile.pageData.username;
       
    } else {
        //window.location.href = "http://google.com"
    }
    if ($.mobile.pageData && $.mobile.pageData.playerToken) {
        playerToken = $.mobile.pageData.playerToken;

    } if ($.mobile.pageData && $.mobile.pageData.channel) {
        channel = $.mobile.pageData.channel;
    }

    joinChat();

    setUserlabel(username);
    setChatroomlabel(channel);

    
    


    function setUserlabel() {
        $("#userchatnamelabel").text("Enter your message(" + username + " says)");
    }

    function setChatroomlabel(channel) {
        if ($.mobile.pageData && $.mobile.pageData.channel) {
            $.ajax({
                type: "POST",
                url: serverUrl + "GetChat",
                data: { chatId: channel },
                dataType: "xml",
                async: false,
                success: function (xml) {
                    $("#chatnamelabel").text($(xml).find("Name").text());
                }
            });
        }
    }

    function joinChat() {
        $.ajax({
            type: "POST",
            url: serverUrl + "joinChat",
            data: {
                playerToken: playerToken,
                chatId: channel,
                userName: username
            },
            dataType: "xml",
            async: false,
            success: function (xml) {}
        });
    }
});