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

// Performance detection based on hardware specs
const isTrulyLowSpecDevice = () => {
	const navigatorInfo = window.navigator;
	// Note: deviceMemory is in GB.
	if (navigatorInfo.deviceMemory && navigatorInfo.deviceMemory < 4) { // Less than 4GB RAM
		console.log('[WaveTextLoader] Device considered low-spec due to memory:', navigatorInfo.deviceMemory + 'GB');
		return true;
	}
	if (navigatorInfo.hardwareConcurrency && navigatorInfo.hardwareConcurrency < 4) { // Less than 4 CPU cores
		console.log('[WaveTextLoader] Device considered low-spec due to CPU cores:', navigatorInfo.hardwareConcurrency);
		return true;
	}
	// Previous iOS check is removed to allow capable iOS devices to use CSS animations.
	// If specific iOS versions/models show issues, more targeted checks could be added here.
	return false;
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
		console.log('[WaveTextLoader] Using CSS implementation (reduced motion preferred)');
		const waveText = new CssWaveText(container, {
			...normalizedConfig,
			rows: 5, // Use fewer rows for reduced motion
			columns: 10,
			reducedMotion: true
		});
		return waveText;
	}

	// Check browser capabilities and device performance
	const supportsCssGrid = supportsFeature('css-grid');
	const isLowSpec = isTrulyLowSpecDevice(); // Use the new hardware-focused check

	console.log('[WaveTextLoader] Device/Feature Check:', { supportsCssGrid, isLowSpec });

	if (supportsCssGrid && !isLowSpec) {
		// Use CSS-based implementation for modern browsers on capable (non-low-spec) devices.
		// This includes capable mobile devices that support CSS Grid.
		console.log('[WaveTextLoader] Using CSS implementation (CSS Grid supported, not low-spec device)');
		return new CssWaveText(container, normalizedConfig);
	} else {
		// Fallback to Optimized Canvas implementation for:
		// 1. Low-spec devices (isLowSpec = true)
		// 2. Browsers not supporting CSS Grid (supportsCssGrid = false)
		console.log('[WaveTextLoader] Using Canvas implementation (low-spec device or no CSS Grid support)');

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