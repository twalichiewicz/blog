/**
 * Responsive UI JavaScript
 * Handles responsive behavior for the San Diego theme
 */
(function () {
	'use strict';

	// Initialize responsive features when DOM is loaded
	document.addEventListener('DOMContentLoaded', function () {
		initResponsiveFeatures();
	});

	/**
	 * Initialize responsive UI features
	 */
	function initResponsiveFeatures() {
		// Handle viewport changes
		const handleViewportChange = () => {
			const isMobile = window.innerWidth < 768;
			document.body.classList.toggle('is-mobile', isMobile);
			document.body.classList.toggle('is-desktop', !isMobile);
		};

		// Listen for resize events
		window.addEventListener('resize', handleViewportChange);

		// Initial call
		handleViewportChange();
	}
})();
