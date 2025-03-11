/**
 * Mobile Tabs - Unified tab handling solution
 * This file handles all tab switching functionality and ensures consistent state
 * across window resizing and device orientation changes.
 */

document.addEventListener('DOMContentLoaded', function () {
	// Cache DOM elements
	const tabsWrapper = document.querySelector('.tabs-wrapper');
	const tabContainer = document.querySelector('.mobile-tabs');
	if (!tabContainer) return; // Exit if no tab container exists

	const tabButtons = document.querySelectorAll('.tab-button');
	const postsContent = document.getElementById('postsContent');
	const projectsContent = document.getElementById('projectsContent');
	const searchBar = document.querySelector('.search-bar');

	// Track the last manually selected tab
	let userSelectedTab = null;

	// Function to ensure only one tab is active and return the active tab type
	function validateActiveState() {
		// Count active tabs
		let activeCount = 0;
		let lastActiveButton = null;

		tabButtons.forEach(button => {
			if (button.classList.contains('active')) {
				activeCount++;
				lastActiveButton = button;
			}
		});

		// If no tabs are active, activate the blog tab by default
		// or the last user-selected tab if available
		if (activeCount === 0) {
			const defaultTab = userSelectedTab || 'blog';
			const defaultButton = Array.from(tabButtons).find(btn => btn.dataset.type === defaultTab);

			if (defaultButton) {
				defaultButton.classList.add('active');
				defaultButton.setAttribute('aria-selected', 'true');
				tabContainer.setAttribute('data-active-tab', defaultTab);
				showContent(defaultTab);
				return defaultTab;
			}
		}

		// If multiple tabs are active, keep only the last one active
		if (activeCount > 1) {
			tabButtons.forEach(button => {
				button.classList.remove('active');
				button.setAttribute('aria-selected', 'false');
			});

			if (lastActiveButton) {
				lastActiveButton.classList.add('active');
				lastActiveButton.setAttribute('aria-selected', 'true');
				const type = lastActiveButton.dataset.type;
				tabContainer.setAttribute('data-active-tab', type);
				showContent(type);
				return type;
			}
		}

		return tabContainer.getAttribute('data-active-tab') || 'blog';
	}

	// Function to show the appropriate content based on tab type
	function showContent(type) {
		if (!postsContent || !projectsContent) return;

		// Only apply content changes on mobile/tablet
		if (document.body.classList.contains('device-desktop')) {
			// On desktop, both sections are visible
			postsContent.style.display = 'block';
			projectsContent.style.display = 'block';
			if (searchBar) searchBar.style.display = 'block';

			// Hide tabs wrapper on desktop
			if (tabsWrapper) tabsWrapper.style.display = 'none';
			return;
		} else {
			// Show tabs wrapper on mobile/tablet
			if (tabsWrapper) tabsWrapper.style.display = 'block';
		}

		// On mobile/tablet, show only the active tab
		if (type === 'blog') {
			postsContent.style.display = 'block';
			projectsContent.style.display = 'none';
			if (searchBar) searchBar.style.display = 'block';
		} else if (type === 'portfolio') {
			postsContent.style.display = 'none';
			projectsContent.style.display = 'block';
			if (searchBar) searchBar.style.display = 'none';
		}
	}

	// Function to switch tabs
	function switchTab(type, isUserAction = false) {
		if (isUserAction) {
			userSelectedTab = type; // Remember user's choice
		}

		// Remove active class from all buttons
		tabButtons.forEach(btn => {
			btn.classList.remove('active');
			btn.setAttribute('aria-selected', 'false');
		});

		// Add active class to the selected button
		const activeButton = Array.from(tabButtons).find(btn => btn.dataset.type === type);
		if (activeButton) {
			activeButton.classList.add('active');
			activeButton.setAttribute('aria-selected', 'true');
		}

		// Update the data attribute
		tabContainer.setAttribute('data-active-tab', type);

		// Show the appropriate content
		showContent(type);
	}

	// Set initial state
	const initialTab = validateActiveState();
	showContent(initialTab);

	// Add click handlers for tab buttons
	tabButtons.forEach(button => {
		button.addEventListener('click', () => {
			const type = button.dataset.type;
			switchTab(type, true); // true indicates this is a user action
		});
	});

	// Handle window resize events
	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			handleDeviceChange();
		}, 250); // Debounce resize events
	});

	// Function to handle device changes (desktop/tablet/mobile)
	function handleDeviceChange() {
		const wasDesktop = document.body.classList.contains('device-desktop');
		const isDesktop = window.innerWidth >= 1024;
		const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
		const isMobile = window.innerWidth < 768;

		// If transitioning from desktop to tablet/mobile, immediately apply tab visibility
		if (wasDesktop && (isTablet || isMobile)) {
			// Get the current active tab or default to 'blog'
			const activeTab = tabContainer.getAttribute('data-active-tab') || userSelectedTab || 'blog';

			// Force the correct tab to be shown
			switchTab(activeTab);
		} else if (isDesktop) {
			// On desktop, show both sections
			if (postsContent) postsContent.style.display = 'block';
			if (projectsContent) projectsContent.style.display = 'block';

			// Hide tabs wrapper on desktop
			if (tabsWrapper) tabsWrapper.style.display = 'none';
		} else {
			// On mobile/tablet, validate and apply the current tab state
			const currentTab = validateActiveState();
			showContent(currentTab);

			// Show tabs wrapper on mobile/tablet
			if (tabsWrapper) tabsWrapper.style.display = 'block';
		}
	}

	// Initial device check
	handleDeviceChange();

	// Handle device orientation changes
	window.addEventListener('orientationchange', () => {
		setTimeout(() => {
			validateActiveState();
			handleDeviceChange();
		}, 300); // Wait for orientation change to complete
	});

	// Listen for device class changes from other scripts
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.attributeName === 'class') {
				// If device class changed, update tab visibility
				if (mutation.target === document.body) {
					handleDeviceChange();
				}
			}
		});
	});

	// Start observing the body element for class changes
	observer.observe(document.body, { attributes: true });

	// Periodically check for tab state consistency (handles edge cases)
	// This is a safety measure to ensure the UI stays consistent
	const consistencyInterval = setInterval(() => {
		validateActiveState();

		// Check if we're on tablet/mobile and both sections are visible (bug case)
		if (!document.body.classList.contains('device-desktop')) {
			if (postsContent && projectsContent &&
				postsContent.style.display === 'block' &&
				projectsContent.style.display === 'block') {
				// Fix the bug by forcing the active tab
				const activeTab = tabContainer.getAttribute('data-active-tab') || userSelectedTab || 'blog';
				showContent(activeTab);
			}
		}
	}, 2000);

	// Clean up interval when page is unloaded
	window.addEventListener('beforeunload', () => {
		clearInterval(consistencyInterval);
		observer.disconnect();
	});
});