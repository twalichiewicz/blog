// Modern touch and gesture handling
export class CarouselGestures {
	constructor(element, state, options = {}) {
		this.element = element;
		this.state = state;
		
		// Gesture configuration
		this.config = {
			minSwipeDistance: 50,
			maxSwipeTime: 300,
			velocityThreshold: 0.3,
			preventVerticalScroll: true,
			enableMomentum: true,
			...options
		};
		
		// Touch tracking
		this.touchData = {
			startX: 0,
			startY: 0,
			currentX: 0,
			currentY: 0,
			startTime: 0,
			velocityX: 0,
			isActive: false,
			identifier: null
		};
		
		// Bind methods
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
		this.handleWheel = this.handleWheel.bind(this);
	}

	enable() {
		// Touch events
		this.element.addEventListener('touchstart', this.handleTouchStart, { passive: false });
		this.element.addEventListener('touchmove', this.handleTouchMove, { passive: false });
		this.element.addEventListener('touchend', this.handleTouchEnd);
		this.element.addEventListener('touchcancel', this.handleTouchEnd);
		
		// Mouse events for desktop
		this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
		
		// Wheel events for horizontal scrolling
		this.element.addEventListener('wheel', this.handleWheel, { passive: false });
	}

	disable() {
		this.element.removeEventListener('touchstart', this.handleTouchStart);
		this.element.removeEventListener('touchmove', this.handleTouchMove);
		this.element.removeEventListener('touchend', this.handleTouchEnd);
		this.element.removeEventListener('touchcancel', this.handleTouchEnd);
		this.element.removeEventListener('mousedown', this.handleMouseDown);
		this.element.removeEventListener('wheel', this.handleWheel);
	}

	handleTouchStart(e) {
		if (this.state.isTransitioning) return;
		
		const touch = e.touches[0];
		this.touchData = {
			startX: touch.clientX,
			startY: touch.clientY,
			currentX: touch.clientX,
			currentY: touch.clientY,
			startTime: Date.now(),
			velocityX: 0,
			isActive: true,
			identifier: touch.identifier
		};
		
		// Add dragging class for visual feedback
		this.element.classList.add('dragging');
	}

	handleTouchMove(e) {
		if (!this.touchData.isActive) return;
		
		const touch = Array.from(e.touches).find(t => t.identifier === this.touchData.identifier);
		if (!touch) return;
		
		const deltaX = touch.clientX - this.touchData.startX;
		const deltaY = touch.clientY - this.touchData.startY;
		
		// Update velocity for momentum
		this.touchData.velocityX = touch.clientX - this.touchData.currentX;
		this.touchData.currentX = touch.clientX;
		this.touchData.currentY = touch.clientY;
		
		// Prevent vertical scroll if horizontal swipe detected
		if (this.config.preventVerticalScroll && Math.abs(deltaX) > Math.abs(deltaY)) {
			e.preventDefault();
			
			// Visual feedback during drag
			this.applyDragTransform(deltaX);
		}
	}

	handleTouchEnd(e) {
		if (!this.touchData.isActive) return;
		
		const deltaX = this.touchData.currentX - this.touchData.startX;
		const deltaY = this.touchData.currentY - this.touchData.startY;
		const deltaTime = Date.now() - this.touchData.startTime;
		
		// Remove dragging class
		this.element.classList.remove('dragging');
		this.resetDragTransform();
		
		// Check if it's a valid swipe
		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			const velocity = Math.abs(this.touchData.velocityX);
			const distance = Math.abs(deltaX);
			
			// Check swipe conditions
			const isValidSwipe = (
				distance > this.config.minSwipeDistance ||
				(velocity > this.config.velocityThreshold && deltaTime < this.config.maxSwipeTime)
			);
			
			if (isValidSwipe) {
				if (deltaX > 0) {
					this.state.prev();
				} else {
					this.state.next();
				}
				
				// Haptic feedback if available
				this.triggerHapticFeedback();
			}
		}
		
		// Reset touch data
		this.touchData.isActive = false;
	}

	handleMouseDown(e) {
		// Implement mouse drag for desktop
		if (this.state.isTransitioning) return;
		
		const startX = e.clientX;
		let currentX = startX;
		let isDragging = false;
		
		const handleMouseMove = (e) => {
			const deltaX = e.clientX - startX;
			
			if (!isDragging && Math.abs(deltaX) > 5) {
				isDragging = true;
				this.element.classList.add('dragging');
			}
			
			if (isDragging) {
				currentX = e.clientX;
				this.applyDragTransform(deltaX);
			}
		};
		
		const handleMouseUp = () => {
			if (isDragging) {
				const deltaX = currentX - startX;
				this.element.classList.remove('dragging');
				this.resetDragTransform();
				
				if (Math.abs(deltaX) > this.config.minSwipeDistance) {
					if (deltaX > 0) {
						this.state.prev();
					} else {
						this.state.next();
					}
				}
			}
			
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
		
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	}

	handleWheel(e) {
		// Horizontal wheel navigation
		if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
			e.preventDefault();
			
			if (!this.wheelTimeout) {
				if (e.deltaX > 0) {
					this.state.next();
				} else {
					this.state.prev();
				}
				
				// Debounce wheel events
				this.wheelTimeout = setTimeout(() => {
					this.wheelTimeout = null;
				}, 300);
			}
		}
	}

	applyDragTransform(deltaX) {
		// Apply visual feedback during drag
		const track = this.element.querySelector('.carousel-track');
		if (!track) return;
		
		// Limit drag distance
		const maxDrag = this.element.offsetWidth * 0.3;
		const clampedDelta = Math.max(-maxDrag, Math.min(maxDrag, deltaX));
		
		// Apply rubber band effect at edges
		const resistance = 0.3;
		const resistedDelta = clampedDelta * (1 - Math.abs(clampedDelta) / maxDrag * resistance);
		
		track.style.transform = `translateX(${resistedDelta}px)`;
		track.style.transition = 'none';
	}

	resetDragTransform() {
		const track = this.element.querySelector('.carousel-track');
		if (!track) return;
		
		track.style.transform = '';
		track.style.transition = '';
	}

	triggerHapticFeedback() {
		// Trigger haptic feedback if available
		if ('vibrate' in navigator) {
			navigator.vibrate(10);
		}
		
		// iOS haptic feedback
		if (window.webkit?.messageHandlers?.haptic) {
			window.webkit.messageHandlers.haptic.postMessage('impact');
		}
	}
}