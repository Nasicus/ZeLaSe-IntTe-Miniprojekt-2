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
            data: {playerToken: playerToken},
            dataType: "xml",
            async: false,
            success: function (xml) { }
        });
    }

    function sendChatMessage() {
        var message = $("#chatMessageInput").val();
        if (message == "") {
           alert('stop homo please');
       } else {
           $.ajax({
               type: "POST",
               url: serverUrl + "WriteLine",
               data: {
                   playerToken: playerToken,
                   text:message
               },
               dataType: "xml",
               async: false,
               success: function(xml) {
                   $("#chatMessageInput").val("");
               }
           });
       }
    }

    function setUserlabel() {
        $("#userchatnamelabel").text("Enter your message(" + username + " says)");
    }

    
    function startChatroomPolling() {
        if (shouldPollForNewMessages) {
            setTimeout(startChatroomPolling, 100);
            $.ajax({
                type: "POST",
                url: serverUrl + "GetChat",
                data: { chatId: channel },
                dataType: "xml",
                async: false,
                success: function (xml) {
                    $("#chatnamelabel").text($(xml).find("Name").text());
                    
                    var newChatHistory ="";
                    $($(xml).find("ChatLine").get().reverse()).each(function () {
                        newChatHistory += $(this).find("Player").find("PlayerName").text() + " said : " + $(this).find("Text").text()+"\n";
                    });
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