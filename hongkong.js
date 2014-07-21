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

            $scrollTop[j].factor = factor;
        }
    };

    /**
     * Throttle scrolling
     * @param  {function} func
     * @param  {integer}  wait
     * @param  {boolean}  immediate
     * @return {function}
     */
    var _throttle = function (func, wait, immediate) {
        var timeout;

        return function () {
            var later = function () {
                timeout = null;

                if (!immediate) {
                    func.apply(this, arguments);
                }
            };

            var callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) {
                func.apply(this, arguments);
            }
        };
    };

    /**
     * Callback for throttle function
     * @return {void}
     */
    var _callback = function () {
        var scroll = window.pageYOffset;
        var i;
        var factor;

        if (scrollPosition === scroll) {
            window.cancelAnimationFrame(_callback);
            $scrollTop.css('transform', 'translateY(0)');

            return false;
        }

        for (i = 0; i < $scrollTop.length; i++) {
            factor = $scrollTop[i].factor;
            $scrollTop.eq(i).css('transform', 'translateY(' + parseInt(scroll / factor, 10) + 'px)');
        }

        for (i = 0; i < $scrollBottom.length; i++) {
            factor = $scrollTop[i].factor;
            $scrollTop.eq(i).css('transform', 'translateY(' + parseInt(scroll / (factor * -1), 10) + 'px)');
        }

        window.cancelAnimationFrame(_callback);
    };

    /**
     * Init
     */
     _generateFactor();

    $(window).on('scroll', function () {
        _throttle(window.requestAnimationFrame(_callback), 100, false);
    });
}(jQuery));
