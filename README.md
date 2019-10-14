# Sand Carousel
A simple JavaScript carousel.
**WARNING**, the project is still in development.

## About
![A screen shot of the carousel](/demo/demo-picture.png "The Sand Carousel with dot controls, in pink")
My main goal is to make a very simple and light carousel that I can use for my projects. There are still quite a few things that I would like to change. I used vanilla JavaScipt for the initiation and the options, and CSS for the animation.

## Usage
1. Link the stylesheet and the script files from the dist folder:
```html
    ...
    <link rel="stylesheet" href="sand-carousel.css">
</head>
<body>
    ...
    <script src="sand-carousel.js"></script>
</body>
```
2. Add the required classes `sand-carousel` and `slides-wrapper` to the containing elements and `slide` class to the carousel's items to a markup similar to the one below.
    
    **Please note** that the script is adding the carousel's controls in the element with the `sand-carosel` class. Both `sand-carousel` and `slides-wrapper` classes can be applied to one element but that might lead to semantic inconsistencies if the containing element is a list and the slides are list items as in the markup below.
```html
<div class="sand-carousel">
    <ul class="slides-wrapper">
        <li class="slide">Slide 1</li>
        <li class="slide">Slide 2</li>
        <li class="slide">Slide 3</li>
    </ul>
</div>
```
3. Initiate the carousel by declaring a new instance of the `SandCarousel` class:
```js
let containerSelector   = ".sand-carousel";
let singleSlideSelector	= ".slide";
let slideDuration       = 6000;
let transitionDuration	= 500;	 // 500ms by dafault
let resizable           = false; // false by defailt
let autoPlay            = true;  // true by default

// NOTE! The autoplay property in the constructor
// is set to false if the slider is resizable
// this.autoplay = resizable ? false : autoplay

const SAND_CAROUSEL     = new SandCarousel(containerSelector, singleSlideSelector, slideDuration, transitionDuration, resizable, autoPlay);
```
4. Then call one of the methods `dotControls()` or `arrowControls()`:
```js
SAND_CAROUSEL.dotControls();
```

## To do
- Review of the code;
- fix the issues;
- add lazy loadgin.
