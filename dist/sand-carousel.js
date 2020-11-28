"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SandCarousel = function () {
  /** 
  * @param {string} carousel a string of the selector for the carousel
  * @param {string} slides a string of the selector for the slided
  * @param {number} slideDuration the time it takes for the slide change animation to finish (see the transitions in the CSS file)
  * @param {number} animationDuration
  * @param {boolean} autoplay
  * @param {boolean} resizable 
  */
  function SandCarousel(carousel, slides, slideDuration) {
    var animationDuration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 500;
    var resizable = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var autoplay = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

    _classCallCheck(this, SandCarousel);

    this.carousel = document.querySelector(carousel);
    this.slides = document.querySelectorAll(slides);
    this.slideClass = this.slides[0].className;
    this.slideDuration = slideDuration;
    this.animationDuration = animationDuration;
    this.resizable = resizable;
    this.autoplay = resizable ? false : autoplay;
    this.currentSlide = 0;

    // Dotted control items:
    this.controlDots = [];

    // The timeout variable:
    this.theLoop = undefined;

    // Page Visibility API:
    this.pageIsVisible = true;

    // Binding this:
    this.initTheCarousel = this.initTheCarousel.bind(this);
    this.changeSlide = this.changeSlide.bind(this);
    this.startLoop = this.startLoop.bind(this);
    this.setVisibilityAPI = this.setVisibilityAPI.bind(this);
  }

  _createClass(SandCarousel, [{
    key: "dotControls",


    /**
   * Initiates the carousel with dot controls and fade animation
   */
    value: function dotControls() {
      var carousel = this.carousel,
          slides = this.slides,
          animationDuration = this.animationDuration,
          initTheCarousel = this.initTheCarousel,
          changeSlide = this.changeSlide,
          throttle = this.throttle;


      if (slides.length > 1) {
        // The animation:
        carousel.classList.add("fading");

        // The controls
        var contorlsContainer = document.createElement("ul");
        contorlsContainer.className = "controls";

        if (slides.length > 1) slides.forEach(function (_slide, key) {
          var controlsItem = document.createElement("li");

          controlsItem.addEventListener("click", throttle(function () {
            return changeSlide(1, key);
          }, animationDuration));
          contorlsContainer.appendChild(controlsItem);
        });
        carousel.appendChild(contorlsContainer);

        this.controlDotsSetter = document.querySelectorAll(".controls li");

        initTheCarousel();
      } else {
        carousel.classList.add("one-slide");
      }
    }

    /**
   * Initiates the carousel with arrow controls and slide animation
   */

  }, {
    key: "arrowControls",
    value: function arrowControls() {
      var carousel = this.carousel,
          slides = this.slides,
          animationDuration = this.animationDuration,
          initTheCarousel = this.initTheCarousel,
          changeSlide = this.changeSlide,
          createArrowIcon = this.createArrowIcon,
          throttle = this.throttle;


      if (slides.length > 1) {
        // The animation:
        carousel.classList.add("sliding");

        // The controls:
        var previousSlideBtn = document.createElement("button");
        previousSlideBtn.className = "controls sand-controls previous-button";
        previousSlideBtn.addEventListener("click", throttle(function () {
          return changeSlide(-1);
        }, animationDuration));
        createArrowIcon(previousSlideBtn);

        var nextSlideBtn = document.createElement("button");
        nextSlideBtn.className = "controls sand-controls next-button";
        nextSlideBtn.addEventListener("click", throttle(function () {
          return changeSlide(1);
        }, animationDuration));
        createArrowIcon(nextSlideBtn);

        carousel.appendChild(previousSlideBtn);
        carousel.appendChild(nextSlideBtn);

        // Temporary fix for slides count equal to 2
        if (slides.length === 2) {
          var slidesDuplicates = [];
          // If the slides count is equal to 2 I need to copy
          // the two slides so I can use the "previous-slide",
          // "current-slide", "next-slide" structure
          slides.forEach(function (slide) {
            var slideDuplicate = slide.cloneNode(true);
            slide.parentNode.appendChild(slideDuplicate);
          });

          // Updates the slides' Node List variable with the newly added ones
          this.slidesSetter = slides[0].parentNode.querySelectorAll(".slide");
        }

        initTheCarousel();
      } else {
        carousel.classList.add("one-slide");
      }
    }

    /**
   * Initiates the carousel
   */

  }, {
    key: "initTheCarousel",
    value: function initTheCarousel() {
      var carousel = this.carousel,
          slides = this.slides,
          slideDuration = this.slideDuration,
          animationDuration = this.animationDuration,
          autoplay = this.autoplay,
          resizable = this.resizable,
          changeSlide = this.changeSlide,
          setVisibilityAPI = this.setVisibilityAPI;

      // Sets the animation duration for the timer to the slide duration

      slides.forEach(function (slide) {
        slide.style.animationDuration = slideDuration / 1000 + 's';
        slide.style.transitionDuration = animationDuration / 1000 + 's';
        slide.style.transitionDelay = animationDuration / 1000 + 's';
      });

      if (resizable == true) {
        carousel.classList.add("resizable");
        carousel.style.transitionDuration = animationDuration / 1000 + 's';
      }

      if (autoplay == true) {
        carousel.classList.add("autoplay");

        // This class addition ensured that the class will be removed right away
        // from the class toggle in startLoop() for the first few seconds (milis.)
        // of the first slide.
        carousel.classList.add("disabled");
      }

      // Activates the visibility API that detects if the user is on the page
      setVisibilityAPI();

      // Initial slide:
      changeSlide(1);
    }

    /**
   * Changes the slide
   * 
   * @param {number} direction -1 or 1 for "previois" and "next" slide
   * @param {number} index the index of the current slide
   */

  }, {
    key: "changeSlide",
    value: function changeSlide(direction) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currentSlide;
      var carousel = this.carousel,
          slides = this.slides,
          slideClass = this.slideClass,
          autoplay = this.autoplay,
          resizable = this.resizable,
          controlDots = this.controlDots,
          startLoop = this.startLoop,
          checkIfFirstLast = this.checkIfFirstLast,
          resetClasses = this.resetClasses;

      var slidesCount = slides.length;

      resetClasses(slides, slideClass);

      var currentSlide = checkIfFirstLast(index, slidesCount, direction);
      var previousSlide = checkIfFirstLast(currentSlide, slidesCount, -1);
      var nextSlide = checkIfFirstLast(currentSlide, slidesCount, 1);
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
      } else {
        slides[nextSlide].classList.add("active");
      }

      // Resizes the carousel to the slide's content
      if (resizable == true) {
        if (controlDots.length != 0) {
          carousel.style.height = slides[previousSlide].offsetHeight + "px";
        } else {
          carousel.style.height = slides[currentSlide].offsetHeight + "px";
        }
      }

      // Resets the loop from the new current slide.
      // This call is part of the recursiuon
      if (autoplay == true) startLoop();
    }

    /**
   * Starts the loop
   */

  }, {
    key: "startLoop",
    value: function startLoop() {
      var carousel = this.carousel,
          slideDuration = this.slideDuration,
          animationDuration = this.animationDuration,
          theLoop = this.theLoop,
          pageIsVisible = this.pageIsVisible,
          changeSlide = this.changeSlide;

      // Disables the carousel during the transition animation

      carousel.classList.toggle("disabled");
      setTimeout(function () {
        return carousel.classList.remove("disabled");
      }, animationDuration);

      // Clears the timeout when the function is called
      // after user's interaction with the controls
      if (theLoop) clearTimeout(theLoop);

      // Loops from the last slide; creates recursion
      if (pageIsVisible) this.theLoopSetter = setTimeout(function () {
        return changeSlide(1);
      }, slideDuration);
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

  }, {
    key: "checkIfFirstLast",
    value: function checkIfFirstLast(index, listCount, direction) {
      if (index === listCount - 1 && direction === 1) return 0;else if (index === 0 && direction === -1) return listCount - 1;else return index + direction;
    }

    /**
   * Resets the className to a given string
   * 
   * @param {NodeList} elements
   * @param {string} className 
   */

  }, {
    key: "resetClasses",
    value: function resetClasses(elements, className) {
      elements.forEach(function (element) {
        return element.className = className;
      });
    }

    /**
   * Creates a SVG element and appends it to an element
   * 
   * @param {Node} element
   */

  }, {
    key: "createArrowIcon",
    value: function createArrowIcon(element) {
      var arrowIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      arrowIcon.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
      arrowIcon.setAttribute("x", "0px");
      arrowIcon.setAttribute("y", "0px");
      arrowIcon.setAttribute("viewBox", "0 0 32 55");
      arrowIcon.setAttribute("style", "enable-background: new 0 0 32 55;");

      var thePath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
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

  }, {
    key: "throttle",
    value: function throttle(callback, limit) {
      var wait = false;
      return function () {
        if (!wait) {
          callback.call();
          wait = true;
          setTimeout(function () {
            return wait = false;
          }, limit);
        }
      };
    }

    /**
   * Sets the Page Visibilyt API that stops the
   * carousel when the tab is switched
   * https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
   */

  }, {
    key: "setVisibilityAPI",
    value: function setVisibilityAPI() {
      var _this = this;

      var autoplay = this.autoplay,
          startLoop = this.startLoop;

      var hidden = "hidden";

      var HANDLE_VISIBILITY_CHANGE = function HANDLE_VISIBILITY_CHANGE() {
        if (document[hidden]) {
          _this.pageIsVisibleSetter = false;
        } else {
          _this.pageIsVisibleSetter = true;
          if (autoplay == true) startLoop();
        }
      };

      if (hidden in document) document.addEventListener("visibilitychange", HANDLE_VISIBILITY_CHANGE);else if ((hidden = "mozHidden") in document) document.addEventListener("mozvisibilitychange", HANDLE_VISIBILITY_CHANGE);else if ((hidden = "webkitHidden") in document) document.addEventListener("webkitvisibilitychange", HANDLE_VISIBILITY_CHANGE);else if ((hidden = "msHidden") in document) document.addEventListener("msvisibilitychange", HANDLE_VISIBILITY_CHANGE);
      // IE 9 and lower:
      else if ("onfocusin" in document) document.onfocusin = document.onfocusout = HANDLE_VISIBILITY_CHANGE;
        // All others:
        else window.onpageshow = window.onpagehide = window.onfocus = window.onblur = HANDLE_VISIBILITY_CHANGE;
    }
  }, {
    key: "slidesSetter",
    set: function set(items) {
      this.slides = items;
    }
  }, {
    key: "currentSlideSetter",
    set: function set(index) {
      this.currentSlide = index;
    }
  }, {
    key: "controlDotsSetter",
    set: function set(items) {
      this.controlDots = items;
    }
  }, {
    key: "theLoopSetter",
    set: function set(loop) {
      this.theLoop = loop;
    }
  }, {
    key: "pageIsVisibleSetter",
    set: function set(bool) {
      this.pageIsVisible = bool;
    }
  }]);

  return SandCarousel;
}();