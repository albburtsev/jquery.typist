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

	$.fn.typistRemove = function(length) {
		length = parseInt(length) || 0;
		return this.each(function() {
			var self = $(this).data('typist');
			self.queue.push({ remove: length });
			self.type();
		});
	};

	$.fn.typistPause = function(delay) {
		delay = parseInt(delay) || 0;
		return this.each(function() {
			var self = $(this).data('typist');
			self.queue.push({ delay: delay });
			self.type();
		});
	};

	$.fn.typistStop = function() {
		return this.each(function() {
			var self = $(this).data('typist');
			self.queue.push({ stop: true });
			self.type();
		});
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

		fire: function(event) {
			this._element.trigger(event, this);
			return this;
		},

		nl2br: function(str) {
			return str.replace('\n', '<br/>');
		},

		remove: function(length) {
			if ( length <= 0 ) {
				this.timer = null;
				return this
					.fire('end_remove.typist')
					.type();
			}

			length--;
			var text = this._container.text();
			text = text.substr(0, text.length - 1);
			text = this.nl2br(text);

			this.timer = setTimeout($.proxy(function() {
				this._container.html(text);
				this.remove(length);
			}, this), this.delay);
		},

		step: function(textArray) {
			if ( !textArray.length ) {
				this.timer = null;
				return this
					.fire('end_type.typist')
					.type();
			}

			var character = textArray.shift();
			character = $('<div>').text(character).html();
			character = this.nl2br(character);

			this.timer = setTimeout($.proxy(function() {
				this._container.html(this._container.html() + character);
				this.step(textArray);
			}, this), this.delay);
		},

		stop: function() {
			clearInterval(this.blinkTimer);
			this.blinkTimer = null;

			if ( this._cursor ) {
				this._cursor.remove();
				this._cursor = null;
			}

			clearTimeout(this.timer);
			this.timer = null;
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
				text;

			if ( typeof item === 'string' ) {
				text = item;

			} else if ( item && item.delay ) {
				this
					.fire('start_pause.typist')
					.timer = setTimeout($.proxy(function() {
						this.timer = null;
						this
							.fire('end_pause.typist')
							.type();
					}, this), item.delay);
				return;

			} else if ( item && item.remove ) {
				this
					.fire('start_remove.typist')
					.remove(item.remove);
				return;

			} else if ( item && item.stop ) {
				this.stop();
				return;
			}

			if ( !text ) {
				return;
			}

			text = text.split('');

			this
				.fire('start_type.typist')
				.step(text);
		}
	};
}));
