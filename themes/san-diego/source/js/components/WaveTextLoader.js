import { CssWaveText } from './CssWaveText.js';
import { OptimizedWaveAnimation } from './OptimizedWaveAnimation.js';

// Feature detection helper
const supportsFeature = (feature) => {
	if (feature === 'css-grid') {
		return window.CSS && window.CSS.supports && window.CSS.supports('display', 'grid');
	}
	if (feature === 'intersection-observer') {
		return 'IntersectionObserver' in window;
	}
	if (feature === 'resize-observer') {
		return 'ResizeObserver' in window;
	}
	return false;
};

// Performance detection with more reliable mobile checks
const isLowEndDevice = () => {
	// Check if the device has limited resources
	const navigatorInfo = window.navigator;

	// Check for low memory (if available)
	if (navigatorInfo.deviceMemory && navigatorInfo.deviceMemory < 4) {
		return true;
	}

	// Check for slower CPUs via hardwareConcurrency
	if (navigatorInfo.hardwareConcurrency && navigatorInfo.hardwareConcurrency < 4) {
		return true;
	}

	// More reliable mobile detection using multiple signals
	const isMobile =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigatorInfo.userAgent) ||
		(window.innerWidth < 768) ||
		(window.matchMedia && window.matchMedia('(max-width: 767px)').matches) ||
		(navigatorInfo.maxTouchPoints && navigatorInfo.maxTouchPoints > 1); // Likely touch device

	// If we're on iOS, it can have performance issues with complex animations
	const isIOS = /iPad|iPhone|iPod/.test(navigatorInfo.userAgent) && !window.MSStream;

	return isMobile || isIOS;
};

// Check if reduced motion is preferred
const prefersReducedMotion = () => {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Normalize configuration to handle both flat and nested structures
const normalizeConfig = (config) => {
	// Create a normalized config with default values
	const normalized = {
		baseString: "Design in Everything ",
		font: {
			size: 21,
			lineHeight: 30,
			charWidth: 14
		},
		frequency: 0.009,
		amplitude: 30,
		speed: 0.0003
	};

	// Copy direct properties if they exist
	if (config.baseString) normalized.baseString = config.baseString;
	if (config.font) normalized.font = { ...normalized.font, ...config.font };
	if (config.frequency) normalized.frequency = config.frequency;
	if (config.amplitude) normalized.amplitude = config.amplitude;
	if (config.speed) normalized.speed = config.speed;

	// Copy nested properties from wave object if it exists
	if (config.wave) {
		if (config.wave.baseString) normalized.baseString = config.wave.baseString;
		if (config.wave.frequency) normalized.frequency = config.wave.frequency;
		if (config.wave.amplitude) normalized.amplitude = config.wave.amplitude;
		if (config.wave.speed) normalized.speed = config.wave.speed;
		if (config.wave.font) normalized.font = { ...normalized.font, ...config.wave.font };
	}

	// For mobile devices, adjust parameters for better performance
	if (window.innerWidth < 768) {
		// Adjust animation parameters for mobile - significantly speed up the animation
		normalized.amplitude = normalized.amplitude * 0.8;    // Slightly higher amplitude 
		normalized.speed = normalized.speed * 3.0;           // Much faster speed on mobile
		normalized.frequency = normalized.frequency * 1.5;    // Higher frequency for more visible waves

		// Slightly reduce font size on small screens if needed
		if (normalized.font.size > 18) {
			normalized.font.size = 18;
			normalized.font.lineHeight = Math.max(normalized.font.lineHeight * 0.9, 24);
			normalized.font.charWidth = Math.max(normalized.font.charWidth * 0.9, 12);
		}
	}

	console.log('Normalized config:', normalized);
	return normalized;
};

/**
 * Creates the most appropriate wave text animation based on browser support and device capabilities
 */
export const createWaveText = (container, config = {}) => {
	console.log('Creating wave text with container:', container);
	console.log('Original config:', config);

	// Normalize configuration
	const normalizedConfig = normalizeConfig(config);

	// Add reduced motion media query listener
	const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
	let reducedMotion = reducedMotionQuery.matches;

	// Update the animation state when the preference changes
	reducedMotionQuery.addEventListener('change', () => {
		reducedMotion = reducedMotionQuery.matches;
		console.log('Reduced motion preference changed:', reducedMotion);

		// Force rebuild if we already have a wave text instance
		const existingWaveContainer = document.querySelector('.wave-container');
		if (existingWaveContainer) {
			console.log('Rebuilding wave text after motion preference change');
			// Remove existing animations
			const styleElement = document.getElementById('wave-text-animations');
			if (styleElement) {
				styleElement.parentNode.removeChild(styleElement);
			}
			// Refresh the container to trigger a rebuild
			existingWaveContainer.style.opacity = '0.99';
			setTimeout(() => {
				existingWaveContainer.style.opacity = '1';
			}, 50);
		}
	});

	// If user prefers reduced motion, use the most lightweight implementation
	if (reducedMotion) {
		// Use CSS with static styling (animation is disabled in CSS for reduced motion)
		const waveText = new CssWaveText(container, {
			...normalizedConfig,
			rows: 5, // Use fewer rows for reduced motion
			columns: 10,
			reducedMotion: true
		});
		return waveText;
	}

	// Check browser capabilities
	const hasModernFeatures = supportsFeature('css-grid') &&
		supportsFeature('intersection-observer');

	// Check device performance
	const isLowPerformance = isLowEndDevice();

	// For debugging
	console.log('Browser features:', { hasModernFeatures, isLowPerformance });

	// Default to canvas implementation for mobile (better performance)
	const isMobile = window.innerWidth < 768;

	if (isMobile || isLowPerformance) {
		// Use optimized canvas implementation for mobile or low-performance devices
		console.log('Using Canvas implementation for mobile/low-performance device');

		// First ensure we have a canvas element
		let canvas = container.querySelector('canvas#waveCanvas');
		if (!canvas) {
			canvas = document.createElement('canvas');
			canvas.id = 'waveCanvas';
			container.appendChild(canvas);
		}

		return new OptimizedWaveAnimation(canvas, normalizedConfig);
	} else if (hasModernFeatures) {
		// Use CSS-based implementation for modern browsers on capable devices
		console.log('Using CSS implementation');
		return new CssWaveText(container, normalizedConfig);
	} else {
		// Fall back to optimized canvas implementation for better compatibility
		console.log('Using Canvas implementation for compatibility');

		// First ensure we have a canvas element
		let canvas = container.querySelector('canvas#waveCanvas');
		if (!canvas) {
			canvas = document.createElement('canvas');
			canvas.id = 'waveCanvas';
			container.appendChild(canvas);
		}

		return new OptimizedWaveAnimation(canvas, normalizedConfig);
	}
}; 