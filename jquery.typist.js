/**
 * jquery.typist – animated text typing
 * @author Alexander Burtsev, http://burtsev.me, 2014
 * @license MIT
 *
 * @todo: scaffolding
 * @todo: config: speed, cursor, blinkSpeed
 * @todo: methods: typistEnter, typistDelay, typistStop
 */
 (function(factory) {
	if ( typeof define === 'function' && define.amd ) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function($) {
	'use strict';

	$.fn.typist = function(opts) {
		return this.each(function() {
			new Typist(this, opts);
		});
	};

	function Typist(container, opts) {
		console.log('Hello typist!');

		$.extend(this, {
			
		}, opts || {});
	}
}));
