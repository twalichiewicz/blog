/**
 * Responsive UI Behavior
 * 
 * This script handles device-specific UI behavior for different screen sizes and orientations.
 * It works in conjunction with the device-detection.js script.
 */

document.addEventListener('DOMContentLoaded', function () {
	const ResponsiveUI = {
		/**
		 * Initialize responsive UI behavior
		 */
		init: function () {
			this.setupDeviceSpecificBehavior();
			this.setupEventListeners();
		},

		/**
		 * Set up device-specific behavior based on detected device
		 */
		setupDeviceSpecificBehavior: function () {
			const body = document.body;

			// Desktop behavior
			if (body.classList.contains('device-desktop')) {
				this.setupDesktopBehavior();
			}

			// Tablet behavior
			if (body.classList.contains('device-tablet')) {
				this.setupTabletBehavior();
			}

			// Mobile behavior
			if (body.classList.contains('device-mobile')) {
				this.setupMobileBehavior();
			}
		},

		/**
		 * Set up desktop-specific behavior
		 */
		setupDesktopBehavior: function () {
			// Show both posts and projects side by side
			const postsContent = document.getElementById('postsContent');
			const projectsContent = document.getElementById('projectsContent');
			const contentWrapper = document.querySelector('.content-wrapper');
			const blogList = document.querySelector('.blog-list');
			const portfolioList = document.querySelector('.portfolio-list');

			// Configure content wrapper for desktop layout
			if (contentWrapper) {
				contentWrapper.style.flexDirection = 'row';
				contentWrapper.style.justifyContent = 'center';
				contentWrapper.style.gap = '48px'; // Using the space-xl variable value
				contentWrapper.style.height = '100%';
				contentWrapper.style.overflow = 'hidden';
			}

			if (postsContent && projectsContent) {
				// Apply smooth transitions
				postsContent.style.transition = 'opacity 0.15s ease-in-out';
				projectsContent.style.transition = 'opacity 0.15s ease-in-out';
				postsContent.style.opacity = '1';
				projectsContent.style.opacity = '1';
				postsContent.style.display = 'block';
				projectsContent.style.display = 'block';

				// Ensure proper column styling
				postsContent.style.flex = '1';
				projectsContent.style.flex = '1';
				postsContent.style.height = '100%';
				projectsContent.style.height = '100%';
				postsContent.style.overflowY = 'auto';
				projectsContent.style.overflowY = 'auto';
				postsContent.style.maxWidth = '600px';
				projectsContent.style.maxWidth = '600px';
			}

			// Move projectsContent to its own container if needed
			if (projectsContent && portfolioList && !portfolioList.contains(projectsContent)) {
				portfolioList.appendChild(projectsContent);
			}

			// Hide mobile tabs
			const tabsWrapper = document.querySelector('.tabs-wrapper');
			if (tabsWrapper) {
				tabsWrapper.style.display = 'none';
			}

			// Enable book view
			const listModeBtn = document.getElementById('listModeBtn');
			const bookModeBtn = document.getElementById('bookModeBtn');

			if (listModeBtn && bookModeBtn) {
				listModeBtn.style.display = 'inline-block';
				bookModeBtn.style.display = 'inline-block';
			}
		},

		/**
		 * Set up tablet-specific behavior
		 */
		setupTabletBehavior: function () {
			const isLandscape = document.body.classList.contains('orientation-landscape');
			const tabsWrapper = document.querySelector('.tabs-wrapper');

			// Ensure mobile tabs are visible
			if (tabsWrapper) {
				tabsWrapper.style.display = 'block';
			}

			// Note: Tab visibility and switching is handled by mobile-tabs.js

			// Enable book view only in landscape
			const bookModeBtn = document.getElementById('bookModeBtn');
			if (bookModeBtn) {
				bookModeBtn.style.display = isLandscape ? 'inline-block' : 'none';
			}
		},

		/**
		 * Set up mobile-specific behavior
		 */
		setupMobileBehavior: function () {
			// Hide book view option
			const bookModeBtn = document.getElementById('bookModeBtn');
			if (bookModeBtn) {
				bookModeBtn.style.display = 'none';
			}

			// Ensure tabs are visible
			const tabsWrapper = document.querySelector('.tabs-wrapper');
			if (tabsWrapper) {
				tabsWrapper.style.display = 'block';
			}

			// Adjust post list for better mobile reading
			const postListItems = document.querySelectorAll('.post-list-item');
			postListItems.forEach(item => {
				item.classList.add('mobile-optimized');
			});
		},

		/**
		 * Set up event listeners for responsive behavior
		 */
		setupEventListeners: function () {
			// Listen for orientation changes
			window.addEventListener('orientationchange', () => {
				setTimeout(() => {
					this.setupDeviceSpecificBehavior();
				}, 100); // Reduced from 100ms for faster response
			});

			// Listen for resize events
			let resizeTimeout;
			let lastDeviceType = this.getCurrentDeviceType();

			window.addEventListener('resize', () => {
				// Check for device type change immediately
				const currentDeviceType = this.getCurrentDeviceType();
				if (currentDeviceType !== lastDeviceType) {
					// Device type changed, update immediately
					lastDeviceType = currentDeviceType;

					// Force tablet behavior when transitioning from desktop to tablet
					if (lastDeviceType === 'desktop' && currentDeviceType === 'tablet') {
						const tabsWrapper = document.querySelector('.tabs-wrapper');
						if (tabsWrapper) {
							tabsWrapper.style.display = 'block';

							// Force the active tab to be shown
							const tabContainer = document.querySelector('.mobile-tabs');
							if (tabContainer) {
								const activeTab = tabContainer.getAttribute('data-active-tab') || 'blog';
								const activeButton = tabContainer.querySelector(`.tab-button[data-type="${activeTab}"]`);

								if (activeButton) {
									// Simulate a click on the active tab button
									setTimeout(() => {
										activeButton.click();
									}, 50);
								}
							}
						}
					}

					this.setupDeviceSpecificBehavior();
				}

				if (resizeTimeout) {
					clearTimeout(resizeTimeout);
				}

				// Still use a short debounce for fine-tuning
				resizeTimeout = setTimeout(() => {
					this.setupDeviceSpecificBehavior();

					// Double-check tablet behavior after resize completes
					if (this.getCurrentDeviceType() === 'tablet') {
						const tabsWrapper = document.querySelector('.tabs-wrapper');
						if (tabsWrapper && tabsWrapper.style.display !== 'block') {
							tabsWrapper.style.display = 'block';
						}
					}
				}, 100); // Reduced from 250ms to 100ms for faster response
			});
		},

		/**
		 * Get current device type based on window width
		 */
		getCurrentDeviceType: function () {
			const width = window.innerWidth;
			if (width >= 1024) return 'desktop';
			if (width >= 768) return 'tablet';
			return 'mobile';
		}
	};

	// Initialize responsive UI behavior
	ResponsiveUI.init();

	// Make available globally
	window.ResponsiveUI = ResponsiveUI;
});

