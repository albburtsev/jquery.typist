jquery.typist
=============

Animated text typing.

[Live demo](http://albburtsev.github.io/jquery.typist/)

## Install

Download latest [release](https://github.com/albburtsev/jquery.typist/releases).
Use [minified](https://github.com/albburtsev/jquery.typist/blob/master/jquery.typist.min.js)
or [development](https://github.com/albburtsev/jquery.typist/blob/master/jquery.typist.js) version.

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

@todo

 * text
 * speed
 * cursor
 * blinkSpeed
 * typeFrom
 * cursorStyles

### Methods

@todo

 * typist()
 * typistAdd()
 * typistRemove()
 * typistDefer()
 * typistStop()
