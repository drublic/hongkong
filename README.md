# jQuery based plugin for parallax scrolling

[![Build Status](https://secure.travis-ci.org/use-init/init.svg?branch=master)](http://travis-ci.org/drublic/hongkong)
[![Dependency Status](https://david-dm.org/drublic/hongkong.svg)](https://david-dm.org/drublic/hongkong)
[![devDependency Status](https://david-dm.org/drublic/hongkong/dev-status.svg)](https://david-dm.org/drublic/hongkong#info=devDependencies)

## Install via npm

    npm i --save hongkong

## Usage

Please add `bin/hongkong.js` to your website. Make sure to include
the dependency jQuery.

    <script src="node_modules/jquery/dist/jquery.js"></script>
    <script src="node_modules/hongkong/bin/hongkong.js"></script>

Just add the attribute `data-parallax`. For directions of the "floating" element
please use `data-parallax-top` or `data-parallax-bottom`.

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
* `selector`: Selector to use to detect elements that should be scrolled; default `[data-parallax]`
* `threshold`: Set threshold for showing and hiding elements; default `0`

### Data attributes
* data-parallax-top
* data-parallax-bottom
* data-parallax-factor
* data-parallax-remove-initial-offset
* data-parallax-remove-general-offset

## Development

Run `npm i` inside this folder.
Start a development server with `npm start`.

## License

The MIT [License](./LICENSE) (MIT)
Copyright (c) 2014 Hans Christian Reinl
