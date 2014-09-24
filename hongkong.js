/**
 * Parallax scrolling
 */
(function ($) {
    var scrollPosition = 0;
    var ticking = false;

    var $scrollTop = $('[data-parallax-top]');
    var $scrollBottom = $('[data-parallax-bottom]');

    /**
     * Get the factor attribute for each
     * @return {[type]} [description]
     */
    var _generateFactor = function () {
        var i;

        for (i = 0; i < $scrollTop.length; i++) {
            $scrollTop[i].factor = parseFloat($scrollTop[i].getAttribute('data-parallax-factor') || 4, 10);
        }

        for (i = 0; i < $scrollBottom.length; i++) {
            $scrollBottom[i].factor = parseFloat($scrollBottom[i].getAttribute('data-parallax-factor') || 4, 10);
        }
    };

    var _isElementInViewport = function ($element) {
        var offsetTop = $element.offset().top;

        return (
            (scrollPosition <= offsetTop + $element.height()) &&
            ($(window).height() + scrollPosition >= offsetTop)
        );
    };

    /**
     * Callback for rAF
     * @return {void}
     */
    var _callback = function () {
        var i;
        var rectObject = 0;

        // Don't do anything if we've scrolled to the top
        if (scrollPosition <= 0) {
            $scrollTop.css({ 'transform': 'translateY(0) translateZ(0)' });
            $scrollBottom.css({ 'transform': 'translateY(0) translateZ(0)' });

            ticking = false;

            return;
        }

        for (i = 0; i < $scrollTop.length; i++) {
            rectObject = $scrollTop[i].getBoundingClientRect();
            visible = _isElementInViewport($($scrollTop[i]).parent());

            $scrollTop[i].style.visibility = visible ? 'visible' : 'hidden';

            if (visible) {
                $($scrollTop[i]).css({ transform: 'translateY(' + Math.floor(rectObject.top / $scrollTop[i].factor) + 'px) translateZ(0)' });
            }
        }

        for (i = 0; i < $scrollBottom.length; i++) {
            rectObject = $scrollTop[i].getBoundingClientRect();
            visible = _isElementInViewport($($scrollTop[i]).parent());

            $scrollTop[i].style.visibility = visible ? 'visible' : 'hidden';

            if (visible) {
                $($scrollBottom[i]).css({ transform: 'translateY(' + Math.floor(rectObject.top / ($scrollBottom[i].factor * -1)) + 'px) translateZ(0)' });
            }
        }

        // allow further rAFs to be called
        ticking = false;
    };

    /**
     * Events
     */
    $(document).on('hongkong:refresh', _callback);

    /**
     * Init
     */
    if ($scrollTop.length || $scrollBottom.length) {
        _generateFactor();


        // only listen for scroll events
        $(window).on('scroll', function () {
            scrollPosition = Math.max($('body').scrollTop(), $('html').scrollTop());

            if (!ticking) {
                window.requestAnimationFrame(_callback);

                ticking = true;
            }
        });
    }

}(jQuery));
