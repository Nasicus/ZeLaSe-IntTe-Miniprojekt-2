$(document).delegate("#channel", "pagecreate", function () {
    loadChannels();
    var token;
    var channelName;
    function loadChannels() {
        //setTimeout(loadChannels, 5000);
        $.ajax({
            type: "POST",
            url: serverUrl + "playerToken="+token+"&channelName="+channelName,
            dataType: "xml",
            success: function (xml) {
                
            }
        });
    }
});