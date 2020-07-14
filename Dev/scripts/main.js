console.time('LoadFrontJS');
$(document).ready(function () {

	$('.js-logo-holder').addClass('active');


	$(".js-nav-item").off("mouseenter mouseleave")
		.on( "mouseenter", function() {
			_that = this;

			window.timer = setTimeout(function(){
				$ths = $(_that);
				$(".js-nav-item").not($ths).removeClass('active');
				$ths.addClass('active');
				$('.js-box-inform > div').removeClass('out');
				$('.js-box-inform .active').addClass('out');
				$('.js-box-inform > div').removeClass('active');
				$($ths.attr('href')).addClass('active');
				$('.js-box-inform .out.active').removeClass('out');
			}, 200);
		})
		.on( "mouseleave", function() {
			_that = this;
			clearTimeout(window.timer);
		})
		.on( "click", function() {
			return false;
		});

});

$(window).load(function () {

	window.timerLogo = setTimeout(function(){
		$('.js-logo-holder').addClass('in-top');
		$('.js-main-nav').addClass('active');

		$('.js-main-nav').find('li:first .js-nav-item').addClass('active');
		$('.js-box-inform').addClass('active').find('div:first').addClass('active');

		clearTimeout(window.timerLogo);
	}, 1500);

	console.timeEnd('LoadFrontJS');
}); 