var info = {};

function setUserGlobals(data) {
  console.log('info getting set', data);
  info = data;
}

$(function () {
  $(".connect-button-link").click(function (e) {
    e.preventDefault();
    showHiddenConnectors();
  });

  $('#showToken').click(function(e) {
    var field = $('#apiToken');
    var error = field.siblings('.error');

    error.fadeOut('fast');
    $.getJSON('/users/me/apiToken', function(data) {
      field.val(data.apiToken);
    }).error(function(response) {
      error.text('Error: ' + response.responseText).fadeIn('fast');
    });
  });

  if (info.optin === 'false') {
    $('#settings_analytics_optedout').removeClass('hidden');
    $('#settings_analytics').addClass('hidden');
  }

  $("#resetToken").click(function(e) {
    $.jsonp({url : info.externalHost + '/users/me/resetApiToken',
      callbackParameter : 'callback',
      error : function (xopts, status) {
        if (console && console.error) console.error('Uhoh: ' + status);
      },
      success : function (json, status) {
                  $("#apiToken").val(json.apiToken);
                }
    });
  });

  $('.synclets-list').delegate('.oauthLink','click', function(evt) {
    // Google custom event for tracking when new services are created
    window.parent._gaq.push(['_trackEvent', 'Locker', 'Add Service', $(evt.currentTarget).data('provider')]);
    Locker.connectService(evt);
  });

  $('body').delegate('input[name=optout]', 'click', function (e) {
    $('#settings_analytics').addClass('hidden');
    $('#settings_analytics_optedout').removeClass('hidden');
  });

  $('input[name=username]').val(info.name);
  $('input[name=email]').val(info.email);

  var validate = $('#settings-account').validate({
    rules : {
      username : {required  : true, minlength : 2},
      email : {required : true, email : true},
      old_password : {minlength : 6},
      new_password : {minlength : 6}
            },
      messages : {
        username : {required  : "We need to know what to call you, hoss.",
        minlength : "At least 2 characters are necessary."},
        email : {required : "Your email address is also how you sign in. Required!"},
        old_password : {minlength : "At least 6 characters are necessary."},
        new_password : {minlength : "At least 6 characters are necessary."}
      },
      submitHandler : function (form) {
                        var email       = $('#email').val();
                        var username    = $('#username').val();
                        var oldPassword = $('#old_password').val();
                        var newPassword = $('#new_password').val();
                        var optout      = $('#optout').is(':checked') ? true : undefined;

                        // There are two pieces to saving this farrago of stuff:
                        //
                        // 1. change passwords, if they've been passed in
                        if (oldPassword && newPassword) {
                          var passwordUrl = info.externalHost + '/users/changePassword';
                          $.jsonp({url : passwordUrl,
                            callbackParameter : 'callback',
                            data : {old_password : oldPassword,
                              new_password : newPassword},
                            error : function (xopts, status) {
                              if (console && console.error) console.error(status + ': from url ' + xopts.url);
                              $('#settings_account_error').text('Password change failed. Perhaps you entered your old password incorrectly?');
                            },
                            success : function (json, status) {
                                        $('#settings_account_error').text('Your password was successfully changed.');
                                      }});
                        }

                        // 2. Save the rest of the settings to Integral.
                        var settingsUrl = info.externalHost + '/users/updateSettings';
                        $.jsonp({url : settingsUrl,
                          callbackParameter : 'callback',
                          data : {username : username,
                            email : email,
                          optout : optout},
                          error : function (xopts, status) {
                            $('#settings_account_error').text('Unable to update your settings.');
                          },
                          success : function (json, status) {
                                      $('#settings_account_error').text('Updated your settings.');
                                    }
                        });
                      }
  });

  var validateOAuthForm = $('#').validate({});

  showAllConnectors();
});

var showHiddenConnectors = function () {
  $(".hideable").fadeIn();
};

var showAllConnectors = function () {
  $(".synclets-list li").fadeIn();
};
