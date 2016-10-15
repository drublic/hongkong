/**
 * Parallax scrolling
 */
let $ = window.jQuery;

// Setting for the plugin
let settings = {};

// Get elements
let $ELEMENTS;

let windowHeight = 0;
let scrollPosition = 0;
let ticking = false;

/**
 * Get the factor attribute for each and initial transforms
 * @return {[type]} [description]
 */
let _setupElements = () => {
  for (let i = 0; i < $ELEMENTS.length; i++) {
    _setupElement($ELEMENTS[i]);
  }
};

let _setupElement = (element) => {
  let $element = $(element);
  let factor = element.getAttribute('data-parallax-factor');
  let transformValues;
  let currentTransform = $element.css('transform');

  element.factor = parseFloat(factor || settings.factor, 10);
  element.initialOffset = element.getBoundingClientRect().top;

  if (currentTransform !== 'none') {
    transformValues = _getValuesFromTransform(currentTransform);
  }

  element.transforms = transformValues;
}

let _isElementInViewport = ($element) => {
  let offsetTop = $element.offset().top;

  return (
    (scrollPosition <= offsetTop + $element.height()) &&
    (windowHeight + scrollPosition >= offsetTop)
  );
};

let _getValuesFromTransform = (matrix) => {
  let values = matrix.split('(')[1];
  values = values.split(')')[0];
  values = values.split(',');

  let a = values[0];
  let b = values[1];
  let angle = Math.round(Math.atan2(b, a) * (180/Math.PI));

  return {
    rotate: angle,
    scale: [parseFloat(values[0], 10), parseFloat(values[3], 10)],
    skew: [parseFloat(values[1], 10), parseFloat(values[2], 10)],
    translate: [parseFloat(values[4], 10), parseFloat(values[5], 10)]
  };
};

let _getFullTransform = (element, positionY) => {
  let transform = `translateY(${positionY}px) translateZ(0) `;

  if (!element.transforms) {
    return transform;
  }

  transform += `
    skew(${element.transforms.skew[0]}, ${element.transforms.skew[1]})
    scale(${element.transforms.scale[0]}, ${element.transforms.scale[1]})
    translate(${element.transforms.translate[0]}, ${element.transforms.translate[1]})
  `;

  return transform;
};

let _animateElement = (element, direction) => {
  let $element = $(element);
  let rectObject = element.getBoundingClientRect();
  let visible = _isElementInViewport($element.parent());
  let offset;
  let factor = element.factor;

  if (direction === 'bottom') {
    factor *= -1;
  }

  element.style.visibility = visible ? 'visible' : 'hidden';

  if (!visible) {
    return;
  }

  offset = rectObject.top - element.initialOffset;

  $element.css({
    transform: _getFullTransform(element, Math.floor(offset / factor))
  });
}

/**
 * Callback for rAF
 * @return {void}
 */
let _callback = () => {

  // Don't do anything if we've scrolled to the top
  if (scrollPosition <= 0) {

    ticking = false;

    return;
  }

  let direction = 'top';

  for (let i = 0; i < $ELEMENTS.length; i++) {
    if ($ELEMENTS[i].dataset.parallaxBottom === '') {
      direction = 'bottom';
    }

    _animateElement($ELEMENTS[i], direction);
  }

  // allow further rAFs to be called
  ticking = false;
};

let update = () => {
  scrollPosition = Math.max($('body').scrollTop(), $('html').scrollTop());

  if (!settings.mobile && window.matchMedia && window.matchMedia(settings.mediaQuery).matches) {
    return false;
  }

  if (!ticking) {
    window.requestAnimationFrame(_callback);

    ticking = true;
  }
};

let _setWindowHeight = () => {
  windowHeight = $(window).height();
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
    selector: '[data-parallax]',
    selectorBottom: '[data-parallax-bottom]',
    selectorTop: '[data-parallax-top]'
  }, options);

  // Set elements
  $ELEMENTS = $(settings.selector);

  if ($ELEMENTS.length > 0) {
    _setupElements();

    // listen for scroll events
    $(window).on('scroll', update);
  }

  $(window).on('resize load', () => {
    _setWindowHeight();
  });
};
