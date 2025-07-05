// Modern state management for carousel
export class CarouselState {
	constructor(slideCount) {
		this.currentIndex = 0;
		this.slideCount = slideCount;
		this.isTransitioning = false;
		this.spotlightActive = false;
		this.spotlightIndex = 0;
		this.listeners = new Map();
	}

	// Event emitter pattern for state changes
	on(event, callback) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}
		this.listeners.get(event).add(callback);
		return () => this.listeners.get(event).delete(callback);
	}

	emit(event, data) {
		if (this.listeners.has(event)) {
			this.listeners.get(event).forEach(callback => callback(data));
		}
	}

	setIndex(index, options = {}) {
		if (index < 0 || index >= this.slideCount || this.isTransitioning) return false;
		
		const previousIndex = this.currentIndex;
		this.currentIndex = index;
		
		if (!options.silent) {
			this.emit('indexChange', { previousIndex, currentIndex: index });
		}
		
		return true;
	}

	next() {
		const nextIndex = (this.currentIndex + 1) % this.slideCount;
		return this.setIndex(nextIndex);
	}

	prev() {
		const prevIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
		return this.setIndex(prevIndex);
	}

	setTransitioning(value) {
		this.isTransitioning = value;
		this.emit('transitionStateChange', { isTransitioning: value });
	}

	openSpotlight(index = this.currentIndex) {
		this.spotlightActive = true;
		this.spotlightIndex = index;
		this.emit('spotlightOpen', { index });
	}

	closeSpotlight() {
		this.spotlightActive = false;
		this.emit('spotlightClose', {});
	}

	setSpotlightIndex(index) {
		if (index < 0 || index >= this.slideCount) return false;
		
		const previousIndex = this.spotlightIndex;
		this.spotlightIndex = index;
		this.emit('spotlightIndexChange', { previousIndex, currentIndex: index });
		
		return true;
	}
}