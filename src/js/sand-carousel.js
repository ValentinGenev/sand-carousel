class SandSlider {
    /** 
     * @param {Node} slider the container of the slider
     * @param {NodeList} slides a NodeList or an array of the slides
     * @param {number} slideDuration the time it takes for the slide change animation to finish (see the transitions in the CSS file)
     * @param {number} animationDuration 
     * @param {boolean} autoplay 
     */
    constructor(slider, slides, slideDuration, animationDuration, autoplay = true) {
        this.slider             = slider;
        this.slides             = slides;
        this.slideClass         = slides[0].className;
        this.slideDuration      = slideDuration;
        this.animationDuration  = animationDuration;
        this.autoplay           = autoplay;
        this.currentSlide       = 0;
 
        // Dotted control items:
        this.controlsItems      = [];
 
        // The timeout variable:
        this.theLoop            = undefined;
 
        // Binding this:
        this.changeSlide        = this.changeSlide.bind(this);
        this.startLoop          = this.startLoop.bind(this);
    }
 
    set slidesSetter(items) {
        this.slides = items;
    }
    set currentSlideSetter(index) {
        this.currentSlide = index;
    }
    set controlsItemsSetter(items) {
        this.controlsItems = items;
    }
    set theLoopSetter(loop) {
        this.theLoop = loop;
    }
 
    /**
     * Initiates the slider with dot controls and fade animation
     */
    dotControls() {
        const { slider, slides, animationDuration, autoplay, changeSlide, startLoop, throttle } = this;
 
        // The animation:
        slider.classList.add("fading");
 
        // The controls
        let contorlsContainer       = document.createElement("ul");
        contorlsContainer.className = "controls";
 
        if (slides.length > 1) slides.forEach((_slide, key) => {
            let controlsItem = document.createElement("li");
             
            controlsItem.addEventListener("click", throttle(() => changeSlide(1, key), animationDuration));
 
            contorlsContainer.appendChild(controlsItem);
        });
        slider.appendChild(contorlsContainer);
 
        this.controlsItemsSetter = document.querySelectorAll(".controls li");
 
        // Initial slide:
        changeSlide(1);
        if (autoplay) startLoop();
    }
 
    /**
     * Initiates the slider with arrow controls and slide animation
     */
    arrowControls() {
        const { slider, slides, animationDuration, autoplay, changeSlide, startLoop, throttle } = this;
 
        // The animation:
        slider.classList.add("sliding");
 
        // The controls:
        let nextSlideBtn = document.createElement("button");
        nextSlideBtn.className = "slider-controls next-button";
        nextSlideBtn.addEventListener("click", throttle(() => changeSlide(1), animationDuration));
 
        let previousSlideBtn = document.createElement("button");
        previousSlideBtn.className = "slider-controls previous-button";
        previousSlideBtn.addEventListener("click", throttle(() => changeSlide(-1), animationDuration));
 
        slider.appendChild(nextSlideBtn);
        slider.appendChild(previousSlideBtn);
 
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
 
        // Initial slide:
        changeSlide(1);
        if (autoplay) startLoop();
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
        const { slides, slideClass, autoplay, controlsItems, startLoop, checkIfFirstLast, resetClasses } = this;
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
 
            if (controlsItems.length != 0) {
                resetClasses(controlsItems, "");
                controlsItems[previousSlide].classList.add("active");
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
 
    resetClasses(elements, className) {
        elements.forEach(element => element.className = className);
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
 * 1.   Stop the slider when the user is not on the page.
 * 2.   Add slide resize option if the slides are different size.
 * 3.   Get the icon classes for the arrow controls out of the script.
 */