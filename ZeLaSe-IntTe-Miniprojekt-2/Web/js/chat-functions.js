$(document).delegate("#chat", "pageinit", function () {
    var playerToken;
    var username;
    var channel;
    var shouldPollForNewMessages = true;

    $(document).delegate("#chat", "pagebeforehide", pageBeforeHideFunction);
    $(document).delegate("#chat", "pagebeforeshow", pageBeforeShowFunction);
    $("#chatMessageInput").bind('keypress', function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) { //Enter keycode
            sendChatMessage();
        }
    });
    
    $("#sendchatmessagebutton").bind("click", sendChatMessage);
    $("#leaveChatButton").bind("click", leaveChat);
    $('#chatmessages').autosize();

    function leaveChat() {
        $.ajax({
            type: "POST",
            url: serverUrl + "LeaveChat",
            data: '{"playerToken": "'+playerToken+'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) { }
        });
    }

    function sendChatMessage() {
        var message = $("#chatMessageInput").val();
        if (message == "") 
            return;
        $.ajax({
            type: "POST",
            url: serverUrl + "WriteLine",
            data: '{"playerToken": "'+playerToken+'","text" : "'+message+'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function(xml) {
                $("#chatMessageInput").val("");
            }
        });
    }

    function setUserlabel() {
        $("#userchatnamelabel").text("Enter your message(" + username + " says)");
    }

    
    function startChatroomPolling() {
        if (shouldPollForNewMessages) {
            setTimeout(startChatroomPolling, 1000);
            $.ajax({
                type: "POST",
                url: serverUrl + "GetChat",
                data: '{ "chatId": "'+channel+'" }',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (response) {
                    response = response.d;
                    $("#chatnamelabel").text(response.Name);
                    
                    var newChatHistory = "";
                    for (var i = response.ChatLines.length-1; i >= 0; i--) {
                        newChatHistory += response.ChatLines[i].Player.PlayerName + " said: " + response.ChatLines[i].Text + "\n";
                    }
                    
                    $("#chatmessages").val(newChatHistory);
                    $("#chatmessages").trigger("autosize");
                }
            });
        }
    }

    function joinChat() {
        $.ajax({
            type: "POST",
            url: serverUrl + "JoinChat",
            data: '{"playerToken": "' + playerToken + '","chatId": "' + channel + '","userName": "' + username + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (xml) {}
        });
    }


    function pageBeforeHideFunction() {
        shouldPollForNewMessages = false;
        playerToken = null;
        username = null;
        channel = null;
    }

    function pageBeforeShowFunction() {
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
        setUserlabel();
        
        shouldPollForNewMessages = true;
        startChatroomPolling();
    }
});