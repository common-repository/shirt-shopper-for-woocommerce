var url = "http://api.thetshirtguylv.com";
//var url = "http://localhost:27932";
var sessionid;

String.prototype.formatDate = function () {
    var d = new Date(parseInt(this.substr(6)));
    var o = d.getTimezoneOffset() / 60;
    var h = d.getHours();
    d.setHours(h - o);
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return ((d.getMonth() + 1).pad() + '/' + (d.getDay() + 1).pad() + '/' + d.getFullYear() + ' ' + hours.pad() + ':' + minutes.pad() + ' ' + ampm);
}
Number.prototype.pad = function () {
    if (this.toString().length == 1)
        return ('0' + this);
    else
        return (this);
}
function createCookie(name, value, minutes) {
    var expires;

    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}
function eraseCookie(name) {
    createCookie(name,"",-1);
}



function loadStart() {
	if(jQuery('#loadscreen').length == 0) {
		jQuery('body').append('<div id="loadscreen"><div class="loadscreen-loading"><div></div></div></div>');
	}
	
	jQuery('#loadscreen').fadeIn();
}

function loadEnd() {
	jQuery('#loadscreen').fadeOut();
}
function loadFilterStart() {
	jQuery('#filterLoading').fadeIn();
}

function loadFilterEnd() {
	jQuery('#filterLoading').fadeOut();
}


function callEval(para){
  eval(para);
}
function checkError(r, called_function) {
	if (r.ErrorNumber == "102.013")
	    userLogin(called_function);
	else
	    alert(r.ErrorDescription + "(" + r.ErrorNumber + ")");
}
function userLogin(called_function) {
	loadStart();
    var xml = '<request><clientname>'+$_cn+'</clientname><sitekey>'+$_sk+'</sitekey><username>'+$_un+'</username></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/UserLogin",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.UserLoginResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                sessionid = r.SessionID;
				createCookie('login_sessionid',sessionid,30);
                callEval(called_function);
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function userFilterLogin(called_function) {
	loadFilterStart();
    var xml = '<request><clientname>'+$_cn+'</clientname><sitekey>'+$_sk+'</sitekey><username>'+$_un+'</username></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/UserLogin",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.UserLoginResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                sessionid = r.SessionID;
				createCookie('login_sessionid',sessionid,30);
                callEval(called_function);
            }
			
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadFilterEnd();
        }
    });
}
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};