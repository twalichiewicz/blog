/**
 * Device Detection and Responsive Behavior
 * 
 * This script handles device detection and applies appropriate classes to the body
 * for device-specific styling and behavior.
 */

document.addEventListener('DOMContentLoaded', function () {
	const DeviceDetection = {
		// Breakpoints matching our SCSS definitions
		breakpoints: {
			mobile: {
				max: 767
			},
			tablet: {
				min: 768,
				max: 1199
			},
			desktop: {
				min: 1200
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

			// Remove existing device classes
			body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');

			// Add appropriate device class
			if (width <= this.breakpoints.mobile.max) {
				body.classList.add('device-mobile');
			} else if (width >= this.breakpoints.tablet.min && width <= this.breakpoints.tablet.max) {
				body.classList.add('device-tablet');
			} else {
				body.classList.add('device-desktop');
			}

			// Detect specific devices
			if (width >= 1024 && width <= 1366 &&
				(navigator.userAgent.includes('iPad') ||
					(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))) {
				body.classList.add('device-ipad-pro');
			}
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
				if (resizeTimeout) {
					clearTimeout(resizeTimeout);
				}
				resizeTimeout = setTimeout(() => {
					this.detectDevice();
					this.detectOrientation();
				}, 250);
			});

			// Orientation change handler
			window.addEventListener('orientationchange', () => {
				setTimeout(() => {
					this.detectOrientation();
				}, 100);
			});
		}
	};

	// Initialize device detection
	DeviceDetection.init();

	// Make available globally
	window.DeviceDetection = DeviceDetection;
}); 