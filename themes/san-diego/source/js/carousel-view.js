// Modern view management for carousel
import { CarouselAnimations } from './carousel-animations.js';

export class CarouselView {
	constructor(element, state) {
		this.element = element;
		this.state = state;
		this.animations = new CarouselAnimations();
		
		// Cache DOM elements
		this.track = element.querySelector('.carousel-track');
		this.slides = Array.from(element.querySelectorAll('.carousel-slide'));
		this.indicators = Array.from(element.querySelectorAll('.indicator'));
		this.prevButton = element.querySelector('.carousel-button.prev');
		this.nextButton = element.querySelector('.carousel-button.next');
		
		// Media elements
		this.mediaElements = this.collectMediaElements();
		
		// Bind to state changes
		this.setupStateListeners();
	}

	collectMediaElements() {
		const media = [];
		
		this.slides.forEach((slide, index) => {
			const img = slide.querySelector('img');
			const video = slide.querySelector('video');
			const iframe = slide.querySelector('iframe');
			
			if (img) {
				// Fix image paths using the original carousel logic
				let imgSrc = this.resolveImagePath(img);
				
				media.push({
					type: 'image',
					element: img,
					src: imgSrc,
					alt: img.alt || '',
					slideIndex: index
				});
			} else if (video) {
				media.push({
					type: 'video',
					element: video,
					src: video.src,
					slideIndex: index
				});
			} else if (iframe) {
				media.push({
					type: 'iframe',
					element: iframe,
					src: iframe.src,
					slideIndex: index
				});
			}
		});
		
		return media;
	}

	setupStateListeners() {
		// Listen for index changes
		this.state.on('indexChange', ({ previousIndex, currentIndex }) => {
			this.transitionToSlide(previousIndex, currentIndex);
			this.updateIndicators(currentIndex);
			this.updateButtonStates();
		});
		
		// Listen for transition state
		this.state.on('transitionStateChange', ({ isTransitioning }) => {
			this.element.classList.toggle('transitioning', isTransitioning);
		});
	}

	transitionToSlide(fromIndex, toIndex) {
		if (fromIndex === toIndex) return;
		
		const fromSlide = this.slides[fromIndex];
		const toSlide = this.slides[toIndex];
		
		// Start transition
		this.state.setTransitioning(true);
		
		// Stop any playing media in the previous slide
		this.pauseMediaInSlide(fromSlide);
		
		// Modern fade transition
		this.animations.fadeTransition(
			fromSlide,
			toSlide,
			() => {
				// Clean up classes
				this.slides.forEach((slide, index) => {
					slide.classList.toggle('active', index === toIndex);
				});
				
				// Play media if applicable
				this.playMediaInSlide(toSlide);
				
				// End transition
				this.state.setTransitioning(false);
			}
		);
		
		// Animate indicators
		this.animations.indicatorTransition(this.indicators, fromIndex, toIndex);
	}

	updateIndicators(activeIndex) {
		this.indicators.forEach((indicator, index) => {
			const isActive = index === activeIndex;
			indicator.classList.toggle('active', isActive);
			indicator.setAttribute('aria-selected', isActive);
			
			// Modern indicator styling
			if (isActive) {
				indicator.style.backgroundColor = 'var(--carousel-indicator-active)';
				indicator.style.width = '24px';
			} else {
				indicator.style.backgroundColor = 'var(--carousel-indicator-inactive)';
				indicator.style.width = '8px';
			}
		});
	}

	updateButtonStates() {
		// Update aria labels with current position
		const currentPos = this.state.currentIndex + 1;
		const total = this.state.slideCount;
		
		this.prevButton?.setAttribute('aria-label', `Previous slide (${currentPos} of ${total})`);
		this.nextButton?.setAttribute('aria-label', `Next slide (${currentPos} of ${total})`);
	}

	pauseMediaInSlide(slide) {
		if (!slide) return;
		
		const video = slide.querySelector('video');
		if (video && !video.paused) {
			video.pause();
		}
	}

	playMediaInSlide(slide) {
		if (!slide) return;
		
		const video = slide.querySelector('video');
		if (video && video.hasAttribute('autoplay')) {
			video.play().catch(() => {
				// Autoplay might be blocked
			});
		}
	}

	// Initialize the view
	initialize() {
		// Set initial slide
		this.slides.forEach((slide, index) => {
			slide.classList.toggle('active', index === 0);
		});
		
		// Set initial indicators
		this.updateIndicators(0);
		this.updateButtonStates();
		
		// Add modern styling classes
		this.element.classList.add('carousel-modern');
	}

