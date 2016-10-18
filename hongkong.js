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
let generalOffset = 0;

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
  element.rect = {
    top: $element.offset().top,
    left: $element.offset().left,
    width: $element.width(),
    height: $element.height()
  };
  element.initialOffset = element.rect.top;

  if (currentTransform !== 'none') {
    transformValues = _getValuesFromTransform(currentTransform);
  }

  element.transforms = transformValues;
}

let _isElementInViewport = ($element, transformY) => {
  let rect = Object.assign({}, $element[0].rect);
  let threshold = 100;

  rect.top += transformY;
  rect.bottom = rect.top + rect.height;

  return (
    rect.bottom >= scrollPosition - generalOffset - threshold &&
    rect.top - scrollPosition - generalOffset - threshold <= window.innerHeight
  );
};

let _getValuesFromTransform = (matrix) => {
  let values = matrix.split('(')[1];
  values = values.split(')')[0];
  values = values.split(',');

  let angle = Math.atan2(values[1], values[0]);
  let denom = Math.pow(values[0], 2) + Math.pow(values[1], 2);
  let scaleX = Math.sqrt(denom);
  let scaleY = (values[0] * values[3] - values[2] * values[1]) / scaleX;
  let skewX = Math.atan2(values[0] * values[2] + values[1] * values[3], denom);

  return {
    rotate: angle / (Math.PI / 180),
    scaleX: scaleX,                  // scaleX factor
    scaleY: scaleY,                  // scaleY factor
    skewX: skewX / (Math.PI / 180),  // skewX angle degrees
    skewY: 0,                        // skewY angle degrees
    translateX: values[4],           // translation point  x
    translateY: values[5]            // translation point  y
  };
};

let _getFullTransform = (element, positionY) => {
  let transform = `translateY(${positionY}px) translateZ(0) `;

  if (!element.transforms) {
    return transform;
  }

  transform += `
    skew(${element.transforms.skewX.toFixed(2)}deg, ${element.transforms.skewY}deg)
    scale(${element.transforms.scaleX}, ${element.transforms.scaleY})
  `;

  return transform;
};

let _animateElement = (element, direction) => {
  let $element = $(element);
  let offset = element.rect.top - scrollPosition;
  let factor = element.factor;

  if (direction === 'bottom') {
    factor *= -1;
  }

  let transformY = Math.floor(offset / factor);
  let visible = _isElementInViewport($element, transformY);

  element.style.visibility = visible ? 'visible' : 'hidden';

  if (visible === false) {
    return;
  }

  if (element.dataset.parallaxRemoveInitialOffset === '') {
    offset -= element.initialOffset;
    transformY = Math.floor(offset / factor);
  }

  $element.css({
    transform: _getFullTransform(element, transformY)
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
  scrollPosition = window.scrollY;

  if (!settings.mobile && window.matchMedia && window.matchMedia(settings.mediaQuery).matches) {
    return false;
  }

  if (!ticking) {
    window.requestAnimationFrame(_callback);

    ticking = true;
  }
};

let _setWindowHeight = () => {
  windowHeight = window.innerHeight;
};

let _setOffset = (event, offset) => {
  generalOffset = offset;
};

/**
 * Events
 */
$(document)
  .on('hongkong:refresh', _callback)
  .on('hongkong:offset', _setOffset);

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

  $(window).on('resize load', _setWindowHeight);
};