// Helper functions for device detection
function updateOrientation() {
	const isLandscape = window.innerWidth > window.innerHeight;
	document.body.classList.toggle('orientation-landscape', isLandscape);
	document.body.classList.toggle('orientation-portrait', !isLandscape);
}

function initMobileLayout() {
	// Skip if already initialized
	if (document.body.classList.contains('device-mobile')) {
		return;
	}

	// Add mobile device class
	document.body.classList.add('device-mobile');
	document.body.classList.remove('device-tablet', 'device-desktop');

	// Set orientation class
	updateOrientation();

	// Mobile layout specific adjustments
	const tabsWrapper = document.querySelector('.tabs-wrapper');
	if (tabsWrapper) {
		tabsWrapper.style.display = 'block';
	}
}

function initTabletLayout() {
	// Skip if already initialized
	if (document.body.classList.contains('device-tablet')) {
		return;
	}

	// Add tablet device class
	document.body.classList.add('device-tablet');
	document.body.classList.remove('device-mobile', 'device-desktop');

	// Set orientation class
	updateOrientation();

	// Tablet layout specific adjustments
	const tabsWrapper = document.querySelector('.tabs-wrapper');
	if (tabsWrapper) {
		tabsWrapper.style.display = 'block';
	}

	// Note: We don't set content visibility here - mobile-tabs.js will handle it
	// This prevents the bug where both sections are visible when resizing from desktop to tablet
}

function initDesktopLayout() {
	// Skip if already initialized
	if (document.body.classList.contains('device-desktop')) {
		return;
	}

	// Add desktop device class
	document.body.classList.add('device-desktop');
	document.body.classList.remove('device-mobile', 'device-tablet');

	// Set orientation class
	updateOrientation();

	// Desktop layout specific adjustments
	const postsContent = document.getElementById('postsContent');
	const projectsContent = document.getElementById('projectsContent');
	const contentWrapper = document.querySelector('.content-wrapper');

	if (postsContent && projectsContent) {
		// Ensure content wrapper has proper desktop styling
		if (contentWrapper) {
			contentWrapper.style.flexDirection = 'row';
			contentWrapper.style.justifyContent = 'center';
			contentWrapper.style.height = '100%';
			contentWrapper.style.overflow = 'hidden';
		}

		// Apply smooth transitions
		postsContent.style.transition = 'opacity 0.15s ease-in-out';
		projectsContent.style.transition = 'opacity 0.15s ease-in-out';

		// Ensure both columns are visible
		postsContent.style.opacity = '1';
		projectsContent.style.opacity = '1';
		postsContent.style.display = 'block';
		projectsContent.style.display = 'block';

		// Ensure proper column styling
		postsContent.style.flex = '1';
		projectsContent.style.flex = '1';
		postsContent.style.height = '100%';
		projectsContent.style.height = '100%';
		postsContent.style.overflowY = 'auto';
		projectsContent.style.overflowY = 'auto';
	}

	// Hide tabs wrapper on desktop
	const tabsWrapper = document.querySelector('.tabs-wrapper');
	if (tabsWrapper) {
		tabsWrapper.style.display = 'none';
	}
}

function handleDeviceChange() {
	const width = window.innerWidth;
	const height = window.innerHeight;

	// Determine device type based on screen size
	if (width < 768) {
		initMobileLayout();
	} else if (width < 1024 || (width < 1366 && height < 1024)) {
		initTabletLayout();
	} else {
		initDesktopLayout();
	}

	// Update orientation class
	updateOrientation();
} 