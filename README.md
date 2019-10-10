# Sand Carousel
A simple JavaScript carousel.

**WARNING**, the project is still in development.

## About
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
2. The markup should look something like this:
```html
<div class="sand-carousel">
    <ul>
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
let transitionDuration	= 500;	// 500ms by dafault
let autoPlay            = true; // true by default

const SAND_SLIDER = new SandCarousel(containerSelector, singleSlideSelector, slideDuration, transitionDuration, autoPlay);
```
3. Then call one of the methods `dotControls()` or `arrowControls()`:
```js
SAND_SLIDER.dotControls();
```

## To do
- Review of the code;
- lazy loadgin;
- make the carousel pause on blur (tab change, window change);
- minimize the code.

## Known issues
- The buttons aren't disabled during the transition animation;
- the carousel doesn't stop when the user changes tabs or the window and the CSS animation causes visual inconsistencies when the user comes back to the page.
