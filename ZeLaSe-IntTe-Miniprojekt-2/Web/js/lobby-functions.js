$(document).delegate("#lobby", "pagecreate", function () {
    $(document).delegate("#lobby", "pagebeforehide", pageBeforeHideFunction);
    $(document).delegate("#lobby", "pagebeforeshow", pageBeforeShowFunction);

    var errorField = $("#errorLobby");
    var playerToken = "";
    var username = "";
    var shouldPollForNewChatRooms = true;
    
    $("#username").bind('keyup', function (e) {
        //checkUserName($("#username"), false);
    });

    $('#login').on("submit",
    function (event) {
        errorField.text("");
        if (login($("#loginname").val(), $("#loginpassword").val()) == true) {
            $('#loginDiv').hide();
            return true;
        } else {
            showError("There is no User " + $("#loginname").val() + " registered");
            return false;
        }
    });
    
    $("#createChannel").bind("click", function () {
        if (isLoggedIn()) {
            var newChannel = createChannel($("#newChannel"));
            if (newChannel == '')
                return;
            hideError();
            $.mobile.changePage("#chat?username=" + username + "&playerToken=" + playerToken + "&channel=" + newChannel, { transition: "slide" });
        } else {
            showError("You are not logged in");
        }
    });

    $("#register").bind("click", function () {
        $.mobile.changePage("#registerPage", { transition: "slide" });
    });

    function login(loginname, password) {
        $.ajax({
            type: "POST",
            url: serverUrl + "Login",
            dataType: "xml",
            async: false,
            data: { playername: loginname, password: password },
            success: function (xml) {
                playerToken = $(xml).find("string").text();
                username = loginname;
            }
        });
        if (playerToken == '') {
            return false;
        }
        return true;
    }


    function reBind() {
        $('#availableChannels li').bind("click", function () {
            if (isLoggedIn()) {
                var newChannel = createChannel($("#newChannel"));
                if (newChannel == '')
                    return;
                hideError();
                $.mobile.changePage("#chat?username=" + username + "&playerToken=" + playerToken + "&channel=" + $(this).attr("id"), { transition: "slide" });
            } else {
                showError("You are not logged in");
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
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            data: '{ "playerToken": "' + playerToken + '", "channelName": "' + newChannel.val() + '" }',
            success: function (response) {
                newChannelName = response.d;
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
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    response = response.d;
                    var channels = $('ul:jqmData(role="listview")');
                    channels.find("li:gt(0)").remove();
                    for (var i = 0; i < response.length; i++) {
                        var chatName = response[i].Name;
                        var chatId = response[i].Id;
                        var numberOfPlayers = response[i].Players.length;
                        channels.append('<li data-theme="c" id="' + chatId + '" data-transition="slide"><a href="#">' + chatName + ' (' + numberOfPlayers + ')</a></li>').listview("refresh");
                    }

                    channels.trigger("create");
                    reBind();
                }
            });
        }
    }

    //function checkUserName(newUserName, checkIfIsEmpty) {
    //    if (checkIfIsEmpty && newUserName.val().trim() == '') {
    //        showError("You MUST enter a username, faggot!");
    //        return '';
    //    }
    //    var isUnique = false;
    //    $.ajax({
    //        type: "POST",
    //        url: serverUrl + "IsNameUnique",
    //        data: '{ "name": "' + newUserName.val() + '" }',
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        async: false,
    //        success: function (response) {
    //            isUnique = response.d;
    //        }
    //    });
    //    if (isUnique) {
    //        hideError();
    //        return newUserName.val();
    //    }
    //    showError("Your username is already taken idiot");
    //    return '';
    //}

    function isLoggedIn() {
        var loggedIn = false;
        $.ajax({
            type: "POST",
            url: serverUrl + "IsLoggedIn",
            dataType: "xml",
            async: false,
            success: function (xml) {
                loggedIn = ("true" == $(xml).find("boolean").text());
            }
        });
        return loggedIn;
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
        if (isLoggedIn()) {
            $('#loginDiv').hide();
        }
        shouldPollForNewChatRooms = true;
        loadChannels();
    }
});



