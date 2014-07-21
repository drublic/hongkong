/**
 * Parallax scrolling
 */
(function ($) {
    var $scrollTop = $('[data-parallax-top]');
    var $scrollBottom = $('[data-parallax-bottom]');
    var scrollPosition = 0;

    /**
     * Get the factor attribute for each
     * @return {[type]} [description]
     */
    var _generateFactor = function () {
        var i;

        for (i = 0; i < $scrollTop.length; i++) {
            $scrollTop[i].factor = parseInt($scrollTop[i].getAttribute('data-parallax-factor') || 4, 10);
        }

        for (i = 0; i < $scrollBottom.length; i++) {
            $scrollBottom[i].factor = parseInt($scrollBottom[i].getAttribute('data-parallax-factor') || 4, 10);
        }
    };


    /**
     * Callback for rAF
     * @return {void}
     */
    var _callback = function () {
        var scroll = window.pageYOffset;
        var i;
        var factor;

        if (scrollPosition === scroll) {
            $scrollTop.css('transform', 'translateY(0) translateZ(0)');
            window.requestAnimationFrame(_callback);

            return false;
        }

        for (i = 0; i < $scrollTop.length; i++) {
            factor = $scrollTop[i].factor;
            $scrollTop.eq(i).css('transform', 'translateY(' + Math.floor(scroll / factor) + 'px) translateZ(0)');
        }

        for (i = 0; i < $scrollBottom.length; i++) {
            factor = $scrollBottom[i].factor;
            $scrollBottom.eq(i).css('transform', 'translateY(' + Math.floor(scroll / (factor * -1)) + 'px) translateZ(0)');
        }

        window.requestAnimationFrame(_callback);
    };

    /**
     * Init
     */
    if ($scrollTop.length || $scrollBottom.length) {
        _generateFactor();
        window.requestAnimationFrame(_callback);
    }

}(jQuery));
