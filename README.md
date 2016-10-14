# jQuery based plugin for parallax scrolling

[![Build Status](https://secure.travis-ci.org/use-init/init.svg?branch=master)](http://travis-ci.org/drublic/hongkong)
[![Dependency Status](https://david-dm.org/drublic/hongkong.svg)](https://david-dm.org/drublic/hongkong)
[![devDependency Status](https://david-dm.org/drublic/hongkong/dev-status.svg)](https://david-dm.org/drublic/hongkong#info=devDependencies)

## Install via npm

    npm i --save hongkong

## Usage

Please add `hongkong.js` right before the closing body tag. Make sure to include
the dependency jQuery and a requestAnimationFrame polyfill.

    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="bower_components/raf.js/raf.js"></script>
    <script src="bower_components/hongkong/hongkong.js"></script>

Just add an attribute `data-parallax-top` or `data-parallax-bottom` to the
element you want to be animated in the named direction.

You can add a `data-parallax-factor` with a value which is an integer to change
the factor of which the element should move. Default is 4.

Then call

    $.hongkong();

somewhere within your JavaScript.

## Options

You can pass options to HongKong to customize it a bit:

* `factor`: default factor to use for momentum if no other is set via a data-attribute; default: `4`
* `mobile`: support parallax effect on mobile; default: `false`
* `mediaQuery`: Media query to match against when disabling parallax on mobile; default: `(max-width: 42em)`
* `selectorBottom`: Selector to use to detect elements that should be scrolled to bottom; default `[data-parallax-bottom]`
* `selectorTop`: Selector to use to detect elements that should be scrolled to top; default `[data-parallax-top]`
