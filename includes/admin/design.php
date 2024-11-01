<?php
function shwc_product_design_page(){

		$current_user = wp_get_current_user();
		$clientname = get_option('wc_shirtshopper_clientname');
		$username = $current_user->user_login;
		$sitekey = get_option('wc_shirtshopper_sitekey');
		$section=sanitize_text_field($_GET['section']);
		$display=sanitize_text_field($_GET['display']);
		
		?>
<div class="wrap">
					<script type="text/javascript">
						var $_cn='<?php echo $clientname?>';var $_un='<?php echo $username?>';var $_sk='<?php echo $sitekey?>';
					</script>
					
					
<nav class="nav-tab-wrapper woo-nav-tab-wrapper">
<a href="admin.php?page=product_design&section=section-1" class="nav-tab <?php if($section=='' || $section=='section-1'){ ?>nav-tab-active<?php }?>">Designs</a>
<a href="admin.php?page=product_design&section=section-2" class="nav-tab <?php if($section=='section-2'){ ?>nav-tab-active<?php }?>">Drop Down Lists</a>
</nav>
<h2></h2>
					<div class="clear"></div>
					<?php
						 switch( $section ){
							 case 'section-2':
							 ?>
							 	<?php
						if(sanitize_text_field($_GET['colid'])=='')
						{
                    ?>
					<script type="text/javascript">
jQuery(document).ready(function () {
    sessionid = readCookie('login_sessionid');
   if (sessionid) {
	   listDropDownList();
  }
  else{
	  userLogin("listDropDownList()");
  }
});
					</script>
										
					<table id="tblDropDownLists" class="wc_emails widefat">
					<thead>
					<tr>
						<th width="30%">Name</th>
						<th width="16%">Modify By</th>
						<th width="16%">Modify On</th>  
						<th width="16%">Actions</th>
					</tr>
					</thead>
					<tfoot>
					<tr>
						<td>Name</td>
						<td>Modify By</td>
						<td>Modify On</td>  
						<td>Actions</td>
					</tr>
					</tfoot>
					<tbody />                
					</table>


					<h2>Add Drop Down</h2>
					<table class="form-table ">
					
					<tbody><tr valign="top">
					<th class="titledesc" scope="row">
						<label for="wc_shirtshopper_name">Name</label>
												</th>
					<td class="forminp forminp-text">
					<input type="text" class="form-control" id="dropdownlistname">
					</td>
					</tr>
					</tbody></table>
					<p class="submit_filter">
							<input type="button" value="Add Drop Down" class="button-primary woocommerce-save-button" name="save" onclick="addDropDownList();">
					</p>
					<?php
						}
						else
						{
							$colid = sanitize_text_field($_GET['colid']);
						?>
							<h2>Drop Down List: <span  id="ddlName"></span><a href="admin.php?page=product_design&section=section-2" class="page-title-action">Back</a></h2>
							
							<script type="text/javascript">
								var dropdownlistid='<?php echo $colid?>';
jQuery(document).ready(function () {
	sessionid = readCookie('login_sessionid');
	if (sessionid) {
		getDropDownList();
	}
	else{
		userLogin("getDropDownList()");
	}
});
							</script>
					<table id="tblDropDownListItems" class="wc_emails widefat">
					<thead>
					<tr>
						<th width="30%">Name</th>
						<th width="18%">Price Increase</th>
						<th width="16%">Modify By</th>
						<th width="16%">Modify On</th>  
						<th width="16%">Actions</th>
					</tr>
					</thead>
					<tfoot>
					<tr>
						<td>Name</td>
						<td>Price Increase</td>
						<td>Modify By</td>
						<td>Modify On</td>  
						<td>Actions</td>
					</tr>
					</tfoot>
					<tbody />                
					</table>


					<h2>Add Options</h2>
					<table class="form-table ">					
					    <tbody>
                            <tr>
					            <th class="titledesc" scope="row"><label for="wc_shirtshopper_name">Name:</label></th>
					            <td class="forminp forminp-text"><input type="text" class="form-control" id="dropdownlistitemname"></td>
					        </tr>
                            <tr>
					            <th class="titledesc" scope="row"><label for="wc_shirtshopper_name">Price Increase:</label></th>
					            <td class="forminp forminp-text"><input type="text" class="form-control" id="dropdownlistitempriceincrease"></td>
					        </tr>
					    </tbody>

					</table>
					<p class="submit_filter">
							<input type="button" value="Add Option" class="button-primary woocommerce-save-button" name="save" onclick="addDropDownListItem();">
					</p>
							
						<?php
						}
					?>
							 <?php
							  break;
							 default:		
							 case 'section-1':
							 						
if($_GET['colid']=='')
{
?>
	<h2><a href="admin.php?page=product_design&colid=0" class="page-title-action">Add Design</a></h2>
	<script type="text/javascript" >
		jQuery(document).ready(function () {
   sessionid = readCookie('login_sessionid');
   if (sessionid) {
	  listDesigns();
  }
  else{
	userLogin("listDesigns()");
  }
});
	</script>
					<table id="tblDesigns" class="wc_emails widefat">
					<thead>
					<tr>
						<th width="25%">Name</th>
						<th width="17%">Preview Image</th>
						<th width="12%">Modify By</th>
						<th width="12%">Modify On</th>  
						<th width="12%">Actions</th>
					</tr>
					</thead>
					<tfoot>
					<tr>
						<td>Name</td>
						<td>Preview Image</td>
						<td>Modify By</td>
						<td>Modify On</td>  
						<td>Actions</td>
					</tr>
					</tfoot>
					<tbody />                
					</table>
					<?php
}
else
{
$colid = $_GET['colid'];
?>
<script type="text/javascript">
 var $colid = <?php echo $colid;?>;
 
 jQuery(document).ready(function () {
   sessionid = readCookie('login_sessionid');
   if (sessionid) {
	   listDesignsInner();
  }
  else{
	  userLogin("listDesignsInner()");
  }
});
</script>
<h2>Designs <a href="admin.php?page=product_design" class="page-title-action">Back</a></h2>
<form method="post" enctype="multipart/form-data" id="designData"  name="designData"> 
<table class="form-table ">
<tbody><tr valign="top">
<th class="titledesc" scope="row">
	<label for="wc_apparel_tabs_name">Name</label>
							</th>
<td class="forminp forminp-text">
<input type="hidden" name="designid" id="designid" value="<?php echo $colid;?>">
<input type="text" class="form-control" id="designname" name="designname">
<input type="hidden" class="form-control"  value="design_upload_files" name="action">
<input type="hidden" id="previewimage_url" name="previewimage_url" value="">
</td>
</tr>
<tr valign="top">
<th class="titledesc" scope="row">
	<label for="wc_apparel_tabs_name">Preview Image</label>
							</th>
<td class="forminp forminp-text">
<span id="previewimage_src"></span>
 <input type="button" class="button button-primary" id="previewimage_image_button" name="previewimage_image_button" value="Add Image"/>
</td>
</tr>
</tbody></table>
</form>
<p class="submit_filter">
		<input type="button" value="<?php if($colid>0){?>Update <?php }else{?>Add <?php }?>" class="button-primary woocommerce-save-button" name="save" onclick="addDesign();">
</p>
<?php if($colid>0){
?>
<script type="text/javascript">
 jQuery(document).ready(function () {
 	updateDesignLoad($colid);
	selectColorPalette();
 });
</script>
	<p><strong>Design Colors</strong></p>

	<table class="wc_emails widefat product_tab_table" id="tblDesignColors" >

            <thead>

                <tr>

                    <th width="20%">Color Palette</th>

                    <th width="20%">Label</th>

                    <th width="25%">&nbsp;</th>

					<th width="20%">Default Value</th>

                    <th width="15%">Actions</th>

                </tr>

            </thead>

            <tbody>

			</tbody><tfoot>

                <tr>

                    <td><select id="ddlcolorpalette_0"  class="product_tab_select" onChange="loadColorPaletteItems(0)"></select></td>

					<td><input type="text" placeholder=""  class="product_tab_textbox" id="designcolordescription_0"/></td>

                    <td></td>

					<td><select id="ddldesigncolorpaletteitems_0"  class="product_tab_select"></select></td>

                    <td><input type="button" value="Add" onclick="addDesignColor(0);" class="button"/></td>

					<td></td>

                </tr>

            </tfoot>

        </table>

		<br>

		<p><strong>Design Attributes</strong></p>

		<table class="wc_emails widefat product_tab_table" id="tblDesignAttributes" >

            <thead>

                <tr>

                    <th width="20%">Attribute Type</th>

                    <th width="20%">Label</th>

                    <th width="25%">Drop Down</th>

					<th width="20%">Default Value</th>

					<th width="15%">Actions</th>

                </tr>

            </thead>

            <tbody>

			</tbody><tfoot>

                <tr id="attribute_0">

                    <td><select id="ddldesignattributetype_0"  class="product_tab_select"  onchange="designattribute_onchange(0);"></select></td>

                    <td><input id="tbxdesignattributedescription_0" type="text" placeholder=""  class="product_tab_textbox" /></td>

                    <td></td>

					<td></td>

					<td><input type="button" value="Add" onclick="saveDesignAttribute(0);" class="button"/></td>

                </tr>

            </tfoot>

        </table>
<?php
}?>


<?php
}
							 break;
}


?>
					
</div>
<?php
}
add_action('wp_ajax_design_upload_files', 'shwc_design_upload_files');
add_action('wp_ajax_nopriv_design_upload_files', 'shwc_design_upload_files'); // Allow 
function shwc_design_upload_files(){
	$arr = array();
	if(count($_FILES)>0){
		if ( ! function_exists( 'wp_handle_upload' ) ) {
 		   require_once( ABSPATH . 'wp-admin/includes/file.php' );
		}
		$upload_overrides = array( 'test_form' => false );
		$uploadedfile = $_FILES['file'];
		add_filter( 'upload_dir', 'shwc_design_upload_dir' );
		$attach = wp_handle_upload($uploadedfile, $upload_overrides);
		remove_filter( 'upload_dir', 'shwc_design_upload_dir' );
		$arr = array("status"=>1,"name"=>$attach['url']);
	}
	else{
		$arr = array("status"=>0,"name"=>"");
	}
	echo json_encode( $arr );
	die();
}

function shwc_design_upload_dir( $dir ) {
	return array(
		'path'   => $dir['basedir'] . '/shirt_shopper',
        'url'    => $dir['baseurl'] . '/shirt_shopper',
        'subdir' => '/shirt_shopper',
    ) + $dir;
}

///////////
?>