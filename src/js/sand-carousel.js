class SandCarousel {
    /** 
     * @param {string} carousel a string of the selector for the carousel
     * @param {string} slides a string of the selector for the slided
     * @param {number} slideDuration the time it takes for the slide change animation to finish (see the transitions in the CSS file)
     * @param {number} animationDuration 
     * @param {boolean} autoplay 
     */
    constructor(carousel, slides, slideDuration, animationDuration, autoplay = true) {
        this.carousel             = document.querySelector(carousel);
        this.slides             = document.querySelectorAll(slides);
        this.slideClass         = this.slides[0].className;
        this.slideDuration      = slideDuration;
        this.animationDuration  = animationDuration;
        this.autoplay           = autoplay;
        this.currentSlide       = 0;
 
        // Dotted control items:
        this.controlDots      = [];
 
        // The timeout variable:
        this.theLoop            = undefined;
 
        // Binding this:
        this.initTheCarousel    = this.initTheCarousel.bind(this);
        this.changeSlide        = this.changeSlide.bind(this);
        this.startLoop          = this.startLoop.bind(this);
		this.createArrowIcon	= this.createArrowIcon.bind(this);
    }
 
    set slidesSetter(items) {
        this.slides = items;
    }
    set currentSlideSetter(index) {
        this.currentSlide = index;
    }
    set controlDotsSetter(items) {
        this.controlDots = items;
    }
    set theLoopSetter(loop) {
        this.theLoop = loop;
    }
 
    /**
     * Initiates the carousel with dot controls and fade animation
     */
    dotControls() {
        const { carousel, slides, animationDuration, initTheCarousel, changeSlide, throttle } = this;
 
        // The animation:
        carousel.classList.add("fading");
 
        // The controls
        let contorlsContainer       = document.createElement("ul");
        contorlsContainer.className = "controls";
 
        if (slides.length > 1) slides.forEach((_slide, key) => {
            let controlsItem = document.createElement("li");
             
            controlsItem.addEventListener("click", throttle(() => changeSlide(1, key), animationDuration));
 
            contorlsContainer.appendChild(controlsItem);
        });
        carousel.appendChild(contorlsContainer);
 
        this.controlDotsSetter = document.querySelectorAll(".controls li");

		initTheCarousel();
    }
 
    /**
     * Initiates the carousel with arrow controls and slide animation
     */
    arrowControls() {
        const { carousel, slides, animationDuration, initTheCarousel, changeSlide, createArrowIcon, throttle } = this;
 
        // The animation:
        carousel.classList.add("sliding");
 
        // The controls:
        let nextSlideBtn = document.createElement("button");
        nextSlideBtn.className = "carousel-controls next-button";
        nextSlideBtn.addEventListener("click", throttle(() => changeSlide(1), animationDuration));
		createArrowIcon(nextSlideBtn);
 
        let previousSlideBtn = document.createElement("button");
        previousSlideBtn.className = "carousel-controls previous-button";
        previousSlideBtn.addEventListener("click", throttle(() => changeSlide(-1), animationDuration));
		createArrowIcon(previousSlideBtn);
 
        carousel.appendChild(nextSlideBtn);
        carousel.appendChild(previousSlideBtn);
 
        // Temporary fix for slides count equal to 2
        if (slides.length === 2) {
            let slidesDuplicates = [];
            // If the slides count is equal to 2 I need to copy
            // the two slides so I can use the "previous-slide",
            // "current-slide", "next-slide" structure
            slides.forEach(slide => {
                let slideDuplicate = slide.cloneNode(true);
                slide.parentNode.appendChild(slideDuplicate);
            });
 
            // Updates the slides' Node List variable with the newly added ones
            this.slidesSetter = slides[0].parentNode.querySelectorAll(".slide");
        }

		initTheCarousel();
    }

	/**
	 * Initiates the carousel
	 */
	initTheCarousel() {
        const { slides, slideDuration, autoplay, changeSlide, startLoop } = this;
		
		if (slides.length > 1) {
			// Sets the animation duration for the timer to the slide duration
			slides.forEach(slide => slide.style.animationDuration = slideDuration / 1000 + 's');

			// Initial slide:
			changeSlide(1);
			if (autoplay) startLoop();
		}
	}
 
    /**
     * Starts the loop
     */
    startLoop() {
        const { slideDuration, theLoop, changeSlide } = this;
 
        // It's important to stop the loop when this
        // function is called because set function
        // is called every time a slide is changed no
        // matter if it's caused by the user or the loop
        // and if one deosn't stop the loop it will not
        // be overwritten.
        if (theLoop) clearTimeout(theLoop)
     
        // Loops from the last slide; creates recursion
        this.theLoopSetter = setTimeout(() => changeSlide(1) , slideDuration);
    }
 
    /**
     * Changes the slide
     * 
     * @param {number} direction -1 or 1 for "previois" and "next" slide
     * @param {number} index the index of the current slide
     */
    changeSlide(direction, index = this.currentSlide) {
        const { slides, slideClass, autoplay, controlDots, startLoop, checkIfFirstLast, resetClasses } = this;
        const slidesCount = slides.length;
 
        resetClasses(slides, slideClass);
     
        let currentSlide = checkIfFirstLast(index, slidesCount, direction);
        let previousSlide = checkIfFirstLast(currentSlide, slidesCount, -1);
        let nextSlide = checkIfFirstLast(currentSlide, slidesCount, 1);
        this.currentSlideSetter = currentSlide;
     
        slides[currentSlide].classList.add("current-slide");
        slides[previousSlide].classList.add("previous-slide");
        slides[nextSlide].classList.add("next-slide");
     
        if (direction === 1) {
            slides[previousSlide].classList.add("active");
 
            if (controlDots.length != 0) {
                resetClasses(controlDots, "");
                controlDots[previousSlide].classList.add("active");
            }
        }
        else {
            slides[nextSlide].classList.add("active");
        }
         
        // Resets the loop from the new current slide.
        // This call is part of the recursiuon
        if (autoplay) startLoop();
    }
 
    /**
     * Checks if the current slide is first or rast
     * 
     * @param {number} index current slide
     * @param {number} listCount the number of slides
     * @param {number} direction -1 or 1 for "previois" and "next" slide
     * 
     * @returns returns the index ot the next slide according to the direction
     */
    checkIfFirstLast(index, listCount, direction) {
        if (index === listCount - 1 && direction === 1) return 0;
        else if (index === 0 && direction === -1 ) return listCount - 1;
        else return index + direction;
    }

	/**
	 * Resets the className to a given string
	 * 
	 * @param {NodeList} elements
	 * @param {string} className 
	 */
    resetClasses(elements, className) {
        elements.forEach(element => element.className = className);
    }

	/**
	 * Creates a SVG element and appends it to an element
	 * 
	 * @param {Node} element
	 */
	createArrowIcon(element) {
		let arrowIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		arrowIcon.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
		arrowIcon.setAttribute("x", "0px");
		arrowIcon.setAttribute("y", "0px");
		arrowIcon.setAttribute("viewBox", "0 0 32 55");
		arrowIcon.setAttribute("style", "enable-background: new 0 0 32 55;");

		let thePath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
		thePath.setAttribute("d", "M2.985,0.579L0.581,2.973c-0.775,0.772-0.775,2.024,0,2.796L22.401,27.5L0.581,49.232c-0.775,0.772-0.775,2.024,0,2.796 l2.403,2.394c0.775,0.772,2.032,0.772,2.807,0l25.627-25.523c0.775-0.772,0.775-2.024,0-2.796L5.792,0.579 C5.017-0.193,3.76-0.193,2.985,0.579z");

		arrowIcon.appendChild(thePath);
		element.appendChild(arrowIcon);
	}
 
    /**
     * The throttle function
     * Many thanks to Jonathan Sampson
     * https://jsfiddle.net/jonathansampson/m7G64/
     * 
     * @param {function} callback the function that should be called with delay
     * @param {number} limit the delay
     */
    throttle(callback, limit) {
        var wait = false;
        return () => {
            if (!wait) {
                callback.call();
                wait = true;
                setTimeout(() => wait = false, limit);
            }
        }
    }
}
 
/**
 * TO DO:
 * 
 * 1.   Stop the carousel when the user is not on the page.
 * 2.   Add slide resize option if the slides are different size.
 * 3.   Get the icon classes for the arrow controls out of the script.
 */