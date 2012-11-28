$(document).delegate("#registerPage", "pagecreate", function () {
    $(document).delegate("#registerPage", "pagebeforehide", pageBeforeHideFunction);
    $(document).delegate("#registerPage", "pagebeforeshow", pageBeforeShowFunction);
    var errorField = $("#errorRegistration");

    $('#registerForm').on("submit",
    function (event) {
        event.preventDefault();
        event.stopPropagation();
        errorField.text("");
        if (checkUserName($("#requestedUsername")) == false || checkPassword($("#password"), $("#password_v")) == false) {
            showError();

        } else if(createUser($("#requestedUsername").val(), $("#password").val())) {
            hideError();            
            $("#leaveRegistration").click();
        }
        else {
            showError("Internal Server Error");          
        }
    });

    function createUser(username, password) {
        var playerId = '';
        $.ajax({
            type: "POST",
            url: serverUrl + "CreatePlayer",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            data: '{ "playername": "' + username + '", "password": "' + password + '" }',
            success: function (response) {
                playerId = response.d;
            }
        });
        return playerId;
    }

    function checkUserName(newUserName) {
        if (newUserName.val().trim() == '') {
            addError("You MUST enter a username, faggot!");
            return false;
        }
        var isUnique = false;
        $.ajax({
            type: "POST",
            url: serverUrl + "IsNameUnique",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            data: '{ "name": "' + newUserName.val() + '" }',
            success: function (response) {
                isUnique = response.d;
            }
        });
        if (isUnique) {
            hideError();
            return true;
        }
        addError("Your username is already taken idiot");
        return false;
    }

    function checkPassword(password, password_v) {
        if (password.val().trim() == '') {
            addError("You must enter a Password");
            return false;
        }
        if (password_v.val().trim() == '') {
            addError("You must enter a Confirmation Password");
            return false;
        }
        if (password_v.val() != password.val()) {
            addError("The Confirmation Password is not the same as the Password");
            return false;
        }
        return true;
    }

    function addError(errorMessage) {
        errorField.text(errorField.text() + '\n' + errorMessage);
    }

    function showError() {
        errorField.css("display", "block");
    }

    function hideError() {
        errorField.css("display", "none");
    }

    function pageBeforeHideFunction() {
    }

    function pageBeforeShowFunction() {
    }
});