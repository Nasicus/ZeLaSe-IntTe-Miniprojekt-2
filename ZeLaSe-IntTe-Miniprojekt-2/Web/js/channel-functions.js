$(document).delegate("#channel", "pagecreate", function () {
    var token;
    var channelName;
    function createChannel() {
        $.ajax({
            type: "POST",
            url: serverUrl + "playerToken="+token+"&channelName="+channelName,
            dataType: "xml",
            success: function (xml) {
                
            }
        });
    }
});