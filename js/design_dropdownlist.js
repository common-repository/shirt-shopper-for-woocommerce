var brandcolors = [];

function listDropDownList() {
    loadStart();
    var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ListDropDownList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ListDropDownListResult;
            if (r.isSuccessful == false) {
                checkError(r, "listDropDownList()");
            }
            else {
                jQuery("#tblDropDownLists > tbody").html("");
                dropdownlists = eval(r.Data);
                
                for (var i = 0; i < dropdownlists.length; i++) {
                    var ddl = dropdownlists[i];
                    jQuery("#tblDropDownLists").append("<tr id='filter-" + ddl.ID + "'><td><a href='admin.php?page=product_design&section=section-2&colid=" + ddl.ID + "'>" + ddl.Name + "</a></td><td>" + ddl.ModifyBy + "</td><td>" + ddl.ModifyOn.formatDate() + "</td><td><a href='admin.php?page=product_design&section=section-2&colid=" + ddl.ID + "'>Edit</a>&nbsp;|&nbsp;<a href='javascript:deleteDropDownList(" + ddl.ID + ");'>Remove</a></td></tr>");
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


function deleteDropDownList(id) {
    loadStart();
    if (sessionid == undefined)
        sessionid = '';
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + id + "</id></request>";    
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteDropDownList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteDropDownListResult;
            if (r.isSuccessful == false) {
                checkError(r, "deleteDropDownList("+id+")");
            }
            else {
                listDropDownList();
            }
             loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
             loadEnd();
        }
    });
}

function addDropDownList() {
    loadStart();
    var xml = '<request><sessionid>' + sessionid + '</sessionid><name>' + jQuery("#dropdownlistname").val() + '</name></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveDropDownList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveDropDownListResult;
            if (r.isSuccessful == false) {
                checkError(r, "addDropDownList()");
            }
            else {
                listDropDownList();
            }
            loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
            loadEnd();
        }
    });
}


jQuery(document).ready(function () {
	//Helper function to keep table row from collapsing when being sorted
    var fixHelperModified = function(e, tr) {
        var $originals = tr.children();
        var $helper = tr.clone();
        $helper.children().each(function(index)
        {
          jQuery(this).width($originals.eq(index).width())
        });
        return $helper;
    };

    //Make diagnosis table sortable
    jQuery("#tblDropDownListItems tbody").sortable({
        helper: fixHelperModified,
        stop: function(event,ui) {
			
		}
		,update:function(event, ui){
			  var dropID = jQuery(ui.item).data('id');
			  jQuery("#tblDropDownListItems tbody tr").each(function(i) {
				if(parseInt(dropID)==parseInt(jQuery(this).data('id')))
				{
					var position = i+1;
					var oldPos = jQuery(this).data('pos');
					if(parseInt(oldPos)<parseInt(position)){
						position++;
					}
					arrangeDropDownListItem(dropID, position);
				}
			 });
        }
		,axis: 'y',
       containment: "parent" 
    }).disableSelection();
});
function arrangeDropDownListItem(id, position) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><dropdownlistid>' + dropdownlistid + '</dropdownlistid><id>' + id + '</id><position>' + position + '</position></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ArrangeDropDownListItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ArrangeDropDownListItemResult;
            if (r.isSuccessful == false) {
                checkError(r, "arrangeDropDownListItem("+id+", "+position+")");
            }
            else {
                getDropDownList();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function getDropDownList() {
    loadStart();
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + dropdownlistid + "</id></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetDropDownList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetDropDownListResult;
            if (r.isSuccessful == false) {
               checkError(r, "getDropDownList()");
            }
            else {
                dropdownlists = eval(r.Data);
                for (var i = 0; i < dropdownlists.length; i++) {
                    var ddl = dropdownlists[i];
                    jQuery("#ddlName").html(ddl.Name);
                    jQuery("#tblDropDownListItems > tbody").html("");
                    for (var j = 0; j < ddl.Items.length; j++) {
                        var item = ddl.Items[j];
						jQuery("#tblDropDownListItems").append("<tr data-id='"+item.ID+"' data-pos='"+item.Position+"' ><td>" + item.Name + "</td><td>" + item.PriceIncrease.toFixed(2) + "</td><td>" + item.ModifyBy + "</td><td>" + item.ModifyOn.formatDate() + "</td><td><a href='javascript:deleteDropDownListItem(" + item.ID + ");'>Remove</a></td></tr>");                        
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
function addDropDownListItem() {
    loadStart();
    var priceincrease = jQuery("#dropdownlistitempriceincrease").val();

    if ((priceincrease == undefined) || (priceincrease == ''))

        priceincrease = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><dropdownlistid>' + dropdownlistid + '</dropdownlistid><name>' + jQuery("#dropdownlistitemname").val() + '</name><priceincrease>' + priceincrease + '</priceincrease><position>0</position></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveDropDownListItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveDropDownListItemResult;
            if (r.isSuccessful == false) {
               checkError(r, "addDropDownListItem()");
            }
            else {
                getDropDownList();
            }
            loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
            loadEnd();
        }
    });
}
function deleteDropDownListItem(id) {
    loadStart();
    if (sessionid == undefined)
        sessionid = '';
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + id + "</id></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteDropDownListItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteDropDownListItemResult;
            if (r.isSuccessful == false) {
                checkError(r, "deleteDropDownListItem("+id+")");
            }
            else {
                getDropDownList();
            }
            loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
            loadEnd();
        }
    });
}