<?php
function shwc_apparel_setting_page() {
?>
<div class="wrap">
<h1>General</h1>
<form method="post" id="apparel_settings" action="options.php">
    <?php settings_fields( 'wc-apparel-settings-group' ); ?>
    <?php do_settings_sections( 'wc-apparel-settings-group' ); ?>
    <table class="form-table">
        <tr valign="top">
        <th scope="row">Client Name</th>
        <td><input type="text" name="wc_shirtshopper_clientname" id="wc_shirtshopper_clientname" value="<?php echo esc_attr( get_option('wc_shirtshopper_clientname') ); ?>" /></td>
        </tr>
         
        <tr valign="top">
        <th scope="row">Site Key</th>
        <td><input type="text" name="wc_shirtshopper_sitekey" id="wc_shirtshopper_sitekey" value="<?php echo esc_attr( get_option('wc_shirtshopper_sitekey') ); ?>" /></td>
        </tr>
    </table>
  <p class="submit">
  <input name="submit" id="submit" class="button button-primary" value="Save Changes" type="submit">
  <?php if(get_option('wc_shirtshopper_clientname')=='' && get_option('wc_shirtshopper_sitekey')=='' ){?>
  &nbsp;&nbsp;
  <input name="register" id="register" class="button button-primary" value="Register" type="button">
  <?php }?>
  </p>
</form>
</div>
<div class="modal fade" id="registerModal">
<div class="modal-dialog" role="document">
<div class="modal-content">
<div class="modal-header">
<button type="button" class="close" data-dismiss="modal" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>
<h4 class="modal-title">Register</h4>
</div>
<div class="modal-body">
	<div class="form-group">
	  <label for="register_clientname" class="form-control-label">Client Name:</label>
	  <input type="text" class="form-control" id="register_clientname">
	 </div>
	<div class="form-group">
	  <label for="register_siteurl" class="form-control-label">Site URL:</label>
	  <input type="text" class="form-control" id="register_siteurl">
	 </div>
	<div class="form-group">
	  <label for="register_contactname" class="form-control-label">Contact Name:</label>
	  <input type="text" class="form-control" id="register_contactname">
	 </div>
	 <div class="form-group">
	  <label for="register_city" class="form-control-label">City:</label>
	  <input type="text" class="form-control" id="register_city">
	 </div>
	 <div class="form-group">
	  <label for="register_state" class="form-control-label">State:</label>
	  <input type="text" class="form-control" id="register_state">
	 </div>
	 <div class="form-group">
	  <label for="register_emailaddress" class="form-control-label">Email Address:</label>
	  <input type="text" class="form-control" id="register_emailaddress">
	 </div>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
<button type="button" class="btn btn-primary" onClick="saveRegister()">Save</button>
</div>
</div>
</div>
</div>

<?php
}

function shwc_register_apparel_settings(){
	register_setting( 'wc-apparel-settings-group', 'wc_shirtshopper_clientname' );
	register_setting( 'wc-apparel-settings-group', 'wc_shirtshopper_sitekey' );
}

add_action('wp_ajax_general_apparel_settings', 'shwc_general_apparel_settings');
add_action('wp_ajax_nopriv_general_apparel_settings', 'shwc_general_apparel_settings'); // Allow 
function shwc_general_apparel_settings(){
  	update_option( 'wc_shirtshopper_clientname', sanitize_text_field($_POST['clientname']));
	update_option( 'wc_shirtshopper_sitekey', sanitize_text_field($_POST['sitekey']));
	$arr = array("status"=>1);
	echo json_encode( $arr );
	die();
}

?>