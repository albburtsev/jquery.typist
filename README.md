jquery.typist
=============

Animated text typing.

[Live demo](http://albburtsev.github.io/jquery.typist/)

## Install

Download latest [release](https://github.com/albburtsev/jquery.typist/releases).
Use [minified](https://github.com/albburtsev/jquery.typist/blob/master/jquery.typist.min.js)
or [development](https://github.com/albburtsev/jquery.typist/blob/master/jquery.typist.js) version.

Or use [bower](http://bower.io/) for install:

```
bower install jquery.typist --save
```

## Usage

Include [jQuery](http://jquery.com) and __jquery.typist__ on your page:

```html
<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="jquery.typist.js"></script>
```

Prepare element for typing:

```html
<p class="typist"></p>
```

Call method ```typist()``` with necessary options and text:

```js
jQuery(function($) {
	$('.typist').typist({
		speed: 12,
		text: 'Hello!'
	});
});

```

### Options

 * __text__ {String} – text for typing;
 * __speed__ {Number} – characters per second, default – ```10```;
 * __cursor__ {Boolean} – shows blinking cursor, default – ```true```;
 * __blinkSpeed__ {Number} – blinking per second, default – ```2```;
 * __typeFrom__ {String} – typing from start/end of element, default – ```'end'```;
 * __cursorStyles__ {Object} – CSS properties for cursor element.

### Methods

 * __typist( [options] )__ – init method;
 * __typistAdd( [text] )__ – additional text for typing;
 * __typistRemove( [length] )__ – removes ```length``` number of characters;
 * __typistPause( [delay] )__ – pauses for ```delay``` milliseconds;
 * __typistStop()__ – stops all animations.

### Events

 * start_type.typist
 * end_type.typist
 * start_pause.typist
 * end_pause.typist
 * start_remove.typist
 * end_remove.typist

```js
$('.typist')
	.on('start_type.typist', function() {
		console.log('Start typing');
	})
	.on('end_type.typist', function() {
		console.log('End typing');
	})
	.typist({ 
		speed: 12,
		text: 'Hello, typist!\n'
	});
```
