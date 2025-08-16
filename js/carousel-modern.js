// Modern carousel implementation with clean architecture
import { CarouselState } from './carousel-state.js';
import { CarouselView } from './carousel-view.js';
import { CarouselGestures } from './carousel-gestures.js';
import { CarouselSpotlight } from './carousel-spotlight.js';
import { CarouselKeyboard } from './carousel-keyboard.js';
import { CarouselMedia } from './carousel-media.js';

export class ModernCarousel {
	static instances = new WeakMap();
	static activeSpotlight = null;

	constructor(element, options = {}) {
		// Prevent duplicate initialization
		if (ModernCarousel.instances.has(element)) {
			return ModernCarousel.instances.get(element);
		}

		this.element = element;
		this.options = {
			autoplay: false,
			autoplayInterval: 5000,
			pauseOnHover: true,
			enableKeyboard: true,
			enableTouch: true,
			enableSpotlight: true,
			transitionDuration: 400,
			...options
		};

		// Initialize components
		this.initialize();

		// Store instance
		ModernCarousel.instances.set(element, this);
	}

	initialize() {
		// Get slide count
		const slides = this.element.querySelectorAll('.carousel-slide');
		if (!slides.length) return;

		// Initialize state management
		this.state = new CarouselState(slides.length);

		// Initialize view
		this.view = new CarouselView(this.element, this.state);
		this.view.initialize();
		this.view.addHoverEffects();

		// Initialize media handler
		this.media = new CarouselMedia(this.element, this.state);

		// Initialize gesture handling
		if (this.options.enableTouch) {
			this.gestures = new CarouselGestures(this.element, this.state);
			this.gestures.enable();
		}

		// Initialize keyboard navigation
		if (this.options.enableKeyboard) {
			this.keyboard = new CarouselKeyboard(this.element, this.state);
			this.keyboard.enable();
		}

		// Initialize spotlight
		if (this.options.enableSpotlight) {
			this.spotlight = new CarouselSpotlight(this.element, this.state, this.view);
		}

		// Set up event listeners
		this.setupEventListeners();

		// Handle responsive behavior
		this.handleResponsive();

		// Start autoplay if enabled
		if (this.options.autoplay) {
			this.startAutoplay();
		}

		// Mark as initialized
		this.element.classList.add('carousel-initialized');
	}

	setupEventListeners() {
		// Navigation buttons
		const prevButton = this.element.querySelector('.carousel-button.prev');
		const nextButton = this.element.querySelector('.carousel-button.next');

		if (prevButton) {
			prevButton.addEventListener('click', (e) => {
				e.preventDefault();
				this.prev();
			});
		}

		if (nextButton) {
			nextButton.addEventListener('click', (e) => {
				e.preventDefault();
				this.next();
			});
		}

		// Indicators
		const indicators = this.element.querySelectorAll('.indicator');
		indicators.forEach((indicator, index) => {
			indicator.addEventListener('click', (e) => {
				e.preventDefault();
				this.goToSlide(index);
			});
		});

		// Pause autoplay on hover
		if (this.options.pauseOnHover && this.options.autoplay) {
			this.element.addEventListener('mouseenter', () => this.pauseAutoplay());
			this.element.addEventListener('mouseleave', () => this.resumeAutoplay());
		}

		// Handle window resize
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => this.handleResponsive(), 150);
		});
	}

	// Public API methods
	next() {
		if (this.state.next()) {
			this.resetAutoplay();
			return true;
		}
		return false;
	}

	prev() {
		if (this.state.prev()) {
			this.resetAutoplay();
			return true;
		}
		return false;
	}

	goToSlide(index) {
		if (this.state.setIndex(index)) {
			this.resetAutoplay();
			return true;
		}
		return false;
	}

	// Autoplay functionality
	startAutoplay() {
		if (!this.options.autoplay || this.autoplayTimer) return;

		this.autoplayTimer = setInterval(() => {
			this.next();
		}, this.options.autoplayInterval);
	}

	pauseAutoplay() {
		if (this.autoplayTimer) {
			clearInterval(this.autoplayTimer);
			this.autoplayTimer = null;
			this.autoplayPaused = true;
		}
	}

	resumeAutoplay() {
		if (this.options.autoplay && this.autoplayPaused) {
			this.autoplayPaused = false;
			this.startAutoplay();
		}
	}

	resetAutoplay() {
		if (this.options.autoplay && !this.autoplayPaused) {
			this.pauseAutoplay();
			this.autoplayPaused = false;
			this.startAutoplay();
		}
	}

	// Responsive handling
	handleResponsive() {
		this.view.handleResize();
		this.media.handleResize();
	}

	// Cleanup
	destroy() {
		// Stop autoplay
		this.pauseAutoplay();

		// Disable components
		if (this.gestures) this.gestures.disable();
		if (this.keyboard) this.keyboard.disable();
		if (this.spotlight) this.spotlight.destroy();

		// Remove instance reference
		ModernCarousel.instances.delete(this.element);

		// Remove initialized class
		this.element.classList.remove('carousel-initialized');
	}

	// Static helper to get instance
	static getInstance(element) {
		return ModernCarousel.instances.get(element);
	}
}

// Auto-initialization
export function initializeCarousels() {
	const carousels = document.querySelectorAll('.carousel:not(.carousel-initialized)');
	const instances = [];

	carousels.forEach(carousel => {
		try {
			const instance = new ModernCarousel(carousel);
			instances.push(instance);
		} catch (error) {
			console.error('Failed to initialize carousel:', error);
		}
	});

	return instances;
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeCarousels);
} else {
	initializeCarousels();
}

// Export for global access
window.ModernCarousel = ModernCarousel;
window.initializeCarousels = initializeCarousels;