/**
 * Device Detection and Responsive Behavior
 * 
 * This script handles device detection and applies appropriate classes to the body
 * for device-specific styling and behavior.
 */

// Run device detection immediately to ensure device classes are set before DOM is fully loaded
(function () {
	const width = window.innerWidth;
	const body = document.body;

	// Add appropriate device class
	if (width <= 767) { // Just below $mobile-breakpoint (768px)
		body.classList.add('device-mobile');
	} else if (width >= 768 && width <= 1023) { // Between $mobile-breakpoint and $tablet-breakpoint
		body.classList.add('device-tablet');
	} else {
		body.classList.add('device-tablet');
	}

	// Add orientation class
	if (window.matchMedia("(orientation: portrait)").matches) {
		body.classList.add('orientation-portrait');
	} else {
		body.classList.add('orientation-landscape');
	}
})();

document.addEventListener('DOMContentLoaded', function () {
	const DeviceDetection = {
		// Breakpoints matching our SCSS definitions
		breakpoints: {
			mobile: {
				max: 767  // Just below $mobile-breakpoint (768px)
			},
			tablet: {
				min: 768, // $mobile-breakpoint: 768px
				max: 1023 // Just below $tablet-breakpoint (1024px)
			},
			desktop: {
				min: 1024 // $tablet-breakpoint: 1024px
			}
		},

		/**
		 * Initialize device detection
		 */
		init: function () {
			this.detectDevice();
			this.detectOrientation();
			this.setupEventListeners();
			this.setupTouchCapability();
		},

		/**
		 * Detect device type based on screen width
		 */
		detectDevice: function () {
			const width = window.innerWidth;
			const body = document.body;

			// Store current device type before changing
			const currentDeviceType = this.getCurrentDeviceType();

			// Remove existing device classes
			body.classList.remove('device-mobile', 'device-tablet', 'device-tablet');

			// Add appropriate device class
			if (width <= this.breakpoints.mobile.max) {
				body.classList.add('device-mobile');
			} else if (width >= this.breakpoints.tablet.min && width <= this.breakpoints.tablet.max) {
				body.classList.add('device-tablet');
			} else {
				body.classList.add('device-tablet');
			}

			// Detect specific devices - using consistent breakpoints
			if (width >= 1024 && width <= 1366 &&
				(navigator.userAgent.includes('iPad') ||
					(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))) {
				body.classList.add('device-ipad-pro');
			}

			// Return whether device type changed
			return currentDeviceType !== this.getCurrentDeviceType();
		},

		/**
		 * Get current device type based on body classes
		 */
		getCurrentDeviceType: function () {
			const body = document.body;
			if (body.classList.contains('device-tablet')) return 'desktop';
			if (body.classList.contains('device-tablet')) return 'tablet';
			if (body.classList.contains('device-mobile')) return 'mobile';

			// Fallback based on width if classes not set yet
			const width = window.innerWidth;
			if (width >= this.breakpoints.desktop.min) return 'desktop';
			if (width >= this.breakpoints.tablet.min) return 'tablet';
			return 'mobile';
		},

		/**
		 * Detect orientation (portrait or landscape)
		 */
		detectOrientation: function () {
			const body = document.body;

			// Remove existing orientation classes
			body.classList.remove('orientation-portrait', 'orientation-landscape');

			// Add appropriate orientation class
			if (window.matchMedia("(orientation: portrait)").matches) {
				body.classList.add('orientation-portrait');
			} else {
				body.classList.add('orientation-landscape');
			}
		},

		/**
		 * Detect touch capability
		 */
		setupTouchCapability: function () {
			const body = document.body;

			if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
				body.classList.add('touch-capable');
			} else {
				body.classList.add('mouse-input');
			}
		},

		/**
		 * Set up event listeners for resize and orientation change
		 */
		setupEventListeners: function () {
			// Throttled resize handler
			let resizeTimeout;
			window.addEventListener('resize', () => {
				// Check for device type change immediately
				const deviceChanged = this.detectDevice();

				// If device type changed, update orientation immediately
				if (deviceChanged) {
					this.detectOrientation();
				}

				if (resizeTimeout) {
					clearTimeout(resizeTimeout);
				}

				// Use a consistent 100ms timeout for responsive behavior
				resizeTimeout = setTimeout(() => {
					this.detectDevice();
					this.detectOrientation();
				}, 100);
			});

			// Orientation change handler
			window.addEventListener('orientationchange', () => {
				// Detect changes with consistent timing
				setTimeout(() => {
					this.detectOrientation();
				}, 50); // Consistent 50ms timeout for orientation changes
			});
		}
	};

	// Initialize device detection
	DeviceDetection.init();

	// Make available globally
	window.DeviceDetection = DeviceDetection;
}); 