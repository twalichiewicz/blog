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

// Performance detection
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

	// Check if battery is low and saving mode is active (if available)
	if (navigatorInfo.getBattery) {
		navigatorInfo.getBattery().then(battery => {
			if (battery.level < 0.15 && battery.charging === false) {
				return true;
			}
		}).catch(e => {
			// Ignore errors
		});
	}

	// Check if the device might be a mobile device
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigatorInfo.userAgent
	);

	return isMobile;
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

	// Default to CSS implementation as it's more performant
	let implementation = 'css';

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

	if (hasModernFeatures && !isLowPerformance) {
		// Use CSS-based implementation for modern browsers on capable devices
		implementation = 'css';
		console.log('Using CSS implementation');
		return new CssWaveText(container, normalizedConfig);
	} else {
		// Fall back to optimized canvas implementation for better compatibility
		implementation = 'canvas';
		console.log('Using Canvas implementation');

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