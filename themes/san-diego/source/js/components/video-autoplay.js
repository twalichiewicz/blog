/**
 * Video Autoplay Handler
 * Handles autoplay for cover videos using Intersection Observer API
 * Similar to Apple's approach for promo videos
 */

class VideoAutoplayManager {
	constructor() {
		// Initializing VideoAutoplayManager
		this.videos = new Map();
		this.observer = null;
		this.init();
	}

	init() {
		// Init called
		// Wait for DOM to be ready
		if (document.readyState === 'loading') {
			// DOM loading, waiting for DOMContentLoaded
			document.addEventListener('DOMContentLoaded', () => this.setup());
		} else {
			// DOM ready, calling setup immediately
			this.setup();
		}
	}

	setup() {
		// Setup called
		// Find all videos with autoplay data attribute
		const autoplayVideos = document.querySelectorAll('video[data-autoplay="true"]');

		// Found autoplay videos
		autoplayVideos.forEach((video, index) => {
			// Video logged
		});

		if (autoplayVideos.length === 0) {
			// No autoplay videos found, exiting
			return;
		}

		// Create intersection observer
		this.observer = new IntersectionObserver(
			(entries) => this.handleIntersection(entries),
			{
				root: null,
				rootMargin: '50px',
				threshold: 0.1
			}
		);

		// Created intersection observer

		// Setup each video
		autoplayVideos.forEach(video => this.setupVideo(video));
	}

	setupVideo(video) {
		// Check if this is a trailer video
		const isTrailer = video.closest('.project-trailer-hero') !== null;
		
		// Store video state
		this.videos.set(video, {
			isPlaying: false,
			hasPlayedOnce: false,
			playPromise: null,
			isTrailer: isTrailer
		});

		// Ensure video is properly configured
		video.muted = true;
		video.playsInline = true;
		video.loop = true;
		
		// Different preload strategy for trailers vs gallery videos
		video.preload = isTrailer ? 'auto' : 'metadata';
		
		// For trailer videos, disable user interaction
		if (isTrailer) {
			video.style.pointerEvents = 'none';
			video.setAttribute('disablePictureInPicture', 'true');
			video.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback');
		}

		// Add loading state
		video.setAttribute('data-loading', 'true');

		// Add event listeners
		video.addEventListener('loadedmetadata', () => {
			// Video metadata loaded
			video.removeAttribute('data-loading');
		});

		video.addEventListener('canplay', () => {
			// Video can play
			video.removeAttribute('data-loading');
		});

		video.addEventListener('play', () => {
			const state = this.videos.get(video);
			if (state) {
				state.isPlaying = true;
				state.hasPlayedOnce = true;
			}
			video.setAttribute('data-playing', 'true');
			video.removeAttribute('data-loading');
		});

		video.addEventListener('pause', () => {
			const state = this.videos.get(video);
			if (state) {
				state.isPlaying = false;
			}
			video.removeAttribute('data-playing');
		});

		video.addEventListener('waiting', () => {
			video.setAttribute('data-loading', 'true');
		});

		video.addEventListener('playing', () => {
			video.removeAttribute('data-loading');
			video.setAttribute('data-playing', 'true');
		});

		// Start observing
		this.observer.observe(video);

		// Try immediate play if video is already in viewport
		this.attemptPlay(video);
	}

	handleIntersection(entries) {
		entries.forEach(entry => {
			const video = entry.target;
			const state = this.videos.get(video);

			if (!state) return;

			if (entry.isIntersecting) {
				// Video is visible, try to play
				this.attemptPlay(video);
			} else {
				// Video is not visible, pause it (but be more aggressive for trailers)
				if (state.isTrailer) {
					// Trailers should pause immediately when out of view
					this.pauseVideo(video);
				} else {
					// Gallery videos can have a small delay
					this.pauseVideo(video);
				}
			}
		});
	}

	async attemptPlay(video) {
		const state = this.videos.get(video);
		if (!state || state.isPlaying) return;

		// Attempting to play video
		// Video readyState logged
		// Video networkState logged

		try {
			// Ensure video is ready
			if (video.readyState < 3) {
				// Video not ready, waiting for canplay event
				// Wait for video to be ready
				await new Promise((resolve) => {
					const onCanPlay = () => {
						// Video canplay event fired
						video.removeEventListener('canplay', onCanPlay);
						resolve();
					};
					video.addEventListener('canplay', onCanPlay);

					// Fallback timeout
					setTimeout(() => {
						// Video canplay timeout, proceeding anyway
						video.removeEventListener('canplay', onCanPlay);
						resolve();
					}, 2000);
				});
			}

			// Attempt to play
			// Starting video play
			state.playPromise = video.play();
			await state.playPromise;

			// Video playing successfully

		} catch (error) {
			// Video autoplay failed
			// Error details logged

			// If autoplay fails, we can still show the poster/first frame
			if (error.name === 'NotAllowedError') {
				// Autoplay not allowed - setting up user interaction fallback
				// User interaction required - this is expected behavior
				this.setupUserInteractionFallback(video);
			} else if (error.name === 'AbortError') {
				// Video play was aborted - this is normal during rapid navigation
			} else {
				// Unexpected video error
			}
		}
	}

	pauseVideo(video) {
		const state = this.videos.get(video);
		if (!state || !state.isPlaying) return;

		try {
			// Wait for any pending play promise
			if (state.playPromise) {
				state.playPromise.then(() => {
					if (!video.paused) {
						video.pause();
					}
				}).catch(() => {
					// Play promise was rejected, video is already paused
				});
			} else if (!video.paused) {
				video.pause();
			}
		} catch (error) {
			// Error pausing video
		}
	}

	setupUserInteractionFallback(video) {
		const state = this.videos.get(video);
		
		// Don't add interaction fallback for trailer videos
		if (state && state.isTrailer) {
			// Trailer video autoplay failed - no user interaction fallback
			return;
		}
		
		// Add a subtle play button overlay or handle click to play
		const container = video.closest('.portfolio-image');
		if (!container) return;

		// Add click handler to container
		const clickHandler = async () => {
			try {
				await video.play();
				container.removeEventListener('click', clickHandler);
			} catch (error) {
				// Manual play failed
			}
		};

		container.addEventListener('click', clickHandler);
		container.style.cursor = 'pointer';

		// Add a subtle visual indicator
		container.setAttribute('title', 'Click to play video');
	}

	// Public method to refresh videos (useful for dynamic content)
	refresh() {
		if (this.observer) {
			this.observer.disconnect();
		}
		this.videos.clear();
		this.setup();
	}

	// Cleanup method
	destroy() {
		if (this.observer) {
			this.observer.disconnect();
		}
		this.videos.clear();
	}
}

// Initialize the video autoplay manager
const videoAutoplayManager = new VideoAutoplayManager();

// Export for potential external use
export default videoAutoplayManager; 