// Media handling for carousel (images, videos, iframes)
export class CarouselMedia {
	constructor(element, state) {
		this.element = element;
		this.state = state;
		this.mediaCache = new Map();
		
		// Initialize media handling
		this.initializeMedia();
		this.setupLazyLoading();
		
		// Safari-specific fixes
		this.applySafariFixes();
	}

	initializeMedia() {
		const slides = this.element.querySelectorAll('.carousel-slide');
		
		slides.forEach((slide, index) => {
			// Handle images
			const img = slide.querySelector('img');
			if (img) {
				this.processImage(img, index);
			}
			
			// Handle videos
			const video = slide.querySelector('video');
			if (video) {
				this.processVideo(video, index);
			}
			
			// Handle iframes
			const iframe = slide.querySelector('iframe');
			if (iframe) {
				this.processIframe(iframe, index);
			}
		});
	}

	processImage(img, slideIndex) {
		// Fix relative paths
		const originalSrc = img.getAttribute('src') || '';
		const resolvedSrc = this.resolveImagePath(originalSrc);
		
		if (resolvedSrc !== img.src) {
			img.src = resolvedSrc;
		}
		
		// Add loading state
		img.classList.add('carousel-image');
		
		// Handle loading
		if (img.complete) {
			img.classList.add('loaded');
		} else {
			img.addEventListener('load', () => {
				img.classList.add('loaded');
				this.onMediaLoaded('image', slideIndex);
			});
			
			img.addEventListener('error', () => {
				console.error(`Failed to load image: ${img.src}`);
				this.onMediaError('image', slideIndex);
			});
		}
		
		// Store in cache
		this.mediaCache.set(`image-${slideIndex}`, {
			type: 'image',
			element: img,
			src: resolvedSrc,
			loaded: img.complete
		});
	}

	processVideo(video, slideIndex) {
		video.classList.add('carousel-video');
		
		// Set up video attributes
		if (!video.hasAttribute('playsinline')) {
			video.setAttribute('playsinline', '');
		}
		
		// Handle video events
		video.addEventListener('loadedmetadata', () => {
			this.onMediaLoaded('video', slideIndex);
		});
		
		video.addEventListener('error', () => {
			console.error(`Failed to load video: ${video.src}`);
			this.onMediaError('video', slideIndex);
		});
		
		// Store in cache
		this.mediaCache.set(`video-${slideIndex}`, {
			type: 'video',
			element: video,
			loaded: video.readyState >= 2
		});
		
		// Handle autoplay based on visibility
		this.setupVideoAutoplay(video, slideIndex);
	}

	processIframe(iframe, slideIndex) {
		iframe.classList.add('carousel-iframe');
		
		// Responsive iframe handling
		const wrapper = document.createElement('div');
		wrapper.className = 'carousel-iframe-wrapper';
		iframe.parentNode.insertBefore(wrapper, iframe);
		wrapper.appendChild(iframe);
		
		// Calculate aspect ratio
		const width = iframe.width || 16;
		const height = iframe.height || 9;
		const aspectRatio = (height / width) * 100;
		wrapper.style.paddingBottom = `${aspectRatio}%`;
		
		// Store in cache
		this.mediaCache.set(`iframe-${slideIndex}`, {
			type: 'iframe',
			element: iframe,
			wrapper: wrapper,
			loaded: true
		});
	}

	resolveImagePath(src) {
		if (!src) return '';
		
		// Already absolute URL
		if (src.startsWith('http://') || src.startsWith('https://')) {
			return src;
		}
		
		// Get project path from context
		const projectPath = this.detectProjectPath();
		
		// Handle relative paths
		if (src.startsWith('./')) {
			return projectPath + src.substring(2);
		}
		
		// Handle root-relative paths
		if (src.startsWith('/')) {
			// Check if it already includes a date path
			if (src.match(/^\/\d{4}\/\d{2}\/\d{2}\//)) {
				return src;
			}
			return src;
		}
		
		// Assume relative to project
		return projectPath + src;
	}

	detectProjectPath() {
		// Try to detect from URL
		const pathMatch = window.location.pathname.match(/^(\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/)/);
		if (pathMatch) {
			return pathMatch[1];
		}
		
		// Try to detect from other images in the page
		const existingImage = this.element.closest('.project-wrapper')?.querySelector('img[src*="/20"]');
		if (existingImage) {
			const srcMatch = existingImage.src.match(/^.*?(\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/)/);
			if (srcMatch) {
				return srcMatch[1];
			}
		}
		
		return '/';
	}

	setupLazyLoading() {
		// Set up intersection observer for lazy loading
		if ('IntersectionObserver' in window) {
			const options = {
				root: this.element,
				rootMargin: '50px',
				threshold: 0.01
			};
			
			this.observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const slide = entry.target;
						const index = Array.from(slide.parentElement.children).indexOf(slide);
						this.loadMediaInSlide(index);
					}
				});
			}, options);
			
			// Observe slides
			const slides = this.element.querySelectorAll('.carousel-slide');
			slides.forEach(slide => this.observer.observe(slide));
		}
	}

	loadMediaInSlide(index) {
		// Load images
		const imageData = this.mediaCache.get(`image-${index}`);
		if (imageData && !imageData.loaded) {
			const img = imageData.element;
			if (img.dataset.src && !img.src) {
				img.src = img.dataset.src;
			}
		}
		
		// Prepare videos
		const videoData = this.mediaCache.get(`video-${index}`);
		if (videoData && !videoData.loaded) {
			const video = videoData.element;
			if (video.dataset.src && !video.src) {
				video.src = video.dataset.src;
			}
		}
	}

	setupVideoAutoplay(video, slideIndex) {
		// Listen for slide changes
		this.state.on('indexChange', ({ currentIndex }) => {
			if (currentIndex === slideIndex) {
				// Play video if it has autoplay attribute
				if (video.hasAttribute('autoplay')) {
					video.play().catch(() => {
						// Autoplay might be blocked
					});
				}
			} else {
				// Pause video when not visible
				if (!video.paused) {
					video.pause();
				}
			}
		});
	}

	applySafariFixes() {
		const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		if (!isSafari) return;
		
		// Force reload first image in Safari
		const firstImage = this.element.querySelector('.carousel-slide:first-child img');
		if (firstImage && (!firstImage.complete || firstImage.naturalWidth === 0)) {
			const src = firstImage.src;
			const tempImg = new Image();
			tempImg.onload = () => {
				// Force refresh with cache buster
				firstImage.src = src + '?t=' + Date.now();
			};
			tempImg.src = src;
		}
		
		// Safari image flicker fix
		this.element.style.webkitTransform = 'translateZ(0)';
	}

	onMediaLoaded(type, index) {
		const media = this.mediaCache.get(`${type}-${index}`);
		if (media) {
			media.loaded = true;
		}
		
		// Emit event
		this.element.dispatchEvent(new CustomEvent('carouselMediaLoaded', {
			detail: { type, index }
		}));
	}

	onMediaError(type, index) {
		// Emit event
		this.element.dispatchEvent(new CustomEvent('carouselMediaError', {
			detail: { type, index }
		}));
	}

	handleResize() {
		// Update iframe aspect ratios if needed
		this.mediaCache.forEach((media, key) => {
			if (media.type === 'iframe' && media.wrapper) {
				// Recalculate if needed
			}
		});
	}

	// Get all media for spotlight
	getAllMedia() {
		const media = [];
		this.mediaCache.forEach((item, key) => {
			media.push({
				...item,
				index: parseInt(key.split('-')[1])
			});
		});
		return media.sort((a, b) => a.index - b.index);
	}
}