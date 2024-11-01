jQuery(document).ready(function($){
	$('table.order_details td.product-name').each(function(){
		var html = $(this).find('dd.variation-DesignInformation').html();
		$(this).find('dt.variation-DesignInformation').remove();
		$(this).find('dd.variation-DesignInformation').remove();
		$(this).find("dl.variation").before(html);
	});
});