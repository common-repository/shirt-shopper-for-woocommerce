<?php
/*
Plugin Name: Shirt Shopper for WooCommerce
Description: Apparel shopping system for woocommerce. Create products with multiple designs and effortlessly add them to your website with apparel selection. Built for with the small screen printing shop and apparel decorators in mind.  
Version: 1.1.18
Author: Shirt Shopper
Author URI: https://www.facebook.com/Shirt-Shopper-1892774967618416/
*/
if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {	 	 
    if ( ! class_exists( 'shirt_shopper_for_woocommerce' ) ) {
		define( 'SHIRT_SHOPPER_PLUGIN_PATH', plugin_dir_url( __FILE__ ) );
	    class shirt_shopper_for_woocommerce {			 
			var $version = '1.1.18';
			var $id = 'wc_shirtshopper';			 
			public function __construct() {				
			    define( 'wc_shirtshopper', $this->version );
				define( 'wc_shirtshopper_id', $this->id );
				
                add_action( 'init', array( &$this, 'wc_shirtshopper_include_functions' ), 1 );
				add_action( 'init', array( &$this, 'wc_shirtshopper_site_functions' ), 1 );
				add_action( 'woocommerce_init', array( &$this, 'wc_shirtshopper_loaded' ) );
				if ( is_admin() ) {
				  $this->wc_shirtshopper_admin_includes();
				}
				if ( is_ssl() ) {
				}
			    $this->install();				
			}		
			public function wc_shirtshopper_include_functions() {
			    include( 'includes/shirt_shopper_functions.php' );			
			}
			public function wc_shirtshopper_site_functions() {
			    include( 'includes/site/site_functions.php' );			
			}
			public function wc_shirtshopper_admin_includes() {
                include( 'includes/admin/admin_functions.php' );
                include( 'includes/admin/apparel.php' );
                include( 'includes/admin/design.php' );
                include( 'includes/admin/general.php' );
                include( 'includes/admin/media.php' );				
			}
			public function wc_shirtshopper_loaded() {
				global $woocommerce;
				
                add_action('wp_enqueue_scripts', 'shwc_add_frontend_js');
                add_filter('product_type_selector', 'shwc_add_apparel_product');
                add_filter('woocommerce_product_data_tabs', 'shwc_apparel_product_tabs' );
                add_action('woocommerce_product_data_panels', 'shwc_apparel_options_product_tab_content' );
                add_action('woocommerce_order_status_processing', 'shwc_checkout_process_called');
                add_action('woocommerce_process_product_meta_apparel_product', 'shwc_save_apparel_option_field'  );
                add_filter('woocommerce_product_data_tabs', 'shwc_hide_apparel_attributes_data_panel' );
                add_action('before_delete_post', 'shwc_delete_api_product'  );
                add_filter('woocommerce_product_tabs', 'shwc_apparel_woo_extra_tabs' );
                add_action('admin_footer', 'shwc_apparel_product_custom_js' );
                add_filter('woocommerce_loop_add_to_cart_link', 'shwc_product_loop_add_to_cart_link', 10, 2 );
                add_action('woocommerce_after_add_to_cart_form', 'shwc_apparel_add_to_cart_form' );
                add_action('wp_ajax_addtocartApparel', 'shwc_addtocart_apparel');
                add_action('wp_ajax_nopriv_addtocartApparel', 'shwc_addtocart_apparel');
                add_filter('woocommerce_get_cart_item_from_session', 'shwc_cart_items_addtocart_apparel', 1, 3 );
                add_filter('woocommerce_cart_subtotal', 'shwc_cart_mini_addtocart_apparel', 10, 3 );
                add_filter('woocommerce_cart_item_name','shwc_cart_items_apparel_into_cart',1,3);
                add_filter('woocommerce_cart_item_thumbnail', 'shwc_cart_items_apparel_image', 10, 3 );
                add_action('woocommerce_add_order_item_meta','shwc_values_to_order_item_meta', 10, 2);
                add_action('admin_init', 'shwc_register_apparel_settings' );
                add_action('admin_menu', 'shwc_register_apparel_menu_page');
                add_action('woocommerce_duplicate_product', 'shwc_duplicate_api_product', 20, 2 );
				
				add_filter('woocommerce_display_item_meta', 'shwc_display_item_meta', 10, 3 );
				
				add_shortcode( 'shirtshopper_designer', 'shwc_apparel_shirtshopper_designer' );
			}
			function install() {
				register_activation_hook( __FILE__, 'shwc_activate_shirtshopper' );
				register_activation_hook( __FILE__, 'flush_rewrite_rules' );
				register_uninstall_hook( __FILE__, 'shwc_uninstall_shirtshopper' );
				register_deactivation_hook( __FILE__, 'shwc_uninstall_shirtshopper' );
				
				if(get_option('wc_shirtshopper_db_version') != $this->version )
				{
					add_action( 'init', 'shwc_install_shirtshopper', 1 );
				}
			}
		}
 	   $GLOBALS['shirt_shopper_for_woocommerce'] = new shirt_shopper_for_woocommerce();
	 }
}
else
{
	

    add_action('admin_notices', 'wc_shirtshopper_error_notice');
    
    function wc_shirtshopper_error_notice(){
        global $current_screen;
        if($current_screen->parent_base == 'plugins'){
            echo '<div class="error"><p>Shirt Shopper for WooCommerce '.__('requires <a href="http://www.woothemes.com/woocommerce/" target="_blank">WooCommerce</a> to be activated in order to work. Please install and activate <a href="'.admin_url('plugin-install.php?tab=search&type=term&s=WooCommerce').'" target="_blank">WooCommerce</a> first.', 'wc_shirt_shopper').'</p></div>';
        }
    }
    
    $plugin = plugin_basename(__FILE__);

    include_once( ABSPATH . 'wp-admin/includes/plugin.php' );

    if(is_plugin_active($plugin)){
            deactivate_plugins( $plugin);
    }
    if ( isset( $_GET['activate'] ) ) unset( $_GET['activate'] ); 
}
?>