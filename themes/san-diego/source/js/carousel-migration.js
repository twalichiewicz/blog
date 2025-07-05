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

// Also export modern initialization
export { initializeCarousels } from './carousel-modern.js';

// Auto-initialize on DOM ready (maintains backward compatibility)
function initLegacyCarousels() {
	const carousels = document.querySelectorAll('.carousel:not(.carousel-initialized)');
	
	carousels.forEach(carousel => {
		try {
			new Carousel(carousel);
		} catch (error) {
			console.error('Failed to initialize carousel:', error);
		}
	});
}

// Initialize
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initLegacyCarousels);
} else {
	initLegacyCarousels();
}

// Export for backward compatibility
window.initializeCarousels = initLegacyCarousels;