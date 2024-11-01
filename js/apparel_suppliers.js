var brandcolors = [];
var SUPPLIERS = [];
function SubscribedSuppliers() {
	loadStart();
    var xml = "<request><sessionid>" + sessionid + "</sessionid></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetSubscribedApparelSuppliers",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetSubscribedApparelSuppliersResult;
            if (r.isSuccessful == false) {
                checkError(r, "SubscribedSuppliers()");
                return;
            }
            else {
                jQuery("#tblSuppliers > tbody").html("");
                var data = eval(r.Data);

                SUPPLIERS = data[0];
                var SUBSCRIBED = data[1];
                var aSub = new Array();
				for (var i = 0; i < SUBSCRIBED.length; i++) {
                    var s = SUBSCRIBED[i];
					aSub[s.ApparelSupplierID]=s;
				}
			   for (var i = 0; i < SUPPLIERS.length; i++) {
                   var d = SUPPLIERS[i];
                    jQuery('#cbxsuppliers').append(jQuery("<option></option>").attr("value", d.ID).text(d.Name));
					if(aSub[d.ID]!== undefined ){
						var s =  aSub[d.ID];
						jQuery("#tblSuppliers").append("<tr id='suppliers_"+s.ID+"'><td>" + s.Name + "</td><td>" + s.ApparelPriceCategoryName + "</td><td>" + s.MarkupPercent + "%</td><td>$" + s.MonthlyCharge.toFixed(2) + "</td><td>" + s.ModifyOn.formatDate() + "</td><td><a href='javascript:updateSubscribedApparelSupplier(" + s.ID + ",\"" + s.Name.replaceAll('"', '\\"')+ "\",\"" + s.ApparelPriceCategoryName.replaceAll('"', '\\"') + "\"," + s.MarkupPercent + ","+s.ApparelSupplierID+")' class='edit'>Edit</a>&nbsp;|&nbsp;<a href='javascript:deleteSubscribedApparelSupplier(" + s.ID + ");'>Delete</a></td></tr>");
					}else{
						jQuery("#tblSuppliers").append("<tr><td>" + d.Name + "</td><td>&nbsp;</td><td>&nbsp;</td><td>$" + d.MonthlyCharge.toFixed(2) + "</td><td>&nbsp;</td><td><a href='javascript:subscribeSupplier(" + d.ID + ");'>Subscribe</a></td></tr>");
					}
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
function updateSubscribedApparelSupplier(id, apparelsuppliername, apparelpricecategoryname, markuppercent,apparelsupplierid) {
	jQuery("#suppliers_" + id).find('td').eq(1).html('<select id="pricecategory_'+id+'" class="product_tab_select"></select>');
	
	jQuery('#pricecategory_'+id).empty();
    for (var i = 0; i < SUPPLIERS.length; i++) {
        var d = SUPPLIERS[i];
		if (d.Name == apparelsuppliername) {
            for (var j = 0; j < d.ApparelPriceCategories.length; j++) {
                var apc = d.ApparelPriceCategories[j];
                if (apc.Name == apparelpricecategoryname)
                    jQuery('#pricecategory_'+id).append(jQuery("<option selected></option>").attr("value", apc.ID).text(apc.Name));
                else
                    jQuery('#pricecategory_'+id).append(jQuery("<option></option>").attr("value", apc.ID).text(apc.Name));
            }

        }
    }
	
	
	jQuery("#suppliers_" + id).find('td').eq(2).html('<input class="product_tab_textbox" id="markuppercent_'+id+'" value=\''+markuppercent+'\' type="text">');
	jQuery("#suppliers_" + id).find('td').eq(5).find('a.edit').text('Save');
    jQuery("#suppliers_" + id).find('td').eq(5).find('a.edit').prop('href', 'javascript:saveSupplier('+id+','+apparelsupplierid+')');
}
function saveSupplier(id,apparelsupplierid){
	loadStart();
	var markuppercent =  jQuery("#markuppercent_"+id).val();
	var apparelpricecategoryid =  jQuery("#pricecategory_"+id).val();
	 var xml = "<request><sessionid>" + sessionid + "</sessionid><apparelsupplierid>" + apparelsupplierid + "</apparelsupplierid><markuppercent>" + markuppercent + "</markuppercent><apparelpricecategoryid>" + apparelpricecategoryid + "</apparelpricecategoryid><id>" + id + "</id></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveSubscribedApparelSupplier",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveSubscribedApparelSupplierResult;
            if (r.isSuccessful == false) {
               checkError(r, "saveSupplier("+id+","+apparelsupplierid+")");
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
function deleteSubscribedApparelSupplier(id) {
	loadStart();
    if (sessionid == undefined)
        sessionid = '';
    var markuppercent = 0;
    if ((jQuery("#markuppercent").val() == undefined) || (jQuery("#markuppercent").val() == ''))
        markuppercent = 0;
    else
        markuppercent = jQuery("#markuppercent").val();
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + id + "</id></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteSubscribedApparelSupplier",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteSubscribedApparelSupplierResult;
            if (r.isSuccessful == false) {
               checkError(r, "deleteSubscribedApparelSupplier("+id+")");
            }
            else {
                jQuery("#markuppercent").val("");
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
function loadPriceCategoryDropDown() {
  var supplierid = jQuery('#cbxsuppliers').val();
    jQuery('#cbxapparelpricecategory').empty();
    for (var i = 0; i < SUPPLIERS.length; i++) {
		   var d = SUPPLIERS[i];
        if (d.ID == supplierid) {

            for (var j = 0; j < d.ApparelPriceCategories.length; j++) {

                var apc = d.ApparelPriceCategories[j];
                jQuery('#cbxapparelpricecategory').append(jQuery("<option></option>").attr("value", apc.ID).text(apc.Name));

            }

        }
    }
}

function subscribeSupplier(id) {
    var w = 600;
    var h = 800;
    var x = screen.width / 2 - w / 2;
    var y = screen.height / 2 - h / 2;
    window.open(url + '/SubscribeApparelSupplier.html?id=' + id + '&sessionid=' + sessionid, 'swwindow', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=0,width=' + w + ',height=' + h + ',screenX=' + x + ',screenY=' + y + ',top=' + y + ',left=' + x);
}