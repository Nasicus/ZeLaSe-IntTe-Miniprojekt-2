$(document).delegate("#lobby", "pagecreate", function () {
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
                    channels.append('<p><a href="#chat" id="' + chatId + '" data-role="button">' + chatName + ' (' + numberOfPlayers + ')</a></p>');
                });
                channels.trigger("create");
            }
        });
    }
});


