/**
 * Parallax scrolling
 */
let $ = window.jQuery;

/**
 * Dependencies
 */
import _throttle from 'lodash/throttle';

// Setting for the plugin
let settings = {};

// Get elements
let $scrollTop;
let $scrollBottom;

let scrollPosition = 0;
let ticking = false;

/**
 * Get the factor attribute for each
 * @return {[type]} [description]
 */
let _generateFactor = () => {
  for (let i = 0; i < $scrollTop.length; i++) {
    $scrollTop[i].factor = parseFloat($scrollTop[i].getAttribute('data-parallax-factor') || settings.factor, 10);
    $scrollTop[i].initialOffset = $scrollTop[i].getBoundingClientRect().top;
  }

  for (let i = 0; i < $scrollBottom.length; i++) {
    $scrollBottom[i].factor = parseFloat($scrollBottom[i].getAttribute('data-parallax-factor') || settings.factor, 10);
    $scrollBottom[i].initialOffset = $scrollBottom[i].getBoundingClientRect().top;
  }
};

let _isElementInViewport = ($element) => {
  let offsetTop = $element.offset().top;

  return (
    (scrollPosition <= offsetTop + $element.height()) &&
    ($(window).height() + scrollPosition >= offsetTop)
  );
};

/**
 * Callback for rAF
 * @return {void}
 */
let _callback = () => {
  let visible;
  let rectObject = 0;
  let offset;

  // Don't do anything if we've scrolled to the top
  if (scrollPosition <= 0) {
    $scrollTop.css('transform', 'translateY(0) translateZ(0)');
    $scrollBottom.css('transform', 'translateY(0) translateZ(0)');

    ticking = false;

    return;
  }

  for (let i = 0; i < $scrollTop.length; i++) {
    rectObject = $scrollTop[i].getBoundingClientRect();
    visible = _isElementInViewport($($scrollTop[i]).parent());

    $scrollTop[i].style.visibility = visible ? 'visible' : 'hidden';

    if (visible) {
      offset = rectObject.top - $scrollTop[i].initialOffset;
      $($scrollTop[i]).css('transform', 'translateY(' + Math.floor(offset / $scrollTop[i].factor) + 'px) translateZ(0)');
    }
  }

  for (let i = 0; i < $scrollBottom.length; i++) {
    rectObject = $scrollBottom[i].getBoundingClientRect();
    visible = _isElementInViewport($($scrollBottom[i]).parent());

    $scrollBottom[i].style.visibility = visible ? 'visible' : 'hidden';
    if (visible) {
      offset = rectObject.top - $scrollBottom[i].initialOffset;
      $($scrollBottom[i]).css('transform', 'translateY(' + Math.floor(offset / ($scrollBottom[i].factor * -1)) + 'px) translateZ(0)');
    }
  }

  // allow further rAFs to be called
  ticking = false;
};

let update =   () => {
  scrollPosition = Math.max($('body').scrollTop(), $('html').scrollTop());

  if (!settings.mobile && window.matchMedia && window.matchMedia(settings.mediaQuery).matches) {
    return false;
  }

  if (!ticking) {
    window.requestAnimationFrame(_callback);

    ticking = true;
  }
}

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
    $(window).on('scroll', _throttle(update));
  }

};
