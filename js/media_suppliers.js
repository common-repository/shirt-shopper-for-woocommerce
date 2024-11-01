var SUPPLIERS = [];
function SubscribedSuppliers() {
	loadStart();
    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetSubscribedMediaSuppliers",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetSubscribedMediaSuppliersResult;
            if (r.isSuccessful == false) {
               checkError(r, "SubscribedSuppliers()");
                return;
            }
            else {
                jQuery("#tblSuppliers > tbody").html("");
                var data = eval(r.Data);

                SUPPLIERS = data[0];
                var SUBSCRIBED = data[1];
                for (var i = 0; i < SUBSCRIBED.length; i++) {
                    var s = SUBSCRIBED[i];
                    jQuery("#tblSuppliers").append("<tr><td>" + s.Name + "</td><td>" + s.ModifyBy + "</td><td>" + s.ModifyOn.formatDate() + "</td><td><a href='javascript:deleteSubscribedMediaSupplier(" + s.ID + ");'>Remove</a></td></tr>");
                }
				
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}

function deleteSubscribedMediaSupplier(id) {
	loadStart();
    if (sessionid == undefined)
        sessionid = '';
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + id + "</id></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteSubscribedMediaSupplier",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteSubscribedMediaSupplierResult;
            if (r.isSuccessful == false) {
               checkError(r, "deleteSubscribedMediaSupplier("+id+")");
            }
            else {
                SubscribedSuppliers();
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}


function SubscribedInnerSuppliers() {
	loadStart();
    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetSubscribedMediaSuppliers",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetSubscribedMediaSuppliersResult;
            if (r.isSuccessful == false) {
                checkError(r, "SubscribedInnerSuppliers()");
                return;
            }
            else {
                var data = eval(r.Data);
				SUPPLIERS = data[0];
                jQuery('#cbxsupplier').empty();
                for (var i = 0; i < SUPPLIERS.length; i++) {
                    var s = SUPPLIERS[i];
                    jQuery('#cbxsupplier').append(jQuery("<option></option>").attr("value", s.ID).text(s.Name));
                }				
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function addSubscribedMediaSupplier(id) {
    if (sessionid == undefined)
        sessionid = '';
    if (id == undefined)
        id = 0;
    var xml = "<request><sessionid>" + sessionid + "</sessionid><mediasupplierid>" + jQuery("#cbxsupplier").val() + "</mediasupplierid><id>" + id + "</id></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveSubscribedMediaSupplier",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveSubscribedMediaSupplierResult;
            if (r.isSuccessful == false) {
               checkError(r, "addSubscribedMediaSupplier("+id+")");
            }
            else {
                window.location.href = "admin.php?page=color_palettes&section=section-1";
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}