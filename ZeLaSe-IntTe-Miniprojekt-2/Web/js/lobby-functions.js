$(document).delegate("#lobby", "pagecreate", function () {
    var errorField = $("#errorLobby");
    var playerToken = "";
    var shouldPollForNewChatRooms = true;
    
    $(document).delegate("#lobby", "pagebeforehide", pageBeforeHideFunction);
    $(document).delegate("#lobby", "pagebeforeshow", pageBeforeShowFunction);
    
    

    $("#createChannel").bind("click", function () {
        var username = checkUserName($("#username"));
        if (username == '')
            return false;
        setPlayerToken();
        if (playerToken == '')
            showError("No player token - lol shouldnt happen, maybe server down");
        var newChannel = createChannel($("#newChannel"));
        if (newChannel == '')
            return false;
        hideError();
        $.mobile.changePage("#chat?username=" + username + "&playerToken=" + playerToken + "&channel=" + newChannel, { transition: "slide" });
    });
    
    function setPlayerToken() {
        if (playerToken != '') return;
        $.ajax({
            type: "POST",
            url: serverUrl + "Connect",
            dataType: "xml",
            async: false,
            success: function (xml) {
                playerToken = $(xml).find("string").text();
            }
        });
    }

    function createChannel(newChannel) {
        if (newChannel.val().trim() == '') {
            showError("You MUST enter a channel, faggot!");
            return '';
        }
        var newChannelName = '';
        $.ajax({
            type: "POST",
            url: serverUrl + "CreateChannel",
            dataType: "xml",
            async: false,
            data: { playerToken: playerToken, channelName: newChannel.val() },
            success: function (xml) {
                newChannelName = $(xml).find("string").text();
            }
        });
        if (newChannelName != '')
            return newChannelName;
        showError("Some Error happend on creating channel, try again");
        return '';
    }
    
    function loadChannels() {
        if (shouldPollForNewChatRooms) {
            setTimeout(loadChannels, 5000);
            $.ajax({
                type: "POST",
                url: serverUrl + "GetChats ",
                dataType: "xml",
                success: function (xml) {
                    var channels = $('ul:jqmData(role="listview")');
                    channels.find("li:gt(0)").remove();
                    $(xml).find("Chat").each(function () {
                        var chatName = $(this).find('Name').text();
                        var chatId = $(this).find('Id').text();
                        var numberOfPlayers = $(this).find('Players').find('Player').size();
                        channels.append('<li data-theme="c" id="' + chatId + '"><a href="#chat" data-transition="slide">' + chatName + ' (' + numberOfPlayers + ')</a></li>').listview("refresh");
                    });
                    channels.trigger("create");
                }
            });
        }
    }

    function checkUserName(newUserName) {
        if (newUserName.val().trim() == '') {
            showError("You MUST enter a username, faggot!");
            return '';
        }
        var isUnique = false;
        $.ajax({
            type: "POST",
            url: serverUrl + "IsNameUnique",
            data: { name: newUserName.val() },
            dataType: "xml",
            async: false,
            success: function (xml) {
                isUnique = ("true" == $(xml).find("boolean").text());
            }
        });
        if (isUnique)
            return newUserName.val();
        showError("Your username is already taken idiot");
        return '';
    }

    function showError(text) {
        errorField.text(text);
        errorField.css("display", "block");
    }

    function hideError() {
        errorField.css("display", "none");
    }
    
    function pageBeforeHideFunction() {
        shouldPollForNewChatRooms = false;
    }
    
    function pageBeforeShowFunction() {
        shouldPollForNewChatRooms = true;
        loadChannels();
    }
});



