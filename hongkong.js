/**
 * Parallax scrolling
 */
let $ = window.jQuery;

/**
 * Settings for the plugin
 * @type {Object}
 */
let settings = {};

/**
 * All elements
 */
let $ELEMENTS;

/**
 * General variables
 */
let windowHeight = 0;
let scrollPosition = 0;
let ticking = false;
let generalOffset = 0;

/**
 * Get the factor attribute for each and initial transforms
 * @return {void}
 */
let _setupElements = () => {
  for (let i = 0; i < $ELEMENTS.length; i++) {
    _setupElement($ELEMENTS[i]);
  }
};

/**
 * Setup each element
 * @param  {Node} element Element which should be used
 * @return {void}
 */
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

/**
 * Check if an element is in the viewport
 * @param  {Object}  $element   Node-like jQuery element to check if in viewport
 * @param  {Number}  transformY Add this offset
 * @return {Boolean}            true if element is in the viewport
 */
let _isElementInViewport = ($element, transformY) => {
  let rect = Object.assign({}, $element[0].rect);

  rect.top += transformY;
  rect.bottom = rect.top + rect.height;

  return (
    rect.bottom >= scrollPosition - generalOffset - settings.threshold &&
    rect.top - scrollPosition - generalOffset - settings.threshold <= window.innerHeight
  );
};

/**
 * Get the current css transform of a matrix
 * @param  {Array}  matrix Current matrix of CSS transforms
 * @return {Object}        transforms in CSS speak
 */
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

/**
 * Get the string which should be applied to the element's transform
 * @param  {Object} transforms Transforms which should be added
 * @param  {Number} positionY  Add this offset
 * @return {String}            Transform string for element
 */
let _getFullTransform = (transforms, positionY) => {
  let transform = `translateY(${positionY}px) translateZ(0) `;

  if (!transforms) {
    return transform;
  }

  transform += `
    skew(${element.transforms.skewX.toFixed(2)}deg, ${element.transforms.skewY}deg)
    scale(${element.transforms.scaleX}, ${element.transforms.scaleY})
  `;

  return transform;
};

/**
 * Animate the element to top or bottom
 * @param  {Node}   element   Node which should be animated
 * @param  {String} direction Top or bottom animation
 * @return {void}
 */
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
    transform: _getFullTransform(element.transforms, transformY)
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

/**
 * Update elements based on scroll, fires rAF
 * @return {void}
 */
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

/**
 * Get the current window height and set it to the main property of the module
 * @return {void}
 */
let _setWindowHeight = () => {
  windowHeight = window.innerHeight;
};

/**
 * Set the general offset of the page
 * @param  {Object} event  Event fired
 * @param  {Number} offset Offset to set
 * @return {void}
 */
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
$.hongkong = (options) => {

  // Options
  settings = $.extend({
    factor: 4,
    mobile: false,
    mediaQuery: '(max-width: 42em)',
    threshold: 0,
    selector: '[data-parallax]',
    selectorBottom: '[data-parallax-bottom]', // Deprecated
    selectorTop: '[data-parallax-top]' // Deprecated
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
