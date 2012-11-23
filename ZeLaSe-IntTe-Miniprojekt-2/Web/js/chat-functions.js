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

    setUserlabel();
    setupChatroomdata();
    $("#sendchatmessagebutton").bind("click", sendChatMessage);
    $("#leaveChatButton").bind("click", leaveChat);


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
               success: function (xml) {}
           });
       }
    }

    function setUserlabel() {
        $("#userchatnamelabel").text("Enter your message(" + username + " says)");
    }

    
    function setupChatroomdata() {
        //setTimeout(setupChatroomdata(), 5000);
        
        $.ajax({
            type: "POST",
            url: serverUrl + "GetChat",
            data: { chatId: channel },
            dataType: "xml",
            async: false,
            success: function(xml) {
                $("#chatnamelabel").text($(xml).find("Name").text());
                $(xml).find("ChatLine").each(function() {
                    alert($(this).find("Player").find("PlayerName") + " said : " + $(this).find("Text").text());
                });

            }
        });
        
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
});