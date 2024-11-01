var brandcolors = [];

jQuery(document).ready(function () {
	jQuery("#previewimage_image_button").click(function (e){
			e.preventDefault();
			var button = jQuery(this);
			wp.media.editor.send.attachment = function(props, attachment) {
			  	jQuery("#previewimage_url").val(attachment.url);
				jQuery('#previewimage_src').html('<img src="'+attachment.url+'" width="160"/>');
				console.log(attachment);
			 };
			wp.media.editor.open(button);
			return false;
	}); 
								 
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
    jQuery("#tblDesignColors tbody").sortable({
        helper: fixHelperModified,
        stop: function(event,ui) {
			
		}
		,update:function(event, ui){
			  var dropID = jQuery(ui.item).data('id');
			  jQuery("#tblDesignColors tbody tr").each(function(i) {
				if(parseInt(dropID)==parseInt(jQuery(this).data('id')))
				{
					var position = i+1;
					var oldPos = jQuery(this).data('pos');
					if(parseInt(oldPos)<parseInt(position)){
						position++;
					}
					arrangeDesignColor(dropID, position);
				}
			 });
        }
		,axis: 'y',
       containment: "parent" 
    });
	
	//Make diagnosis table sortable
    jQuery("#tblDesignAttributes tbody").sortable({
        helper: fixHelperModified,
        stop: function(event,ui) {
			
		}
		,update:function(event, ui){
			  var dropID = jQuery(ui.item).data('id');
			  jQuery("#tblDesignAttributes tbody tr").each(function(i) {
				if(parseInt(dropID)==parseInt(jQuery(this).data('id')))
				{
					var position = i+1;
					var oldPos = jQuery(this).data('pos');
					if(parseInt(oldPos)<parseInt(position)){
						position++;
					}
					arrangeDesignAttribute(dropID, position);
				}
			 });
        }
		,axis: 'y',
       containment: "parent" 
    });
	
	
});

