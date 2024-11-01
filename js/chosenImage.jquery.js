/*
 * Chosen jQuery plugin to add an image to the dropdown items.
 */
(function($) {
    $.fn.chosenImage = function(options) {
        return this.each(function() {
		
		function getEnhancedSelectFormatString() {
		return {
			'language': {
				errorLoading: function() {
					// Workaround for https://github.com/select2/select2/issues/4355 instead of i18n_ajax_error.
					return wc_enhanced_select_params.i18n_searching;
				},
				inputTooLong: function( args ) {
					var overChars = args.input.length - args.maximum;

					if ( 1 === overChars ) {
						return wc_enhanced_select_params.i18n_input_too_long_1;
					}

					return wc_enhanced_select_params.i18n_input_too_long_n.replace( '%qty%', overChars );
				},
				inputTooShort: function( args ) {
					var remainingChars = args.minimum - args.input.length;

					if ( 1 === remainingChars ) {
						return wc_enhanced_select_params.i18n_input_too_short_1;
					}

					return wc_enhanced_select_params.i18n_input_too_short_n.replace( '%qty%', remainingChars );
				},
				loadingMore: function() {
					return wc_enhanced_select_params.i18n_load_more;
				},
				maximumSelected: function( args ) {
					if ( args.maximum === 1 ) {
						return wc_enhanced_select_params.i18n_selection_too_long_1;
					}

					return wc_enhanced_select_params.i18n_selection_too_long_n.replace( '%qty%', args.maximum );
				},
				noResults: function() {
					return wc_enhanced_select_params.i18n_no_matches;
				},
				searching: function() {
					return wc_enhanced_select_params.i18n_searching;
				}
			}
		};
	}
								  
								  
            var $select = $(this);
            var imgMap  = {};
            var valueMap  = {};

            // 1. Retrieve img-src from data attribute and build object of image sources for each list item.
            $select.find('option').filter(function(){
                return $(this).text();
            }).each(function(i) {
                imgMap[i] = $(this).attr('data-img-src');
                valueMap[i] = $(this).val();
            });
			var select2_args = $.extend({
				minimumResultsForSearch: 2,
				allowClear:  $( this ).data( 'allow_clear' ) ? true : false,
				placeholder: $( this ).data( 'placeholder' )
			},getEnhancedSelectFormatString());
			
			select2_args.templateSelection = function(opt) {
				var imageUrl = $(opt.element).attr('data-img-src');
				var image = '';
				if(typeof imageUrl!=='undefined'){
					image = '<img src="'+imageUrl+'">';	
				}
				 var $opt = $(
            '<div class="selected-text-image"><div class="selected-text">' + opt.text + '</div><div class="selected-image">' + image + '</div></div>'
            );
				return $opt;
				 //return opt.text;
			};
			select2_args.templateResult = function(opt) {
				var imageUrl = $(opt.element).attr('data-img-src');
				var image = '';
				if(typeof imageUrl!=='undefined'){
					image = '<img src="'+imageUrl+'">';	
				}
				 var $opt = $(
            '<div class="select-text-image"><div class="select-text">' + opt.text + '</div><div class="select-image">' + image + '</div></div>'
            );
				 return $opt;
				 // return opt.text;
			};
			
			
			$select.select2( select2_args ).addClass( 'enhanced' );
			
	    });
    };
})(jQuery);
