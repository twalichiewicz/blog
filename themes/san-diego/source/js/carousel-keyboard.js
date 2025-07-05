// Keyboard navigation for carousel
export class CarouselKeyboard {
	constructor(element, state) {
		this.element = element;
		this.state = state;
		this.enabled = false;
		
		// Bind methods
		this.handleKeydown = this.handleKeydown.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}

	enable() {
		if (this.enabled) return;
		
		// Make carousel focusable
		this.element.setAttribute('tabindex', '0');
		this.element.setAttribute('role', 'region');
		this.element.setAttribute('aria-label', 'Image carousel');
		
		// Add event listeners
		this.element.addEventListener('keydown', this.handleKeydown);
		this.element.addEventListener('focus', this.handleFocus);
		this.element.addEventListener('blur', this.handleBlur);
		
		// Also listen on document when carousel has focus
		this.documentKeyHandler = (e) => {
			if (this.element.contains(document.activeElement)) {
				this.handleKeydown(e);
			}
		};
		document.addEventListener('keydown', this.documentKeyHandler);
		
		this.enabled = true;
	}

	disable() {
		if (!this.enabled) return;
		
		this.element.removeAttribute('tabindex');
		this.element.removeEventListener('keydown', this.handleKeydown);
		this.element.removeEventListener('focus', this.handleFocus);
		this.element.removeEventListener('blur', this.handleBlur);
		
		if (this.documentKeyHandler) {
			document.removeEventListener('keydown', this.documentKeyHandler);
		}
		
		this.enabled = false;
	}

	handleKeydown(e) {
		// Don't interfere with form elements
		if (this.isFormElement(e.target)) return;
		
		let handled = true;
		
		switch (e.key) {
			case 'ArrowLeft':
			case 'Left':
				this.state.prev();
				break;
				
			case 'ArrowRight':
			case 'Right':
				this.state.next();
				break;
				
			case 'Home':
				this.state.setIndex(0);
				break;
				
			case 'End':
				this.state.setIndex(this.state.slideCount - 1);
				break;
				
			case ' ':
			case 'Enter':
				// Open spotlight if available
				if (this.state.spotlightOpen) {
					this.state.openSpotlight();
				}
				break;
				
			case 'Escape':
				// Close spotlight if open
				if (this.state.spotlightActive) {
					this.state.closeSpotlight();
				}
				break;
				
			default:
				// Number keys for direct navigation
				if (e.key >= '1' && e.key <= '9') {
					const index = parseInt(e.key) - 1;
					if (index < this.state.slideCount) {
						this.state.setIndex(index);
					}
				} else {
					handled = false;
				}
		}
		
		if (handled) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	handleFocus() {
		this.element.classList.add('keyboard-focused');
		
		// Announce to screen readers
		this.announceCurrentSlide();
	}

	handleBlur() {
		this.element.classList.remove('keyboard-focused');
	}

	announceCurrentSlide() {
		// Create or update live region for screen readers
		let liveRegion = this.element.querySelector('.carousel-live-region');
		if (!liveRegion) {
			liveRegion = document.createElement('div');
			liveRegion.className = 'carousel-live-region';
			liveRegion.setAttribute('role', 'status');
			liveRegion.setAttribute('aria-live', 'polite');
			liveRegion.setAttribute('aria-atomic', 'true');
			liveRegion.style.position = 'absolute';
			liveRegion.style.left = '-9999px';
			liveRegion.style.width = '1px';
			liveRegion.style.height = '1px';
			liveRegion.style.overflow = 'hidden';
			this.element.appendChild(liveRegion);
		}
		
		const current = this.state.currentIndex + 1;
		const total = this.state.slideCount;
		liveRegion.textContent = `Slide ${current} of ${total}`;
	}

	isFormElement(element) {
		const formTags = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'];
		return formTags.includes(element.tagName) || 
			element.contentEditable === 'true';
	}
}