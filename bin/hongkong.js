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
	  element.initialOffset = element.getBoundingClientRect().top;

	  if (currentTransform !== 'none') {
	    transformValues = _getValuesFromTransform(currentTransform);
	  }

	  element.transforms = transformValues;
	};

	var _isElementInViewport = function _isElementInViewport($element) {
	  var offsetTop = $element.offset().top;

	  return scrollPosition <= offsetTop + $element.height() && windowHeight + scrollPosition >= offsetTop;
	};

	var _getValuesFromTransform = function _getValuesFromTransform(matrix) {
	  var values = matrix.split('(')[1];
	  values = values.split(')')[0];
	  values = values.split(',');

	  var a = values[0];
	  var b = values[1];
	  var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

	  return {
	    rotate: angle,
	    scale: [parseFloat(values[0], 10), parseFloat(values[3], 10)],
	    skew: [parseFloat(values[1], 10), parseFloat(values[2], 10)],
	    translate: [parseFloat(values[4], 10), parseFloat(values[5], 10)]
	  };
	};

	var _getFullTransform = function _getFullTransform(element, positionY) {
	  var transform = 'translateY(' + positionY + 'px) translateZ(0) ';

	  if (!element.transforms) {
	    return transform;
	  }

	  transform += '\n    skew(' + element.transforms.skew[0] + ', ' + element.transforms.skew[1] + ')\n    scale(' + element.transforms.scale[0] + ', ' + element.transforms.scale[1] + ')\n    translate(' + element.transforms.translate[0] + ', ' + element.transforms.translate[1] + ')\n  ';

	  return transform;
	};

	var _animateElement = function _animateElement(element, direction) {
	  var $element = $(element);
	  var rectObject = element.getBoundingClientRect();
	  var visible = _isElementInViewport($element.parent());
	  var offset = void 0;
	  var factor = element.factor;

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
	  scrollPosition = Math.max($('body').scrollTop(), $('html').scrollTop());

	  if (!settings.mobile && window.matchMedia && window.matchMedia(settings.mediaQuery).matches) {
	    return false;
	  }

	  if (!ticking) {
	    window.requestAnimationFrame(_callback);

	    ticking = true;
	  }
	};

	var _setWindowHeight = function _setWindowHeight() {
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

	  $(window).on('resize load', function () {
	    _setWindowHeight();
	  });
	};

/***/ }
/******/ ]);