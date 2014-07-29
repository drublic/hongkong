(function ($) {
    'use strict';

    $(document).on('click', '.button', function (event) {
        event.preventDefault();

        var hash = $(event.target).attr('href');

        if (window.location.hash === hash) {
            window.location.hash = '!';
        } else {
            window.location.hash = hash;
        }
    });
}(jQuery));
