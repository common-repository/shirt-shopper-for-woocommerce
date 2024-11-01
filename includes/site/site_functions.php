<?php
	
function shwc_checkout_process_called( $order_id ) {
	global $wpdb; 
	$order = new WC_Order($order_id);
    $items = $order->get_items();
    foreach ($items as $item) {
    	$data_colorid = unserialize($item['item_meta']['designid_colorid'][0]);
    	$data_qty = $item['item_meta']['_qty'][0];
    	$apparelcolorsizeid = $data_colorid['colorid'];
    	$quantity = $data_qty;

    	$sessionid = "";
		$current_user = wp_get_current_user();
		$clientname = get_option('wc_shirtshopper_clientname');
		$username = $current_user->user_login;
		$sitekey = get_option('wc_shirtshopper_sitekey');
		$apiurl='http://api.thetshirtguylv.com/';
		$url=$apiurl.'Site.svc/SiteLogin';
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
		$res = $response->SiteLoginResult;
		if($res->isSuccessful)
		{
			$sessionid = $res->SessionID;
			$url=$apiurl.'Site.svc/Checkout';
			$data=array("sessionid"=>$sessionid,"apparelcolorsizeid"=>$apparelcolorsizeid,"quantity"=>$quantity);
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
			$res = $response->CheckoutResult;
			
			if($res->isSuccessful)
			{
			}
		}
    }
}






