function withjQuery($) {
	$(window).on('scroll load', function() {
		$navbar = $('.navbar.navbar-default').first();
		if ($(window).scrollTop() > ($('#landing-page').height() - $navbar.height()))
			$navbar.addClass('top-nav-collapse');
		else
			$navbar.removeClass('top-nav-collapse');
	});

	$('#main-site-nav').find('ul li').on('click', function(){
		$('.navbar-collapse.collapse.in').removeClass('in');
	})
}

function pollForjQuery(time) {
	if (window.jQuery) {
		withjQuery(window.jQuery);
	} else {
		setTimeout(function() {
			pollForjQuery(time * 2)
		}, time);
	}
}

pollForjQuery(20);
