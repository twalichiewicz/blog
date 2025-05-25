class Carousel {
	static activeSpotlightCarousel = null; // Static property to track active carousel

	constructor(element) {
		console.log('[Carousel] Constructor called for:', element);
		this.carousel = element;
		this.track = element.querySelector('.carousel-track');
		this.slides = Array.from(element.querySelectorAll('.carousel-slide'));
		this.indicators = Array.from(element.querySelectorAll('.indicator'));
		this.prevButton = element.querySelector('.carousel-button.prev');
		this.nextButton = element.querySelector('.carousel-button.next');

		this.currentIndex = 0;
		this.slideCount = this.slides.length;

		// Add media handling
		this.activeMedia = null;

		this.currentSpotlightIndex = 0;
		this.carouselImages = Array.from(this.carousel.querySelectorAll('img')); // Store images for this specific carousel

		// Add touch handling properties for both carousel and spotlight
		this.touchStartX = 0;
		this.touchStartY = 0;
		this.touchEndX = 0;
		this.touchEndY = 0;
		this.minSwipeDistance = 50;
		this.maxSwipeTime = 300;
		this.touchStartTime = 0;
		this.spotlightModal = null;

		this.init();

		// Add iframe handling
		this.handleIframeResize();

		// Add image click handlers
		this.setupImageHandlers();
		console.log('[Carousel] Constructor finished for:', element);
	}

	init() {
		console.log('[Carousel init()] Called for:', this.carousel);
		// Store bound versions of handlers for easy removal
		this.boundPrev = this.prev.bind(this);
		this.boundNext = this.next.bind(this);
		this.indicatorHandlers = new Map();
		this.imageClickHandlers = new Map();
		this.boundTouchStart = this.handleTouchStart.bind(this);
		this.boundTouchMove = this.handleTouchMove.bind(this);
		this.boundTouchEnd = this.handleTouchEnd.bind(this);

		// Remove any listeners potentially added by previous instances/calls
		// (Note: this is somewhat redundant if destroy() is called reliably before re-init)
		this.prevButton?.removeEventListener('click', this.boundPrev);
		this.nextButton?.removeEventListener('click', this.boundNext);
		this.indicators.forEach((indicator, index) => {
			const handler = this.indicatorHandlers.get(indicator);
			if (handler) {
				indicator.removeEventListener('click', handler);
			}
		});
		this.indicatorHandlers.clear();

		// Only initialize carousel navigation if more than one slide
		if (this.slideCount > 1) {
			// Update the button HTML with SF Symbols SVGs
			if (this.prevButton) {
				this.prevButton.innerHTML = `
			<svg width='24px' height='24px' viewBox='0 0 52 52' direction='ltr' xmlns='http://www.w3.org/2000/svg' version='1.1'>
			  <g fill-rule='nonzero' transform='scale(1,-1) translate(0,-52.400390625)'>
				<path fill='black' stroke='black' fill-opacity='1.0' stroke-width='1.0' d='
				  M 24.6640625,5.37109375
				  C 36.115234375,5.37109375 45.482421875,14.73828125 45.482421875,26.2109375
				  C 45.482421875,37.662109375 36.115234375,47.029296875 24.6640625,47.029296875
				  C 13.212890625,47.029296875 3.845703125,37.662109375 3.845703125,26.2109375
				  C 3.845703125,14.73828125 13.212890625,5.37109375 24.6640625,5.37109375
				  Z
				  M 28.8984375,34.8046875
				  L 30.1171875,33.5859375
				  L 21.7578125,25.2265625
				  L 30.1171875,16.8671875
				  L 28.8984375,15.6484375
				  L 19.2578125,25.2265625
				  Z
				' />
			  </g>
			</svg>
		  `;
			}

			if (this.nextButton) {
				this.nextButton.innerHTML = `
			<svg width='24px' height='24px' viewBox='0 0 52 52' direction='ltr' xmlns='http://www.w3.org/2000/svg' version='1.1'>
			  <g fill-rule='nonzero' transform='scale(1,-1) translate(0,-52.400390625)'>
				<path fill='black' stroke='black' fill-opacity='1.0' stroke-width='1.0' d='
				  M 24.6640625,5.37109375
				  C 36.115234375,5.37109375 45.482421875,14.73828125 45.482421875,26.2109375
				  C 45.482421875,37.662109375 36.115234375,47.029296875 24.6640625,47.029296875
				  C 13.212890625,47.029296875 3.845703125,37.662109375 3.845703125,26.2109375
				  C 3.845703125,14.73828125 13.212890625,5.37109375 24.6640625,5.37109375
				  Z
				  M 20.4296875,34.8046875
				  L 30.0703125,25.2265625
				  L 20.4296875,15.6484375
				  L 19.2109375,16.8671875
				  L 27.5703125,25.2265625
				  L 19.2109375,33.5859375
				  Z
				' />
			  </g>
			</svg>
		  `;
			}

			// Update the spotlight close button with SF Symbol
			const closeButton = document.createElement('button');
			closeButton.className = 'spotlight-modal-close';
			closeButton.setAttribute('aria-label', 'Close spotlight');
			closeButton.innerHTML = `
		  <svg width='24px' height='24px' viewBox='0 0 52 52' direction='ltr' xmlns='http://www.w3.org/2000/svg' version='1.1'>
			<g fill-rule='nonzero' transform='scale(1,-1) translate(0,-52.400390625)'>
			  <path fill='black' stroke='black' fill-opacity='1.0' stroke-width='1.0' d='
				  M 24.6640625,5.37109375
				  C 36.115234375,5.37109375 45.482421875,14.73828125 45.482421875,26.2109375
				  C 45.482421875,37.662109375 36.115234375,47.029296875 24.6640625,47.029296875
				  C 13.212890625,47.029296875 3.845703125,37.662109375 3.845703125,26.2109375
				  C 3.845703125,14.73828125 13.212890625,5.37109375 24.6640625,5.37109375
				  Z
				  M 16.45703125,17.40234375
				  C 16.091796875,17.40234375 15.8125,17.638671875 15.8125,17.982421875
				  C 15.8125,18.17578125 15.85546875,18.3046875 16.02734375,18.498046875
				  L 23.76171875,26.232421875
				  L 16.02734375,33.966796875
				  C 15.876953125,34.1171875 15.8125,34.2890625 15.8125,34.4609375
				  C 15.8125,34.8046875 16.091796875,35.041015625 16.45703125,35.041015625
				  C 16.671875,35.041015625 16.80078125,34.998046875 16.994140625,34.8046875
				  L 24.6640625,27.134765625
				  L 32.333984375,34.8046875
				  C 32.52734375,34.998046875 32.69921875,35.041015625 32.87109375,35.041015625
				  C 33.2578125,35.041015625 33.515625,34.8046875 33.515625,34.4609375
				  C 33.515625,34.2890625 33.451171875,34.1171875 33.30078125,33.966796875
				  L 25.56640625,26.232421875
				  L 33.30078125,18.498046875
				  C 33.451171875,18.34765625 33.515625,18.17578125 33.515625,17.982421875
				  C 33.515625,17.638671875 33.2578125,17.40234375 32.87109375,17.40234375
				  C 32.69921875,17.40234375 32.52734375,17.466796875 32.333984375,17.66015625
				  L 24.6640625,25.330078125
				  L 16.994140625,17.66015625
				  C 16.80078125,17.466796875 16.671875,17.40234375 16.45703125,17.40234375
				  Z
			  ' />
			</g>
		  </svg>
		`;

			this.prevButton?.addEventListener('click', this.boundPrev);
			this.nextButton?.addEventListener('click', this.boundNext);

			this.indicators.forEach((indicator, index) => {
				const handler = () => this.goToSlide(index);
				this.indicatorHandlers.set(indicator, handler); // Store handler
				indicator.addEventListener('click', handler);
			});

			// Enhanced touch support
			this.carousel.addEventListener('touchstart', this.boundTouchStart, { passive: true });
			this.carousel.addEventListener('touchmove', this.boundTouchMove, { passive: false });
			this.carousel.addEventListener('touchend', this.boundTouchEnd, { passive: true });
		}

		// Add click handlers for images
		this.slides.forEach(slide => {
			const img = slide.querySelector('img');
			if (img) {
				img.style.cursor = 'nesw-resize';
				const handler = () => this.openSpotlight(img.src, img.alt);
				this.imageClickHandlers.set(img, handler);
				img.addEventListener('click', handler);
			}
		});

		// Add lazy loading to carousel images
		this.slides.forEach(slide => {
			const img = slide.querySelector('img');
			if (img) {
				img.loading = 'lazy';
				img.decoding = 'async';
			}
		});
		console.log('[Carousel init()] Finished for:', this.carousel);

		console.log('[Carousel] Initializing carousel with', this.slideCount, 'slides');
		if (this.slideCount <= 1) {
			console.log('[Carousel] Single slide or no slides, hiding navigation');
			if (this.prevButton) this.prevButton.style.display = 'none';
			if (this.nextButton) this.nextButton.style.display = 'none';
			this.indicators.forEach(indicator => indicator.style.display = 'none');
		} else {
			this.setupEventListeners();
		}

		// Initialize first slide
		this.goToSlide(0);

		// Add video error handling
		this.setupVideoErrorHandling();
	}

	handleSwipe(deltaX, duration) {
		// Check if the swipe was fast enough and long enough
		if (duration <= this.maxSwipeTime && Math.abs(deltaX) >= this.minSwipeDistance) {
			if (deltaX > 0) {
				this.next();
			} else {
				this.prev();
			}
		}
	}

	goToSlide(index) {
		// Pause any active media in current slide
		const currentSlide = this.slides[this.currentIndex];
		this.pauseMedia(currentSlide);

		this.slides[this.currentIndex].classList.remove('active');
		this.slides[this.currentIndex].setAttribute('aria-hidden', 'true');
		if (this.indicators[this.currentIndex]) {
			this.indicators[this.currentIndex].classList.remove('active');
		}

		this.currentIndex = index;

		this.slides[this.currentIndex].classList.add('active');
		this.slides[this.currentIndex].setAttribute('aria-hidden', 'false');
		if (this.indicators[this.currentIndex]) {
			this.indicators[this.currentIndex].classList.add('active');
		}

		// Handle media in new slide
		const newSlide = this.slides[index];
		this.playMedia(newSlide);

		// Ensure iframe in new slide is properly sized
		const iframe = newSlide.querySelector('iframe');
		if (iframe) {
			this.resizeIframe(iframe);
		}
	}

	next() {
		const nextIndex = (this.currentIndex + 1) % this.slideCount;
		this.goToSlide(nextIndex);
	}

	prev() {
		const prevIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
		this.goToSlide(prevIndex);
	}

	openSpotlight(src, alt) {
		Carousel.activeSpotlightCarousel = this;
		let modal = document.querySelector('.spotlight-modal');
		const hasMultipleImages = this.carouselImages.length > 1;

		if (!modal) {
			modal = document.createElement('div');
			modal.className = 'spotlight-modal';
			modal.innerHTML = `
				<button class="spotlight-modal-close" aria-label="Close spotlight"></button>
				<img src="${src}" alt="${alt}">
				${hasMultipleImages ? `
					<button class="spotlight-nav-button prev" aria-label="Previous image"></button>
					<button class="spotlight-nav-button next" aria-label="Next image"></button>
					<div class="carousel-indicators">
						${this.carouselImages.map((_, index) => `
							<button class="indicator ${index === this.currentSpotlightIndex ? 'active' : ''}" 
									aria-label="Go to slide ${index + 1}"></button>
						`).join('')}
					</div>
				` : ''}
			`;
			document.body.appendChild(modal);
		} else {
			// Update existing modal content
			modal.innerHTML = `
				<button class="spotlight-modal-close" aria-label="Close spotlight"></button>
				<img src="${src}" alt="${alt}">
				${hasMultipleImages ? `
					<button class="spotlight-nav-button prev" aria-label="Previous image"></button>
					<button class="spotlight-nav-button next" aria-label="Next image"></button>
					<div class="carousel-indicators">
						${this.carouselImages.map((_, index) => `
							<button class="indicator ${index === this.currentSpotlightIndex ? 'active' : ''}" 
									aria-label="Go to slide ${index + 1}"></button>
						`).join('')}
					</div>
				` : ''}
			`;
		}

		// Always setup navigation for the current modal state
		this.setupSpotlightNavigation(modal);
		modal.classList.add('active');
		document.body.style.overflow = 'hidden';
	}

	setupSpotlightTouchEvents(modal) {
		const handleTouchStart = (e) => {
			this.touchStartX = e.touches[0].clientX;
			this.touchStartY = e.touches[0].clientY;
			this.touchStartTime = Date.now();
		};

		const handleTouchMove = (e) => {
			if (!this.touchStartX) return;

			const currentX = e.touches[0].clientX;
			const currentY = e.touches[0].clientY;
			const deltaX = this.touchStartX - currentX;
			const deltaY = Math.abs(this.touchStartY - currentY);

			if (deltaY > Math.abs(deltaX)) return;
			e.preventDefault();
		};

		const handleTouchEnd = (e) => {
			if (!this.touchStartX) return;

			const touchEndTime = Date.now();
			const touchDuration = touchEndTime - this.touchStartTime;

			this.touchEndX = e.changedTouches[0].clientX;
			this.touchEndY = e.changedTouches[0].clientY;

			const deltaX = this.touchStartX - this.touchEndX;
			const deltaY = Math.abs(this.touchStartY - this.touchEndY);

			if (deltaY < Math.abs(deltaX)) {
				if (touchDuration <= this.maxSwipeTime && Math.abs(deltaX) >= this.minSwipeDistance) {
					if (deltaX > 0) {
						this.navigateSpotlight('next');
					} else {
						this.navigateSpotlight('prev');
					}
				}
			}

			this.touchStartX = 0;
			this.touchStartY = 0;
			this.touchEndX = 0;
			this.touchEndY = 0;
		};

		modal.addEventListener('touchstart', handleTouchStart, { passive: true });
		modal.addEventListener('touchmove', handleTouchMove, { passive: false });
		modal.addEventListener('touchend', handleTouchEnd, { passive: true });
	}

	closeSpotlight() {
		const modal = document.querySelector('.spotlight-modal');
		if (modal) {
			modal.classList.remove('active');
			document.body.style.overflow = '';
			Carousel.activeSpotlightCarousel = null;
			// Remove the specific keydown listener for this spotlight instance
			if (this.boundSpotlightKeydownHandler) {
				document.removeEventListener('keydown', this.boundSpotlightKeydownHandler);
				this.boundSpotlightKeydownHandler = null; // Clear reference
			}
		}
	}

	isVisible(element) {
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= window.innerHeight &&
			rect.right <= window.innerWidth
		);
	}

	pauseMedia(slide) {
		const video = slide.querySelector('video');
		if (video) {
			video.pause();
		}
		const iframe = slide.querySelector('iframe');
		if (iframe) {
			// Reset iframe src to stop any playing content
			iframe.src = iframe.src;
		}
	}

	playMedia(slide) {
		const video = slide.querySelector('video[autoplay]');
		if (video) {
			video.play().catch(() => {
				// Handle autoplay failure gracefully
				console.log('Autoplay prevented by browser');
			});
		}
	}

	getMediaType(src) {
		if (src.match(/\.(mp4|webm|ogg)$/i)) return 'video';
		if (src.includes('iframe')) return 'iframe';
		return 'image';
	}

	handleIframeResize() {
		const iframes = this.carousel.querySelectorAll('iframe');
		iframes.forEach(iframe => {
			// Set initial size
			this.resizeIframe(iframe);

			// Add resize listener
			window.addEventListener('resize', () => {
				this.resizeIframe(iframe);
			});
		});
	}

	resizeIframe(iframe) {
		const slide = iframe.closest('.carousel-slide');
		if (slide) {
			const slideWidth = slide.offsetWidth;
			const slideHeight = slide.offsetHeight;

			// Maintain aspect ratio for physics simulation
			if (iframe.src.includes('physics-simulation')) {
				const aspectRatio = 16 / 9;
				const height = slideWidth / aspectRatio;
				iframe.style.height = `${height}px`;
			} else {
				iframe.style.height = `${slideHeight}px`;
			}

			iframe.style.width = `${slideWidth}px`;
		}
	}

	setupImageHandlers() {
		const images = this.carousel.querySelectorAll('img');
		images.forEach(img => {
			// Check if this is a large content image
			if (img.naturalWidth > 800 || img.naturalHeight > 800) {
				img.classList.add('large-image');

				// Add click handler for zoom
				img.addEventListener('click', () => {
					this.openSpotlight(img.src, img.alt);
				});
				img.style.cursor = 'nesw-resize';
			}
		});
	}

	setupSpotlightNavigation(modal) {
		const prevButton = modal.querySelector('.spotlight-nav-button.prev');
		const nextButton = modal.querySelector('.spotlight-nav-button.next');
		const closeButton = modal.querySelector('.spotlight-modal-close');
		const self = this; // Store reference to Carousel instance

		if (prevButton) {
			prevButton.onclick = () => {
				self.navigateSpotlight('prev');
				// Play small click sound
				if (window.playSmallClickSound) {
					window.playSmallClickSound();
				}
			};
		}
		if (nextButton) {
			nextButton.onclick = () => {
				self.navigateSpotlight('next');
				// Play small click sound
				if (window.playSmallClickSound) {
					window.playSmallClickSound();
				}
			};
		}
		if (closeButton) {
			closeButton.onclick = () => {
				self.closeSpotlight();
				// Play small click sound
				if (window.playSmallClickSound) {
					window.playSmallClickSound();
				}
			};
		}

		// Close on background click
		modal.addEventListener('click', (e) => {
			// Check if the click was directly on the modal (background) and not on its children
			if (e.target === modal) {
				self.closeSpotlight();
				// Play small click sound
				if (window.playSmallClickSound) {
					window.playSmallClickSound();
				}
			}
		});

		// Keyboard navigation
		// Remove previous keydown listener if it exists on this instance
		if (self.boundSpotlightKeydownHandler) {
			document.removeEventListener('keydown', self.boundSpotlightKeydownHandler);
		}
		// Define and bind the handler
		self.boundSpotlightKeydownHandler = (e) => {
			if (!modal.classList.contains('active')) return;
			// Use Carousel.activeSpotlightCarousel for the check, not self, as it's static
			if (Carousel.activeSpotlightCarousel !== self) return;

			if (e.key === 'ArrowLeft') {
				self.navigateSpotlight('prev');
				if (window.playSmallClickSound) window.playSmallClickSound();
			}
			if (e.key === 'ArrowRight') {
				self.navigateSpotlight('next');
				if (window.playSmallClickSound) window.playSmallClickSound();
			}
			if (e.key === 'Escape') {
				self.closeSpotlight();
				if (window.playSmallClickSound) window.playSmallClickSound();
			}
		};
		document.addEventListener('keydown', self.boundSpotlightKeydownHandler);
	}

	navigateSpotlight(direction) {
		// Only navigate if this carousel owns the spotlight
		if (Carousel.activeSpotlightCarousel !== this) return;

		const modalImg = document.querySelector('.spotlight-modal img');
		if (!modalImg) return;

		this.currentSpotlightIndex = direction === 'next'
			? (this.currentSpotlightIndex + 1) % this.carouselImages.length
			: (this.currentSpotlightIndex - 1 + this.carouselImages.length) % this.carouselImages.length;

		const nextImage = this.carouselImages[this.currentSpotlightIndex];
		modalImg.src = nextImage.src;
		modalImg.alt = nextImage.alt;

		this.updateSpotlightIndicators();
	}

	updateSpotlightIndicators() {
		const modal = document.querySelector('.spotlight-modal');
		if (!modal) return;

		const indicators = modal.querySelectorAll('.indicator');
		indicators.forEach((indicator, index) => {
			indicator.classList.toggle('active', index === this.currentSpotlightIndex);
		});
	}

	// Add this method to better handle iframe loading
	handleIframeLoad(iframe) {
		iframe.addEventListener('load', () => {
			this.resizeIframe(iframe);

			// Add message passing for dark mode if needed
			if (iframe.src.includes('physics-simulation')) {
				const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
				iframe.contentWindow.postMessage({ darkMode }, '*');
			}
		});
	}

	destroy() {
		console.log('[Carousel destroy()] Called for:', this.carousel);
		// Remove event listeners added in init()
		this.prevButton?.removeEventListener('click', this.boundPrev);
		this.nextButton?.removeEventListener('click', this.boundNext);

		this.indicators.forEach((indicator, index) => {
			const handler = this.indicatorHandlers?.get(indicator);
			if (handler) {
				indicator.removeEventListener('click', handler);
			}
		});
		this.indicatorHandlers?.clear();

		// Remove touch listeners
		if (this.boundTouchStart) this.carousel.removeEventListener('touchstart', this.boundTouchStart);
		if (this.boundTouchMove) this.carousel.removeEventListener('touchmove', this.boundTouchMove);
		if (this.boundTouchEnd) this.carousel.removeEventListener('touchend', this.boundTouchEnd);

		// Remove image click listeners
		this.slides.forEach(slide => {
			const img = slide.querySelector('img');
			const handler = this.imageClickHandlers?.get(img);
			if (img && handler) {
				img.removeEventListener('click', handler);
			}
		});
		this.imageClickHandlers?.clear();

		// Remove iframe load listeners maybe?
		// ... other cleanup ...

		// Remove spotlight keydown listener if it was attached
		if (this.boundSpotlightKeydownHandler) {
			document.removeEventListener('keydown', this.boundSpotlightKeydownHandler);
			this.boundSpotlightKeydownHandler = null;
		}

		console.log('Carousel instance destroyed:', this.carousel);
		console.log('[Carousel destroy()] Finished for:', this.carousel);
		// Mark as no longer initialized internally (for debugging, classList is external)
		this.carousel.dataset.carouselInstanceDestroyed = 'true';
	}

	// Need to define handleTouchStart, handleTouchMove, handleTouchEnd as methods
	handleTouchStart(e) {
		if (this.slideCount <= 1) return;
		this.touchStartX = e.touches[0].clientX;
		this.touchStartY = e.touches[0].clientY;
		this.touchStartTime = Date.now();
	}

	handleTouchMove(e) {
		if (this.slideCount <= 1 || !this.touchStartX) return;
		const currentX = e.touches[0].clientX;
		const currentY = e.touches[0].clientY;
		const deltaX = this.touchStartX - currentX;
		const deltaY = Math.abs(this.touchStartY - currentY);
		// If scrolling more vertical than horizontal, don't prevent default
		if (deltaY > Math.abs(deltaX)) return;
		// Prevent page scrolling when swiping horizontally
		e.preventDefault();
	}

	handleTouchEnd(e) {
		if (this.slideCount <= 1 || !this.touchStartX) return;
		const touchEndTime = Date.now();
		const touchDuration = touchEndTime - this.touchStartTime;
		this.touchEndX = e.changedTouches[0].clientX;
		this.touchEndY = e.changedTouches[0].clientY;
		const deltaX = this.touchStartX - this.touchEndX;
		const deltaY = Math.abs(this.touchStartY - this.touchEndY);
		// Only handle horizontal swipes
		if (deltaY < Math.abs(deltaX)) {
			this.handleSwipe(deltaX, touchDuration);
		}
		// Reset values
		this.touchStartX = 0;
		this.touchStartY = 0;
		this.touchEndX = 0;
		this.touchEndY = 0;
	}

	setupVideoErrorHandling() {
		const videos = this.carousel.querySelectorAll('video');
		videos.forEach((video, index) => {
			console.log(`[Carousel] Setting up video ${index}:`, video.src || video.querySelector('source')?.src);

			video.addEventListener('loadstart', () => {
				console.log(`[Carousel] Video ${index} loadstart`);
			});

			video.addEventListener('loadedmetadata', () => {
				console.log(`[Carousel] Video ${index} metadata loaded`);
			});

			video.addEventListener('canplay', () => {
				console.log(`[Carousel] Video ${index} can play`);
			});

			video.addEventListener('error', (e) => {
				console.error(`[Carousel] Video ${index} error:`, e, video.error);
			});

			video.addEventListener('stalled', () => {
				console.warn(`[Carousel] Video ${index} stalled`);
			});
		});
	}
}