function shwc_apparel_tab_content()
{
	global $product;
	$product_id = $product->id;
	$clientname = get_option('wc_shirtshopper_clientname');
	$username = "WP User";
	$sitekey = get_option('wc_shirtshopper_sitekey');
	$_productid = get_post_meta( $product_id, '_productid', true );
	?>
	<script type="text/javascript">
	    var $_cn='<?php echo $clientname?>';var $_un='<?php echo $username?>';var $_sk='<?php echo $sitekey?>';
		var $_productid='<?php echo $_productid?>';
		var $site_url = '<?php echo get_site_url(); ?>';
	</script>
	
	
	<div class="row">
		<div class="tab-content filter-tab margin-bottom-10">
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
					<select name="sortBy" id="sortBy" class="form-control prod-sort" onchange="javascript: SearchApparel('<?php echo $_productid;?>');"></select>                
					</div>
				</div>
            </div>
        </div>
    <div class="container-fluid">
        <div class="row">
		    <div class="col-sm-12" id="apparelResults">                
            </div>
        </div>
    </div>
	
	
   
    
<a href="#0" class="cd-btn" id="loadDetailProduct"></a>
<div class="cd-panel from-right">
		<header class="cd-panel-header">
			<h1 id="aNameHeading"></h1>
			<a href="#0" class="cd-panel-close "><i class="glyphicon glyphicon-remove"></i></a>
		</header>

		<div class="cd-panel-container">
			<div class="cd-panel-content">
					
				<div id="detailProduct">
			<form name="popupForm" id="popupForm">
			<div class="row" style="padding-bottom:150px ">
				<div class="col-md-3">
					<div class="design_product_image">
						<img id="aImage" />
					</div>
					<div id="aColors"></div>  
				</div>	
				<div class="col-md-6">
					<input type="hidden" name="popup_product_id" value="<?php echo $product_id;?>" id="popup_product_id">
					<div id="aName"></div>
					<div id="aDescription"></div>      
					<div id="aSizeBox"></div> 
					<p align="right">
						<button class="btn btn-primary" type="button" id="popup_add_to_cart">Add to Cart</button>
					</p>
					<div id="placementImageContent" class="placement_image_content">
					</div>
					 
				</div>
				<div class="col-md-3">
				<div class="design_image" id="design_image_box">
				<?php  $src = wp_get_attachment_image_src( get_post_thumbnail_id($product_id),'medium'); ?>
				<img src="<?php  echo $src[0];?>">
				</div>
								
				<div id="placementImage" class="placement_image_box">
				</div>
				
				</div>	
			</div>
			</form>
		</div> 


			</div> <!-- cd-panel-content -->
		</div> <!-- cd-panel-container -->
	</div> <!-- cd-panel -->

	


   	<?php
}
function shwc_addtocart_apparel()
{
		ob_start();
		global $woocommerce,$wpdb;
		$product_id=sanitize_text_field($_POST['product_id']);
		$qut=array_map( 'sanitize_text_field', wp_unslash($_POST['qut']));
		$price=array_map( 'sanitize_text_field', wp_unslash($_POST['price']));
		$size=array_map( 'sanitize_text_field', wp_unslash($_POST['size']));
		$color=sanitize_text_field($_POST['color']);
		$colorid= sanitize_text_field($_POST['colorid']);
		$colorimage =sanitize_text_field($_POST['colorimage']);
		$sizename =sanitize_text_field($_POST['sizename']);
		$ProductID=sanitize_text_field($_POST['ProductID']);
		$apprelimage=sanitize_text_field($_POST['apprelimage']);
		$apparelname=sanitize_text_field($_POST['apparelname']);

		/*
		$design_attribute=array_map( 'sanitize_text_field', wp_unslash($_POST['design_attribute']));
		$design_colors=array_map( 'sanitize_text_field', wp_unslash($_POST['design_colors']));
		$design_placement=array_map( 'sanitize_text_field', wp_unslash($_POST['design_placement']));
		$design_placement_image=array_map( 'sanitize_text_field', wp_unslash($_POST['design_placement_image']));
		*/
		$design_attribute=$_POST['design_attribute'];
		$design_colors=$_POST['design_colors'];
		$design_placement=$_POST['design_placement'];
		$design_placement_image=$_POST['design_placement_image'];
		
		$design_colors_price = 0;
		if(is_array($design_colors))
		{
			foreach ($design_colors as $key => $placement) {
				foreach($placement as $value){
					foreach ($value as $data) {
						$d = explode("_+_",$data);
						$design_colors_price += $d[2];
					}
				}
			}
		}
		
		$design_attribute_price = 0;
		if(is_array($design_attribute))
		{
			foreach ($design_attribute as $key => $placement) {
				foreach($placement as $value){
					foreach ($value as $dkey => $data) {
						foreach ($data as $k => $d) {
							if($dkey=='drop_down_list')
							{
								$dd=explode("_+_",$d);
								$design_attribute_price+=$dd[2];
							}
						}
					}
				}
			}
		}
		
		$cnt = false;
		foreach($qut as $k => $q)
		{
			if($q>0)
			{
				 $quantity = $q;
				 $cart_item_meta['color'] = $color;
				 $cart_item_meta['colorimage'] = $colorimage;
				 $cart_item_meta['sizename'] = $sizename;
				 $cart_item_meta['apparelname'] = $apparelname;
				 $cart_item_meta['apprelimage'] = $apprelimage;

				 $cart_item_meta['design_attribute'] = $design_attribute;
				 $cart_item_meta['design_colors'] = $design_colors;
				 $cart_item_meta['design_placement'] = $design_placement;
				 $cart_item_meta['design_placement_image'] = $design_placement_image;
				 
				 $cart_item_meta['ProductID'] = $ProductID;
				 $cart_item_meta['colorid'] = $colorid[$k];
				 $cart_item_meta['size'] = $size[$k];
				 $cart_item_meta['price'] = $price[$k] + $design_colors_price + $design_attribute_price;
				 $passed_validation = apply_filters( 'woocommerce_add_to_cart_validation', true, $product_id, $quantity );
        		 $product_status    = get_post_status( $product_id );
				 if ( $passed_validation && WC()->cart->add_to_cart( $product_id, $quantity ,0,array(),$cart_item_meta) && 'publish' === $product_status ) {
					$cnt = true;
				 }
			}
		}
		if($cnt)
		{
			$added_text = sprintf("&ldquo; %s &rdquo; has been added to your cart.",get_the_title( $product_id));
			// Output success messages
			if ( 'yes' === get_option( 'woocommerce_cart_redirect_after_add' ) ) {
				$return_to = apply_filters( 'woocommerce_continue_shopping_redirect', wp_get_referer() ? wp_get_referer() : home_url() );
				$message   = sprintf( '<a href="%s" class="button wc-forward">%s</a> %s', esc_url( $return_to ), esc_html__( 'Continue Shopping', 'woocommerce' ), esc_html( $added_text ) );
			} else {
				$message   = sprintf( '<a href="%s" class="button wc-forward">%s</a> %s', esc_url( wc_get_page_permalink( 'cart' ) ), esc_html__( 'View Cart', 'woocommerce' ), esc_html( $added_text ) );
			}	
			wc_add_notice($message);
		}
		
       die();
}
function shwc_cart_items_addtocart_apparel($item, $values, $key){
	$_product = wc_get_product($item['product_id']);
	//$price = $_product->get_price();
	//$price +=$item[ 'price' ];
	$price = $item[ 'price' ];
	$item['data']->set_price($price);
	return $item;
}
function shwc_cart_mini_addtocart_apparel($cart_subtotal, $compound, $cart){
		$total_price = 0;
		foreach($cart->cart_contents as $key=>$value)
		{
			$total_price+=($value['price']*$value['quantity']);
		}
	 //return $cart_subtotal; 
	 return wc_price($total_price); 
}	
function shwc_cart_items_apparel_into_cart($product_name, $values, $cart_item_key )
{
	if(count($values['color']) > 0)
	{
		
		$src = wp_get_attachment_image_src( get_post_thumbnail_id($values['product_id']));
		$return_string = "";
		$return_string .= $product_name;
		$return_string .= '<br>Style: '.$values['apparelname'].' #'.$values['sizename'];
		$return_string .= '<br>Color: '.$values['color'];
		$return_string .= ", Size: ".$values['size'];
		if(is_array($values['design_placement'])){
			$return_string .= '<table class="shirts_cart" width="100%" cellpadding="0" cellspacing="0"  border="0" >';
			$return_string .= '<tr>';
			$return_string .= '<th class="shirt_style_image">&nbsp;</th>';
			$return_string .= '<th>';
			$return_string .= 'Placement';
			$return_string .= '</th>';
			$return_string .= '<th>';
			$return_string .= 'Design';
			$return_string .= '</th>';
			$return_string .= '<th>';
			$return_string .= 'Details';
			$return_string .= '</th>';
			$return_string .= '</tr>';
			$ii=true;
			foreach($values['design_placement'] as $placement_key => $placement_value){
				$return_string .= '<tr>';
				 if($ii){
					$return_string .= '<td rowspan="'.count($values['design_placement']).'" class="shirt_style_image"><img src="'.$values['apprelimage'].'" class="app_image" width="75" style="width:75px;"></td>';
					$ii=false;
				}
				$return_string .= '<td >'.$placement_value;
				$return_string .= '</td>';
				$return_string .= '<td>';
				if($values['design_placement_image'][$placement_key]!=''){
					$return_string .='<img src="'.$values['design_placement_image'][$placement_key].'" class="app_image" width="75" style="width:75px;">' ;
				}
				$return_string .= '</td>';
				$return_string .= '<td >';
						if(is_array($values['design_colors'][$placement_key]))
						{
							foreach ($values['design_colors'][$placement_key] as $key => $value) {
								foreach ($value as $dkey => $data) {
									$d = explode("_+_",$data);
									$name = $d[1];
										if($d[2]>0)
										$name.=" (+".number_format($d[2],2).")";
				
									$return_string .= $dkey.": ".$d[4].", ".$name."<br>";
								}
							}	
								
				
						}
						if(is_array($values['design_attribute'][$placement_key]))
						{
							foreach ($values['design_attribute'][$placement_key] as $key => $value) {
								foreach ($value as $dkey => $data) {
				
									foreach ($data as $k => $d) {
										if($dkey=='drop_down_list')
										{
											$dd=explode("_+_",$d);
											$price="";
											if($dd[2]>0)
												$price.=" (+".number_format($dd[2],2).")";
											$return_string .= $k.": ".$dd[1]." ".$price."<br>";	
										}
										else
										{
											if($d!='' && $d!='undefined')
											{
												$return_string .= $k.": ".$d."<br>";	
											}
										}
									}
									
								}
							}
						}
						
					
				
				$return_string .= '</td>';
			$return_string .= '</tr>';
			}
			$return_string .= '</table>';
		}
		else{
			$return_string .= '<br><img src="'.$src[0].'" class="app_image" width="75" style="width:75px;">';
			if($values['apprelimage']!=''){
				$return_string .= '<span class="shirt_style_image"><br><br><img src="'.$values['apprelimage'].'" class="app_image" width="75" style="width:75px;"></span>';
			}
		}
		return $return_string;
	}
	else
	{
		return $product_name;
	}
}
function shwc_cart_items_apparel_image($product_image, $values, $cart_item_key){
	if(count($values['color']) > 0)
	{
		$return_string = "";
		$return_string .= '<div class="cart_items_apparel_image" ><img src="'.$values['apprelimage'].'" class="app_image" width="75"></div>';
		return $return_string;
	}
	else
	{
		return $product_name;
	}
}
function shwc_product_loop_add_to_cart_link($html, $product)
{
	$product_type = get_the_terms($product->id, "product_type");
	if ($product_type[0]->name == 'apparel_product') {
		$html="";
	}
	return $html;
}
function shwc_apparel_add_to_cart_form()
{
	global $product;
	$product_type = get_the_terms($product->id, "product_type");
	if ($product_type[0]->name == 'apparel_product') {
		echo "<style>.cart{display:none;}</style>";
	}
}
function shwc_values_to_order_item_meta($item_id, $values)
{
	global $woocommerce,$wpdb;
	$src = wp_get_attachment_image_src( get_post_thumbnail_id($values['product_id']));
	$return_string = "";
	$return_string .= 'Style: '.$values['apparelname'].' #'.$values['sizename'];
	$return_string .= '<br>Color: '.$values['color'];
	$return_string .= ", Size: ".$values['size'];
		if(is_array($values['design_placement'])){
			$return_string .= '<table class="shirts_cart" width="100%" cellpadding="0" cellspacing="0"  border="0" >';
			$return_string .= '<tr>';
			$return_string .= '<th>&nbsp;</th>';
			$return_string .= '<th>';
			$return_string .= 'Placement';
			$return_string .= '</th>';
			$return_string .= '<th>';
			$return_string .= 'Design';
			$return_string .= '</th>';
			$return_string .= '<th>';
			$return_string .= 'Details';
			$return_string .= '</th>';
			$return_string .= '</tr>';
			$ii=true;
			foreach($values['design_placement'] as $placement_key => $placement_value){
				 $return_string .= '<tr>';
				 if($ii){
					$return_string .= '<td rowspan="'.count($values['design_placement']).'"><img src="'.$values['apprelimage'].'" class="app_image" width="75" style="width:75px;"></td>';
					$ii=false;
				}
				$return_string .= '<td >'.$placement_value;
				$return_string .= '</td>';
				$return_string .= '<td>';
				if($values['design_placement_image'][$placement_key]!=''){
					$return_string .='<img src="'.$values['design_placement_image'][$placement_key].'" class="app_image" width="75" style="width:75px;">' ;
				}
				$return_string .= '</td>';
				$return_string .= '<td >';
						if(is_array($values['design_colors'][$placement_key]))
						{
							foreach ($values['design_colors'][$placement_key] as $key => $value) {
								foreach ($value as $dkey => $data) {
									$d = explode("_+_",$data);
									$name = $d[1];
										if($d[2]>0)
										$name.=" (+".number_format($d[2],2).")";
				
									$return_string .= $dkey.": ".$d[4].", ".$name."<br>";
								}
							}	
								
				
						}
						if(is_array($values['design_attribute'][$placement_key]))
						{
							foreach ($values['design_attribute'][$placement_key] as $key => $value) {
								foreach ($value as $dkey => $data) {
				
									foreach ($data as $k => $d) {
										if($dkey=='drop_down_list')
										{
											$dd=explode("_+_",$d);
											$price="";
											if($dd[2]>0)
												$price.=" (+".number_format($dd[2],2).")";
											$return_string .= $k.": ".$dd[1]." ".$price."<br>";	
										}
										else
										{
											if($d!='' && $d!='undefined')
											{
												$return_string .= $k.": ".$d."<br>";	
											}
										}
									}
									
								}
							}
						}
						
					
				
				$return_string .= '</td>';
			$return_string .= '</tr>';
			}
			$return_string .= '</table>';
		}
		else{
			$return_string .= '<br><br><img src="'.$src[0].'" class="app_image" width="75" style="width:75px;">';
			if($values['apprelimage']!=''){
				$return_string .= '<br><br><img src="'.$values['apprelimage'].'" class="app_image" width="75" style="width:75px;">';
			}
		}
	woocommerce_add_order_item_meta($item_id,'Design Information',$return_string);
	$ProductID = $values['ProductID'];
	$colorid = $values['colorid'];
	if(!empty($ProductID) && !empty($colorid) )
	{
		woocommerce_add_order_item_meta($item_id,'designid_colorid',array("ProductID"=>$ProductID,"colorid"=>$colorid));  
	}
	
}


