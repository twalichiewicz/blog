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
			const blogList = document.querySelector('.blog-list');
			const portfolioList = document.querySelector('.portfolio-list');

			if (postsContent && projectsContent) {
				postsContent.style.display = 'block';
				projectsContent.style.display = 'block';
			}

			// Move projectsContent to its own container if needed
			if (projectsContent && portfolioList && !portfolioList.contains(projectsContent)) {
				portfolioList.appendChild(projectsContent);
			}

			// Hide mobile tabs
			const mobileTabs = document.querySelector('.mobile-tabs');
			if (mobileTabs) {
				mobileTabs.style.display = 'none';
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
			const mobileTabs = document.querySelector('.mobile-tabs');

			// Ensure mobile tabs are visible
			if (mobileTabs) {
				mobileTabs.style.display = 'flex';
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
			const mobileTabs = document.querySelector('.mobile-tabs');
			if (mobileTabs) {
				mobileTabs.style.display = 'flex';
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
				}, 100);
			});

			// Listen for resize events
			let resizeTimeout;
			window.addEventListener('resize', () => {
				if (resizeTimeout) {
					clearTimeout(resizeTimeout);
				}
				resizeTimeout = setTimeout(() => {
					this.setupDeviceSpecificBehavior();
				}, 250);
			});
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
	const mobileTabs = document.querySelector('.mobile-tabs');
	if (mobileTabs) {
		mobileTabs.style.display = 'flex';
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
	const mobileTabs = document.querySelector('.mobile-tabs');
	if (mobileTabs) {
		mobileTabs.style.display = 'flex';
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

	if (postsContent && projectsContent) {
		postsContent.style.display = 'block';
		projectsContent.style.display = 'block';
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