	// Handle responsive behavior
	handleResize() {
		const isMobile = window.innerWidth < 768;
		this.element.classList.toggle('carousel-mobile', isMobile);
		
		// Adjust button visibility on mobile
		if (this.prevButton && this.nextButton) {
			const showButtons = !isMobile || this.state.slideCount > 1;
			this.prevButton.style.display = showButtons ? '' : 'none';
			this.nextButton.style.display = showButtons ? '' : 'none';
		}
	}

	// Enhanced hover effects
	addHoverEffects() {
		// Button hover with depth
		[this.prevButton, this.nextButton].forEach(button => {
			if (!button) return;
			
			button.addEventListener('mouseenter', () => {
				button.style.transform = 'translateY(-50%) scale(1.1)';
				button.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
			});
			
			button.addEventListener('mouseleave', () => {
				button.style.transform = 'translateY(-50%) scale(1)';
				button.style.boxShadow = '';
			});
			
			button.addEventListener('mousedown', () => {
				this.animations.buttonPress(button);
			});
		});
		
		// Indicator hover
		this.indicators.forEach(indicator => {
			indicator.addEventListener('mouseenter', () => {
				if (!indicator.classList.contains('active')) {
					indicator.style.opacity = '0.8';
					indicator.style.transform = 'scale(1.2)';
				}
			});
			
			indicator.addEventListener('mouseleave', () => {
				if (!indicator.classList.contains('active')) {
					indicator.style.opacity = '';
					indicator.style.transform = '';
				}
			});
		});
	}

	// Resolve image paths (from original carousel.js)
	resolveImagePath(img) {
		let imgSrc = img.src;
		let originalSrc = img.getAttribute('src') || '';
		
		// Check if we have a relative path that needs resolution
		if (originalSrc.startsWith('./') || (originalSrc && !originalSrc.startsWith('/') && !originalSrc.startsWith('http'))) {
			// Try to detect project path from carousel context
			let projectPath = '/';
			const carouselContainer = this.element.closest('.project-wrapper');
			if (carouselContainer) {
				const fixedImg = carouselContainer.querySelector('img[src*="/2019/"], img[src*="/20"]');
				if (fixedImg) {
					const match = fixedImg.getAttribute('src').match(/^(\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/)/);
					if (match) projectPath = match[1];
				}
			}
			// Fallback to window location if on project page
			if (projectPath === '/' && window.location.pathname.match(/^\/\d{4}\/\d{2}\/\d{2}\/[^/]+\//)) {
				projectPath = window.location.pathname.endsWith('/') ? 
					window.location.pathname : window.location.pathname + '/';
			}
			
			// Remove './' if present, otherwise use the original src
			const filename = originalSrc.startsWith('./') ? originalSrc.substring(2) : originalSrc;
			imgSrc = projectPath + filename;
			
			// Update the actual img element's src attribute
			img.src = imgSrc;
			img.setAttribute('src', imgSrc);
		} else if (originalSrc.startsWith('/') && !originalSrc.includes('/2019/') && !originalSrc.includes('/20')) {
			// This is an absolute path from root that should be relative to the project
			let projectPath = '/';
			const carouselContainer = this.element.closest('.project-wrapper');
			if (carouselContainer) {
				const fixedImg = carouselContainer.querySelector('img[src*="/2019/"], img[src*="/20"]');
				if (fixedImg) {
					const match = fixedImg.getAttribute('src').match(/^(\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/)/);
					if (match) projectPath = match[1];
				}
			}
			if (projectPath === '/' && window.location.pathname.match(/^\/\d{4}\/\d{2}\/\d{2}\/[^/]+\//)) {
				projectPath = window.location.pathname.endsWith('/') ? 
					window.location.pathname : window.location.pathname + '/';
			}
			
			const filename = originalSrc.substring(1); // Remove leading slash
			imgSrc = projectPath + filename;
			
			// Update the actual img element's src attribute
			img.src = imgSrc;
			img.setAttribute('src', imgSrc);
		} else if (!imgSrc || imgSrc === window.location.href || imgSrc.endsWith('.html')) {
			// If src is empty, equals current page, or ends with .html, it's broken
			if (originalSrc) {
				let projectPath = '/';
				const carouselContainer = this.element.closest('.project-wrapper');
				if (carouselContainer) {
					const fixedImg = carouselContainer.querySelector('img[src*="/2019/"], img[src*="/20"]');
					if (fixedImg) {
						const match = fixedImg.getAttribute('src').match(/^(\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/)/);
						if (match) projectPath = match[1];
					}
				}
				if (projectPath === '/' && window.location.pathname.match(/^\/\d{4}\/\d{2}\/\d{2}\/[^/]+\//)) {
					projectPath = window.location.pathname.endsWith('/') ? 
						window.location.pathname : window.location.pathname + '/';
				}
				imgSrc = projectPath + originalSrc;
				img.src = imgSrc;
				img.setAttribute('src', imgSrc);
			}
		}
		
		return imgSrc;
	}
}