var mediacolortypes;
var mediacolors = [];
var mediacolordropdownid = 0;
var mediacolorsAdded = [];
var group_id = 0;
var add_group_id = 0;


function listColorPalette() {
	loadStart();
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
               checkError(r, "listColorPalette()");
            }
            else {
                jQuery("#tblMediaColorDropdowns > tbody").html("");
                var data = eval(r.Data);
                var mediacolordropdowns = data[0];
                mediacolortypes = data[1];
                var mcs = data[2];
				
				for (var i = 0; i < mcs.length; i++) {
                    var mc = mcs[i];
                    mediacolors[mc.ID] = mc;
                }
                //mediacolors = data[2];
                jQuery('#ddlcolorpalette').empty();
                for (var i = 0; i < mediacolordropdowns.length; i++) {
                    var f = mediacolordropdowns[i];
                    jQuery("#tblMediaColorDropdowns").append("<tr id='tr" + i + "'><td><a href='admin.php?page=color_palettes&section=section-2&colid=" + f.ID + "'>" + f.Name + "</a></td><td>" + f.ModifyBy + "</td><td>" + f.ModifyOn.formatDate() + "</td><td><a href='admin.php?page=color_palettes&section=section-2&colid=" + f.ID + "'>Edit</a>&nbsp;|&nbsp;<a href='javascript:deleteMediaColorDropdowns(" + f.ID + ");'>Remove</a></td></tr>");
                    jQuery('#ddlcolorpalette').append(jQuery("<option></option>").attr("value", f.ID).text(f.Name));
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

function deleteMediaColorDropdowns(id) {
    if (id == undefined)
        id = 0;
	loadStart();	
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteColorPalette",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteColorPaletteResult;
            if (r.isSuccessful == false) {
               checkError(r, "deleteMediaColorDropdowns("+id+")");
            }
            else {
                listColorPalette();
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function addMediaColorDropdown() {
    if (sessionid == undefined)
        sessionid = '';
	loadStart();	
    var mediacolordropdownname = jQuery("#mediacolordropdownname").val();
    var xml = "<request><sessionid>" + sessionid + "</sessionid><name>" + mediacolordropdownname + "</name><id>" + mediacolordropdownid + "</id></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveColorPalette",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveColorPaletteResult;
            if (r.isSuccessful == false) {
                checkError(r, "addMediaColorDropdown()");
            }
            else {
                var data = eval(r.Data);
				window.location.href = "admin.php?page=color_palettes&section=section-2&colid="+data[0];
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}


function listColorPaletteInner() {
	
	loadStart();
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
                checkError(r, "listColorPaletteInner()");
            }
            else {
                var data = eval(r.Data);
				var mediacolordropdowns = data[0];
				for (var i = 0; i < mediacolordropdowns.length; i++) {
						var f = mediacolordropdowns[i];
						if(f.ID==$_colid){
							jQuery("#mediacolordropdownname").val(f.Name);
							break;
						}
				}
                mediacolortypes = data[1];
				var mcs = data[2];
				
				for (var i = 0; i < mcs.length; i++) {
                    var mc = mcs[i];
                    mediacolors[mc.ID] = mc;
                }
				loadColorPaletteItems($_colid);
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}

function loadColorPaletteItems(id) {
	mediacolorsAdded = [];
	loadStart();	
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
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
				var ddlMediaColorType = jQuery('#ddlMediaColorType').val();
				jQuery('#ddlMediaColorType').empty();
                var data = eval(r.Data);
                var colorpalette = data[0];
                for (var i = 0; i < mediacolortypes.length; i++) {
                        var f = mediacolortypes[i];
                        jQuery('#ddlMediaColorType').append(jQuery("<option></option>").attr("value", f.ID).text(f.Name));
                }
				if(!isNaN(parseInt(ddlMediaColorType)))
					jQuery('#ddlMediaColorType').val(parseInt(ddlMediaColorType));
			   
               jQuery('#accordion').empty();
                for (var i = 0; i < colorpalette.ColorPaletteGroups.length; i++) {
                    var group = colorpalette.ColorPaletteGroups[i];
					var panels ='<div class="panel panel-default panel-sort" data-id="'+group.ID+'" data-pos="'+group.Position+'" id="media_group_'+group.ID+'">';
					panels +='<div class="panel-heading">';
					panels +='<h4 class="panel-title">';
					
					var priceLable="";
					if(parseInt(group.PriceIncrease)>0)
						priceLable='(+' + parseFloat(group.PriceIncrease).toFixed(2) + ')';	
						
					panels +='<a data-toggle="collapse" data-parent="#accordion" href="#collapse'+group.ID+'">'+group.Name + priceLable +'</a>';
					panels +='<div class="orderGroup"><span class="orderGroupDown"><a href="javascript:arrangeColorPaletteGroup(\''+group.ID+'\','+(group.Position + 2)+')"><span class="glyphicon glyphicon-collapse-down"></span></a></span><span class="orderGroupUp"><a href="javascript:arrangeColorPaletteGroup(\''+group.ID+'\','+(group.Position - 1)+')"><span class="glyphicon glyphicon-collapse-up"></span></a></span></div>';
					panels +='<a class="deleteGroup" href="javascript:removeGroup(\''+group.ID+'\')"><span class="glyphicon glyphicon-remove"></span></a>';
					panels +='<a class="editGroup" href="javascript:editGroup(\''+group.ID+'\',\''+group.Name+'\',\''+group.PriceIncrease+'\')"><span class="glyphicon glyphicon-pencil"></span></a>';
					
					panels +='</h4>';
					panels +='</div>';
					panels +='<div id="collapse'+group.ID+'" data-id="'+group.ID+'" data-pos="'+group.Position+'" class="panel-collapse collapse">';
					panels +='<div class="panel-body">';
					panels +='<ul class="right-draggable droppable sortable">';
					for (var j = 0; j < group.ColorPaletteItems.length; j++) {
						var item = group.ColorPaletteItems[j];
						// image saurav
						//console.log(item);
						mediacolorsAdded.push(item.MediaColorID);
						var HtmlColor='';
						if(mediacolors[item.MediaColorID].HtmlColor!='')
							HtmlColor = 'style="background-color:'+mediacolors[item.MediaColorID].HtmlColor+'"';
						var PatternImage='';
						if(item.HasPattern ==true){
							PatternImage = '<img src="'+site_url+'?apparel-image=1&media-id='+item.MediaColorID+ '"  >';
						}
						else if ((mediacolors[item.MediaColorID].PatternImage != undefined) && (mediacolors[item.MediaColorID].PatternImage!='')){
							PatternImage = '<img src="http://api.thetshirtguylv.com' + mediacolors[item.MediaColorID].PatternImage + '"  >';
						}
						panels +='<li data-id="'+mediacolors[item.MediaColorID].ID+'"  data-pos="'+item.Position+'" data-did="'+item.ID+'" id="media_color_'+mediacolors[item.MediaColorID].ID+'"><span class="name">'+mediacolors[item.MediaColorID].Name+'</span><span class="closex"><a href="javascript:removeItem(\''+group.ID+'\',\''+item.ID+'\')"><span class="glyphicon glyphicon-remove"></span></a></span><span class="color" '+HtmlColor+' >'+PatternImage+'</span></li>';
				    }
					panels +='</ul>';
					panels +='</div>';
					panels +='</div>';
					panels +='</div>';
					jQuery("#accordion").append(panels);
                }
				if(group_id>0 && add_group_id<=0)
				{
					jQuery("#accordion").find('.panel-collapse').removeClass("in");
					jQuery('#collapse'+group_id).addClass("in");
				}
				else
				{
					jQuery("#accordion").find('.panel-collapse').removeClass("in");
					jQuery("#accordion").find('.panel-collapse:first').addClass("in");
				}
				add_group_id = 0;
				// drag
	jQuery( ".sortable" ).sortable({
        stop: function(event,ui) {
		}
		,update:function(event, ui){
			var dropID = jQuery(ui.item).data('did');
			var gid = jQuery("#accordion .in").data('id');
			jQuery("#collapse"+gid+" li").each(function(i) {
				if(parseInt(dropID)==parseInt(jQuery(this).data('did')))
				{
					position = i+1;
					var oldPos = jQuery(this).data('pos');
					if(parseInt(oldPos)<parseInt(position)){
						position++;
					}
					arrangeColorPaletteItem(gid,dropID, position);
				}
				
			});
		}
		,axis: 'y',
       containment: "parent" 
    }).disableSelection();
				   //
			   
			   loadMediaColors();
			}
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function addColorPaletteGroup(colorpaletteid, name, priceincrease, id) {
	add_group_id=1;
    var position = jQuery("#msAddedMediaColor").val();
    if (position == undefined)
        position = 0;
    if (position < 0) {
        var pos = 1;
        var ddl = document.getElementById('msAddedMediaColor');
        for (var i = 0; i < ddl.length; i++) {
            if (ddl.options[i].value < 0) {
                pos += 1;
                if (ddl.options[i].value == position) {
                    position = pos;
                    break;
                }
            }
        }
    }
    if (name == undefined)
        name = 'Section';
    if (priceincrease == undefined)
        priceincrease = 0;
    if (id == undefined)
        id = 0;
		loadStart();	
    var xml = '<request><sessionid>' + sessionid + '</sessionid><colorpaletteid>' + colorpaletteid + '</colorpaletteid><position>' + position + '</position><name>' + name + '</name><priceincrease>' + priceincrease + '</priceincrease><id>' + id + '</id></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveColorPaletteGroup",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveColorPaletteGroupResult;
            if (r.isSuccessful == false) {
                checkError(r, "addColorPaletteGroup("+colorpaletteid+", "+name+", "+priceincrease+", "+id+")");
            }
            else {
                loadColorPaletteItems($_colid);
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}

var shiftClick = 0;

function loadMediaColors() {
  
   var typeid = jQuery('#ddlMediaColorType').val();
   jQuery('#draggableBox').empty();   
	jQuery.each(mediacolors, function (key, mc) {
	    if (mc != undefined) {
	        if (typeid == mc.MediaProductID) {
			
				if(jQuery.inArray(mc.ID,mediacolorsAdded)==-1){
					// image saurav
					//console.log(mc);	
					var HtmlColor='';
					if(mc.HtmlColor!='')
						HtmlColor = 'style="background-color:'+mc.HtmlColor+'"';
					var PatternImage='';
					if(mc.HasPattern==true){
						PatternImage = '<img src="'+site_url+'?apparel-image=1&media-id='+mc.ID+ '"  >';
					}
					else if ((mc.PatternImage != undefined) && (mc.PatternImage!='')){
						PatternImage = '<img src="http://api.thetshirtguylv.com' + mc.PatternImage + '"  >';
					}
					jQuery('#draggableBox').append('<li class="item draggable" data-id="'+mc.ID+'"><span class="name">'+mc.Name+'</span><span class="closex"><a href="javascript:void(0)"><span class="glyphicon glyphicon-remove"></span></a></span><span class="color" '+HtmlColor+' >'+PatternImage+'</span></li>');
				}
				
			}
		}
    });
	var calculatecontsize = jQuery( ".left-draggable" ).height();	
	//dynamic height
	//jQuery( ".right-draggable" ).css({"height":calculatecontsize + "px"} );
 // drag		
 	jQuery(".droppable").droppable({
	drop: function(event, ui) {
		var $list = jQuery(this);
		$helper = ui.helper;
		jQuery($helper).removeClass("selected");
		var $selected = jQuery(".selected");					
		if($selected.length > 1){						
			moveSelected($list,$selected);
		}else{
			moveItem(ui.draggable,$list);
		}										
	}, tolerance: "touch"
	});
			 
			 jQuery(".draggable").draggable({
				revert: "invalid",
				helper: function( event ) {
					var dragHtml='<ul class="left-draggable-no-bg">';
					jQuery("#draggableBox .selected").each(function(){
						dragHtml+='<li class="item draggable ui-draggable ui-draggable-handle">';
						dragHtml+=jQuery(this).html();
						dragHtml+='</li>';
					});
					dragHtml+='</ul>';
					return jQuery(dragHtml);
      			},
				cursor: "move",
				drag: function(event,ui){
					var $helper = ui.helper;
					jQuery($helper).removeClass("selected");
					var $selected = jQuery(".selected");	
				}
			 });
			
			function moveSelected($list,$selected){
				 var vals = '';
				jQuery($selected).each(function(){
					jQuery(this).appendTo($list).removeClass("selected");
					var items_id = jQuery(this).data('id');
					 vals += (',' + items_id);
				});			
				var gid = jQuery("#accordion .in").data('id');
				vals = vals.substring(1);
				addItems(gid,vals);
			}
			
			function moveItem( $item,$list ) {
				var items_id = $item.data('id');
				var pos = $item.data('pos');
				var gid = jQuery("#accordion .in").data('id');
				$item.find(".item").remove();
				$item.appendTo( $list );
				if(pos == undefined)
					addItems(gid,items_id);
			}
			
			jQuery(".item").click(function(e){
				if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
					jQuery(".item").removeClass("selected");
				}
				if(e.shiftKey)
				{
					var stopShiftClick = jQuery(this).data('id');
					var start=0;
					var end = 0;
					if(parseInt(stopShiftClick)>parseInt(shiftClick)){
						start=shiftClick;
						end=stopShiftClick;
					}
					else{
						start=stopShiftClick;
						end=shiftClick;
					}
					jQuery("#draggableBox .item").each(function(){
						var id =  parseInt(jQuery(this).data('id'));
						if(id>= start && id<=end){
							jQuery(this).addClass("selected");
						}
					});
				}
				shiftClick = jQuery(this).data('id');
				
				jQuery(this).toggleClass("selected");
			});
 //
}
function removeGroup(id)
{
	group_id = 0;
	loadStart();
	 var xml = '<request><sessionid>' + sessionid + '</sessionid><colorpalettegroupid>' + id + '</colorpalettegroupid><colorpaletteitemid>0</colorpaletteitemid></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteColorPaletteItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteColorPaletteItemResult;
            if (r.isSuccessful == false) {
               checkError(r, "removeGroup("+id+")");
            }
            else {
                loadColorPaletteItems($_colid);
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function removeItem(gid,id)
{
	group_id = gid;
		loadStart();
		var xml = '<request><sessionid>' + sessionid + '</sessionid><colorpalettegroupid>0</colorpalettegroupid><colorpaletteitemid>' + id + '</colorpaletteitemid></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteColorPaletteItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteColorPaletteItemResult;
            if (r.isSuccessful == false) {
               checkError(r, "removeItem("+gid+","+id+")");
            }
            else {
                loadColorPaletteItems($_colid);
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function saveEdit(){
	var name = jQuery('#group_name').val();
	var priceincrease = jQuery('#additional_cost').val();
	var id = jQuery('#group_id').val();
	addColorPaletteGroup($_colid, name, priceincrease, id);
	jQuery('#editModal').modal('hide');
}
function editGroup(id,name,priceIncrease)
{
	group_id = id;
	jQuery('#group_name').val(name);
	jQuery('#additional_cost').val(priceIncrease);
	jQuery('#group_id').val(id);
	jQuery('#editModal').modal('show');
}
function addItems(gid,id)
{
	group_id = gid;
	loadStart();
	var xml = '<request><sessionid>' + sessionid + '</sessionid><colorpalettegroupid>' + gid + '</colorpalettegroupid><colorpaletteitemid>0</colorpaletteitemid><mediacolors>' + id + '</mediacolors></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/SaveColorPaletteItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SaveColorPaletteItemResult;
            if (r.isSuccessful == false) {
               checkError(r, "addItems("+gid+","+id+")");
            }
            else {
                loadColorPaletteItems($_colid);
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function editMediaColorDropdown(){
		mediacolordropdownid = $_colid;
		addMediaColorDropdown();
}

function arrangeColorPaletteGroup(id, position) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><colorpaletteid>' + $_colid + '</colorpaletteid><id>' + id + '</id><position>' + position + '</position></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ArrangeColorPaletteGroup",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ArrangeColorPaletteGroupResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                 loadColorPaletteItems($_colid);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}
function arrangeColorPaletteItem(gid,id, position) {
    var xml = '<request><sessionid>' + sessionid + '</sessionid><colorpalettegroupid>' + gid + '</colorpalettegroupid><id>' + id + '</id><position>' + position + '</position></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ArrangeColorPaletteItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ArrangeColorPaletteItemResult;
            if (r.isSuccessful == false) {
                 checkError(r, "arrangeColorPaletteItem("+gid+","+id+","+position+")");
            }
            else {
                loadColorPaletteItems($_colid);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
    });
}