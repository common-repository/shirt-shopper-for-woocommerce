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
    jQuery("#tblProductDesigns tbody").sortable({
        helper: fixHelperModified,
        stop: function(event,ui) {
			
		}
		,update:function(event, ui){
			  var dropID = jQuery(ui.item).data('id');
			  console.log(dropID);
			  jQuery("#tblProductDesigns tbody tr").each(function(i) {
				if(parseInt(dropID)==parseInt(jQuery(this).data('id')))
				{
					var position = i+1;
					var oldPos = jQuery(this).data('pos');
					if(parseInt(oldPos)<parseInt(position)){
						position++;
					}
					arrangeProductDesign(dropID, position);
				}
			 });
        }
		,axis: 'y',
       containment: "parent" 
    });

jQuery(".wc-enhanced-select-image").chosenImage({
	
});
	
	
});
function arrangeProductDesign(id, position) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><productid>' + productid + '</productid><id>' + id + '</id><position>' + position + '</position></request>';
    loadStart();
	jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ArrangeProductDesign",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ArrangeProductDesignResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
               updateProductLoad();
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function addDesignPlacement(id) {
    if (sessionid == undefined)
        sessionid = '';
	var placementid = jQuery("#ddlplacement_"+id).val();
    var designid = jQuery("#ddlproductdesign_"+id).val();
    var xml = "<request><sessionid>" + sessionid + "</sessionid><productid>" + productid + "</productid><placementid>" + placementid + "</placementid><designid>" + designid + "</designid><id>" + id + "</id></request>";
   loadStart();
   jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveDesignPlacement",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveDesignPlacementResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                jQuery("#ddlplacement_0").val("");
                jQuery("#ddlproductdesign_0").val("");
				updateProductLoad();
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function deleteDesignPlacement(id) {
    if (id == undefined)
        id = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
   loadStart();	
   jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteDesignPlacement",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteDesignPlacementResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
               updateProductLoad();
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function updateProductLoad() {
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + productid + "</id></request>";
    loadStart();
	jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetProduct",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetProductResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                var data = eval(r.Data);
                var products = data[0];
                var p = products[0];
                jQuery("#tblProductDesigns > tbody").html("");
                for (var i = 0; i < p.Designs.length; i++) {
                    var d = p.Designs[i];
					var pImage='';
					if(d.PreviewImage!=null){
						pImage='<img src="'+d.PreviewImage+'" width="40">';
					}
					jQuery("#tblProductDesigns").append("<tr id='placement_"+d.ID+"' data-id='"+d.ID+"' data-pos='"+d.Position+"'><td>" + d.ID + "</td><td>" + d.PlacementName + "</td><td>" + d.DesignName + "</td><td>" + pImage + "</td><td><a class='edit' href='javascript:editDesignPlacement(" + d.ID + ","+d.DesignID+","+d.PlacementID+");'>Edit</a>&nbsp;|&nbsp;<a href='javascript:deleteDesignPlacement(" + d.ID + ");'>Remove</a></td></tr>");
                }
				jQuery("#tblProductDesigns tbody").sortable( "refresh" );   
		    }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function editDesignPlacement(id,DesignID,PlacementID){
	jQuery("#placement_" + id).find('td').eq(1).html('<select id="ddlplacement_'+id+'" class="product_tab_select"></select>');
	jQuery('#ddlplacement_0').find('option').clone().appendTo('#ddlplacement_'+id);
	jQuery('#ddlplacement_'+id).val(PlacementID);
	jQuery("#placement_" + id).find('td').eq(2).html('<select id="ddlproductdesign_'+id+'" class="product_tab_select"></select>');
	jQuery('#ddlproductdesign_0').find('option').clone().appendTo('#ddlproductdesign_'+id);
	jQuery('#ddlproductdesign_'+id).val(DesignID);
	jQuery("#placement_" + id).find('td').eq(3).find('a.edit').text('Save');
    jQuery("#placement_" + id).find('td').eq(3).find('a.edit').prop('href', 'javascript:addDesignPlacement('+id+')');
	
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
