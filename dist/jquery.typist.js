/**
 * jquery.typist — animated text typing
 * @author Alexander Burtsev, http://burtsev.me, 2014—2015
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

	$.fn.typistInit = function () {
		return this.each(function() {
			if ( !$(this).data('typist')) {
				new Typist(this);
			}
		});
	};

	$.fn.typist = function(opts) {
		return this.each(function() {
			new Typist(this, opts);
		});
	};

	$.fn.typistAdd = function(text, callback) {
		return this
			.typistInit()
			.each(function() {
				var self = $(this).data('typist');
				self.queue.push({ text: text, callback: callback });
				self.type();
			});
	};

	$.fn.typistRemove = function(length, callback) {
		length = parseInt(length) || 0;

		return this
			.typistInit()
			.each(function() {
				var self = $(this).data('typist');
				self.queue.push({ remove: length, callback: callback });
				self.type();
			});
	};

	$.fn.typistPause = function(delay, callback) {
		delay = parseInt(delay) || 0;

		return this
			.typistInit()
			.each(function() {
				var self = $(this).data('typist');
				self.queue.push({ delay: delay, callback: callback });
				self.type();
			});
	};

	$.fn.typistStop = function() {
		return this
			.typistInit()
			.each(function() {
				var self = $(this).data('typist');
				self.queue.push({ stop: true });
				self.type();
			});
	};

	/**
	 * @class
	 * @param {HTMLElement} element
	 * @param {Object} [opts]
	 * @param {String} [opts.text=''] Text for typing
	 * @param {Number} [opts.speed=10] Typing speed (characters per second)
	 * @param {Boolean} [opts.cursor=true] Shows blinking cursor
	 * @param {Number} [opts.blinkSpeed=2] Blinking per second
	 * @param {String} [opts.typeFrom='end'] Typing from start/end of element
	 * @param {Object} [opts.cursorStyles] CSS properties for cursor element
	 */
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

		this._cursor = null;
		this._element = $(element);
		this._element.data('typist', this);
		this._container = null;

		this.queue = [];
		this.timer = null;
		this.delay = 1000 / this.speed;

		this.blinkTimer = null;
		this.blinkDelay = 1000 / this.blinkSpeed;

		if ( this.text ) {
			this.queue.push({ text: this.text });
			this.type();
		}
	}

	Typist.prototype =
	/** @lends Typist */
	{
		/**
		 * Adds blinking cursor into element
		 */
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

		/**
		 * Triggers event
		 * @param {String} event
		 * @return {Typist}
		 */
		fire: function(event) {
			this._element.trigger(event, this);
			return this;
		},

		/**
		 * New line to <br> tag
		 * @param {String} text
		 * @return {String}
		 */
		nl2br: function(text) {
			return text.replace(/\n/g, '<br>');
		},

		/**
		 * <br> tag to new line
		 * @param {String} html
		 * @return {String}
		 */
		br2nl: function (html) {
			return html.replace(/<br.*?>/g, '\n');
		},

		/**
		 * Removes given number of characters
		 * @param {Number} length
		 * @param {Function} [callback]
		 */
		remove: function(length, callback) {
			if ( length <= 0 ) {
				callback();
				this.timer = null;
				return this
					.fire('end_remove.typist')
					.type();
			}

			var text = this._container.html();

			length--;
			text = this.br2nl(text);
			text = text.substr(0, text.length - 1);
			text = this.nl2br(text);

			this.timer = setTimeout($.proxy(function() {
				this._container.html(text);
				this.remove(length, callback);
			}, this), this.delay);

			this.fire('tick.typist');
		},

		/**
		 * Adds given text character by character
		 * @param {String|Array} text
		 */
		step: function(text, callback) {
			if ( typeof text === 'string' ) {
				text = text.split('');
			}

			if ( !text.length ) {
				callback();
				this.timer = null;
				return this
					.fire('end_type.typist')
					.type();
			}

			var character = text.shift();
			character = $('<div>').text(character).html();
			character = this.nl2br(character);

			this.timer = setTimeout($.proxy(function() {
				this._container.html(this._container.html() + character);
				this.step(text, callback);
			}, this), this.delay);

			this.fire('tick.typist');
		},

		/**
		 * Stops all animations and removes cursor
		 * @return {[type]} [description]
		 */
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

		/**
		 * Gets and invokes tasks from queue
		 */
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

			var item = this.queue.shift() || {},
				callback = $.proxy(item.callback || $.noop, this);

			if ( item.delay ) {
				this
					.fire('start_pause.typist')
					.timer = setTimeout($.proxy(function() {
						callback();
						this.timer = null;
						this
							.fire('end_pause.typist')
							.type();
					}, this), item.delay);
				return;

			} else if ( item.remove ) {
				this
					.fire('start_remove.typist')
					.remove(item.remove, callback);
				return;

			} else if ( item.stop ) {
				this.stop();
				return;
			}

			if ( !item.text ) {
				return;
			}

			this
				.fire('start_type.typist')
				.step(item.text, callback);
		}
	};
}));
