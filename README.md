# jQuery based plugin for parallax scrolling

## Install via Bower

	bower i --save parallax-scroll

## Usage

Please add `parallax-scroll.js`. Make sure to include the dependency jQuery
and a requestAnimationFrame polyfill.

	<script src="bower_components/jquery/dist/jquery.js"></script>
	<script src="bower_components/raf.js/raf.js"></script>
	<script src="bower_components/parallax-scroll/parallax-scroll.js"></script>

Just add an attribute `data-parallax-top` or `data-parallax-bottom` to the
element you want to be animated in the named direction.

You can add a `data-parallax-factor` with a value which is an integer to change
the factor of which the element should move. Default is 4.
