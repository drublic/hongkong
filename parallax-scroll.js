/**
 * Parallax scrolling
 */
(function ($) {
	var $scrollTop = $('[data-parallax-top]');
	var $scrollBottom = $('[data-parallax-bottom]');
	var $element;
	var factor;

	var scrollPosition = 0;

	var _callback = function () {
		var scroll = window.pageYOffset;
		var i;

		if (scrollPosition === scroll) {
			window.cancelAnimationFrame(_callback);

			return false;
		}

		for (i = 0; i < $scrollTop.length; i++) {
			$element = $($scrollTop[i]);
			factor = $element.attr('data-parallax-factor') || 4;

			$element.css('transform', 'translateY(' + ((scroll - $element.parent().offset().top) / factor) + 'px)');
		}

		for (i = 0; i < $scrollBottom.length; i++) {
			$element = $($scrollBottom[i]);
			factor = $element.attr('data-parallax-factor') || 4;

			$element.css('transform', 'translateY(' + ((scroll - $element.parent().offset().top) / (factor * -1)) + 'px)');
		}

		window.cancelAnimationFrame(_callback);
	};

	$(window).on('scroll', function () {
		window.requestAnimationFrame(_callback);
	});
}(jQuery));
