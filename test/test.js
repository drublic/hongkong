(function ($) {
    'use strict';

    var offset = 0;

    $.hongkong();

    $(document).on('click', '.toggle', function (event) {
        event.preventDefault();

        var hash = $(event.target).attr('href');

        if (window.location.hash === hash) {
            window.location.hash = '!';
        } else {
            window.location.hash = hash;
        }

        $(document).trigger('hongkong:refresh');
    });

    $(document).on('click', '.set-offset', function () {
      if (offset === 0) {
        offset = 400;
      } else {
        offset = 0;
      }

      $(document).trigger('hongkong:offset', offset);
    });
}(jQuery));
