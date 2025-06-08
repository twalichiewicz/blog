/**
 * Device Detection and Responsive Behavior
 * 
 * Simplified device detection - mobile vs tablet only
 */

// Run device detection immediately to ensure device classes are set before DOM is fully loaded
(function () {
	const width = window.innerWidth;
	const body = document.body;

	// Add appropriate device class (mobile or tablet only)
	if (width <= 767) {
		body.classList.add('device-mobile');
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
		// Mobile breakpoint
		mobileBreakpoint: 767,

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
			body.classList.remove('device-mobile', 'device-tablet');

			// Add appropriate device class (mobile or tablet only)
			if (width <= this.mobileBreakpoint) {
				body.classList.add('device-mobile');
			} else {
				body.classList.add('device-tablet');
			}

			// Return whether device type changed
			return currentDeviceType !== this.getCurrentDeviceType();
		},

		/**
		 * Get current device type based on body classes
		 */
		getCurrentDeviceType: function () {
			const body = document.body;
			if (body.classList.contains('device-tablet')) return 'tablet';
			if (body.classList.contains('device-mobile')) return 'mobile';

			// Fallback based on width if classes not set yet
			const width = window.innerWidth;
			return width > this.mobileBreakpoint ? 'tablet' : 'mobile';
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

				// Use a 100ms timeout for responsive behavior
				resizeTimeout = setTimeout(() => {
					this.detectDevice();
					this.detectOrientation();
				}, 100);
			});

			// Orientation change handler
			window.addEventListener('orientationchange', () => {
				setTimeout(() => {
					this.detectOrientation();
				}, 50);
			});
		}
	};

	// Initialize device detection
	DeviceDetection.init();

	// Make available globally
	window.DeviceDetection = DeviceDetection;
}); 