// Modern animation utilities with physics-based easing
export class CarouselAnimations {
	constructor() {
		// Spring physics parameters
		this.springConfig = {
			stiffness: 300,
			damping: 30,
			mass: 1
		};
	}

	// Smooth spring easing function
	springEasing(t) {
		const { stiffness, damping, mass } = this.springConfig;
		const c = damping / (2 * Math.sqrt(stiffness * mass));
		
		if (c < 1) {
			// Underdamped
			const wd = Math.sqrt(stiffness / mass) * Math.sqrt(1 - c * c);
			return 1 - Math.exp(-c * Math.sqrt(stiffness / mass) * t) * 
				(Math.cos(wd * t) + (c / Math.sqrt(1 - c * c)) * Math.sin(wd * t));
		} else {
			// Critically damped or overdamped
			return 1 - (1 + Math.sqrt(stiffness / mass) * t) * 
				Math.exp(-Math.sqrt(stiffness / mass) * t);
		}
	}

	// Custom easing curves
	static easings = {
		easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
		easeOutBack: t => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2),
		easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
		easeOutElastic: t => {
			if (t === 0 || t === 1) return t;
			const p = 0.3;
			return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
		}
	};

	// Animate a value with spring physics
	animateValue(from, to, duration, onUpdate, easing = 'easeOutExpo') {
		const startTime = performance.now();
		const easingFn = typeof easing === 'function' ? easing : CarouselAnimations.easings[easing];
		
		const animate = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easedProgress = easingFn(progress);
			const currentValue = from + (to - from) * easedProgress;
			
			onUpdate(currentValue, progress);
			
			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		};
		
		requestAnimationFrame(animate);
	}

	// Slide transition with modern effects
	transitionSlide(element, direction, onComplete) {
		const distance = direction === 'next' ? -100 : 100;
		
		// Initial state
		element.style.transform = `translateX(${-distance}%)`;
		element.style.opacity = '0';
		
		// Force reflow
		element.offsetHeight;
		
		// Animate
		this.animateValue(0, 1, 400, (progress) => {
			const x = -distance * (1 - progress);
			const opacity = progress;
			const scale = 0.95 + 0.05 * progress;
			
			element.style.transform = `translateX(${x}%) scale(${scale})`;
			element.style.opacity = opacity;
		}, 'easeOutBack');
		
		setTimeout(onComplete, 400);
	}

	// Enhanced fade transition
	fadeTransition(elementOut, elementIn, onComplete) {
		// Parallel animations for smooth cross-fade
		this.animateValue(1, 0, 300, (opacity) => {
			if (elementOut) elementOut.style.opacity = opacity;
		});
		
		this.animateValue(0, 1, 300, (opacity) => {
			if (elementIn) elementIn.style.opacity = opacity;
		});
		
		setTimeout(onComplete, 300);
	}

	// Button press effect
	buttonPress(element) {
		this.animateValue(1, 0.95, 100, (scale) => {
			element.style.transform = `scale(${scale})`;
		}, 'easeInOutCubic');
		
		setTimeout(() => {
			this.animateValue(0.95, 1, 200, (scale) => {
				element.style.transform = `scale(${scale})`;
			}, 'easeOutElastic');
		}, 100);
	}

	// Indicator transition
	indicatorTransition(indicators, fromIndex, toIndex) {
		// Animate out previous indicator
		if (indicators[fromIndex]) {
			this.animateValue(1, 0.6, 200, (scale) => {
				indicators[fromIndex].style.transform = `scaleX(${scale})`;
			});
		}
		
		// Animate in new indicator
		if (indicators[toIndex]) {
			this.animateValue(0.6, 1, 300, (scale) => {
				indicators[toIndex].style.transform = `scaleX(${scale})`;
			}, 'easeOutBack');
		}
	}

	// Parallax depth effect
	applyParallax(element, scrollProgress, depth = 0.5) {
		const offset = scrollProgress * 50 * depth;
		element.style.transform = `translateY(${offset}px)`;
	}

	// Smooth scroll to element
	smoothScrollTo(element, duration = 600) {
		const start = window.pageYOffset;
		const target = element.getBoundingClientRect().top + start;
		
		this.animateValue(start, target, duration, (position) => {
			window.scrollTo(0, position);
		}, 'easeInOutCubic');
	}
}