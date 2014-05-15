/**
 * jquery.typist – animated text typing
 * @author Alexander Burtsev, http://burtsev.me, 2014
 * @license MIT
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

	$.fn.typistAdd = function(text) {
		return this.each(function() {
			var self = $(this).data('typist');
			self.queue.push(text);
			self.type();
		});
	};

	$.fn.typistRemove = function() {
		// @todo
	};

	$.fn.typistDefer = function(delay) {
		delay = parseInt(delay) || 0;
		return this.each(function() {
			var self = $(this).data('typist');
			self.queue.push({ delay: delay });
			self.type();
		});
	};

	$.fn.typistStop = function() {
		// @todo
	};

	function Typist(element, opts) {
		$.extend(this, {
			speed: 10, // characters per second
			text: '',
			cursor: true,
			blinkSpeed: 2, // blink per second
			typeFrom: 'end', // 'start', 'end'

			cursorStyles: {
				display: 'inline-block',
				fontStyle: 'normal',
				margin: '-2px 2px 0 2px'
			}
		}, opts || {});

		this._element = $(element);
		this._element.data('typist', this);

		this.queue = [];
		this.timer = null;
		this.delay = 1000 / this.speed;

		this.blinkTimer = null;
		this.blinkDelay = 1000 / this.blinkSpeed;

		if ( this.text ) {
			this.queue.push(this.text);
			this.type();
		}
	}

	Typist.prototype = {
		addCursor: function() {
			if ( this._cursor ) {
				clearInterval(this.blinkTimer);
				this._cursor
					.stop()
					.remove();
			}

			this._cursor = $('<span>|</span>')
				.css(this.cursorStyles)
				.insertAfter(this._container);

			this.cursorVisible = true;
			this.blinkTimer = setInterval($.proxy(function() {
				this.cursorVisible = !this.cursorVisible;
				this._cursor.animate({ opacity: this.cursorVisible ? 1 : 0 }, 100);
			}, this), this.blinkDelay);
		},

		step: function(textArray) {
			if ( !textArray.length ) {
				this.timer = null;
				return this.type();
			}

			var character = textArray.shift();
			if ( character === '\n' ) {
				character = '<br/>';
			} else {
				character = $('<div>').html(character).text();
			}

			this.timer = setTimeout($.proxy(function() {
				this._container.html(this._container.html() + character);
				this.step(textArray);
			}, this), this.delay);
		},

		stop: function() {

		},

		type: function() {
			if ( this.timer ) {
				return;
			}

			if ( !this._container ) {
				this._container = $('<span>');
				if ( this.typeFrom === 'start' ) {
					this._element.prepend(this._container);
				} else {
					this._element.append(this._container);
				}
			}

			if ( this.cursor ) {
				this.addCursor();
			}

			var item = this.queue.shift(),
				text, delay;

			if ( typeof item === 'string' ) {
				text = item;
			} else if ( item && item.delay ) {
				delay = item.delay;
				this.timer = setTimeout($.proxy(function() {
					this.timer = null;
					this.type();
				}, this), delay);

				return;
			}

			if ( !text ) {
				return this.stop();
			}

			text = text.split('');
			this.step(text);
		}
	};
}));
