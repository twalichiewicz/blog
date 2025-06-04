/**
 * Video Autoplay Handler
 * Handles autoplay for cover videos using Intersection Observer API
 * Similar to Apple's approach for promo videos
 */

class VideoAutoplayManager {
	constructor() {
		console.log('[VideoAutoplayManager] Initializing...');
		this.videos = new Map();
		this.observer = null;
		this.init();
	}

	init() {
		console.log('[VideoAutoplayManager] Init called');
		// Wait for DOM to be ready
		if (document.readyState === 'loading') {
			console.log('[VideoAutoplayManager] DOM loading, waiting for DOMContentLoaded');
			document.addEventListener('DOMContentLoaded', () => this.setup());
		} else {
			console.log('[VideoAutoplayManager] DOM ready, calling setup immediately');
			this.setup();
		}
	}

	setup() {
		console.log('[VideoAutoplayManager] Setup called');
		// Find all videos with autoplay data attribute
		const autoplayVideos = document.querySelectorAll('video[data-autoplay="true"]');

		console.log('[VideoAutoplayManager] Found videos:', autoplayVideos.length);
		autoplayVideos.forEach((video, index) => {
			console.log(`[VideoAutoplayManager] Video ${index + 1}:`, video.src);
		});

		if (autoplayVideos.length === 0) {
			console.log('[VideoAutoplayManager] No autoplay videos found, exiting');
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

		console.log('[VideoAutoplayManager] Created intersection observer');

		// Setup each video
		autoplayVideos.forEach(video => this.setupVideo(video));
	}

	setupVideo(video) {
		// Store video state
		this.videos.set(video, {
			isPlaying: false,
			hasPlayedOnce: false,
			playPromise: null
		});

		// Ensure video is properly configured
		video.muted = true;
		video.playsInline = true;
		video.loop = true;
		video.preload = 'metadata';

		// Add loading state
		video.setAttribute('data-loading', 'true');

		// Add event listeners
		video.addEventListener('loadedmetadata', () => {
			console.log('Video metadata loaded:', video.src);
			video.removeAttribute('data-loading');
		});

		video.addEventListener('canplay', () => {
			console.log('Video can play:', video.src);
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
				// Video is visible, try to play (Reverted to original behavior)
				this.attemptPlay(video);
			} else {
				// Video is not visible, pause it
				this.pauseVideo(video);
			}
		});
	}

	async attemptPlay(video) {
		const state = this.videos.get(video);
		if (!state || state.isPlaying) return;

		console.log('Attempting to play video:', video.src);
		console.log('Video readyState:', video.readyState);
		console.log('Video networkState:', video.networkState);

		try {
			// Ensure video is ready
			if (video.readyState < 3) {
				console.log('Video not ready, waiting for canplay event...');
				// Wait for video to be ready
				await new Promise((resolve) => {
					const onCanPlay = () => {
						console.log('Video canplay event fired');
						video.removeEventListener('canplay', onCanPlay);
						resolve();
					};
					video.addEventListener('canplay', onCanPlay);

					// Fallback timeout
					setTimeout(() => {
						console.log('Video canplay timeout, proceeding anyway');
						video.removeEventListener('canplay', onCanPlay);
						resolve();
					}, 2000);
				});
			}

			// Attempt to play
			console.log('Starting video play...');
			state.playPromise = video.play();
			await state.playPromise;

			console.log('Video playing successfully:', video.src);

		} catch (error) {
			console.log('Video autoplay failed:', error.name, error.message);
			console.log('Error details:', error);

			// If autoplay fails, we can still show the poster/first frame
			if (error.name === 'NotAllowedError') {
				console.log('Autoplay not allowed - setting up user interaction fallback');
				// User interaction required - this is expected behavior
				this.setupUserInteractionFallback(video);
			} else if (error.name === 'AbortError') {
				console.log('Video play was aborted - this is normal during rapid navigation');
			} else {
				console.log('Unexpected video error:', error);
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
			console.log('Error pausing video:', error);
		}
	}

	setupUserInteractionFallback(video) {
		// Add a subtle play button overlay or handle click to play
		const container = video.closest('.portfolio-image');
		if (!container) return;

		// Add click handler to container
		const clickHandler = async () => {
			try {
				await video.play();
				container.removeEventListener('click', clickHandler);
			} catch (error) {
				console.log('Manual play failed:', error);
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