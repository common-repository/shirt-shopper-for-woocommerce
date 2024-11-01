<?php
function shwc_color_palettes_page(){
		$current_user = wp_get_current_user();
		$clientname = get_option('wc_shirtshopper_clientname');
		$username = $current_user->user_login;
		$sitekey = get_option('wc_shirtshopper_sitekey');
		$section=sanitize_text_field($_GET['section']);
?>
<div class="wrap">
<script type="text/javascript">
						var $_cn='<?php echo $clientname?>';var $_un='<?php echo $username?>';var $_sk='<?php echo $sitekey?>';
						var site_url = '<?php echo get_site_url(); ?>';
					</script>
					
<nav class="nav-tab-wrapper woo-nav-tab-wrapper">
<a href="admin.php?page=color_palettes&section=section-1" class="nav-tab <?php if($section=='' || $section=='section-1'){ ?>nav-tab-active<?php }?>">Media Suppliers</a>
<a href="admin.php?page=color_palettes&section=section-2" class="nav-tab <?php if($section=='section-2'){ ?>nav-tab-active<?php }?>">Color Palettes</a>
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
	   listColorPalette();
  }
  else{
	 userLogin("listColorPalette()");
  }
});
					</script>
					
					<table id="tblMediaColorDropdowns" class="wc_emails widefat">
					<thead>
					<tr>
						<th width="20%">Name</th>
						<th width="20%">Modify By</th>
						<th width="20%">Modify On</th>
						<th width="20%">Actions</th>
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
					<h2>Add Color Palettes</h2>
					<table class="form-table">
					
					<tbody><tr valign="top">
					</tr>
					<tr valign="top">
					<th class="titledesc" scope="row">
						<label for="wc_shirtshopper_value">Name</label>
												</th>
					<td class="forminp forminp-text">
					<input type="text" placeholder="" id="mediacolordropdownname" style="width: 250px;"/>
					</td>
					</tr></tbody></table>
					<p class="submit_filter">
							<input type="button" value="Add" class="button-primary woocommerce-save-button" name="save" onclick="addMediaColorDropdown();">
					</p>
					<?php
					}
					else
					{
						$colid = sanitize_text_field($_GET['colid']);
					?>
					<h1>Edit Color Palettes  <a href="admin.php?page=color_palettes&section=section-2" class="page-title-action">Back</a></h1>
					<div class="prod_style">
					<input name="mediacolordropdownname" size="30" value="" id="mediacolordropdownname" spellcheck="true" autocomplete="off" type="text">
					<input value="Update" class="button-primary woocommerce-save-button update_apprel_filter" name="save" onclick="editMediaColorDropdown()" type="button">
					</div>
					<script type="text/javascript">
var $_colid='<?php echo $colid?>';
jQuery(document).ready(function () {
	sessionid = readCookie('login_sessionid');
	if (sessionid) {
	   listColorPaletteInner();
	}
	else{
	   userLogin("listColorPaletteInner()");
	}
});
					</script>
					
		<div class="row margin-bottom-10">
            <div class="col-sm-10">
				 <div class="left-draggable-heading">Media Colors&nbsp;:&nbsp;<select id="ddlMediaColorType" onchange="loadMediaColors();" style="width:150px  " ></select></div>
				 <div class="right-draggable-heading"><input onclick="addColorPaletteGroup('<?php echo $colid;?>');" type="button" value="Add Section"></div>
			</div>
	    </div>
		
<div class="row">
	<div class="col-sm-10">
		<ul class="left-draggable" id="draggableBox">
		</ul>
		<div class="right-draggable-box"  >
			<div class="panel-group" id="accordion">
			</div>
		</div>
	</div>
</div>
		<div class="modal fade" id="editModal">
		<div class="modal-dialog" role="document">
		<div class="modal-content">
		<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
		<span aria-hidden="true">&times;</span>
		</button>
		<h4 class="modal-title">Edit Section</h4>
		</div>
		<div class="modal-body">
			<div class="form-group">
              <label for="recipient-name" class="form-control-label">Section Name:</label>
              <input type="text" class="form-control" id="group_name">
			  <input type="hidden"  id="group_id">
            </div>
			<div class="form-group">
              <label for="recipient-name" class="form-control-label">Additional Cost:</label>
              <input type="text" class="form-control" id="additional_cost">
            </div>
			
		</div>
		<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
		<button type="button" class="btn btn-primary" onClick="saveEdit()">Save changes</button>
		</div>
		</div>
		</div>
		</div>
		 <?php
					}
					 break;
					 default:		
					 case 'section-1':
					 ?>
					 <?php
						if(sanitize_text_field($_GET['colid'])=='')
						{
					?>
<h2><a href="admin.php?page=color_palettes&section=section-1&colid=0" class="page-title-action">Add Supplier</a></h2>
<script type="text/javascript">
jQuery(document).ready(function () {
      sessionid = readCookie('login_sessionid');
   if (sessionid) {
	   SubscribedSuppliers();
  }
  else{
	 userLogin("SubscribedSuppliers()");
  }
});
</script>
<table id="tblSuppliers" class="wc_emails widefat">
<thead>
<tr>
	<th width="28%">Name</th>
	<th width="18%">Modify By</th>
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

					 <?php
					 	}
						else
						{
						$colid = sanitize_text_field($_GET['colid']);
						?>
<script type="text/javascript">
 var $colid = <?php echo $colid;?>;
 jQuery(document).ready(function () {
    sessionid = readCookie('login_sessionid');
   if (sessionid) {
	   SubscribedInnerSuppliers();
  }
  else{
	    userLogin("SubscribedInnerSuppliers()");
  }
});
</script>
<h2><?php if($colid>0){?>Edit <?php }else{?>Add <?php }?> Suppliers
<a href="admin.php?page=color_palettes&section=section-1" class="page-title-action">Back</a>
</h2>
<table class="form-table ">
					
					<tbody><tr valign="top">
					<th class="titledesc" scope="row">
						<label for="cbxdistributor">Name</label>
												</th>
					<td class="forminp forminp-text">
					<select id="cbxsupplier" ></select>
					<input type="hidden" name="suppliers" id="suppliers" value="<?php echo $colid;?>">
					</td>
					</tr>
					</tbody></table>
		<p class="submit_filter">
							<input type="button" value="<?php if($colid>0){?>Update <?php }else{?>Add <?php }?> Suppliers" class="button-primary woocommerce-save-button" name="save" onclick="addSubscribedMediaSupplier();">
					</p>			
						<?php
						}
					 ?>
					 <?php
					 break;
			}		 
					?>
					
</div>
<?php
}
?>