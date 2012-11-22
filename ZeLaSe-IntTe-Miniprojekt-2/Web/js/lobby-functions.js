$(document).delegate("#lobby", "pagecreate", function () {
    var errorField = $("#errorLobby");
    loadChannels();
    
    function loadChannels() {
        //setTimeout(loadChannels, 5000);
        $.ajax({
            type: "POST",
            url: serverUrl + "GetChats ",
            dataType: "xml",
            success: function (xml) {
                var channels = $("#availableChannels");
                channels.html("");
                $(xml).find("Chat").each(function () {
                    var chatName = $(this).find('Name').text();
                    var chatId = $(this).find('Id').text();
                    var numberOfPlayers = $(this).find('Players').find('Player').size();
                    var a = $('ul:jqmData(role="listview")');
                    a.append('<li data-theme="c" id="' + chatId + '"><a href="#chat" data-transition="slide">' + chatName + ' (' + numberOfPlayers + ')</a></li>').listview("refresh");
                });
                channels.trigger("create");
            }
        });
    }

    function checkUserName() {
        var username = $("#username");
        if (username.val().trim() == '') {
            showError("You MUST enter a username, faggot!");
            return false;
        }
        var isUnique = false;
        $.ajax({
            type: "POST",
            url: serverUrl + "IsNameUnique",
            data: { name: username.val() },
            dataType: "xml",
            async: false,
            success: function (xml) {
                isUnique = "true" == $(xml).find("boolean").text();
            }
        });
        return isUnique;
    }
    
    function showError(text) {
        errorField.text(text);
        errorField.css("display", "block");
    }

    function hideError() {
        errorField.css("display", "none");
    }
    
    $("#createChannel").bind("click", function () {
        var username = $("#username");
        if (!checkUserName())
            return false;
        $.mobile.changePage("#chat?username=" + username.val(), { transition: "slide" });
    });
    

});
