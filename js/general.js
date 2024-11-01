jQuery(document).ready(function () {
			jQuery("#apparel_settings").submit(function(){
				if(jQuery("#wc_shirtshopper_clientname").val() == ''){
						alert("Please enter Client Name.");
						return false;
				}
				if(jQuery("#wc_shirtshopper_sitekey").val() == ''){
						alert("Please enter Site Key.");
						return false;
				}
				eraseCookie('login_sessionid');
			});
			jQuery("#register").click(function(){
				jQuery('#registerModal').modal('show');
			});
			
});

function saveRegister(){

	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;	
	if(jQuery("#register_clientname").val() == ''){
		alert("Please enter Client Name.");
	}
	else if(jQuery("#register_siteurl").val() == ''){
			alert("Please enter Site URL.");
	}	
	else if(jQuery("#register_contactname").val() == ''){
			alert("Please enter Contact Name.");
	}
	else if(jQuery("#register_city").val() == ''){
			alert("Please enter City.");
	}
	else if(jQuery("#register_state").val() == ''){
			alert("Please enter State.");
	}
	else if(jQuery("#register_emailaddress").val() == ''){
			alert("Please enter Email Address.");
	}
	else if(!filter.test(jQuery("#register_emailaddress").val())){
			alert("Please enter valid Email Address.");
	}
	else{
	
 loadStart();
var xml = "<request><clientname>" + jQuery("#register_clientname").val() + "</clientname><siteurl>" + jQuery("#register_siteurl").val() + "</siteurl><contactname>" + jQuery("#register_contactname").val() + "</contactname><city>" + jQuery("#register_city").val() + "</city><state>" + jQuery("#register_state").val() + "</state><emailaddress>" + jQuery("#register_emailaddress").val() + "</emailaddress></request>";
jQuery.ajax({
type: "POST",
url: url + "/AdminAPI.svc/Register",
contentType: "application/json; charset=utf-8",
data: JSON.stringify(jQuery.xml2json(xml)),
dataType: "json",
success: function (response) {
var r = response.RegisterResult;
	if (r.isSuccessful == false) {
		checkError(r, "saveRegister()");
		loadEnd();
	}
	else {
			 var data = eval(r.Data);
			 var sitekey = data[1];
			jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			data:{
				action : 'general_apparel_settings',
				clientname : jQuery("#register_clientname").val(),
				sitekey : sitekey
			},
			dataType: "json",
			success: function (response) {
				window.location.href = "admin.php?page=shirt_shopper";
			}});
			 
	}
	
},
error: function (xhr, ajaxOptions, thrownError) {
	alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
	loadEnd();
}});


	}
}