// Keep track of initialized carousel elements
const initializedCarousels = new WeakSet();
let carouselInstances = []; // Store instances for potential cleanup

export function initializeCarousels(container = document) {
	console.log('[carousel.js] initializeCarousels Start, container:', container.id || container.tagName);
	// Query ALL carousels in the container, not just those :not(.initialized)
	const carouselsToProcess = container.querySelectorAll('.carousel');
	console.log(`[carousel.js] Found ${carouselsToProcess.length} total .carousel elements in container ${container.id || container.tagName}`);

	carouselsToProcess.forEach(carouselElement => {
		console.log('[carousel.js] Processing carouselElement:', carouselElement, 'Current classes:', carouselElement.className);

		// Attempt to find and destroy any existing instance associated with this DOM element
		const existingInstanceIndex = carouselInstances.findIndex(inst => inst.carousel === carouselElement);
		if (existingInstanceIndex > -1) {
			console.log('[carousel.js] Destroying existing tracked instance for:', carouselElement);
			try {
				carouselInstances[existingInstanceIndex].destroy();
			} catch (e) {
				console.error('[carousel.js] Error destroying existing instance:', e, carouselElement);
			}
			carouselInstances.splice(existingInstanceIndex, 1);
		}
		// Also ensure it's removed from the WeakSet if it was there
		initializedCarousels.delete(carouselElement);

		// Always remove .initialized class before attempting re-initialization to ensure a clean state
		carouselElement.classList.remove('initialized');
		delete carouselElement.dataset.carouselInstanceDestroyed; // Clean up our debug marker

		console.log('[carousel.js] Attempting to initialize new Carousel for element:', carouselElement);
		try {
			const newInstance = new Carousel(carouselElement);
			carouselElement.classList.add('initialized'); // Mark as initialized *after* successful construction
			initializedCarousels.add(carouselElement);
			carouselInstances.push(newInstance);
		} catch (error) {
			console.error('[carousel.js] Error initializing carousel:', error, carouselElement);
		}
	});
	console.log(`[carousel.js] initializeCarousels End. Total active instances: ${carouselInstances.length}`);
}

