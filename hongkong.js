/**
 * Parallax scrolling
 */
(function ($) {

    // Setting for the plugin
    var settings = {};

    // Get elements
    var $scrollTop;
    var $scrollBottom;

    var scrollPosition = 0;
    var ticking = false;

    /**
     * Get the factor attribute for each
     * @return {[type]} [description]
     */
    var _generateFactor = function () {
        var i;

        for (i = 0; i < $scrollTop.length; i++) {
            $scrollTop[i].factor = parseFloat($scrollTop[i].getAttribute('data-parallax-factor') || settings.factor, 10);
        }

        for (i = 0; i < $scrollBottom.length; i++) {
            $scrollBottom[i].factor = parseFloat($scrollBottom[i].getAttribute('data-parallax-factor') || settings.factor, 10);
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
        var visible;
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
            rectObject = $scrollBottom[i].getBoundingClientRect();
            visible = _isElementInViewport($($scrollBottom[i]).parent());

            $scrollBottom[i].style.visibility = visible ? 'visible' : 'hidden';

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
     * Init as jQuery plugin
     */
    $.hongkong = function (options) {

        // Options
        settings = $.extend({
            factor: 4,
            mobile: false,
            mediaQuery: '(max-width: 42em)',
            selectorBottom: '[data-parallax-bottom]',
            selectorTop: '[data-parallax-top]'
        }, options);

        // Set elements
        $scrollTop = $(settings.selectorTop);
        $scrollBottom = $(settings.selectorBottom);

        if ($scrollTop.length || $scrollBottom.length) {
            _generateFactor();

            // only listen for scroll events
            $(window).on('scroll', function () {
                scrollPosition = Math.max($('body').scrollTop(), $('html').scrollTop());

                if (!settings.mobile && window.matchMedia && window.matchMedia(settings.mediaQuery).matches) {
                    return false;
                }

                if (!ticking) {
                    window.requestAnimationFrame(_callback);

                    ticking = true;
                }
            });
        }

    };

}(jQuery));
