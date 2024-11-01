<?php

function shwc_install_shirtshopper()
{
    wc_shirtshopper_install();
    update_option( "wc_shirtshopper_db_version", wc_shirtshopper);
}

function wc_shirtshopper_install() {
    global $wpdb, $woocommerce;
}
if ( ! class_exists( 'WC_Product_Apparel_Product' ) ) {
    class WC_Product_Apparel_Product extends WC_Product {
        public function __construct( $product ) {
            $this->product_type = 'apparel_product';
            parent::__construct( $product );
            
        }
        public function get_price_html( $price = '' ) {
            return "";
        }
    }
    
}
function shwc_add_apparel_product( $types ){
    $types[ 'apparel_product' ] = __( 'Apparel Product' );
    return $types;
}
function shwc_apparel_product_tabs( $tabs) {
	$tabs['apparel'] = array(
		'label'		=> __( 'Apparel', 'woocommerce' ),
		'target'	=> 'apparel_options',
		'class'		=> array('show_if_apparel_product'),
	);
	return $tabs;
}


function shwc_get_apparel_media_image(){
    if ( empty( sanitize_text_field($_REQUEST['apparel-image']) ) ) return;
	
	$media_id =intval(sanitize_text_field($_REQUEST['media-id']));
	
    $upload = wp_upload_dir();
    $uploads_dir = $upload['basedir'];
    $upload_dir = $uploads_dir . '/shirt_shopper/apparel_media_image';
	if (! is_dir($upload_dir)) {
		mkdir( $uploads_dir.'/shirt_shopper', 0777 );
		mkdir( $upload_dir, 0777 );
    }
	$file = $upload_dir ."/". $media_id . '.png';	
	if(!file_exists($file))
	{	
		$sessionid = $_COOKIE['apparel_image_sessionid'];
		if($sessionid==''){
			$sessionid = shwc_get_apparel_image_sessionid();
		}
		$apiurl='http://api.thetshirtguylv.com/';
		$url=$apiurl.'Settings.svc/GetMediaColorPatternThumbnail';
		$data=array("sessionid"=>$sessionid ,"mediacolorid"=>$media_id);
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
		$res = $response->GetMediaColorPatternThumbnailResult;
		
		if($res->isSuccessful){
            $img = $res->Data;
            $data = base64_decode($img);
            $success = file_put_contents($file, $data);	
		}
		else{
			if ($res->ErrorNumber == "102.013"){
				shwc_get_apparel_media_image();
			}
		}
	}
	$image_url =$upload['baseurl'].'/shirt_shopper/apparel_media_image/'.$media_id . '.png';
	header('Content-type: image/jpeg');
	readfile($file);
	die();
}
function shwc_get_apparel_image_sessionid(){
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
		setcookie('apparel_image_sessionid', $sessionid, time() + (3600), "/");
	}
	return $sessionid;
}
function shwc_duplicate_api_product($new_id, $orig_post_obj) {
	$_productid = get_post_meta( $orig_post_obj->ID, '_productid', true );
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
            $url=$apiurl.'Settings.svc/ProductDuplicate';
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
            $res = $response->ProductDuplicateResult;
            if($res->isSuccessful)
            {
                $new_product_id = $res->Data;
                update_post_meta( $new_id, '_productid', $new_product_id );
            }
		}
	}
}
shwc_get_apparel_media_image();