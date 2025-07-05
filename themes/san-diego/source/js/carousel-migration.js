// Migration wrapper to maintain backward compatibility
import { ModernCarousel } from './carousel-modern.js';

// Create a compatibility layer that maps old API to new
class Carousel {
	constructor(element) {
		// Use modern carousel under the hood
		this.modernCarousel = new ModernCarousel(element);
		this.carousel = element;
		
		// Map old properties
		this.currentIndex = 0;
		this.slides = this.modernCarousel.view.slides;
		this.slideCount = this.slides.length;
		this.spotlightModal = null;
		
		// Listen to state changes to update legacy properties
		this.modernCarousel.state.on('indexChange', ({ currentIndex }) => {
			this.currentIndex = currentIndex;
		});
	}

	// Legacy API methods
	init() {
		// Already initialized in constructor
	}

	prev() {
		this.modernCarousel.prev();
	}

	next() {
		this.modernCarousel.next();
	}

	goToSlide(index) {
		this.modernCarousel.goToSlide(index);
	}

	updateCarouselImages() {
		// Handled automatically by modern carousel
	}

	showSpotlight(index) {
		this.modernCarousel.state.openSpotlight(index);
	}

	closeSpotlight() {
		this.modernCarousel.state.closeSpotlight();
	}

	destroy() {
		this.modernCarousel.destroy();
	}

	// Static property for compatibility
	static get activeSpotlightCarousel() {
		return ModernCarousel.activeSpotlight?.carousel || null;
	}

	static set activeSpotlightCarousel(value) {
		// Handled by modern carousel
	}
}

// Replace the old carousel initialization
window.Carousel = Carousel;

// Import modern functions
import { initializeCarousels as modernInitializeCarousels, ModernCarousel } from './carousel-modern.js';

// Create a wrapper that maintains the old API but uses modern implementation
function initializeCarousels(container = document) {
	// Use the modern initialization
	return modernInitializeCarousels(container);
}

// Also expose cleanup function for dynamic content
function cleanupCarouselInstances(container) {
	// Get all carousel instances in the container
	const carousels = container.querySelectorAll('.carousel');
	carousels.forEach(carousel => {
		const instance = ModernCarousel.getInstance(carousel);
		if (instance) {
			instance.destroy();
		}
	});
}

// Export functions globally for dynamic loading compatibility
window.initializeCarousels = initializeCarousels;
window.cleanupCarouselInstances = cleanupCarouselInstances;

// Also export as modules
export { initializeCarousels, cleanupCarouselInstances };

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => initializeCarousels());
} else {
	initializeCarousels();
}