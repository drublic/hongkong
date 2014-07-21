/**
 * Parallax scrolling
 */
(function ($) {
    var $scrollTop = $('[data-parallax-top]');
    var $scrollBottom = $('[data-parallax-bottom]');
    var factor;
    var scrollPosition = 0;

    /**
     * Get the factor attribute for each
     * @return {[type]} [description]
     */
    var _generateFactor = function () {
        var i = 0;
        var j = 0;

        for (; i < $scrollTop.length; i++) {
            factor = $scrollTop[i].getAttribute('data-parallax-factor') || 4;

            $scrollTop[i].factor = factor;
        }

        for (; j < $scrollBottom.length; j++) {
            factor = $scrollBottom[j].getAttribute('data-parallax-factor') || 4;

            $scrollBottom[j].factor = factor;
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
            $scrollTop.eq(i).css('transform', 'translateY(' + parseInt(scroll / factor, 10) + 'px) translateZ(0)');
        }

        for (i = 0; i < $scrollBottom.length; i++) {
            factor = $scrollBottom[i].factor;
            $scrollBottom.eq(i).css('transform', 'translateY(' + parseInt(scroll / (factor * -1), 10) + 'px) translateZ(0)');
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
