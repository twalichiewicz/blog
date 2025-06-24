/**
 * Adaptive Video Component
 * Dynamically switches video sources based on grid layout for optimal aspect ratios
 */

class AdaptiveVideoManager {
	constructor() {
		this.videos = new Map();
		this.init();
	}

	init() {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.setup());
		} else {
			this.setup();
		}
	}

	setup() {

		// Find all videos with data-base-path (our adaptive videos)
		const adaptiveVideos = document.querySelectorAll('video[data-base-path]');

		adaptiveVideos.forEach(video => this.setupAdaptiveVideo(video));
	}

	setupAdaptiveVideo(video) {
		const basePath = video.getAttribute('data-base-path');
		const portfolioItem = video.closest('.portfolio-item');

		if (!portfolioItem || !basePath) {
			return;
		}

		const gridSize = portfolioItem.getAttribute('data-grid-size');

		// Determine the best aspect ratio for this grid size
		const aspectRatio = this.getAspectRatioForGridSize(gridSize);

		// Update video sources based on aspect ratio
		this.updateVideoSources(video, basePath, aspectRatio);

		// Store video info for potential future updates
		this.videos.set(video, {
			basePath,
			gridSize,
			aspectRatio,
			portfolioItem
		});
	}

	getAspectRatioForGridSize(gridSize) {
		const aspectRatioMap = {
			'1x1': 'square',    // 1:1 aspect ratio
			'2x2': 'square',    // 1:1 aspect ratio (larger)
			'1x2': 'tall',      // 9:16 aspect ratio
			'3x1': 'wide',      // 16:9 aspect ratio
			'default': 'compatible' // Default 16:9
		};

		return aspectRatioMap[gridSize] || aspectRatioMap.default;
	}

	updateVideoSources(video, basePath, aspectRatio) {

		// Clear existing sources
		const existingSources = video.querySelectorAll('source');
		existingSources.forEach(source => source.remove());

		// Define source priorities based on aspect ratio
		const sourcePaths = this.getSourcePaths(basePath, aspectRatio);

		// Add new sources in priority order
		sourcePaths.forEach(({ src, type }) => {
			const source = document.createElement('source');
			source.src = src;
			source.type = type;
			video.appendChild(source);
		});

		// Force video to reload with new sources
		video.load();

	}

	getSourcePaths(basePath, aspectRatio) {
		const sources = [];

		// Add aspect-ratio specific sources first (highest priority)
		if (aspectRatio !== 'compatible') {
			sources.push(
				{ src: `${basePath}-${aspectRatio}.webm`, type: 'video/webm' },
				{ src: `${basePath}-${aspectRatio}.mp4`, type: 'video/mp4' }
			);
		}

		// Add compatible fallbacks
		sources.push(
			{ src: `${basePath}-compatible.webm`, type: 'video/webm' },
			{ src: `${basePath}-compatible.mp4`, type: 'video/mp4' },
			{ src: `${basePath}-simple.mp4`, type: 'video/mp4' }
		);

		return sources;
	}

	// Method to update videos if grid layout changes (for future use)
	updateVideoForNewGridSize(video, newGridSize) {
		const videoData = this.videos.get(video);
		if (!videoData) return;

		const newAspectRatio = this.getAspectRatioForGridSize(newGridSize);
		if (newAspectRatio !== videoData.aspectRatio) {
			this.updateVideoSources(video, videoData.basePath, newAspectRatio);
			videoData.gridSize = newGridSize;
			videoData.aspectRatio = newAspectRatio;
		}
	}

	// Refresh all adaptive videos (useful for dynamic content)
	refresh() {
		this.videos.clear();
		this.setup();
	}
}

// Export for module system
export default AdaptiveVideoManager;

// Also make available globally for non-module usage
if (typeof window !== 'undefined') {
	window.AdaptiveVideoManager = AdaptiveVideoManager;
} 