// Clean up instances associated with a container before it's removed/replaced
export function cleanupCarouselInstances(container) {
	console.log('[carousel.js] cleanupCarouselInstances Start for container:', container.id || container.tagName);
	const carouselsInContainer = container.querySelectorAll('.carousel.initialized'); // Find carousels marked as initialized
	console.log(`[carousel.js] Found ${carouselsInContainer.length} .carousel.initialized in container ${container.id || container.tagName} to cleanup.`);

	carouselsInContainer.forEach(carouselElement => {
		console.log('[carousel.js cleanup] Processing carouselElement for cleanup:', carouselElement);
		const instanceIndex = carouselInstances.findIndex(inst => inst.carousel === carouselElement);
		if (instanceIndex > -1) {
			try {
				console.log('[carousel.js cleanup] Destroying instance during cleanup for:', carouselElement);
				carouselInstances[instanceIndex].destroy();
				carouselInstances.splice(instanceIndex, 1);
			} catch (error) {
				console.error('[carousel.js cleanup] Error destroying carousel instance during cleanup:', error, carouselElement);
			}
		} else {
			console.warn('[carousel.js cleanup] Could not find instance in carouselInstances for element:', carouselElement);
		}
		initializedCarousels.delete(carouselElement);
		carouselElement.classList.remove('initialized');
		// Remove the dataset marker if it was set
		delete carouselElement.dataset.carouselInstanceDestroyed;
	});
	console.log(`[carousel.js] cleanupCarouselInstances End. Total active instances: ${carouselInstances.length}`);
}

// Handle bfcache restore
window.addEventListener('pageshow', (event) => {
	if (event.persisted) {
		console.log('[carousel.js pageshow] Start - bfcache');
		// Simply re-run initialization for the whole document.
		// The logic within initializeCarousels handles destroying old instances.
		initializeCarousels(document);
		console.log('[carousel.js pageshow] End - bfcache');
	}
});

// Initialize on initial load (since this is a module, it runs once) - Moved pageshow logic here
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => initializeCarousels(document));
} else {
	initializeCarousels(document); // Initialize if DOM is already ready
}