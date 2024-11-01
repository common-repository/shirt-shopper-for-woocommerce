var filter = [];
var cID = 0;
var cLABEL = 1;
var cLABELS = 2;
var cITEMID = 3;
var cITEMNAME = 4;
var cSHOW = 6;
var sessionid="";
jQuery(document).ready(function($){
	sessionid = readCookie('frontend_sessionid');
   if (sessionid) {
	  SetupSearch($_productid);
  }
  else{
	  login("SetupSearch("+$_productid+")");
  }
	   
	var timeout;


	//open the lateral panel
	jQuery('.cd-btn').on('click', function(event){
		event.preventDefault();
		jQuery('.cd-panel').addClass('is-visible');
	});
	//clode the lateral panel
	jQuery('.cd-panel').on('click', function(event){
		if( jQuery(event.target).is('.cd-panel') || jQuery(event.target).is('.cd-panel-close') || jQuery(event.target).is('.cd-panel-close .glyphicon-remove') ) { 
			jQuery('.cd-panel').removeClass('is-visible');
			loadEnd();
			event.preventDefault();
		}
	});

   
	
	//for stop dropdown hide inside click
	jQuery('body').on('click','.dropdown-menu',function(e){
		e.stopPropagation();
	});
	
	//for show and hide add filter menu
	jQuery('.add-filter-btn,ul.add-filter-list').on('mouseover', function(e){
		jQuery(this).parent().addClass('open');
		clearTimeout(timeout);
	});
	
	jQuery('.add-filter-btn,ul.add-filter-list').on('mouseout', function(e){
		var $this = jQuery(this);
		timeout = setTimeout(function(){
			$this.parent().removeClass('open');
		}, 200);
	});
	
	//for page load check filter select and show them
	jQuery('.add-filter-list input[type=checkbox]').each(function(){
		if(jQuery(this).prop("checked") != true){
			jQuery('.filter-container')
				.find("[data-filter-menu='" + jQuery(this).attr('data-filter-box') + "']")
				.removeClass('active-filter');
		}
		//SearchApparel();
	});
	
	//for show filter that user select from dropdown
	jQuery('body').on('change','input[type=checkbox].add-filter-checkbox',function(){
		if(jQuery(this).prop("checked") != true){
			jQuery('.filter-container')
				.find("[data-filter-menu='" + jQuery(this).attr('data-filter-box') + "']").remove();
		}
		//SearchApparel();
	});	

	jQuery('body').on('change', '.js-filter-item input[type=checkbox]', function () {
	    //SearchApparel();	    
	});
	//for show chosen filter to user
	jQuery('body').on('change','.js-filter-item input[type=checkbox]',function(){
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
	});
	
	//for remove chosen filter by user
	jQuery('body').on('click','.remove-chosenFilter',function(){
		var showFilter = jQuery(this).parent().attr('class');
		showFilterClass = showFilter.replace(/ /g, '');
		showFilterClass = showFilterClass.replace("/", '');
		showFilterClass = showFilterClass.replace('chosen', '');
		jQuery(this).parents('.filter-item:first').find('input[type=checkbox].' + showFilterClass + '').removeClass(showFilterClass).prop("checked", false);
		
		var length = jQuery(this).parents('.filter-item:first').find('input[type=checkbox]:checked').length;
		if(parseInt(length)==0)
			 jQuery(this).parents('.filter-item:first').find('.add-filter-list').find('.js-filter-checkbox:first').prop("checked", true);
			
		
        jQuery(this).parent().remove();
		SearchApparel($_productid);
    });
	
	jQuery('body').on('click','#popup_add_to_cart',function(){
		jQuery.ajax({
        type: "POST",
        url: wc_add_to_cart_params.ajax_url,
        data: jQuery('#popupForm').serialize()+'&action=addtocartApparel&product_id='+jQuery("#popup_product_id").val(),
        success: function (response) {
				window.location.reload(true);
		},
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
        }
	});	
	});
});
var brandcolors = [];
function SetupSearch(productid) {
    if (productid == undefined)
        productid = 0;
    var xml = "<request><sessionid>" + sessionid + "</sessionid><productid>" + productid + "</productid></request>";
	loadStart();
    jQuery.ajax({
        type: "POST",
        url: url + "/Site.svc/ApparelSearchSetup",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ApparelSearchSetupResult;
            if (r.isSuccessful == false) {
                checkError(r, "SetupSearch("+productid+")");
                return;
            }
            else {
                var data = eval(r.Data);
				var brand_data = data[0];
				//brandcolors = data[0];
				for (var i = 0; i < brand_data.length; i++) {
					brandcolors[brand_data[i].ID] = brand_data[i];
				}
				
                var CATS = data[1];
                var SORT = data[2];
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
                        $html += '			<input type="checkbox" class="js-filter-checkbox" id="' + c.ID + '~' + ci.ID + '" onchange="javascript:SearchApparel('+$_productid+');">';
                        $html += '			<span class="add-filter-name">' + ci.Name + '</span>';
                        $html += '		</label>';
                        $html += '	</li>';
                    }
                    menuData = '';
                    var html = '<div class="btn-group filter-item active-filter" data-filter-menu="' + menuData + '">';
                    html += '<button type="button" id="' + c.ID + '" class="btn add-filter-btn keep-open"  data-target="#" data-toggle="dropdown">';
                    html += '' + c.Name + ' <span class="glyphicon glyphicon-chevron-down"></span></button>';
                    html += '<ul class="dropdown-menu add-filter-list" role="menu">';
                    html += $html;
                    html += '</ul>';
                    html += '</div>';
					
					if(c.Items.length>1)
                    	jQuery('.filter-container').append(html);                    
                }                
                for (var i = 0; i < SORT.length; i++) {
                    jQuery('#sortBy').append(jQuery("<option></option>").attr("value", SORT[i].ID).text(SORT[i].Name));
                }
                SearchApparel($_productid);
				
				
				
				
            }
	    },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function login(called_function) {
    var xml = '<request><clientname>'+$_cn+'</clientname><sitekey>'+$_sk+'</sitekey><username>'+$_un+'</username></request>';
	loadStart();
    jQuery.ajax({
        type: "POST",
        url: url + "/Site.svc/SiteLogin",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.SiteLoginResult;
            if (r.isSuccessful == false) {
                alert(r.ErrorDescription + "(" + r.ErrorNumber + ")")
            }
            else {
                sessionid = r.SessionID;
				createCookie('frontend_sessionid',sessionid,30);
                callEval(called_function);
            }
	    },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
var colorPrice=new Array();
var colorList=new Array();
var colorListName=new Array();
var colorListImage=new Array();
var itemList=new Array();
var colorQuantity=new Array();
function popDetail(apparelid) {
	loadStart();
    var xml = "<request><sessionid>" + sessionid + "</sessionid><apparelid>" + apparelid + "</apparelid><productid>" + $_productid + "</productid></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Site.svc/ApparelGet",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ApparelGetResult;
			if (r.isSuccessful == false) {
                 checkError(r, "popDetail("+apparelid+")");
                return;
            }
            else {

                var data = eval(r.Data);
				var apparel_list = data[0];
                var colorsize_list = data[1];
				
                var color_list = data[2];
                var size_list = data[3];
				var placements_list = data[4];
                //var designattribute_list = data[4];
                //var designcolors_list = data[5];
						

                colorPrice=new Array();
				colorQuantity=new Array();
				colorList=new Array();
				itemList=new Array();
				colorID=new Array();
                var apparel = apparel_list[0];                
                jQuery("#aNameHeading").html(apparel.Name+", Style No: "+apparel.Style);
                
                jQuery("#aDescription").html(apparel.Description); 
                for (var i = 0; i < colorsize_list.length; i++) {
                    var acs = colorsize_list[i];
					colorPrice[acs.ApparelBrandColor.ID+"_"+acs.ApparelSize.ID] = acs.DefaultPrice.Price;
                    colorID[acs.ApparelBrandColor.ID+"_"+acs.ApparelSize.ID] = acs.ID;
					colorQuantity[acs.ApparelBrandColor.ID+"_"+acs.ApparelSize.ID] = acs.QuantityAvailable; 
				}
				jQuery("#aColors").html("");
				for (var i = 0; i < color_list.length; i++) {
                    //ID,Name,ColorSquareImage,Image,Thumbnail
					var color = color_list[i];
					var ap_color='';
					if(i==0)
					{
						jQuery("#aImage").attr('src', 'http://api.thetshirtguylv.com/image/COLOR_PRODUCT_IMAGE/' + color.Image);
						ap_color='ap_color_sel';
					}
					else
					{
						ap_color='';
					}
						
                    
                    var img = "<img src='http://api.thetshirtguylv.com/image/COLOR_SQUARE_IMAGE/" + color.ColorSquareImage + "' alt='" + color.Name + "' /> ";
					var link = "<a href=\"javascript:setImage('" + color.Image + "','"+color.ID+"','" + color.Name + "','"+color.ColorSquareImage+"');\"  class=\"ap_color " + ap_color + "\">" + img + "</a>";
					colorList.push(color.ID);
					colorListName.push(color.Name);
					colorListImage.push("http://api.thetshirtguylv.com/image/COLOR_SQUARE_IMAGE/" + color.ColorSquareImage);
                    jQuery("#aColors").append(link);
                }
                jQuery('#aSizes').html("");
				jQuery('#aSizeBox').html("");
				var th="";
				var td="";
				var tdp="";
				
				jQuery.each(size_list, function (i, item) {
					th+='<th class="class_size_'+item.ID+'"><input type="hidden" name="size['+item.ID+']" value="'+item.Name+'">'+item.Name+'</th>';
					tdp+= '<td class="class_size_'+item.ID+'"><input type="hidden" name="colorid['+item.ID+']" value="'+colorID[colorList[0]+"_"+item.ID]+'"><input type="hidden" name="price['+item.ID+']" value="'+colorPrice[colorList[0]+"_"+item.ID]+'" id="price_box_'+item.ID+'"><span id="price_'+item.ID+'">$'+parseFloat(colorPrice[colorList[0]+"_"+item.ID]).toFixed(2)+'</span></td>';
					td+= '<td class="class_size_'+item.ID+'"><input type="text" class="numqut"  name="qut['+item.ID+']" value="" placeholder="0"></td>';
					itemList.push(item.ID);
					if(parseInt(colorQuantity[colorList[0]+"_"+item.ID])<=0)
						jQuery('.class_size_'+item.ID).hide();
					else
						jQuery('.class_size_'+item.ID).show();
						
			    });
				if(th!='')
				{
					var boxHtml='<table class="table productDTable"><thead><tr><th>&nbsp;</th>';
					boxHtml+=th;
					boxHtml+='</tr></thead><tbody>';
					boxHtml+='<tr><td>Price</td>';
					boxHtml+=tdp;
					boxHtml+='</tr>';
					boxHtml+='<tr><td>Quantity</td>';
					boxHtml+=td;
					boxHtml+='</tr>';
					boxHtml+='</tbody></table>';
					boxHtml +='<input type="hidden" name="apparelname" value="'+apparel.Name+'" id="apparelname">';
					boxHtml +='<input type="hidden" name="ProductID" value="'+$_productid+'" id="ProductID">';
					boxHtml +='<input type="hidden" name="color" value="'+colorListName[0]+'" id="color">';
					boxHtml +='<input type="hidden" name="colorimage" value="'+colorListImage[0]+'" id="colorimage">';
					boxHtml +='<input type="hidden" name="sizename" value="'+apparel.Style+'" id="sizename">';
					boxHtml +='<input type="hidden" name="apprelimage" value="http://api.thetshirtguylv.com/image/COLOR_PRODUCT_IMAGE/'+apparel.PreviewImage+'" id="apprelimage">';
					boxHtml +='';
					jQuery('#aSizeBox').html(boxHtml);
				}
//

			jQuery("#placementImage").html("");	
			var placementImage = [];
			jQuery("#placementImageContent").html("");	
			var placementImageContent = [];
			for (var p = 0; p < placements_list.length; p++) {
				 var pAttr = placements_list[p];
				  var designattribute_list = pAttr.DesignAttributes;
   				  var designcolors_list = pAttr.DesignColors;
				  var temp = '<div class="col-sm-4">';
				  temp += '<div class="placement_image">';
				  temp += '<a href="javascript:replaceDesignImage(\''+pAttr.PreviewImage+'\')"><img src="' + pAttr.PreviewImage + '" alt="' + pAttr.PlacementName + '" /></a>';
				  temp += '</div>';
				  temp += '<div class="placement_title">'+pAttr.PlacementName+'</div>';
				  temp +='</div>';
				  placementImage.push(temp);
				  
				  //Attributes
				  var aDesignAttributes = [];
				  for (var i = 0; i < designattribute_list.length; i++) {
                    var dAttr = designattribute_list[i];
					var default_value = dAttr.DefaultValue;
					
                    if (dAttr.DesignAttributeTypeName == 'Drop Down List') {
                        var ddl = dAttr.DropDownList;
                     
var temp = '<div class="custom_dropdown">';
temp += '<div class="form-group">';
temp += '<label for="">'+dAttr.Description + ':</label><input type="hidden" name="design_attribute['+pAttr.PlacementID+']['+dAttr.ID+'][drop_down_list]['+dAttr.Description.replace(/"/g, "'") + ']" id="attdrop'+pAttr.PlacementID+'_'+dAttr.ID+'_hidden" value="" >';
				temp += '<div class="dropdownss">';
				  temp += '<div class="dropbtnss"><span id="attdrop'+pAttr.PlacementID+'_'+dAttr.ID+'"></span></div>';
					temp += '<div class="dropdown-contentss" id="attdrop'+pAttr.PlacementID+'_'+dAttr.ID+'_section">';
				    temp += '<ul>';
					if(ddl!=null){
						 	for (var j = 0; j < ddl.Items.length; j++) {
                            var item = ddl.Items[j];
							var priceIncrease='';
							if (item.PriceIncrease > 0)
									priceIncrease += ' $' + item.PriceIncrease.toFixed(2);  
								var sel_class ='';
								if(default_value==item.Name){
									sel_class ='normal_options_select';
								}
								
								temp += '<li class="normal_options '+sel_class+'" data-price="'+item.PriceIncrease+'" data-value="' + item.ID + '_+_'+item.Name.replace(/"/g, "'")+'_+_'+item.PriceIncrease+'" data-id="#attdrop'+pAttr.PlacementID+'_'+dAttr.ID+'_hidden"><div class="label_text label_text_price">' + item.Name+'</div><div class="label_color_price">'+priceIncrease+ '</div></li>';
							}
					}
						temp += '</ul>';
				  temp += '</div>';
				temp += '</div>';
temp += '</div>';
temp += '</div>';
						
                        aDesignAttributes.push(temp);
                    }
                    else if (dAttr.DesignAttributeTypeName == 'Textbox') {
                        aDesignAttributes.push('<div class="form-group"><label for="">'+dAttr.Description + ':</label><input name="design_attribute['+pAttr.PlacementID+']['+dAttr.ID+'][textbox]['+dAttr.Description.replace(/"/g, "'") + ']" type="text" value="' + dAttr.DefaultValue + '" class="form-control"/></div>');
                    }
                    else if (dAttr.DesignAttributeTypeName == 'Multiline Textbox') {
                    	aDesignAttributes.push('<div class="form-group"><label for="">'+dAttr.Description + ':</label><textarea name="design_attribute['+pAttr.PlacementID+']['+dAttr.ID+'][multiline_textbox]['+dAttr.Description.replace(/"/g, "'") + ']" class="form-control">' + dAttr.DefaultValue + '"</textarea></div>');
                    }
                    else if (dAttr.DesignAttributeTypeName == 'Date Picker') {
                    	aDesignAttributes.push('<div class="form-group"><label for="">'+dAttr.Description + ':</label><input name="design_attribute['+pAttr.PlacementID+']['+dAttr.ID+'][date_picker]['+dAttr.Description.replace(/"/g, "'") + ']" class="form-control" type="text" value="' + dAttr.DefaultValue + '"/></div>');
                    }
                    else if (dAttr.DesignAttributeTypeName == 'File Upload') {
                    	aDesignAttributes.push('<div class="form-group"><label for="">'+dAttr.Description + ':</label><input name="design_attribute['+pAttr.PlacementID+']['+dAttr.ID+'][file_upload]['+dAttr.Description.replace(/"/g, "'") + ']" class="form-control" type="file" /></div>');
                    }
                }
				var aDesignAttributesHtml = "";
				for (var i = 0; i < aDesignAttributes.length; i++) {
					aDesignAttributesHtml+=aDesignAttributes[i];
                }
				//
				//design color
				 var aDesignColors = [];
				
                for (var i = 0; i < designcolors_list.length; i++) {
                    var dc = designcolors_list[i];
					var default_value = dc.DefaultColorPaletteItemID;
					
var temp = '<div class="custom_dropdown">';
	temp += '<div class="form-group"><label for="">'+dc.Description + ':</label><input type="hidden" name="design_colors['+pAttr.PlacementID+']['+dc.ID+']['+dc.Description.replace(/"/g, "'") + ']" id="drop'+pAttr.PlacementID+'_'+dc.ID+'_hidden" value="" >';
	temp += '<div class="dropdownss">';
	  temp += '<div class="dropbtnss"><span id="drop'+pAttr.PlacementID+'_'+dc.ID+'"></span></div>';
	  temp += '<div class="dropdown-contentss" id="drop'+pAttr.PlacementID+'_'+dc.ID+'_section">';
		 temp += '<ul>';
		 for (var j = 0; j < dc.ColorPaletteGroups.length; j++) {
			  var cgp = dc.ColorPaletteGroups[j];
			   if (cgp.PriceIncrease > 0)
					temp += '<li class="normal_group">' + cgp.Name + ' +$' + cgp.PriceIncrease.toFixed(2)+'</li>';                  
				else
					temp += '<li class="normal_group">' + cgp.Name +'</li>';
				for (var k = 0; k < cgp.ColorPaletteItems.length; k++) {
					var cpi = cgp.ColorPaletteItems[k];
					var HtmlColor='';
					if(cpi.HtmlColor!='')
						HtmlColor = 'style="background-color:'+cpi.HtmlColor+'"';
						
						var PatternImage='';
					
						if(cpi.HasPattern ==true){
							PatternImage = '<img src="'+$site_url+'?apparel-image=1&media-id='+cpi.MediaColorID+ '"  >';
						}
						else if(cpi.PatternImage!=''){
							PatternImage = '<img src="http://api.thetshirtguylv.com' + cpi.PatternImage + '"  >';
						}
						var sel_class ='';
						if(default_value==cpi.ID){
							sel_class ='normal_options_select';
						}
						
					temp += '<li class="normal_options '+sel_class+'" data-value="' + cgp.ID + '_+_'+cgp.Name.replace(/"/g, "'")+'_+_'+cgp.PriceIncrease+'_+_'+cpi.ID+'_+_'+cpi.MediaColorName.replace(/"/g, "'")+'" data-price="'+cgp.PriceIncrease+'" data-id="#drop'+pAttr.PlacementID+'_'+dc.ID+'_hidden"><div class="label_text">' + cpi.MediaColorName + '</div><div class="label_color" '+HtmlColor+'>'+PatternImage+'</div></li>';
                 }
		 }
		temp += '</ul>';
	  temp += '</div>';
	temp += '</div>';
temp += '</div>';
temp += '</div>';

					
					aDesignColors.push(temp);
                }
				var aDesignColorsHtml = "";
				for (var i = 0; i < aDesignColors.length; i++) {
					aDesignColorsHtml+=aDesignColors[i];
                }
                //
				
				
				
				placementImageContent.push('<div class="col-sm-4"><input type="hidden" name="design_placement['+pAttr.PlacementID+']" value="'+pAttr.PlacementName+'" ><input type="hidden" name="design_placement_image['+pAttr.PlacementID+']" value="'+pAttr.PreviewImage+'" ><div class="placement_image_content_box"><div class="placement_name">'+pAttr.PlacementName+'</div><div class="design_colors">'+aDesignColorsHtml+'</div><div class="design_attributes">'+aDesignAttributesHtml+'</div></div></div>');
                
				  
				  
				  
			}
			for (var i = 0; i < placementImage.length; i++) {
                	jQuery("#placementImage").append(placementImage[i]);
			}
			for (var i = 0; i < placementImageContent.length; i++) {
                	jQuery("#placementImageContent").append(placementImageContent[i]);
			}

jQuery(".dropbtnss span").on("click", function(event) {
	var id = jQuery(this).attr("id");
	jQuery('.dropdown-contentss').not('#' + id +'_section').hide();
	jQuery('#' + id +'_section').slideToggle();
	event.stopPropagation();
});

jQuery(".dropdown-contentss .normal_options").on("click", function(event) {
	var price = jQuery(this).data("price");
	if(price>0){
			var text = jQuery(this).find('.label_text').html();
			var color = jQuery(this).find('.label_color').html();
			var html ='';
			if(typeof(color)!="undefined"){
				html +='<div class="label_text_price_color">'+text+'</div>';
				html +='<div class="label_color">'+color+'</div>';
			}
			else{
				html +='<div class="label_text_price">'+text+'</div>';
			}
			html +='<div class="label_color_price">+'+price.toFixed(2)+'</div>';
	}
	else
	{
		var html = jQuery(this).html();
	}
    jQuery(this).parent().parent().parent().find('.dropbtnss span').html(html);
    jQuery(this).parent().parent().slideToggle();
	jQuery(jQuery(this).data("id")).val(jQuery(this).data("value"));
	event.stopPropagation();
});	
jQuery(window).click(function() {
	jQuery('.dropdown-contentss').hide();
});
jQuery('.dropdown-contentss').each(function(index){
	var price = jQuery(this).find('li.normal_options_select').data("price");
	if(price>0){
			var text = jQuery(this).find('li.normal_options_select').find('.label_text').html();
			var color = jQuery(this).find('li.normal_options_select').find('.label_color').html();
			var html ='';
			if(typeof(color)!="undefined"){
				html +='<div class="label_text_price_color">'+text+'</div>';
				html +='<div class="label_color">'+color+'</div>';
			}
			else{
				html +='<div class="label_text_price">'+text+'</div>';
			}
			
			html +='<div class="label_color_price">+'+price.toFixed(2)+'</div>';
	}
	else
	{
		var html = jQuery(this).find('li.normal_options_select').html();
	}
	
	var id = jQuery(this).find('li.normal_options_select').data("id");
	var value = jQuery(this).find('li.normal_options_select').data("value");
	jQuery(this).find('li.normal_options_select').parent().parent().parent().find('.dropbtnss span').html(html);
	jQuery(id).val(value);
});				
				
				jQuery('.ap_color').click(function(){
					jQuery('.ap_color').removeClass('ap_color_sel');
					jQuery(this).addClass('ap_color_sel');
				});
				
				jQuery("#loadDetailProduct").trigger("click");
				return;
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
            loadEnd();
	    }
    });
}
function replaceDesignImage(src){
		jQuery("#design_image_box").html('<img src="'+src+'" >');
}
function setImage(PreviewImage,color_id,color_name,color_image) {
    jQuery("#aImage").attr('src', 'http://api.thetshirtguylv.com/image/COLOR_PRODUCT_IMAGE/' + PreviewImage);
	for (var i = 0; i < itemList.length; i++) {
		jQuery("#price_"+itemList[i]).html('$'+parseFloat(colorPrice[color_id+"_"+itemList[i]]).toFixed(2));
		jQuery("#price_box_"+itemList[i]).val(colorPrice[color_id+"_"+itemList[i]]);
		
		if(parseInt(colorQuantity[color_id+"_"+itemList[i]])<=0)
			jQuery('.class_size_'+itemList[i]).hide();
		else
			jQuery('.class_size_'+itemList[i]).show();	
	}
	jQuery("#color").val(color_name);
	jQuery("#colorimage").val("http://api.thetshirtguylv.com/image/COLOR_SQUARE_IMAGE/" + color_image);
	jQuery("#apprelimage").val("http://api.thetshirtguylv.com/image/COLOR_PRODUCT_IMAGE/" + PreviewImage);
}

function loadFilters() {
    GetApparelBrandColors();

    filter[0] = ['fltr_brand', 'Brand', 'All Brands', [], [], false]; GetApparelBrands(filter[0]);
    filter[1] = ['fltr_category', 'Category', 'All Categories', [], [], false]; GetApparelCategories(filter[1]);

    var $addFilterMenu = [];
    for (var i = 0; i < filter.length; i++) {
        $addFilterMenu += '<li class="add-filter-item">';
        $addFilterMenu += '<label>';
        $addFilterMenu += '<input type="checkbox" class="add-filter-checkbox" id="' + filter[i][cID] + '" data-filter-box="' + i + '">';
        $addFilterMenu += '<span class="add-filter-name">' + filter[i][cLABEL] + '</span>';
        $addFilterMenu += '</label>';
        $addFilterMenu += '</li>';
    }
    jQuery('.add-filter-list').append($addFilterMenu);
}
var timeoutId = 0;
var gtotal=0;
var gdd=0;
function SearchApparel(productid) {
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
    loadStart();
    var xml = "<request><sessionid>" + sessionid + "</sessionid><productid>" + productid + "</productid><filteritems>" + filtercats + "</filteritems><sortby>" + jQuery('#sortBy').val() + "</sortby></request>";
    jQuery.ajax({
        type: "POST",
        url: url + "/Site.svc/ApparelSearch",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jQuery.xml2json(xml)),
        dataType: "json",
        success: function (response) {
            var r = response.ApparelSearchResult;
            if (r.isSuccessful == false) {
                 checkError(r, "SearchApparel("+productid+")");
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
                    div += '  <a href="javascript:popDetail(' + a.ID + ');"><img src="http://api.thetshirtguylv.com/image/COLOR_PRODUCT_IMAGE/' + a.PreviewImage + '" class="img-responsive" ></a>';
					div +='</div>';
                    div += '  <div class="content ttglv_apparel">';
                    div += '    <h2 class="hding">' + a.Name + '</h2>';
                   // div += '    <p class="margin-10-20">' + a.Style + '</p>';
                    div += '    <p class="margin-10-20">Starting At ' + a.StartingPrice + '</p>';
                    div += '    <p class="margin-10-20">' + a.AvailableSizes + '</p>';
                    div += '    <div class="display-color-brands">' + DisplayBrandColors(a.AvailableColors) + '</div>';
                    div += '  </div>';
					div += '</div>';
                    div += '</div>';
                    jQuery("#apparelResults").append(div);
				}
				 jQuery('.jcarousel').jcarousel();

        jQuery('.jcarousel-control-prev')
            .on('jcarouselcontrol:active', function() {
                jQuery(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                jQuery(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '-=1'
            });

        jQuery('.jcarousel-control-next')
            .on('jcarouselcontrol:active', function() {
                jQuery(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                jQuery(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '+=1'
            });

        jQuery('.jcarousel-pagination')
            .on('jcarouselpagination:active', 'a', function() {
                jQuery(this).addClass('active');
            })
            .on('jcarouselpagination:inactive', 'a', function() {
                jQuery(this).removeClass('active');
            })
            .jcarouselPagination();
    
				var maximage=0;
				jQuery(".highlight-box img").load(function() {
					var highestBox = 0;
					jQuery('#apparelResults .highlight-image').each(function(){  
							if(jQuery(this).height() > highestBox){  
								highestBox = jQuery(this).height();  
							}
					});
					var highestHeadingBox = 0;
					jQuery('.ttglv_apparel .hding').each(function(){  
							if(jQuery(this).height() > highestHeadingBox){  
								highestHeadingBox = jQuery(this).height();  
							}
					});   
					jQuery('.ttglv_apparel .hding').height(highestHeadingBox);
					
					jQuery('#apparelResults .highlight-box').height(highestBox);
					if(jQuery(this).height() > maximage){ 
						maximage = jQuery(this).height();
						jQuery('#apparelResults .highlight-image-box').height(maximage);
					}
				});
            }
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
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
function SearchResults(startat,page,configid) {
    paginate(page, configid);
    var xml = "<request><sessionid>" + sessionid + "</sessionid><apparelsearchconfigid>" + configid + "</apparelsearchconfigid><startat>" + startat + "</startat></request>";
	loadStart(); 
    jQuery.ajax({
        type: "POST",
        url: url + "/Site.svc/ApparelSearchResults",
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
                   // div += '    <p class="margin-10-20">' + a.Style + '</p>';
                    div += '    <p class="margin-10-20">Starting At ' + a.StartingPrice + '</p>';
                    div += '    <p class="margin-10-20">' + a.AvailableSizes + '</p>';
                    div += '    <div class="display-color-brands">' + DisplayBrandColors(a.AvailableColors) + '</div>';
                    div += '  </div>';
					div += '  </div>';
                    div += '</div>';
                    jQuery("#apparelResults").append(div);
                }
				 jQuery('.jcarousel').jcarousel();

        jQuery('.jcarousel-control-prev')
            .on('jcarouselcontrol:active', function() {
                jQuery(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                jQuery(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '-=1'
            });

        jQuery('.jcarousel-control-next')
            .on('jcarouselcontrol:active', function() {
                jQuery(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                jQuery(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '+=1'
            });

        jQuery('.jcarousel-pagination')
            .on('jcarouselpagination:active', 'a', function() {
                jQuery(this).addClass('active');
            })
            .on('jcarouselpagination:inactive', 'a', function() {
                jQuery(this).removeClass('active');
            })
            .jcarouselPagination();
    
				var maximage=0;
				jQuery(".highlight-box img").load(function() {
					var highestBox = 0;
					jQuery('#apparelResults .highlight-image').each(function(){  
							if(jQuery(this).height() > highestBox){  
								highestBox = jQuery(this).height();  
							}
					});   
					jQuery('#apparelResults .highlight-box').height(highestBox);
					
					var highestHeadingBox = 0;
					jQuery('.ttglv_apparel .hding').each(function(){  
							if(jQuery(this).height() > highestHeadingBox){  
								highestHeadingBox = jQuery(this).height();  
							}
					});   
					jQuery('.ttglv_apparel .hding').height(highestHeadingBox);
					
					if(jQuery(this).height() > maximage){ 
						maximage = jQuery(this).height();
						jQuery('#apparelResults .highlight-image-box').height(maximage);
					}
				});
			}
			loadEnd();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText + ' - ' + xhr.error + ' - ' + thrownError);
			loadEnd();
        }
    });
}
function DisplayBrandColors(list) {
		var tmp = '<div class="jcarousel-wrapper">';
		tmp += '<div class="jcarousel">';
		tmp +='<ul>';
    for (var i = 0; i < list.length; i++) {
        if (brandcolors[list[i]] != undefined)
            tmp += "<li><img src='http://api.thetshirtguylv.com/image/COLOR_SQUARE_IMAGE/" + brandcolors[list[i]].ColorSquareImage + "' alt='" + brandcolors[list[i]].Name + "' /></li>";
    }	
	tmp +='</ul>';
    tmp +='</div>';
    tmp +='<a href="javascript:void(0)" class="jcarousel-control-prev">&lsaquo;</a>';
    tmp +='<a href="javascript:void(0)" class="jcarousel-control-next">&rsaquo;</a>';
    tmp +='</div>';
    return tmp;
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