function shwc_add_frontend_js()
{
	wp_enqueue_script( 'apparel-cart-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/cart.js' );
	wp_enqueue_style('apparel-cart-style', SHIRT_SHOPPER_PLUGIN_PATH . 'css/cart.css' );
	
	wp_register_style( 'apparel_canvas_css', SHIRT_SHOPPER_PLUGIN_PATH.'css/canvas.css', false, '1.0.0' );
	wp_register_style( 'apparel-bootstrap-style', SHIRT_SHOPPER_PLUGIN_PATH.'css/bootstrap.css', false, '1.0.0' );
	wp_register_style( 'apparel-site-style', SHIRT_SHOPPER_PLUGIN_PATH.'css/site-style.css', false, '1.0.0' );
	wp_register_style( 'apparel-jcarousel-style', SHIRT_SHOPPER_PLUGIN_PATH.'css/jcarousel.css', false, '1.0.0' );
	
	wp_register_script( 'apparel_canvas_fabric', SHIRT_SHOPPER_PLUGIN_PATH . 'js/fabric-1.6.6.js' );
	wp_register_script( 'apparel_canvas_customisecontrols', SHIRT_SHOPPER_PLUGIN_PATH . 'js/customiseControls.min.js' );
	wp_register_script( 'apparel_canvas_fabric_canvas', SHIRT_SHOPPER_PLUGIN_PATH . 'js/fabric-canvas.js' );
	wp_register_script( 'apparel_canvas_canvas', SHIRT_SHOPPER_PLUGIN_PATH . 'js/canvas.js' );
	
	wp_register_script( 'apparel-bootstrap-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/bootstrap.min.js' );
	wp_register_script( 'apparel-global-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/global.js' );
	wp_register_script( 'apparel-xmlToJSON-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/xmlToJSON.js' );
	
	
	
	if(is_product()){
		wp_enqueue_style('apparel-bootstrap-style');
		wp_enqueue_style('apparel-site-style');
		wp_enqueue_style('apparel-jcarousel-style');
		
		wp_enqueue_script( 'apparel-bootstrap-script');
		wp_enqueue_script( 'apparel-global-script');
		wp_enqueue_script( 'apparel-site-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/site.js' );
		wp_enqueue_script( 'apparel-xmlToJSON-script');
		wp_enqueue_script( 'apparel-jcarousel-min-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/jquery.jcarousel.min.js' );
		wp_enqueue_script( 'apparel-jcarousel-script', SHIRT_SHOPPER_PLUGIN_PATH . 'js/jcarousel.js' );
	}
}
function shwc_apparel_woo_extra_tabs($tabs)
{
	global $post;
    $product = new WC_Product($post->ID);
    $product_type = get_the_terms($post->ID, "product_type");
    if ($product_type[0]->name == 'apparel_product') {
        $tabs['apparel_tab'] = array(
            'title'    => __( 'Apparel Selection', 'woocommerce' ),
            'priority' => 1,
            'callback' => 'shwc_apparel_tab_content'
        );
    }
    return $tabs;
}

    function shwc_apparel_shirtshopper_designer( $attributes ) {
		//print_r($attributes);
		wp_enqueue_script( 'apparel-bootstrap-script');
		wp_enqueue_script( 'apparel-global-script');
		wp_enqueue_script( 'apparel-xmlToJSON-script');
		
		
		wp_enqueue_style('apparel-bootstrap-style');
        wp_enqueue_style( 'apparel_canvas_css' );
		wp_enqueue_script( 'apparel_canvas_fabric' );
		wp_enqueue_script( 'apparel_canvas_customisecontrols' );
		wp_enqueue_script( 'apparel_canvas_fabric_canvas' );
		wp_enqueue_script( 'apparel_canvas_canvas' );
		
		$width = ($attributes['width']=='')?'500':$attributes['width'];
		$height = ($attributes['height']=='')?'400':$attributes['height'];
		
		?>
			  <div class="container-fluid">
        <div class="row">
            <div class="col-md-7 col-md-7">
                <canvas id="myCanvas" width="<?php echo $width;?>" height="<?php echo $height;?>" style="border: 1px solid #aaa"></canvas>
            </div>
            <div class="col-md-5 editcolorbox col-md-5">
                <div style="text-align: center;">
                    <div class="btn-group btn-group-justified" role="group" aria-label="Justified button group with nested dropdown">
                        <a class="btn btn-default" id="addText" style="border-radius: 0px"><span class="addtextimg"><img src="<?php echo SHIRT_SHOPPER_PLUGIN_PATH;?>image/addtext.png">Add Text</span>
                            </a>
                        <div class="btn-group toolbox" role="group">
                            <a class="btn btn-default dropdown-toggle" id="addclipart" role="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" style="border-radius: 0px">
                                <span class="addtextimg">
                                <img src="<?php echo SHIRT_SHOPPER_PLUGIN_PATH;?>image/addclipart.png"> Add Clipart
                                </a>
                                <ul class="dropdown-menu" id="listClipArt">
                                </ul>
                            </div>
                            <!-- a class="btn btn-default" id="uploadart" style="border-radius: 0px"><span class="addtextimg"><img src="<?php echo SHIRT_SHOPPER_PLUGIN_PATH;?>image/uploadclipart.png"> Upload Art</span>
                            </a -->
                        </div>
                    </div>
                    <div class="row pane editcolor">
                        <div class="col-md-2 tab_custom">
                            <ul class="nav nav-pills nav-stacked" id="clipart_layer">

                            </ul>
                        </div>
                        <div class="col-md-10 optionbox">
                            <div class="row optioncontent">
                                <div class="colortab_custom">
                                    <div class="edittextbox" style="display: none;">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <textarea name="" rows="4" placeholder="-- enter your text here --" id="tbxbefore" class="form-control" style="font-size: 11px"></textarea>
                                            </div>
                                            <div class="col-md-12">
                                                <button class="btn btn-primary" id="gotext" style="float: right;">Add Text</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="texteditor" style="display: none;">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <textarea name="" rows="3" id="tbx" class="form-control" style="font-size: 11px"></textarea>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Font</label>
                                                <select name="" id="dlFonts_form" class="form-control"></select>
                                            </div>
                                            <div class="col-md-2">
                                                <label for="" class="control-label">Color</label><br>
                                                <div class="colorlayer">
                                                    <a class="btn btn-default colorpicker selectcolor" style="background-color:#1c1a1c;" id="fillcolor"></a>
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <label for="">Stroke</label><br>
                                                <div class="colorlayer">
                                                    <a class="btn btn-default colorpicker selectcolor" id="strokecolor" style="background-image: url(<?php echo SHIRT_SHOPPER_PLUGIN_PATH;?>image/trans-color.png);" data-id="none"></a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="firstp">
                                            <div class="row">
                                                <span class="span_bold">Width</span>
                                                <input class="rangesty" type="range" min="30" max="300" step="1" id="clipart_stretch_range" pattern="[0-9]*" value="1">
                                                <input class="text_radis form-control" type="number" min="30" max="300" step="1" id="clipart_stretch_text" pattern="[0-9]*" value="1">
                                            </div>
                                            <div class="row">
                                                <span class="lockimg" id="lock" data-lock="true" style="position:relative;float:left"></span>
                                            </div>
                                            <div class="row">
                                                <span class="span_bold">Height</span>
                                                <input class="rangesty" type="range" min="10" max="300" step="0.1" id="clipart_lnheight_range" pattern="[0-9]*">
                                                <input class="text_radis form-control" type="number" min="0.5" max="3" step="0.1" id="clipart_lnheight_text" pattern="[0-9]*">
                                            </div>
                                            <div class="row">
                                                <span class="span_bold">Spacing</span>
                                                <input class="rangesty" type="range" min="-50" max="50" step="1" id="clipart_spacing_range" pattern="[0-9]*" value="0">
                                                <input class="text_radis form-control" type="number" min="-50" max="50" step="1" id="clipart_spacing_text" pattern="[0-9]*" value="0">
                                            </div>
                                            <div class="row">
                                                <span class="span_bold">Rotate</span>
                                                <input class="rangesty" type="range" min="-360" max="360" step="1" id="clipart_rotate_range" pattern="[0-9]*" value="0">
                                                <input class="text_radis form-control" type="number" min="-360" max="360" step="1" id="clipart_rotate_text" pattern="[0-9]*" value="0">
                                            </div>
                                            <!-- div class="row">
                                                <span class="span_bold">Arc</span>
                                                <input class="rangesty" type="range" min="-360" max="360" step="1" id="clipart_arc_range" pattern="[0-9]*" value="0">
                                                <input class="text_radis form-control" type="number" min="-360" max="360" step="1" id="clipart_arc_text" pattern="[0-9]*" value="0">
                                            </div -->
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <span class="span_bold layout_label" style="width: 120px;">layer order</span>
                                                </div>
                                                <div class="col-md-4">
                                                    &nbsp;
                                                </div>
                                                <div class="col-md-4">
                                                    <span class="span_bold layout_label" style="width: 100px;">position</span>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-4 layout_col4">
                                                    <button class="btn btn-default layer_up layout_btn">
                                                        <span class="bring_forwoard">Forward</span>
                                                    </button>
                                                </div>
                                                <div class="col-md-4 layout_col4">
                                                    <button class="btn btn-default layer_down layout_btn">
                                                        <span class="send_backward">Backward</span>
                                                    </button>
                                                </div>
                                                <div class="col-md-4 layout_col4">
                                                    <button class="btn btn-default position_center layout_btn"><span class="position_center">Center</span></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="secondp">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <buttion class="accordion" id="colorx">
                                                        <span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span> Ink Color
                                                    </buttion>
                                                    <div class="panel">

                                                        <div class="row">
                                                            <div class="col-md-12" id="colorpad">

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <buttion class="accordion" id="patternx"><span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span> Pattern</buttion>
                                                    <div class="panel">
                                                        <div class="row">
                                                            <div class="col-md-12" id="patternpad">

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <buttion class="accordion" id="glitterx"><span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span> Glitter</buttion>
                                                    <div class="panel">
                                                        <div class="row">
                                                            <div class="col-md-12" id="glitterpad">

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-12" style="margin-bottom: 4px;">
                                                    <a href="#" class="btn btn-default selectcolor" title="Shirt Color" style="background: url(<?php echo SHIRT_SHOPPER_PLUGIN_PATH;?>image/trans-color.png);"></a>
                                                    <span> No Ink(Shirt fabric will show through)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="cliparteditor">
                                        <ul class="nav nav-tabs colordiv colorlayer">
                                        </ul>
                                        <div class="tab-content">
                                            <div id="home" class="tab-pane fade secondp in active">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <buttion class="accordion1" id="colorx">
                                                            <span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span> Ink Color</buttion>
                                                        <div class="panel1">
                                                            <div class="row">
                                                                <div class="col-md-12" id="colorpad">

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <buttion class="accordion1" id="patternx"><span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span> Pattern</buttion>
                                                        <div class="panel1">
                                                            <div class="row">
                                                                <div class="col-md-12" id="patternpad">

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <buttion class="accordion1" id="glitterx"><span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span> Glitter</buttion>
                                                        <div class="panel">
                                                            <div class="row">
                                                                <div class="col-md-12" id="glitterpad">

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- div class="row">
                                                    <div class="col-md-12" style="margin-bottom: 4px;">
                                                        <a href="#" class="btn btn-default selectcolor" title="Shirt Color" style="background: url(<?php echo SHIRT_SHOPPER_PLUGIN_PATH;?>image/trans-color.png);"></a>
                                                        <span> No Ink(Shirt fabric will show through)</span>
                                                    </div>
                                                </div -->
                                            </div>
                                        </div>
                                        <div class="firstp">
                                            <div class="row">
                                                <span class="span_bold">width</span>
                                                <input class="rangesty" type="range" min="0" max="2000" id="clipart_width_range" pattern="[0-9]*">
                                                <input class="text_radis form-control" type="number" min="0.1" max="2000" id="clipart_width_text" pattern="[0-9]*">
                                            </div>
                                            <div class="row">
                                                <span class="lockimg" id="lock" data-lock="true" style="position:relative;float:left"></span>
                                            </div>
                                            <div class="row">
                                                <span class="span_bold">height</span>
                                                <input class="rangesty" type="range" min="0.1" max="2000" id="clipart_height_range" pattern="[0-9]*">
                                                <input class="text_radis form-control" type="number" min="0.1" max="2000" id="clipart_height_text" pattern="[0-9]*">
                                            </div>
                                            <div class="row">
                                                <span class="span_bold">rotate</span>
                                                <input class="rangesty" type="range" min="-360" max="360" id="clipart_angle_range" pattern="[0-9]*">

                                                <input class="text_radis form-control" type="number" min="-360" max="360" id="clipart_angle_text" pattern="[0-9]*">

                                            </div>
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <span class="span_bold layout_label">layer order</span>
                                                </div>
                                                <div class="col-md-4">
                                                    &nbsp;
                                                </div>
                                                <div class="col-md-4">
                                                    <span class="span_bold layout_label">position</span>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-4 layout_col4">
                                                    <button class="btn btn-default layer_up layout_btn">
                                                        <span class="bring_forwoard">Forward</span>
                                                    </button>

                                                </div>
                                                <div class="col-md-4 layout_col4">
                                                    <button class="btn btn-default layer_down layout_btn">
                                                        <span class="send_backward">Backward</span>
                                                    </button>
                                                </div>
                                                <div class="col-md-4 layout_col4">
                                                    <button class="btn btn-default position_center layout_btn">
                                                        <span class="position_center">Center</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row placementeditor">
                                <div class="col-md-8">
                                    <div class="row">
                                        <div class="col-md-3">
                                            <img class="img-responsive womenimg" src="<?php echo SHIRT_SHOPPER_PLUGIN_PATH;?>image/shirt_preview.png">
                                            <h5 style="text-align: center">LPC54</h5>
                                        </div>
                                        <div class="placement-panel">
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <button class="btn btn-primary" data-toggle="modal" data-target=".placement-modal" id="addplacementbtn">
                                        <!-- span class="glyphicon glyphicon-folder-open"></span--><b><span>Add New <br>Design <br>Placement&nbsp;&nbsp;</span></b>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade placement-modal" tabindex="-1" data-backdrop="static" role="dialog" aria-labelledby="myLargeModalLabel">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">Modal title</h4>
                        </div>
                        <div class="modal-body">

                        </div>
                        <div class="clearfix"></div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="select_placement">Select a placement</button>
                        </div>
                    </div>
                </div>
            </div>
			</div>
		<?
		return '';
    }

    function shwc_display_item_meta( $html, $item, $args){
		$strings = array();
		$html    = '';
		$args    = wp_parse_args( $args, array(
			'before'    => '<ul class="wc-item-meta"><li>',
			'after'		=> '</li></ul>',
			'separator'	=> '</li><li>',
			'autop'		=> false,
		) );

		foreach ( $item->get_formatted_meta_data() as $meta_id => $meta ) {
			$value = $args['autop'] ? wp_kses_post( wpautop( make_clickable( $meta->display_value ) ) ) : wp_kses_post( make_clickable( $meta->display_value ) );
			$strings[] = '<strong class="wc-item-meta-label">' . wp_kses_post( $meta->display_key ) . ':</strong> ' . $value;
		}

		if ( $strings ) {
			$html = $args['before'] . implode( $args['separator'], $strings ) . $args['after'];
		}
		return $html;
	}
	
?>