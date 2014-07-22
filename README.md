# jQuery based plugin for parallax scrolling

## Install via Bower

	bower i --save hongkong

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
