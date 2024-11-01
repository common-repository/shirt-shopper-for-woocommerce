<?php
function shwc_apparel_filter_page(){
		$current_user = wp_get_current_user();
		$clientname = get_option('wc_shirtshopper_clientname');
		$username = $current_user->user_login;
		$sitekey = get_option('wc_shirtshopper_sitekey');
		$section=sanitize_text_field($_GET['section']);
		
?>
<div class="wrap">

	
					<script type="text/javascript">
						var $_cn='<?php echo $clientname?>';var $_un='<?php echo $username?>';var $_sk='<?php echo $sitekey?>';
					</script>
					
					
<nav class="nav-tab-wrapper woo-nav-tab-wrapper">
<a href="admin.php?page=apparel_filter&section=section-1" class="nav-tab <?php if($section=='' || $section=='section-1'){ ?>nav-tab-active<?php }?>">Apparel Suppliers</a>
<a href="admin.php?page=apparel_filter&section=section-2" class="nav-tab <?php if($section=='section-2'){ ?>nav-tab-active<?php }?>">Filters</a>
</nav>
					
					<div class="clear"></div>
					
					<?php
						 switch( $section ){
							 case 'section-2':
					?>
					<?php
						if(sanitize_text_field($_GET['colid'])=='')
						{
					?>
					<h2><a href="javascript:addFilter()" class="page-title-action">Add Filter</a>
					</h2>
					
<script type="text/javascript">
jQuery(document).ready(function ($) {
     sessionid = readCookie('login_sessionid');
   if (sessionid) {
	   listFilters();
  }
  else{
	 userLogin("listFilters()");
  }
});
</script>
					<table id="tblFilters" class="wc_emails widefat">
					<thead>
					<tr>
						<th width="38%">Filter Name</th>
						<th width="18%">Modify By</th>
						<th width="18%">Modify On</th>  
						<th width="22%">Actions</th>
					</tr>
					</thead>
					<tfoot>
					<tr>
						<td>Filter Name</td>
						<td>Modify By</td>
						<td>Modify On</td>  
						<td>Actions</td>
						</tr>
					</tfoot>
					<tbody />                
					</table>
					<script>
var filter_id=0;
var filter_section_box="";
var filterStatus=false;
jQuery(document).ready(function(){
	filter_section_box = jQuery('#filter_section_box').html();
	jQuery('#filter_section_box').html("");
	
});
function addFilter(){
filter_id = 0;
filterStatus=false;
jQuery( ".save_link" ).addClass('disable_link');
var name_status=true;
var maxid=0;
jQuery( ".fname" ).each(function( index ) {
  var name = jQuery(this).text();
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

});
	newFilter=++maxid;
	var newFilterName="new";
	if(!name_status)
		newFilterName+=" ("+newFilter+")";
	saveNewFilter(newFilterName,"0:0");
	
	
}
function removeFilter(id) {
	deleteFilter(id);
}
</script>
<div class="modal fade" id="duplicateModal">
<div class="modal-dialog" role="document">
<div class="modal-content">
<div class="modal-header">
<button type="button" class="close" data-dismiss="modal" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>
<h4 class="modal-title">Duplicate Filter</h4>
</div>
<div class="modal-body">
	<div class="form-group">
	  <label for="recipient-name" class="form-control-label">Filter Name:</label>
	  <input type="text" class="form-control" id="duplicate_name">
	  <input type="hidden"  id="duplicate_id">
	  <input type="hidden"  id="duplicate_value">
	</div>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
<button type="button" class="btn btn-primary" onClick="saveDuplicate()">Save</button>
</div>
</div>
</div>
</div>

<div class="modal fade" id="trashModal">

<div class="modal-dialog" role="document">
<div class="modal-content">
<div class="modal-header">
<button type="button" class="close" data-dismiss="modal" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>
<h4 class="modal-title">Trash</h4>
</div>
<div class="modal-body">
	<div class="form-group">
	  <label for="recipient-name" class="form-control-label">You are about to delete this filter. Are you sure?</label>
	  <input type="hidden"  id="trash_id">
	  </div>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-primary" onClick="saveTrash()">Yes</button>
<button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
</div>
</div>
</div>
</div>


					
					<?php
					}
					else
					{
						$colid = sanitize_text_field($_GET['colid']);
					?>
					<h2>Edit Filter 
					<input value="Add Filter" class="button-primary woocommerce-save-button edit_apprel_filter" name="save" onclick="addFilterInner()" type="button">	
					<a href="admin.php?page=apparel_filter&section=section-2" class="page-title-action filter_back_link">Back</a>
					</h2>
					<div class="prod_style">
					<input name="ddlName" size="30" value="" id="ddlName" spellcheck="true" autocomplete="off" type="text">
					<input value="Update" class="button-primary woocommerce-save-button update_apprel_filter" name="save" onclick="editFilter('<?php echo $colid?>')" type="button">
					<div id="filterLoading" class="filter-loading"><div></div></div>
					</div>		
							<script type="text/javascript">
								var filterid='<?php echo $colid?>';
jQuery(document).ready(function ($) {
	sessionid = readCookie('login_sessionid');
   if (sessionid) {
	   SetupSearch();
  }
  else{
	   userFilterLogin("SetupSearch()");
  }

});
</script>
		<div class="row">
            <div class="tab-content filter-tab margin-bottom-10" >
                <div id="first" class="tab-pane fade in active">
                    <div id="productsFacets" class="filter-container"></div>
                </div>
            </div>
        </div>
		<div class="row">
            <div class="col-sm-12 ">
				<div class="row">
					<div class="col-md-4">
					Total Items: <span id="totalitems">0</span>
					</div>
					<div class="col-md-4">
						<div id="dPaging"></div>
					</div>
					<div class="col-md-4">
					<select name="sortBy" id="sortBy" class="form-control prod-sort" onchange="javascript: SearchApparel();"></select>                
					</div>
				</div>
            </div>
        </div>
		<div id="selectionFilter"></div>
    <div class="container-fluid">
        <div class="row">
            <div  id="apparelResults">
            </div>
        </div>
    </div> 
	
	<div class="modal fade" id="addModal">
<div class="modal-dialog" role="document">
<div class="modal-content">
<div class="modal-header">
<button type="button" class="close" data-dismiss="modal" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>
<h4 class="modal-title">Add Filter</h4>
</div>
<div class="modal-body">
	<div class="form-group">
	  <label for="recipient-name" class="form-control-label">Name:</label>
	  <input type="text" class="form-control" id="add_name">
	</div>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
<button type="button" class="btn btn-primary" onClick="saveAddFilter()">Save</button>
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
	<h2>&nbsp;</h2>
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
		<th width="20%">Supplier Name</th>
		<th width="20%">Price Category</th>
		<th width="12%">Markup</th>
		<th width="12%">Monthly Charge</th>
		<th width="16%">Modify On</th>  
		<th width="16%">Actions</th>
	</tr>
	</thead>
	<tfoot>
	<tr>
		<td>Supplier Name</td>
		<td>Price Category</td>
		<td>Markup</td>
		<td>Monthly Charge</td>
		<td>Modify On</td>  
		<td>Actions</td>
	</tr>
	</tfoot>
	<tbody />                
	</table>
<?php
					break;
			}
		?>			
					
</div>
<?php
}
?>