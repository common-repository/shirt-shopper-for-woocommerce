<?php
function shwc_wp_admin_style($hook) {
		wp_enqueue_media();
		wp_enqueue_script('jquery-ui-draggable');
		wp_enqueue_script('jquery-ui-droppable');
		wp_enqueue_script('wc-enhanced-select');
        wp_register_style( 'apparel_wp_admin_css', SHIRT_SHOPPER_PLUGIN_PATH.'css/apparel-style.css', false, '1.0.0' );
		wp_enqueue_style( 'apparel_wp_admin_css' );
		if ( $hook == 'post-new.php' || $hook == 'post.php' ) {
			if( 'product' == get_post_type() ){
					wp_enqueue_style('apparel-admin-style', SHIRT_SHOPPER_PLUGIN_PATH . 'css/admin-style.css' );
					
					wp_enqueue_script( 'apparel-global-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/global.js' );
					wp_enqueue_script( 'apparel-xmlToJSON-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/xmlToJSON.js' );
					wp_enqueue_script( 'apparel-chosenImage-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/chosenImage.jquery.js' );
					wp_enqueue_script( 'apparel-design-products-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/design_products.js' );
			}
		}
}
add_action( 'admin_enqueue_scripts', 'shwc_wp_admin_style' );
function shwc_register_apparel_menu_page(){
	$shirt_shopper = add_menu_page('Shirt Shopper','Shirt Shopper', 'manage_options', 'shirt_shopper', 'shwc_apparel_setting_page',SHIRT_SHOPPER_PLUGIN_PATH.'image/tshirt.png');
	$shirt_shopper = add_submenu_page('shirt_shopper', 'General', 'General', 'manage_options', 'shirt_shopper', 'shwc_apparel_setting_page');
	$apparel_filter = add_submenu_page('shirt_shopper', 'Apparel', 'Apparel', 'manage_options', 'apparel_filter', 'shwc_apparel_filter_page');
	$color_palettes = add_submenu_page('shirt_shopper', 'Media', 'Media', 'manage_options', 'color_palettes', 'shwc_color_palettes_page');
	$product_design = add_submenu_page('shirt_shopper', 'Design', 'Design', 'manage_options', 'product_design', 'shwc_product_design_page');
	add_action( 'load-' . $shirt_shopper, 'shwc_load_shirt_shopper' );
	add_action( 'load-' . $apparel_filter, 'shwc_load_apparel_filter' );
	add_action( 'load-' . $color_palettes, 'shwc_load_color_palettes' );
	add_action( 'load-' . $product_design, 'shwc_load_product_design' );
}
function shwc_load_shirt_shopper(){
	wp_enqueue_style('apparel-bootstrap-style', SHIRT_SHOPPER_PLUGIN_PATH . 'css/bootstrap.css' );
	wp_enqueue_style('apparel-admin-style', SHIRT_SHOPPER_PLUGIN_PATH . 'css/admin-style.css' );
	
	
	wp_enqueue_script( 'apparel-bootstrap-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/bootstrap.min.js' );
	wp_enqueue_script( 'apparel-global-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/global.js' );
	wp_enqueue_script( 'apparel-xmlToJSON-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/xmlToJSON.js' );
	
	wp_enqueue_script( 'apparel-general-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/general.js' );
}
function shwc_load_apparel_filter(){
	wp_enqueue_style('apparel-bootstrap-style', SHIRT_SHOPPER_PLUGIN_PATH . 'css/bootstrap.css' );
	wp_enqueue_style('apparel-admin-style', SHIRT_SHOPPER_PLUGIN_PATH . 'css/admin-style.css' );
	
	wp_enqueue_script( 'apparel-bootstrap-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/bootstrap.min.js' );
	wp_enqueue_script( 'apparel-global-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/global.js' );
	wp_enqueue_script( 'apparel-xmlToJSON-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/xmlToJSON.js' );
	$section=sanitize_text_field($_GET['section']);
	switch( $section ){
		case 'section-2':
			wp_enqueue_script( 'apparel-apparel-filters-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/apparel_filters.js' );	
		break;
		default:		
		case 'section-1':
			wp_enqueue_script( 'apparel-apparel-suppliers-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/apparel_suppliers.js' );	
		break;
	}
}
function shwc_load_color_palettes(){
	wp_enqueue_style('apparel-bootstrap-style', SHIRT_SHOPPER_PLUGIN_PATH . 'css/bootstrap.css' );
	wp_enqueue_style('apparel-admin-style', SHIRT_SHOPPER_PLUGIN_PATH . 'css/admin-style.css' );
	
	wp_enqueue_script( 'apparel-bootstrap-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/bootstrap.min.js' );
	wp_enqueue_script( 'apparel-global-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/global.js' );
	wp_enqueue_script( 'apparel-xmlToJSON-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/xmlToJSON.js' );
	
	$section=sanitize_text_field($_GET['section']);
	switch( $section ){
		case 'section-2':
			wp_enqueue_script( 'apparel-media-color-palettes-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/media_color_palettes.js' );	
		break;
		default:		
		case 'section-1':
			wp_enqueue_script( 'apparel-media-suppliers-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/media_suppliers.js' );	
		break;
	}
	
}
function shwc_load_product_design(){
	wp_enqueue_style('apparel-bootstrap-style', SHIRT_SHOPPER_PLUGIN_PATH . 'css/bootstrap.css' );
	wp_enqueue_style('apparel-admin-style', SHIRT_SHOPPER_PLUGIN_PATH . 'css/admin-style.css' );
	
	wp_enqueue_script( 'apparel-bootstrap-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/bootstrap.min.js' );
	wp_enqueue_script( 'apparel-global-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/global.js' );
	wp_enqueue_script( 'apparel-xmlToJSON-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/xmlToJSON.js' );
	
	$section=sanitize_text_field($_GET['section']);
	switch( $section ){
		case 'section-2':
			wp_enqueue_script( 'apparel-design-dropdownlist-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/design_dropdownlist.js' );	
		break;
		default:		
		case 'section-1':
			wp_enqueue_script( 'apparel-design-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/design.js' );	
		break;
	}
	
}
function shwc_activate_shirtshopper(){
}
function shwc_uninstall_shirtshopper(){
	delete_option("wc_shirtshopper_clientname");
	delete_option("wc_shirtshopper_sitekey");
	delete_option("wc_shirtshopper_db_version");
}
function shwc_apparel_options_product_tab_content() {

	global $post;
	$sessionid = "";
	$current_user = wp_get_current_user();
	$clientname = get_option('wc_shirtshopper_clientname');
	$username = $current_user->user_login;
	$sitekey = get_option('wc_shirtshopper_sitekey');
	$apiurl='http://api.thetshirtguylv.com/';
	$url=$apiurl.'Settings.svc/UserLogin';
	$data=array("clientname"=>$clientname ,"sitekey"=>$sitekey,"username"=>$username);
    $options = array(
     'http' => array(
       'method'  => 'POST',
       'content' => json_encode( $data ),
       'header'=>  "Content-Type: application/json\r\n" .
                   "Accept: application/json\r\n"
       )
   );
	$context  = stream_context_create( $options );
	$result = file_get_contents( $url, false, $context );
	$response = json_decode( $result );
	$apparel_filter = array();
	$design_color_filter = array();
	$design_type = array();
	$res = $response->UserLoginResult;
	if($res->isSuccessful)
	{
		$sessionid = $res->SessionID;
		$url=$apiurl.'Settings.svc/ListFilters';
		$data=array("sessionid"=>$sessionid);
        $options = array(
         'http' => array(
           'method'  => 'POST',
           'content' => json_encode( $data ),
           'header'=>  "Content-Type: application/json\r\n" .
                       "Accept: application/json\r\n"
           )
       );
		$context  = stream_context_create( $options );
		$result = file_get_contents( $url, false, $context );
		$response = json_decode( $result );
		
		$res = $response->ListFiltersResult;
		if($res->isSuccessful)
		{
			$filters = json_decode( $res->Data );
			if(is_array($filters)){
				foreach($filters as $key=>$value)
				{
					$apparel_filter[$value->ID]= $value->Name;
				}
			}
		}
        else
            echo '<div class="error">Shirt Shopper for WooCommerce: '.$res->ErrorDescription.' ('.$res->ErrorNumber.')</p></div>';
	}
    else
        echo '<div class="error">Shirt Shopper for WooCommerce: '.$res->ErrorDescription.' ('.$res->ErrorNumber.')</p></div>';
?><div id='apparel_options' class='panel woocommerce_options_panel'><?php

                                                                        ?><div class='options_group'><?php

    woocommerce_wp_select(array(
    'id' => '_apparel_filter',
    'label' => __('Apparel Filter', 'woocommerce'),
    'options' => $apparel_filter
    )
);
    woocommerce_wp_hidden_input(
    array( 
        'id'    => '_design_color_filter'
        )
    );
    $_productid_array = array('id'=>'_productid');
                                     ?>
		<?php
    
    $placeMentArray = array(); 
    $placementDropdowns = array();
    $designDropdowns = array();
    $_productid = get_post_meta( $post->ID, '_productid', true );
    
    $product_type = get_the_terms($post->ID, "product_type");
    $display_table = true;
    if($_productid>0)
    {
        if($sessionid!='')
        {
            $url=$apiurl.'Settings.svc/GetProduct';
            $data=array("sessionid"=>$sessionid,"id"=>$_productid);
            $options = array(
            'http' => array(
            'method'  => 'POST',
            'content' => json_encode( $data ),
            'header'=>  "Content-Type: application/json\r\n" .
            "Accept: application/json\r\n"
            )
            );
            $context  = stream_context_create( $options );
            $result = file_get_contents( $url, false, $context );
            $response = json_decode( $result );
            $res = $response->GetProductResult;
            if($res->isSuccessful)
            {
                $data = json_decode( $res->Data );
                $placeMentArray = $data[0][0]->Designs;
            }
            else
            {
                $_productid_array['value'] = 0;
                $display_table = false;
            }
            
            $url=$apiurl.'Settings.svc/ListDesigns';
            $data=array("sessionid"=>$sessionid);
            $options = array(
            'http' => array(
            'method'  => 'POST',
            'content' => json_encode( $data ),
            'header'=>  "Content-Type: application/json\r\n" .
            "Accept: application/json\r\n"
            )
            );
            $context  = stream_context_create( $options );
            $result = file_get_contents( $url, false, $context );
            $response = json_decode( $result );
            $res = $response->ListDesignsResult;
            if($res->isSuccessful)
            {
                $data = json_decode( $res->Data );
                $designDropdowns = $data[0];
            }
            $url=$apiurl.'Settings.svc/ListPlacements';
            $data=array("sessionid"=>$sessionid);
            $options = array(
            'http' => array(
            'method'  => 'POST',
            'content' => json_encode( $data ),
            'header'=>  "Content-Type: application/json\r\n" .
            "Accept: application/json\r\n"
            )
            );
            $context  = stream_context_create( $options );
            $result = file_get_contents( $url, false, $context );
            $response = json_decode( $result );
            $res = $response->ListPlacementsResult;
            if($res->isSuccessful)
            {
                $data = json_decode( $res->Data );
                $placementDropdowns = $data[0];
            }
        }	
        
        if($display_table){
        ?>
			<script type="text/javascript">
			    var productid = '<?php echo $_productid;?>';
			    var sessionid = '<?php echo $sessionid;?>';
			    var $_cn = '<?php echo $clientname?>'; var $_un = '<?php echo $username?>'; var $_sk = '<?php echo $sitekey?>';
			</script>
			<p><strong>Placement</strong></p>
			<table class="wc_emails widefat product_tab_table" id="tblProductDesigns" >
            <thead>
                <tr>
                    <th width="10%">ID</th>
                    <th width="20%">Placement</th>
                    <th width="20%">Name</th>
					<th width="20%">Preview Image</th>
                    <th width="10%">Actions</th>
                </tr>
            </thead>
            <tbody>
			<?php
			if(is_array($placeMentArray))
			{
				foreach($placeMentArray as $key=>$value)
				{
				
            ?>
				<tr id="placement_<?php echo $value->ID?>" data-id="<?php echo $value->ID?>" data-pos="<?php echo $value->Position?>">
				<td><?php echo $value->ID?></td>
				<td><?php echo $value->PlacementName?></td>
				<td><?php echo $value->DesignName?></td>
				<td><?php if($value->PreviewImage!=''){ ?><img src="<?php echo $value->PreviewImage?>" width="40"><?php }?></td>
				<td><a class="edit" href="javascript:editDesignPlacement('<?php echo $value->ID?>','<?php echo $value->DesignID?>','<?php echo $value->PlacementID?>');">Edit</a>&nbsp;|&nbsp;<a href="javascript:deleteDesignPlacement('<?php echo $value->ID?>');">Remove</a></td>
				</tr>
				<?php
				}
			}
                ?>
            </tbody><tfoot>
                <tr>
                    <td>Add</td>
                    <td><select id="ddlplacement_0"  class="product_tab_select wc-enhanced-select">
					<?php
           foreach($placementDropdowns as $key=>$value)
            {
                    ?>
						<option value="<?php echo $value->ID?>"><?php echo $value->Name?></option>
					<?php
            }
			
                    ?>
					</select></td>
                    <td colspan="2">
					<select id="ddlproductdesign_0"  class="product_tab_select wc-enhanced-select-image" style="width:100%">
					<?php
					
            foreach($designDropdowns as $key=>$value)
            {
                    ?>
						<option value="<?php echo $value->ID?>"  data-img-src="<?php echo $value->PreviewImage?>"><?php echo $value->Name?></option>
					<?php
            }
                    ?>
					</select></td>
                    <td><input type="button" id="btndesigncoloradd" value="Add" onclick="addDesignPlacement(0);" class="button"/></td>
					
                </tr>
            </tfoot>
        </table>
		
				<?php
        }
    }else if ($product_type[0]->name == 'apparel_product') {
                ?>
					<p><strong>Please save product before adjusting apparel details.</strong></p>
				<?php
    }
    
                ?>
		</div>

	</div><?php
    woocommerce_wp_hidden_input($_productid_array);
    

}
function shwc_delete_api_product( $post_id ) {
	$_productid = get_post_meta( $post_id, '_productid', true );
	if($_productid>0)
	{
		$current_user = wp_get_current_user();
		$clientname = get_option('wc_shirtshopper_clientname');
		$username = $current_user->user_login;
		$sitekey = get_option('wc_shirtshopper_sitekey');
		$apiurl='http://api.thetshirtguylv.com/';
		$url=$apiurl.'Settings.svc/UserLogin';
		$data=array("clientname"=>$clientname ,"sitekey"=>$sitekey,"username"=>$username);
        $options = array(
         'http' => array(
           'method'  => 'POST',
           'content' => json_encode( $data ),
           'header'=>  "Content-Type: application/json\r\n" .
                       "Accept: application/json\r\n"
           )
       );
		$context  = stream_context_create( $options );
		$result = file_get_contents( $url, false, $context );
		$response = json_decode( $result );
		$res = $response->UserLoginResult;
		if($res->isSuccessful)
		{
            $sessionid = $res->SessionID;
            $url=$apiurl.'Settings.svc/DeleteProduct';
            $data=array("sessionid"=>$sessionid ,"id"=>$_productid);
            $options = array(
              'http' => array(
                'method'  => 'POST',
                'content' => json_encode( $data ),
                'header'=>  "Content-Type: application/json;charset=utf-8\r\n" .
                            "Accept: application/json\r\n"
                )
            );
            $context  = stream_context_create( $options );
            $result = file_get_contents( $url, false, $context );
            $response = json_decode( $result );
            $res = $response->DeleteProductResult;
            if($res->isSuccessful)
            {
                
            }
            
		}
	}
}
function shwc_save_apparel_option_field( $post_id ) {
	$_apparel_filter =  sanitize_text_field($_POST['_apparel_filter']) ;
	update_post_meta( $post_id, '_apparel_filter', $_apparel_filter );
	
	
	$_design_color_filter =  sanitize_text_field($_POST['_design_color_filter']);
	update_post_meta( $post_id, '_design_color_filter', $_design_color_filter );
	
	$designid = 0;
	$product_type = get_the_terms($post_id, "product_type");
	$product = new WC_Product($post_id);
	
    if (($product_type[0]->name == 'apparel_product') || ($product->is_type('apparel_product'))) {
		$current_user = wp_get_current_user();
		$clientname = get_option('wc_shirtshopper_clientname');
		$username = $current_user->user_login;
		$sitekey = get_option('wc_shirtshopper_sitekey');
		$apiurl='http://api.thetshirtguylv.com/';
		$url=$apiurl.'Settings.svc/UserLogin';
		$data=array("clientname"=>$clientname ,"sitekey"=>$sitekey,"username"=>$username);
        $options = array(
         'http' => array(
           'method'  => 'POST',
           'content' => json_encode( $data ),
           'header'=>  "Content-Type: application/json\r\n" .
                       "Accept: application/json\r\n"
           )
       );
		$context  = stream_context_create( $options );
		$result = file_get_contents( $url, false, $context );
		$response = json_decode( $result );
		$res = $response->UserLoginResult;
		if($res->isSuccessful)
		{
			$sessionid = $res->SessionID;
			$title = sanitize_text_field($_POST['post_title']);
			$_regular_price = (sanitize_text_field($_POST['_regular_price'])=='')?0:sanitize_text_field($_POST['_regular_price']);
			$_sale_price = (sanitize_text_field($_POST['_sale_price'])=='')?0:sanitize_text_field($_POST['_sale_price']);
			$_productid = (sanitize_text_field($_POST['_productid'])=='')?0:sanitize_text_field($_POST['_productid']);
			$url=$apiurl.'Settings.svc/SaveProduct';
			$data=array("sessionid"=>$sessionid ,"name"=>$title,"apparelfilterid"=>$_apparel_filter,"price"=>$_regular_price,"saleprice"=>$_sale_price,"id"=>$_productid);
			$options = array(
			  'http' => array(
				'method'  => 'POST',
				'content' => json_encode( $data ),
				'header'=>  "Content-Type: application/json;charset=utf-8\r\n" .
							"Accept: application/json\r\n"
				)
			);
			$context  = stream_context_create( $options );
			$result = file_get_contents( $url, false, $context );
			$response = json_decode( $result );
			$res = $response->SaveProductResult;
			if($res->isSuccessful)
			{
				$data = json_decode( $res->Data );
				$productid = $data[0];
			}
            else {
                echo '<div class="error">Shirt Shopper for WooCommerce: '.$res->ErrorDescription.' ('.$res->ErrorNumber.')</p></div>';
            }
		}
        else {
            echo '<div class="error">Shirt Shopper for WooCommerce: '.$res->ErrorDescription.' ('.$res->ErrorNumber.')</p></div>';
        }
	}
	$_productid =  (sanitize_text_field($_POST['_productid'])==0)?$productid:sanitize_text_field($_POST['_productid']);
	update_post_meta( $post_id, '_productid', $_productid );
}
function shwc_hide_apparel_attributes_data_panel( $tabs) {
	$tabs['attribute']['class'][] = 'hide_if_apparel_product';
	$tabs['general']['class'][] = 'show_if_apparel_product';
	$tabs['general']['class'][] = 'show_if_simple';
	$tabs['general']['class'][] = 'show_if_variable';
	$tabs['general']['class'][] = 'show_if_external';
	$tabs['inventory']['class'][] = 'show_if_apparel_product';
	return $tabs;
}
function shwc_apparel_product_custom_js() {

	if ( 'product' != get_post_type() ) :
		return;
	endif;

          ?><script type='text/javascript'>
	      jQuery(document).ready(function () {


	          jQuery("#product-type").change(function () {

	              if (jQuery(this).val() == 'apparel_product') {

	                  jQuery('.show_if_simple').addClass('show_if_apparel_product').show();

	              }

	          });
	          if (jQuery("#product-type").val() == 'apparel_product') {

	              jQuery('.show_if_simple').addClass('show_if_apparel_product').show();

	          }

	      });

	</script><?php

}

?>