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
	var $ = window.jQuery;

	// Setting for the plugin
	var settings = {};

	// Get elements
	var $ELEMENTS = void 0;

	var windowHeight = 0;
	var scrollPosition = 0;
	var ticking = false;

	/**
	 * Get the factor attribute for each and initial transforms
	 * @return {[type]} [description]
	 */
	var _setupElements = function _setupElements() {
	  for (var i = 0; i < $ELEMENTS.length; i++) {
	    _setupElement($ELEMENTS[i]);
	  }
	};

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

	var _isElementInViewport = function _isElementInViewport($element, transformY) {
	  var rect = Object.assign({}, $element[0].rect);
	  var threshold = 100;

	  rect.top += transformY;
	  rect.bottom = rect.top + rect.height;

	  return rect.bottom >= scrollPosition - threshold && rect.top - scrollPosition - threshold <= window.innerHeight;
	};

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

	var _getFullTransform = function _getFullTransform(element, positionY) {
	  var transform = 'translateY(' + positionY + 'px) translateZ(0) ';

	  if (!element.transforms) {
	    return transform;
	  }

	  transform += '\n    skew(' + element.transforms.skewX.toFixed(2) + 'deg, ' + element.transforms.skewY + 'deg)\n    scale(' + element.transforms.scaleX + ', ' + element.transforms.scaleY + ')\n  ';

	  return transform;
	};

	var _animateElement = function _animateElement(element, direction) {
	  var $element = $(element);
	  var offset = element.rect.top - scrollPosition;
	  var factor = element.factor;

	  if (direction === 'bottom') {
	    factor *= -1;
	  }

	  var transformY = Math.floor(offset / factor);
	  var visible = _isElementInViewport($element, transformY);

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
	    if ($ELEMENTS[i].dataset.parallaxBottom === '') {
	      direction = 'bottom';
	    }

	    _animateElement($ELEMENTS[i], direction);
	  }

	  // allow further rAFs to be called
	  ticking = false;
	};

	var update = function update() {
	  scrollPosition = window.scrollY;

	  if (!settings.mobile && window.matchMedia && window.matchMedia(settings.mediaQuery).matches) {
	    return false;
	  }

	  if (!ticking) {
	    window.requestAnimationFrame(_callback);

	    ticking = true;
	  }
	};

	var _setWindowHeight = function _setWindowHeight() {
	  windowHeight = window.innerHeight;
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

	  $(window).on('resize load', function () {
	    _setWindowHeight();
	  });
	};

/***/ }
/******/ ]);