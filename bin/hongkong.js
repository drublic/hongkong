/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Parallax scrolling
	 */
	var $ = {};

	/**
	 * Settings for the plugin
	 * @type {Object}
	 */
	var settings = {};

	/**
	 * All elements
	 */
	var $ELEMENTS = void 0;

	/**
	 * General variables
	 */
	var scrollPosition = 0;
	var ticking = false;
	var generalOffset = 0;

	/**
	 * Get the factor attribute for each and initial transforms
	 * @return {void}
	 */
	var _setupElements = function _setupElements() {
	  for (var i = 0; i < $ELEMENTS.length; i++) {
	    _setupElement($ELEMENTS[i]);
	  }
	};

	/**
	 * Setup each element
	 * @param  {Node} element Element which should be used
	 * @return {void}
	 */
	var _setupElement = function _setupElement(element) {
	  var $element = $(element);
	  var factor = element.getAttribute('data-parallax-factor');
	  var transformValues = void 0;
	  var currentTransform = $element.css('transform');

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
	};

	/**
	 * Check if an element is in the viewport
	 * @param  {Object}  $element   Node-like jQuery element to check if in viewport
	 * @param  {Number}  transformY Add this offset
	 * @return {Boolean}            true if element is in the viewport
	 */
	var _isElementInViewport = function _isElementInViewport($element) {
	  var transformY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	  var rect = $.extend({}, $element[0].rect);

	  rect.top += transformY;
	  rect.bottom = rect.top + rect.height;

	  return rect.bottom + generalOffset >= scrollPosition - settings.threshold && rect.top - scrollPosition - settings.threshold <= window.innerHeight + generalOffset;
	};

	/**
	 * Get the current css transform of a matrix
	 * @param  {Array}  matrix Current matrix of CSS transforms
	 * @return {Object}        transforms in CSS speak
	 */
	var _getValuesFromTransform = function _getValuesFromTransform(matrix) {
	  var values = matrix.split('(')[1];
	  values = values.split(')')[0];
	  values = values.split(',');

	  var angle = Math.atan2(values[1], values[0]);
	  var denom = Math.pow(values[0], 2) + Math.pow(values[1], 2);
	  var scaleX = Math.sqrt(denom);
	  var scaleY = (values[0] * values[3] - values[2] * values[1]) / scaleX;
	  var skewX = Math.atan2(values[0] * values[2] + values[1] * values[3], denom);

	  return {
	    rotate: angle / (Math.PI / 180),
	    scaleX: scaleX, // scaleX factor
	    scaleY: scaleY, // scaleY factor
	    skewX: skewX / (Math.PI / 180), // skewX angle degrees
	    skewY: 0, // skewY angle degrees
	    translateX: values[4], // translation point  x
	    translateY: values[5] // translation point  y
	  };
	};

	/**
	 * Get the string which should be applied to the element's transform
	 * @param  {Object} transforms Transforms which should be added
	 * @param  {Number} positionY  Add this offset
	 * @return {String}            Transform string for element
	 */
	var _getFullTransform = function _getFullTransform(transforms, positionY) {
	  var transform = 'translateY(' + positionY + 'px) translateZ(0) ';

	  if (!transforms) {
	    return transform;
	  }

	  if (transforms.skewX || transforms.skewY) {
	    transform += 'skew(' + transforms.skewX.toFixed(2) + 'deg, ' + transforms.skewY + 'deg)';
	  }

	  if (transforms.scaleX || transforms.scaleY) {
	    transform += 'scale(' + transforms.scaleX + ', ' + transforms.scaleY + ')';
	  }

	  return transform;
	};

	/**
	 * Animate the element to top or bottom
	 * @param  {Node}   element   Node which should be animated
	 * @param  {String} direction Top or bottom animation
	 * @return {void}
	 */
	var _animateElement = function _animateElement(element, direction) {
	  var $element = $(element);
	  var offset = element.rect.top - scrollPosition;
	  var factor = element.factor;

	  if ($element.data('parallax-remove-general-offset') === '') {
	    offset += generalOffset;
	  }

	  if (direction === 'bottom') {
	    factor *= -1;
	  }

	  var transformY = Math.floor(offset / factor);
	  var visible = _isElementInViewport($element, transformY);

	  if (visible === false) {
	    return;
	  }

	  if ($element.data('parallax-remove-initial-offset') === '') {
	    offset -= element.initialOffset;
	  }

	  $element.css({
	    transform: _getFullTransform(element.transforms, transformY)
	  });
	};

	/**
	 * Callback for rAF
	 * @return {void}
	 */
	var _callback = function _callback() {

	  // Don't do anything if we've scrolled to the top
	  if (scrollPosition <= 0) {

	    ticking = false;

	    return;
	  }

	  var direction = 'top';

	  for (var i = 0; i < $ELEMENTS.length; i++) {
	    if ($($ELEMENTS[i]).data('parallax-bottom') === '') {
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
	var update = function update() {
	  scrollPosition = window.scrollY || window.pageYOffset;

	  if (!settings.mobile && window.matchMedia && window.matchMedia(settings.mediaQuery).matches) {
	    return false;
	  }

	  if (!ticking && window.requestAnimationFrame) {
	    window.requestAnimationFrame(_callback);

	    ticking = true;
	  }
	};

	/**
	 * Set the general offset of the page
	 * @param  {Object} event  Event fired
	 * @param  {Number} offset Offset to set
	 * @return {void}
	 */
	var _setOffset = function _setOffset(event, offset) {
	  generalOffset = offset;
	};

	var initialize = function initialize() {
	  if ($ELEMENTS.length > 0) {
	    _setupElements();
	  }
	};

	/**
	 * Init as jQuery plugin
	 */
	var constructor = function constructor(jQuery) {
	  $ = jQuery;

	  /**
	   * Events
	   */
	  $(document).on('hongkong:refresh', _callback).on('hongkong:offset', _setOffset);

	  $.hongkong = function (options) {

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
	      initialize();

	      // listen for scroll events
	      $(window).on('scroll', update);
	    }

	    $(window).on('resize load', initialize);
	  };
	};

	if (window.jQuery || window.$) {
	  constructor(window.jQuery);
	} else if (module.exports) {
	  module.exports = constructor;
	} else {
	  throw Error('Hongkong: Please make jQuery available globally.');
	}

/***/ }
/******/ ]);