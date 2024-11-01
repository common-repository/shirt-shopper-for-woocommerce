var brandcolors = [];

function showTrash(id){
	jQuery("#trash_id").val(id);
	jQuery('#trashModal').modal('show');
}
function saveTrash(){
		var id = jQuery("#trash_id").val();
		deleteFilter(id);
		jQuery('#trashModal').modal('hide');
}
function deleteFilter(id) {
    if (id == undefined)
        id = 0;
		
	loadStart();	
    var xml = '<request><sessionid>' + sessionid + '</sessionid><id>' + id + '</id></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/DeleteFilter",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.DeleteFilterResult;
            if (r.isSuccessful == false) {
                checkError(r, "deleteFilter("+id+")");
            }
            else {
                listFilters();
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function listFilters(filterid) {
	if (filterid == undefined)
        filterid = 0;
		
	loadStart();	
    var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ListFilters",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ListFiltersResult;
            if (r.isSuccessful == false) {
                checkError(r, "listFilters("+filterid+")");
            }
            else {
                jQuery("#tblFilters > tbody").html("");
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
                    jQuery("#tblFilters").append("<tr id='filter-" + f.ID + "'><td><a href='admin.php?page=apparel_filter&section=section-2&colid=" + f.ID + "' class='fname'>" + f.Name + "</a></td><td>" + f.ModifyBy + "</td><td>" + f.ModifyOn.formatDate() + "</td><td><a href='admin.php?page=apparel_filter&section=section-2&colid=" + f.ID + "' class='fname'>Edit</a>&nbsp;|&nbsp;<a href='javascript:updateSaveFilter(" + f.ID + ",\"" + f.Name + "\",\"" + f.Value + "\");'>Duplicate</a>&nbsp;|&nbsp;<a href='javascript:showTrash(" + f.ID + ");'>Delete</a></td></tr>");
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
function saveDuplicate(){
		var id = jQuery('#duplicate_id').val();
		var new_name = jQuery('#duplicate_name').val();
		var value = jQuery('#duplicate_value').val();
		saveAsFilter(id,new_name,value);
		jQuery('#duplicateModal').modal('hide');
}
function saveAsFilter(id,name,value) {
	if(parseInt(filter_id)==parseInt(id))
	{
		 var menus = document.getElementsByClassName("btn add-filter-btn keep-open");
    var items = document.getElementsByClassName("js-filter-checkbox");
    var filtercats = '';
    for (var i = 0; i < menus.length; i++) {
        var filteritems = '';
        for (var j = 0; j < items.length; j++) {
            if (items[j].checked == true) {
                var s = items[j].id.split('~');
                if (s[0] == menus[i].id) {
                    if (s[1] != 0)
                        filteritems += (',' + s[1]);
                }
            }
        }
        if (filteritems.length > 0)
            filtercats += (';' + menus[i].id + ':' + filteritems.substr(1));
    }
    if (filtercats.length > 0)
        filtercats = filtercats.substr(1);
	
	if(filtercats=='')
			filtercats = "0:0";
	value =	filtercats;
	
	}
	
		var xml = '<request><sessionid>' + sessionid + '</sessionid><name>' + name + '</name><value>' + value + '</value><id>0</id></request>';
		loadStart();
		jQuery.ajax({
			type: "POST",
			url: url + "/Settings.svc/SaveFilter",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(jQuery.xml2json(xml)),
			dataType: "json",
			success: function (response) {
				var r = response.SaveFilterResult;
				if (r.isSuccessful == false) {
					checkError(r, "saveAsFilter("+id+","+name+","+value+")");
				}
				else {
					var data = eval(r.Data);
					//listFilters(data[0]);
					window.location.href = "admin.php?page=apparel_filter&section=section-2&colid="+data[0];
				}
				loadEnd();
			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
				loadEnd();
			}
		});
	
}
function updateSaveFilter(id,name,value)
{
	jQuery('#duplicate_name').val(name);
	jQuery('#duplicate_id').val(id);
	jQuery('#duplicate_value').val(value);
	jQuery('#duplicateModal').modal('show');
}
function saveNewFilter(name,value) {
	var xml = '<request><sessionid>' + sessionid + '</sessionid><name>' + name + '</name><value>' + value + '</value><id>0</id></request>';
		loadStart();
		jQuery.ajax({
			type: "POST",
			url: url + "/Settings.svc/SaveFilter",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(jQuery.xml2json(xml)),
			dataType: "json",
			success: function (response) {
				var r = response.SaveFilterResult;
				if (r.isSuccessful == false) {
					checkError(r, "saveNewFilter("+name+","+value+")");
				}
				else {
					var data = eval(r.Data);
					//listFilters(data[0]);
					window.location.href = "admin.php?page=apparel_filter&section=section-2&colid="+data[0];
				}
				loadEnd();
			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
				loadEnd();
			}
		});
}


jQuery(document).ready(function ($) {

	var timeout;
    jQuery('body').on('click', '.dropdown-menu', function (e) {
        e.stopPropagation();
    });
    jQuery('.add-filter-btn,ul.add-filter-list').on('mouseover', function (e) {
        jQuery(this).parent().addClass('open');
        clearTimeout(timeout);
    });
    jQuery('.add-filter-btn,ul.add-filter-list').on('mouseout', function (e) {
        var $this = jQuery(this);
        timeout = setTimeout(function () {
            $this.parent().removeClass('open');
        }, 200);
    });
    jQuery('.add-filter-list input[type=checkbox]').each(function () {
        if (jQuery(this).prop("checked") != true) {
            jQuery('.filter-container')
				.find("[data-filter-menu='" + jQuery(this).attr('data-filter-box') + "']")
				.removeClass('active-filter');
        }
     //   SearchApparel();
	});

    //for show filter that user select from dropdown
    jQuery('body').on('change', 'input[type=checkbox].add-filter-checkbox', function () {
        if (jQuery(this).prop("checked") != true) {
            jQuery('.filter-container')
				.find("[data-filter-menu='" + jQuery(this).attr('data-filter-box') + "']").remove();
        }
		   //   SearchApparel();
	 });
	
jQuery('body').on('click', '.js-filter-item input[type=checkbox]', function () {
	jQuery( ".save_link" ).addClass('disable_link');
	jQuery( "#save-"+filter_id ).removeClass('disable_link');
});
    //for show chosen filter to user
    jQuery('body').on('change', '.js-filter-item input[type=checkbox]', function () {
		filterStatus = true;
		if (jQuery(this).prop("checked") == true) {
            var showFilter = jQuery(this).next('.add-filter-name').text();
			showFilterClass = showFilter.replace(/ /g, '');
			showFilterClass = showFilterClass.replace("/", '');
			jQuery(this).addClass('filterName' + showFilterClass + '');
			var oid = jQuery(this).attr('id').split('~');
			if(parseInt(oid[1])>0)
			{
				jQuery(this)
					.parents('.filter-item:first')
					.append('<div class="chosen filterName' + showFilterClass + '">' + showFilter + ' <span class="remove-chosenFilter">X</span></div>');
				jQuery(this).parents('.add-filter-list').find('.js-filter-checkbox:first').prop("checked", false);
			}
			else
			{
					jQuery(this).parents('.filter-item').find('.chosen').remove();
					jQuery(this).parents('.add-filter-list').find('.js-filter-checkbox').prop("checked", false);
					jQuery(this).parents('.add-filter-list').find('.js-filter-checkbox:first').prop("checked", true);
			}
	    }
        else {
            var showFilter = jQuery(this).next('.add-filter-name').text();
			showFilterClass = showFilter.replace(/ /g, '');
			showFilterClass = showFilterClass.replace("/", '');
			jQuery(this).removeClass('filterName' + showFilterClass + '');
            jQuery(this)
			.parents('.filter-item:first')
			.find('.filterName' + showFilterClass + '').remove();
			
			var length = jQuery(this).parents('.filter-item:first').find('input[type=checkbox]:checked').length;
			if(parseInt(length)==0)
			 	jQuery(this).parents('.filter-item:first').find('.add-filter-list').find('.js-filter-checkbox:first').prop("checked", true);
			
        }
			clearTimeout(timeoutId);
			timeoutId = setTimeout(SearchApparel, 500); 
    });

    //for remove chosen filter by user
    jQuery('body').on('click', '.remove-chosenFilter', function () {
		filterStatus=true;
		jQuery( ".save_link" ).addClass('disable_link');
		jQuery( "#save-"+filter_id ).removeClass('disable_link');
		
        var showFilter = jQuery(this).parent().attr('class');
		showFilterClass = showFilter.replace(/ /g, '');
		showFilterClass = showFilterClass.replace("/", '');
		showFilterClass = showFilterClass.replace('chosen', '');
		jQuery(this).parents('.filter-item:first').find('input[type=checkbox].' + showFilterClass + '').removeClass(showFilterClass).prop("checked", false);
		
		var length = jQuery(this).parents('.filter-item:first').find('input[type=checkbox]:checked').length;
		if(parseInt(length)==0)
			 jQuery(this).parents('.filter-item:first').find('.add-filter-list').find('.js-filter-checkbox:first').prop("checked", true);
			
		
        jQuery(this).parent().remove();
		SearchApparel();
    });
});

function showAddModelFilter(){
	jQuery('#addModal').modal('show');
}
function saveAddFilter(){
	var add_name = jQuery('#add_name').val(); 
	var xml = '<request><sessionid>' + sessionid + '</sessionid><name>' + add_name + '</name><value>0:0</value><id>0</id></request>';
		loadFilterStart();
		jQuery.ajax({
			type: "POST",
			url: url + "/Settings.svc/SaveFilter",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(jQuery.xml2json(xml)),
			dataType: "json",
			success: function (response) {
				var r = response.SaveFilterResult;
				if (r.isSuccessful == false) {
					checkError(r, "saveAddFilter()");
				}
				else {
					var data = eval(r.Data);
					window.location.href = "admin.php?page=apparel_filter&section=section-2&colid="+data[0];
					jQuery('#addModal').modal('hide');
				}
				loadFilterEnd();
			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
				loadFilterEnd();
			}
		});	
}


function saveFilter(hasfilterid) {
    id = 0;
	loadFilterStart();
    var menus = document.getElementsByClassName("btn add-filter-btn keep-open");
    var items = document.getElementsByClassName("js-filter-checkbox");
    var filtercats = '';
    for (var i = 0; i < menus.length; i++) {
        var filteritems = '';
        for (var j = 0; j < items.length; j++) {
            if (items[j].checked == true) {
                var s = items[j].id.split('~');
                if (s[0] == menus[i].id) {
                    if (s[1] != 0)
                        filteritems += (',' + s[1]);
                }
            }
        }
        if (filteritems.length > 0)
            filtercats += (';' + menus[i].id + ':' + filteritems.substr(1));
    }
    if (filtercats.length > 0)
        filtercats = filtercats.substr(1);
	if(filtercats=='')
	{
			alert("Please select filter options!");
	}
	else
	{
		loadFilterStart();
		var xml = '<request><sessionid>' + sessionid + '</sessionid><name>' + name + '</name><value>' + filtercats + '</value><id>' + id + '</id></request>';
		jQuery.ajax({
			type: "POST",
			url: url + "/Settings.svc/SaveFilter",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(jQuery.xml2json(xml)),
			dataType: "json",
			success: function (response) {
				var r = response.SaveFilterResult;
				if (r.isSuccessful == false) {
					checkError(r, "saveFilter("+hasfilterid+")");
				}
				else {
					listFilters();
				}
				loadFilterEnd();
			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
				loadFilterEnd();
			}
		});
	}
}
var hiddenfilterid = 0;
var filtername ="";
function SetupSearch() {
	
	filter_id = filterid;
	filterStatus=false;
	jQuery( ".save_link" ).addClass('disable_link');
	
	jQuery(".loadarrow").removeClass('loadarrow-up');
    jQuery(".loadarrow").addClass('loadarrow-down');
	jQuery('.filter-class').remove();
	
	loadFilterStart();	 
    var xml = "<request><sessionid>" + sessionid + "</sessionid><filterid>" + filterid + "</filterid></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ApparelSearchSetup",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ApparelSearchSetupResult;
            if (r.isSuccessful == false) {
                checkError(r, "SetupSearch()");
                return;
            }
            else {
				
				
                jQuery("#productsFacets").empty();
                var tmpActiveItems = [];
                var data = eval(r.Data);

                var FILTERNAME = data[0];
                var COLORS = data[1];
                var CATS = data[2];
                var SORT = data[3];
				jQuery("#ddlName").val(FILTERNAME);
				filtername = FILTERNAME;
                for (var i = 0; i < COLORS.length; i++) {
                    var c = COLORS[i];
                    brandcolors[c.ID] = c;
                }
				var selectionHtml="";
                for (var i = 0; i < CATS.length; i++) {
                    var c = CATS[i];
                    var $html = [];
                    $html += '	<li class="js-filter-item">';
                    $html += '		<label>';
                    $html += '			<input type="checkbox" class="js-filter-checkbox" id="' + c.ID + '~0" CHECKED>';
                    $html += '			<span class="add-filter-name">All ' + c.Name + '</span>';
                    $html += '		</label>';
                    $html += '	</li>';
                    $html += '	<li class="divider"></li>';
                    for (var j = 0; j < c.Items.length; j++) {
                        var ci = c.Items[j];
                        $html += '	<li class="js-filter-item">';
                        $html += '		<label>';
                        $html += '			<input type="checkbox" class="js-filter-checkbox" id="' + c.ID + '~' + ci.ID + '">';
                        $html += '			<span class="add-filter-name">' + ci.Name + '</span>';
                        $html += '		</label>';
                        $html += '	</li>';

                        if (ci.IsActive == true)
                            tmpActiveItems.push(c.ID + '~' + ci.ID);
                    }
					selectionHtml+='<div class="row"><div class="col-sm-12"><div id="filter_name_' + c.ID + '"></div><div id="filter_label_' + c.ID + '"></div></div></div>';
					menuData = '';
                    var html = '<div class="btn-group filter-item active-filter" data-filter-menu="' + menuData + '" data-filter-id="filter_label_' + c.ID + '" data-filter-name-id="filter_name_' + c.ID + '"  data-filter-name="' + c.Name + '">';
                    html += '<button type="button" id="' + c.ID + '" class="btn add-filter-btn keep-open"  data-target="#" data-toggle="dropdown">';
                    html += '' + c.Name + ' <span class="glyphicon glyphicon-chevron-down"></span></button>';
                    html += '<ul class="dropdown-menu add-filter-list" role="menu">';
                    html += $html;
                    html += '</ul>';
                    html += '</div>';
					jQuery("#productsFacets").append(html);
                }
				jQuery("#selectionFilter").html(selectionHtml);
				
				jQuery('#sortBy').append(jQuery("<option></option>").attr("value","0").text("Order By"));
                for (var i = 0; i < SORT.length; i++) {
                    jQuery('#sortBy').append(jQuery("<option></option>").attr("value", SORT[i].ID).text(SORT[i].Name));
                }
                for (var i = 0; i < tmpActiveItems.length; i++) {
                    var d = document.getElementById(tmpActiveItems[i]);
                    jQuery(d).prop("checked", true).change();                    
                }
		       clearTimeout(timeoutId);
			   timeoutId = setTimeout(SearchApparel, 500);
			}
			loadFilterEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadFilterEnd();
        }
    });
}
var timeoutId = 0;
var gtotal=0;
var gdd=0;
function SearchApparel() {
    var menus = document.getElementsByClassName("btn add-filter-btn keep-open");
    var items = document.getElementsByClassName("js-filter-checkbox");
    var filtercats = '';
    for (var i = 0; i < menus.length; i++) {
        var filteritems = '';
        for (var j = 0; j < items.length; j++) {
            if (items[j].checked == true) {
                var s = items[j].id.split('~');
                if (s[0] == menus[i].id) {
                    if (s[1] != 0)
                        filteritems += (',' + s[1]);
                }
            }
        }
        if (filteritems.length > 0)
            filtercats += (';' + menus[i].id + ':' + filteritems.substr(1));
    }
    if (filtercats.length > 0)
        filtercats = filtercats.substr(1);
		
	console.log(filtercats);	
	loadFilterStart();
    var xml = "<request><sessionid>" + sessionid + "</sessionid><filterid>0</filterid><filteritems>" + filtercats + "</filteritems><sortby>" + jQuery('#sortBy').val() + "</sortby></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ApparelSearch",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ApparelSearchResult;
            if (r.isSuccessful == false) {
                 checkError(r, "SearchApparel()");
                return;
            }
            else {
                jQuery("#apparelResults").empty();
                var data = eval(r.Data);
                var totalitems = data[0];
                var d = eval(data[1]);
		        var configid = data[2]; 
				gtotal = totalitems;
				gdd = d;
				jQuery("#totalitems").html(totalitems);
				paginate(1,configid);
                for (var i = 0; i < d.length; i++) {
                    var a = d[i];
                    var div = '<div class="col-sm-2 highlight-box ">';
					div +='<div class="highlight-image">';
					div +='<div class="highlight-image-box">';
                    div += '  <img src="http://api.thetshirtguylv.com/image/COLOR_PRODUCT_IMAGE/' + a.PreviewImage + '" class="img-responsive" >';
					div +='</div>';
                    div += '  <div class="content ttglv_apparel">';
                    div += '    <h2 class="hding">' + a.Name + '</h2>';
                    div += '    <p class="margin-10-20">' + a.Style + '</p>';
                    div += '    <p class="margin-10-20">Starting At ' + a.StartingPrice + '</p>';
                    div += '    <p class="margin-10-20">' + a.AvailableSizes + '</p>';
                    div += '    <div>' + DisplayBrandColors(a.AvailableColors) + '</div>';
                    div += '  </div>';
					div += '</div>';
                    div += '</div>';
                    jQuery("#apparelResults").append(div);
				}
				var maximage=0;
				jQuery(".highlight-box img").load(function() {
					var highestBox = 0;
					jQuery('#apparelResults .highlight-image').each(function(){  
							if(jQuery(this).height() > highestBox){  
								highestBox = jQuery(this).height();  
							}
					});   
					jQuery('#apparelResults .highlight-box').height(highestBox);
					if(jQuery(this).height() > maximage){ 
						maximage = jQuery(this).height();
						jQuery('#apparelResults .highlight-image-box').height(maximage);
					}
				});
				
			}
			loadFilterEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadFilterEnd();
        }
    });
}
function paginate(pageno,configid)
{
	var num =  4;
	jQuery("#dPaging").empty();
	var last_page = Math.ceil(gtotal/gdd.length);
	if(last_page<num)
	{
		num = last_page;
	}
	if(parseInt(gtotal)>0)
	{
		if(parseInt(pageno)>1)
		{
			jQuery("#dPaging").append("<a href='javascript:SearchResults(1,1," + configid + ");'>FIRST</a>&nbsp;");
			var copre=(pageno - 1);
			var maxcnt = (copre-1)*gdd.length;
			maxcnt++;
			jQuery("#dPaging").append("<a href='javascript:SearchResults("+maxcnt+","+ copre +"," + configid + ");'>PREV</a>&nbsp;");
		}
		var start=pageno;
		var end=start+num;
		var minus=end-last_page;
		if(minus>0)
		{
			start=pageno-minus;
			end=start+num;
			if(start<1)
			{
				start=1;
			}
		}
		
		for(var k=start;k<=end;k++)
		{
			if(k==pageno)
			{
				jQuery("#dPaging").append("<strong>"+k + "</strong>&nbsp;");
			}
			else
			{
				var maxcnt = (k-1)*gdd.length;
				maxcnt++;
				jQuery("#dPaging").append("<a href='javascript:SearchResults(" + maxcnt + ","+ k +"," + configid + ");'>" + k + " </a>&nbsp;");
			}

		}
		if(parseInt(pageno)<parseInt(last_page))
		{
			var conext=(pageno + 1);
			var maxcnt = (conext-1)*gdd.length;
			maxcnt++;
			jQuery("#dPaging").append("<a href='javascript:SearchResults("+maxcnt+","+ conext +"," + configid + ");'>NEXT</a>&nbsp;");
			var maxcnt = (last_page-1)*gdd.length;
			maxcnt++;
			jQuery("#dPaging").append("<a href='javascript:SearchResults("+maxcnt+","+last_page+"," + configid + ");'>LAST</a>&nbsp;");
		}
		
	}
}
function DisplayBrandColors(list) {
    var tmp = '';
    for (var i = 0; i < list.length; i++) {
        if (brandcolors[list[i]] != undefined)
            tmp += "<img src='http://api.thetshirtguylv.com/image/COLOR_SQUARE_IMAGE/" + brandcolors[list[i]].ColorSquareImage + "' class='colorsquare' alt='" + brandcolors[list[i]].Name + "' />";
    }
    return (tmp);
}
function SearchResults(startat,page,configid) {
	paginate(page,configid);
	loadFilterStart();
    var xml = "<request><sessionid>" + sessionid + "</sessionid><apparelsearchconfigid>" + configid + "</apparelsearchconfigid><startat>" + startat + "</startat></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ApparelSearchResults",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ApparelSearchResultsResult;
            if (r.isSuccessful == false) {
               checkError(r, "SearchResults("+startat+","+page+"," + configid + ")");
                return;
            }
            else {
                jQuery("#apparelResults").empty();
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var a = data[i];
                    var div = '<div class="col-sm-2 highlight-box ">';
					div +='<div class="highlight-image">';
					div +='<div class="highlight-image-box">';
                    div += '  <a href="javascript:popDetail(' + a.ID + ');"><img src="http://api.thetshirtguylv.com/image/COLOR_PRODUCT_IMAGE/' + a.PreviewImage + '" class="img-responsive" ></a>';
					div += '  </div>';
                    div += '  <div class="content ttglv_apparel">';
                    div += '    <h2 class="hding">' + a.Name + '</h2>';
                    div += '    <p class="margin-10-20">' + a.Style + '</p>';
                    div += '    <p class="margin-10-20">Starting At ' + a.StartingPrice + '</p>';
                    div += '    <p class="margin-10-20">' + a.AvailableSizes + '</p>';
                    div += '    <div>' + DisplayBrandColors(a.AvailableColors) + '</div>';
                    div += '  </div>';
					div += '  </div>';
                    div += '</div>';
                    jQuery("#apparelResults").append(div);
                }
				
				var maximage=0;
				jQuery(".highlight-box img").load(function() {
					var highestBox = 0;
					jQuery('#apparelResults .highlight-image').each(function(){  
							if(jQuery(this).height() > highestBox){  
								highestBox = jQuery(this).height();  
							}
					});   
					jQuery('#apparelResults .highlight-box').height(highestBox);
					if(jQuery(this).height() > maximage){ 
						maximage = jQuery(this).height();
						jQuery('#apparelResults .highlight-image-box').height(maximage);
					}
				});
				
            }
			loadFilterEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadFilterEnd();
        }
    });
}
function editFilter(id) {
	var menus = document.getElementsByClassName("btn add-filter-btn keep-open");
    var items = document.getElementsByClassName("js-filter-checkbox");
    var filtercats = '';
    for (var i = 0; i < menus.length; i++) {
        var filteritems = '';
        for (var j = 0; j < items.length; j++) {
            if (items[j].checked == true) {
                var s = items[j].id.split('~');
                if (s[0] == menus[i].id) {
                    if (s[1] != 0)
                        filteritems += (',' + s[1]);
                }
            }
        }
        if (filteritems.length > 0)
            filtercats += (';' + menus[i].id + ':' + filteritems.substr(1));
    }
	filtername = jQuery("#ddlName").val();
    if (filtercats.length > 0)
        filtercats = filtercats.substr(1);
		loadFilterStart();
		var xml = '<request><sessionid>' + sessionid + '</sessionid><name>' + filtername + '</name><value>' + filtercats + '</value><id>' + id + '</id></request>';
		jQuery.ajax({
			type: "POST",
			url: url + "/Settings.svc/SaveFilter",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(jQuery.xml2json(xml)),
			dataType: "json",
			success: function (response) {
				var r = response.SaveFilterResult;
				if (r.isSuccessful == false) {
					checkError(r, "editFilter("+id+")");
				}
				loadFilterEnd();
			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
				loadFilterEnd();
			}
		});
	
}
function addFilterInner(){
	var newFilterName="new";
	loadFilterStart();	
    var xml = '<request><sessionid>' + sessionid + '</sessionid></request>';
    jQuery.ajax({
        type: "POST",
        url: url + "/Settings.svc/ListFilters",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ListFiltersResult;
            if (r.isSuccessful == false) {
                checkError(r, "addFilter()");
            }
            else {
				var name_status=true;
				var maxid=0;
                var data = eval(r.Data);
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
					var name = f.Name;
					  if(name=='new')
					  {
							name_status=false;
					  }
					  if(name.search("new")>=0)
					  {
						id = name.replace("new", ""); 
						id = id.replace(" ", ""); 
						id = id.replace("(", ""); 
						id = id.replace(")", "");
						if(id!='')
						{
							maxid=(parseInt(id)>maxid)?parseInt(id):maxid;
						}
					  }
                }
				newFilter=++maxid;
				var newFilterName="new";
				if(!name_status)
					newFilterName+=" ("+newFilter+")";
				
				saveNewFilter(newFilterName,"0:0");
		    }
			loadFilterEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        	loadFilterEnd();
		}
    });
}