function listDesigns() {
    var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
	loadStart();
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ListDesigns",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ListDesignsResult;
            if (r.isSuccessful == false) {
                checkError(r, "listDesigns()");
            }
            else {
                jQuery("#tblDesigns > tbody").html("");
                var data = eval(r.Data);
                var designs = data[0];
                
                for (var i = 0; i < designs.length; i++) {
                    var f = designs[i];
					var image="";
					if(f.PreviewImage!=null){
						image='<img  src="'+f.PreviewImage+'" class="" width="40">';
					}
                    jQuery("#tblDesigns").append("<tr><td><a href='admin.php?page=product_design&colid=" + f.ID + "'>" + f.Name + "</a></td><td>" +image+ "</td><td>" + f.ModifyBy + "</td><td>" + f.ModifyOn.formatDate() + "</td><td><a href='admin.php?page=product_design&colid=" + f.ID + "'>Edit</a>&nbsp;|&nbsp;<a href='javascript:deleteDesign(" + f.ID + ");'>Remove</a></td></tr>");
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



var dropdownlists;
function designattribute_onchange(id,ddlid,defaultvalue) {
	if (ddlid == undefined)
        ddlid = '';
	if (defaultvalue == undefined)
        defaultvalue = '';
    switch (parseInt(jQuery("#ddldesignattributetype_"+id).val())) {
        case 4: // Drop Down List
            var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
			loadStart();
            jQuery.ajax({
                type: "POST",
                url: url + "/Settings.svc/ListDropDownList",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(jQuery.xml2json(xml)),
                dataType: "json",
                success: function (response) {
                    var r = response.ListDropDownListResult;
                    if (r.isSuccessful == false) {
                        checkError(r, "designattribute_onchange("+id+")");
                    }
                    else {
                        dropdownlists = eval(r.Data);
                        var ddlitems = '';
                        for (var i = 0; i < dropdownlists.length; i++) {
                            var ddl = dropdownlists[i];
                            ddlitems += "<option value='" + ddl.ID + "'>" + ddl.Name + "</option>";
                        }
                        jQuery("#attribute_" + id).find('td').eq(2).html("<select  class='product_tab_select' id='designattributeddl_"+id+"' onchange='setDefaultDropDownListItems("+id+")'><option value='0'></option>" + ddlitems + "</select>");
						if(ddlid!=''){
								jQuery("#designattributeddl_" + id).val(ddlid);
								setDefaultDropDownListItems(id,defaultvalue);
						}
                    }
					loadEnd();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
					loadEnd();
                }
            });
            break;
        case 7: // File Upoad
            jQuery("#attribute_" + id).find('td').eq(2).html('');
            jQuery("#attribute_" + id).find('td').eq(3).html('');
            break;
        default:
            jQuery("#attribute_" + id).find('td').eq(2).html('');
			jQuery("#attribute_" + id).find('td').eq(3).html("<input  class='product_tab_textbox' type='text' id='designdefaultvalue_"+id+"' value='"+defaultvalue+"' />");
            break;
    }
}
function setDefaultDropDownListItems(id,defaultvalue) {
	if (defaultvalue == undefined)
        defaultvalue = '';
	var ddlid = jQuery("#designattributeddl_"+id).val();
    var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + ddlid + "</id></request>";
	loadStart();
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetDropDownList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetDropDownListResult;
            if (r.isSuccessful == false) {
                checkError(r, "setDefaultDropDownListItems("+id+")");
            }
            else {
                dropdownlists = eval(r.Data);
                for (var i = 0; i < dropdownlists.length; i++) {
                    var ddl = dropdownlists[i];
                    var ddlitems = '';
                    for (var j = 0; j < ddl.Items.length; j++) {
                        var item = ddl.Items[j];
                        ddlitems += "<option value='" + item.Name + "'>" + item.Name + "</option>";
                    }
                    jQuery("#attribute_" + id).find('td').eq(3).html("<select  class='product_tab_select' id='designdefaultvalue_"+id+"'><option value='0'></option>" + ddlitems + "</select>");
					if(defaultvalue!=''){
								jQuery("#designdefaultvalue_" + id).val(defaultvalue);
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

function saveDesignAttribute(id) {
	var ddldesignattributetype =  jQuery("#ddldesignattributetype_"+id).val();
	var tbxdesignattributedescription =  jQuery("#tbxdesignattributedescription_"+id).val();
	var designdefaultvalue =  jQuery("#designdefaultvalue_"+id).val();
	var ddlid =  parseInt(jQuery("#designattributeddl_"+id).val());
    if (isNaN(ddlid) == true)
        ddlid = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><designid>' + designid + '</designid><designattributetypeid>' + ddldesignattributetype + '</designattributetypeid><description>' + tbxdesignattributedescription + '</description><dropdownlistid>' + ddlid + '</dropdownlistid><defaultvalue>' + designdefaultvalue + '</defaultvalue><id>' + id + '</id></request>';
	loadStart();
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveDesignAttribute",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveDesignAttributeResult;
            if (r.isSuccessful == false) {
                 checkError(r, "saveDesignAttribute("+id+")");
            }
            else {
                jQuery("#ddldesignattributetype_" + id).val("");
                jQuery("#tbxdesignattributedescription_" + id).val("");
                jQuery("#designdefaultvalue_" + id).val("");
                jQuery("#designattributeddl_" + id).val("");
                updateDesignLoad(designid);
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });

}

function deleteDesignAttribute(id) {
    if (confirm('You are about to delete this design attribute. Are you sure?') == false)
        return;
    if (id == undefined)
        id = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
	loadStart();
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteDesignAttribute",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteDesignAttributeResult;
            if (r.isSuccessful == false) {
                 checkError(r, "deleteDesignAttribute("+id+")");
            }
            else {
                updateDesignLoad(designid);
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}

function addDesignColor(id) {
    if (sessionid == undefined)
        sessionid = '';

    var ddlcolorpaletteid = jQuery("#ddlcolorpalette_"+id).val();
    var description = jQuery("#designcolordescription_"+id).val();
	var ddldesigncolorpaletteitems = jQuery("#ddldesigncolorpaletteitems_"+id).val();
	var xml = "<request><sessionid>" + sessionid + "</sessionid><designid>" + designid + "</designid><colorpaletteid>" + ddlcolorpaletteid + "</colorpaletteid><description>" + description + "</description><defaultcolorpaletteitemid>" + ddldesigncolorpaletteitems + "</defaultcolorpaletteitemid><id>" + id + "</id></request>";
    loadStart();
	jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveDesignColor",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveDesignColorResult;
            if (r.isSuccessful == false) {
               checkError(r, "addDesignColor("+id+")");
            }
            else {
                jQuery("#ddlcolorpalette_0").val("");
                jQuery("#designcolordescription_0").val("");
                updateDesignLoad(designid);
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}


function deleteDesignColor(id) {
    if (confirm('You are about to delete this design color. Are you sure?') == false)
        return;
    if (id == undefined)
        id = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
	loadStart();
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteDesignColor",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteDesignColorResult;
            if (r.isSuccessful == false) {
                checkError(r, "deleteDesignColor("+id+")");
            }
            else {
              updateDesignLoad(designid);
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}

var designid = 0;
var attributetypes;
function updateDesignLoad(id) {
    if (sessionid == undefined)
        sessionid = '';
    designid = id;
    jQuery("#sDesignFunction").text("Update");
    jQuery("#btndesignadd").attr("value", "Update");
     var xml = "<request><sessionid>" + sessionid + "</sessionid><id>" + designid + "</id></request>";
	 loadStart();
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetDesign",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetDesignResult;
            if (r.isSuccessful == false) {
                 checkError(r, "updateDesignLoad("+id+")");
            }
            else {
                var data = eval(r.Data);
                var designs = data[0];
                var design = designs[0];
                attributetypes = data[1];
                jQuery("#tblDesignColors > tbody").html("");
                for (var i = 0; i < design.DesignColors.length; i++) {
                    var mc = design.DesignColors[i];
					jQuery("#tblDesignColors").append("<tr  data-id='"+mc.ID+"' data-pos='"+mc.Position+"' id='design_"+mc.ID+"'><td>" + mc.ColorPaletteName + "</td><td colspan='2'>" + mc.Description + "</td><td>" + mc.DefaultColorPaletteItemName + "</td><td><a href='javascript:editDesignColor(" + mc.ID + "," + mc.ColorPaletteID + ",\"" + mc.Description.replaceAll('"', '\\"') + "\"," + mc.DefaultColorPaletteItemID + ")' class='edit'>Edit</a>&nbsp;|&nbsp;<a href='javascript:deleteDesignColor(" + mc.ID + ");'>Remove</a></td></tr>");
                }
                jQuery("#tblDesignAttributes > tbody").html("");
                for (var i = 0; i < design.DesignAttributes.length; i++) {
                    var da = design.DesignAttributes[i];
					jQuery("#tblDesignAttributes").append("<tr data-id='"+da.ID+"' data-pos='"+da.Position+"' id='attribute_"+da.ID+"'><td>" + da.DesignAttributeTypeName + "</td><td>" + da.Description + "</td><td>" + da.DropDownListName + "</td><td>" + da.DefaultValue + "</td><td><a href='javascript:editDesignAttribute(" + da.ID + "," + da.DesignAttributeTypeID + ",\"" + da.Description.replaceAll('"', '\\"') + "\"," + da.DropDownListID  + ",\"" + da.DefaultValue.replaceAll('"', '\\"') + "\")' class='edit'>Edit</a>&nbsp;|&nbsp;<a href='javascript:deleteDesignAttribute(" + da.ID + ");'>Remove</a></td></tr>");
                }
                jQuery('#ddldesignattributetype_0').empty();
                jQuery('#ddldesignattributetype_0').append(jQuery("<option></option>").attr("value", 0).text(''));
                for (var i = 0; i < attributetypes.length; i++) {
                    var at = attributetypes[i];
                    jQuery('#ddldesignattributetype_0').append(jQuery("<option></option>").attr("value", at.ID).text(at.Name));
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
function editDesignAttribute(id,typeid,description,ddlid,defaultvalue){
	jQuery("#attribute_" + id).find('td').eq(1).html('<select id="ddldesignattributetype_'+id+'" class="product_tab_select"  onChange="designattribute_onchange('+id+')"></select>');
	jQuery('#ddldesignattributetype_0').find('option').clone().appendTo('#ddldesignattributetype_'+id);
	jQuery('#ddldesignattributetype_'+id).val(typeid);
	designattribute_onchange(id,ddlid,defaultvalue);
	jQuery("#attribute_" + id).find('td').eq(2).html('<input id="tbxdesignattributedescription_'+id+'" type="text" placeholder="" value="'+description+'"  class="product_tab_textbox" />');
	jQuery("#attribute_" + id).find('td').eq(4).find('a.edit').text('Save');
    jQuery("#attribute_" + id).find('td').eq(4).find('a.edit').prop('href', 'javascript:saveDesignAttribute('+id+')');
}
function editDesignColor(id,colorPaletteID,description,defaultColorPaletteItemID){
	jQuery("#design_" + id).find('td').eq(0).html('<select id="ddlcolorpalette_'+id+'" class="product_tab_select"  onChange="loadColorPaletteItems('+id+')"></select>');
	jQuery('#ddlcolorpalette_0').find('option').clone().appendTo('#ddlcolorpalette_'+id);
	jQuery('#ddlcolorpalette_'+id).val(colorPaletteID);
	jQuery("#design_" + id).find('td').eq(1).html('<input class="product_tab_textbox" id="designcolordescription_'+id+'" value=\''+description+'\' type="text">');
	jQuery("#design_" + id).find('td').eq(2).html('<select id="ddldesigncolorpaletteitems_'+id+'" class="product_tab_select"></select>');
	
	loadColorPaletteItems(id,defaultColorPaletteItemID);
	jQuery("#design_" + id).find('td').eq(3).find('a.edit').text('Save');
    jQuery("#design_" + id).find('td').eq(3).find('a.edit').prop('href', 'javascript:addDesignColor('+id+')');
}
function deleteDesign(id) {
    if (confirm('You are about to delete this design. Are you sure?') == false)
        return;
    if (id == undefined)
        id = 0;
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
	loadStart();
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteDesign",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteDesignResult;
            if (r.isSuccessful == false) {
                  checkError(r, "deleteDesign("+id+")");
            }
            else {
                listDesigns();
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}



function listDesignsInner() {
    var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
	loadStart();
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ListDesigns",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ListDesignsResult;
            if (r.isSuccessful == false) {
                 checkError(r, "listDesignsInner()");
            }
            else {
                var data = eval(r.Data);
                var designs = data[0];
                for (var i = 0; i < designs.length; i++) {
                    var f = designs[i];
					if(parseInt($colid)==parseInt(f.ID))
					{
							 jQuery("#designname").val(f.Name);
							 jQuery("#previewimage_url").val(f.PreviewImage);
							 var image="";
							if(f.PreviewImage!=null){
								image='<img  src="'+f.PreviewImage+'" class="" width="160">';
							}
							jQuery("#previewimage_src").html(image);
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
function addDesign() {
	
		var designname = jQuery("#designname").val();
	var designid = jQuery("#designid").val();
var previewimage = jQuery("#previewimage_url").val();	
    var xml = "<request><sessionid>" + sessionid + "</sessionid><name>" + designname + "</name><id>"+designid+"</id><previewimage>" + previewimage + "</previewimage></request>";
 	loadStart();
 jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveDesign",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveDesignResult;
            if (r.isSuccessful == false) {
                checkError(r, "addDesign()");
            }
            else {
                window.location.href = "admin.php?page=product_design";
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });

}
function arrangeDesignColor(id, position) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><designid>' + designid + '</designid><id>' + id + '</id><position>' + position + '</position></request>';
   loadStart();
   jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ArrangeDesignColor",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ArrangeDesignColorResult;
            if (r.isSuccessful == false) {
                checkError(r, "arrangeDesignColor("+id+", "+position+")");
            }
            else {
                updateDesignLoad(designid);
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function arrangeDesignAttribute(id, position) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><designid>' + designid + '</designid><id>' + id + '</id><position>' + position + '</position></request>';
    loadStart();
	jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ArrangeDesignAttribute",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ArrangeDesignAttributeResult;
            if (r.isSuccessful == false) {
                checkError(r, "arrangeDesignAttribute("+id+", "+position+")");
            }
            else {
                updateDesignLoad(designid);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function selectColorPalette() {
    var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ListColorPalette",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ListColorPaletteResult;
            if (r.isSuccessful == false) {
                checkError(r, "selectColorPalette()");
            }
            else {
                var data = eval(r.Data);
                var mediacolordropdowns = data[0];
				var mcs = data[2];
                for (var i = 0; i < mcs.length; i++) {
                    var mc = mcs[i];
                    mediacolors[mc.ID] = mc;
                }
                jQuery('#ddlcolorpalette_0').empty();
                for (var i = 0; i < mediacolordropdowns.length; i++) {
                    var f = mediacolordropdowns[i];
                    jQuery('#ddlcolorpalette_0').append(jQuery("<option></option>").attr("value", f.ID).text(f.Name));
                }
				loadColorPaletteItems(0);
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
var mediacolors = [];
function loadColorPaletteItems(id,selected) {
	var colorId = jQuery("#ddlcolorpalette_"+id).val();
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>'+colorId+'</id></request>';
	loadStart();
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/GetColorPalette",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.GetColorPaletteResult;
            if (r.isSuccessful == false) {
               checkError(r, "loadColorPaletteItems("+id+")");
            }
            else {
                var data = eval(r.Data);
                var colorpalette = data[0];
                jQuery("#ddldesigncolorpaletteitems_"+id).empty();
                for (var i = 0; i < colorpalette.ColorPaletteGroups.length; i++) {
                    var group = colorpalette.ColorPaletteGroups[i];
                    jQuery("#ddldesigncolorpaletteitems_"+id).append(jQuery("<option></option>").attr("value", group.ID * -1).text(group.Name + '(+' + group.PriceIncrease + ')'));
                    for (var j = 0; j < group.ColorPaletteItems.length; j++) {
                        var item = group.ColorPaletteItems[j];
                        jQuery("#ddldesigncolorpaletteitems_"+id).append(jQuery("<option></option>").attr("value", item.ID).text(mediacolors[item.MediaColorID].Name));
                    }
                }
				if (selected != undefined)
        			jQuery("#ddldesigncolorpaletteitems_"+id).val(selected);
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
