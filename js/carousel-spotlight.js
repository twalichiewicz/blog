// Spotlight (lightbox) functionality for carousel
export class CarouselSpotlight {
	constructor(element, state, view) {
		this.carousel = element;
		this.state = state;
		this.view = view;
		this.modal = null;
		this.isOpen = false;
		
		// Setup image click handlers
		this.setupImageClickHandlers();
		
		// Listen for state changes
		this.state.on('spotlightOpen', ({ index }) => this.open(index));
		this.state.on('spotlightClose', () => this.close());
	}

	setupImageClickHandlers() {
		// Add click handlers to all carousel images
		const images = this.carousel.querySelectorAll('.carousel-slide img');
		images.forEach((img, index) => {
			img.style.cursor = 'zoom-in';
			img.addEventListener('click', (e) => {
				e.preventDefault();
				this.state.openSpotlight(index);
			});
		});
	}

	open(index = this.state.currentIndex) {
		if (this.isOpen) return;
		
		// Create spotlight modal
		this.createModal();
		
		// Set initial slide
		this.state.setSpotlightIndex(index);
		this.updateSpotlightContent(index);
		
		// Show modal with animation
		requestAnimationFrame(() => {
			this.modal.classList.add('active');
			document.body.classList.add('spotlight-open');
		});
		
		this.isOpen = true;
		
		// Set as active spotlight
		this.constructor.activeSpotlight = this;
	}

	close() {
		if (!this.isOpen || !this.modal) return;
		
		// Animate out
		this.modal.classList.remove('active');
		document.body.classList.remove('spotlight-open');
		
		// Remove after animation
		setTimeout(() => {
			if (this.modal) {
				this.modal.remove();
				this.modal = null;
			}
		}, 300);
		
		this.isOpen = false;
		
		// Clear active spotlight
		if (this.constructor.activeSpotlight === this) {
			this.constructor.activeSpotlight = null;
		}
	}

	createModal() {
		// Create modal structure
		this.modal = document.createElement('div');
		this.modal.className = 'carousel-spotlight-modal';
		this.modal.innerHTML = `
			<div class="spotlight-backdrop"></div>
			<div class="spotlight-container">
				<button class="spotlight-close" aria-label="Close spotlight">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
					</svg>
				</button>
				<div class="spotlight-content">
					<div class="spotlight-media-container"></div>
				</div>
				<div class="spotlight-navigation">
					<button class="carousel-button spotlight-prev" aria-label="Previous image">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
					<button class="carousel-button spotlight-next" aria-label="Next image">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
				</div>
				<div class="spotlight-indicators"></div>
			</div>
		`;
		
		// Add to body
		document.body.appendChild(this.modal);
		
		// Setup event listeners
		this.setupModalEvents();
		
		// Create indicators
		this.createIndicators();
	}

	setupModalEvents() {
		// Close button
		const closeBtn = this.modal.querySelector('.spotlight-close');
		closeBtn.addEventListener('click', () => this.close());
		
		// Backdrop click
		const backdrop = this.modal.querySelector('.spotlight-backdrop');
		backdrop.addEventListener('click', () => this.close());
		
		// Navigation buttons
		const prevBtn = this.modal.querySelector('.spotlight-prev');
		const nextBtn = this.modal.querySelector('.spotlight-next');
		
		prevBtn.addEventListener('click', () => this.navigateSpotlight('prev'));
		nextBtn.addEventListener('click', () => this.navigateSpotlight('next'));
		
		// Keyboard navigation
		this.handleKeydown = (e) => {
			switch (e.key) {
				case 'Escape':
					this.close();
					break;
				case 'ArrowLeft':
					this.navigateSpotlight('prev');
					break;
				case 'ArrowRight':
					this.navigateSpotlight('next');
					break;
			}
		};
		document.addEventListener('keydown', this.handleKeydown);
		
		// Touch gestures
		this.setupSpotlightGestures();
	}

	setupSpotlightGestures() {
		const container = this.modal.querySelector('.spotlight-content');
		let touchStartX = 0;
		let touchStartY = 0;
		
		container.addEventListener('touchstart', (e) => {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
		});
		
		container.addEventListener('touchend', (e) => {
			const touchEndX = e.changedTouches[0].clientX;
			const touchEndY = e.changedTouches[0].clientY;
			const deltaX = touchEndX - touchStartX;
			const deltaY = touchEndY - touchStartY;
			
			// Check if horizontal swipe
			if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
				if (deltaX > 0) {
					this.navigateSpotlight('prev');
				} else {
					this.navigateSpotlight('next');
				}
			}
		});
	}

	createIndicators() {
		const indicatorContainer = this.modal.querySelector('.spotlight-indicators');
		const media = this.view.mediaElements;
		
		media.forEach((item, index) => {
			const indicator = document.createElement('button');
			indicator.className = 'spotlight-indicator';
			indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
			indicator.addEventListener('click', () => {
				this.state.setSpotlightIndex(index);
				this.updateSpotlightContent(index);
			});
			indicatorContainer.appendChild(indicator);
		});
		
		// Update initial state
		this.updateIndicators(this.state.spotlightIndex);
	}

	updateIndicators(activeIndex) {
		const indicators = this.modal.querySelectorAll('.spotlight-indicator');
		indicators.forEach((indicator, index) => {
			indicator.classList.toggle('active', index === activeIndex);
		});
	}

	navigateSpotlight(direction) {
		const currentIndex = this.state.spotlightIndex;
		let newIndex;
		
		if (direction === 'prev') {
			newIndex = (currentIndex - 1 + this.state.slideCount) % this.state.slideCount;
		} else {
			newIndex = (currentIndex + 1) % this.state.slideCount;
		}
		
		this.state.setSpotlightIndex(newIndex);
		this.updateSpotlightContent(newIndex);
	}

	updateSpotlightContent(index) {
		const mediaContainer = this.modal.querySelector('.spotlight-media-container');
		const media = this.view.mediaElements[index];
		
		if (!media) return;
		
		// Clear previous content
		mediaContainer.innerHTML = '';
		
		// Add new content based on type
		if (media.type === 'image') {
			const img = document.createElement('img');
			img.src = media.src;
			img.alt = media.alt;
			img.className = 'spotlight-image';
			mediaContainer.appendChild(img);
		} else if (media.type === 'video') {
			const video = media.element.cloneNode(true);
			video.className = 'spotlight-video';
			video.controls = true;
			mediaContainer.appendChild(video);
		} else if (media.type === 'iframe') {
			const iframe = media.element.cloneNode(true);
			iframe.className = 'spotlight-iframe';
			mediaContainer.appendChild(iframe);
		}
		
		// Update indicators
		this.updateIndicators(index);
		
		// Update navigation visibility
		this.updateNavigationVisibility();
	}

	updateNavigationVisibility() {
		const prevBtn = this.modal.querySelector('.spotlight-prev');
		const nextBtn = this.modal.querySelector('.spotlight-next');
		
		// Always show for multiple slides
		const showNav = this.state.slideCount > 1;
		prevBtn.style.display = showNav ? '' : 'none';
		nextBtn.style.display = showNav ? '' : 'none';
	}

	destroy() {
		if (this.modal) {
			this.close();
		}
		
		// Remove event listeners
		if (this.handleKeydown) {
			document.removeEventListener('keydown', this.handleKeydown);
		}
	}
}