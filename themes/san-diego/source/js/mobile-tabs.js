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
	// Track current device type to detect changes
	let currentDeviceType = '';

	// Function to update the slider width and position based on active button
	function updateSlider() {
		if (!tabContainer || tabButtons.length < 2) return;

		const activeButton = tabContainer.querySelector('.tab-button.active');
		if (!activeButton) return;

		// Get the active button's width and position
		const buttonWidth = activeButton.offsetWidth;
		const buttonIndex = Array.from(tabButtons).indexOf(activeButton);

		// Get the container's padding and gap
		const containerStyle = window.getComputedStyle(tabContainer);
		const containerPadding = parseInt(containerStyle.paddingLeft) || 4; // Default to 4px if not set
		const gap = parseInt(containerStyle.gap) || 4; // Default to 4px if not set

		// Get the container's width for calculations
		const containerWidth = tabContainer.offsetWidth;

		// Calculate the exact position of the active button relative to the container
		let position = containerPadding;

		// If it's the second button, add the width of the first button plus the gap
		if (buttonIndex === 1) {
			position += tabButtons[0].offsetWidth + gap;
		}

		// Calculate the adjusted width to ensure it doesn't extend beyond the container
		let adjustedWidth;

		if (buttonIndex === 0) {
			// For the first button
			adjustedWidth = buttonWidth - containerPadding;
		} else {
			// For the second button, ensure it doesn't extend beyond the container
			const rightEdge = position + buttonWidth;
			const maxRightPosition = containerWidth - containerPadding;

			if (rightEdge > maxRightPosition) {
				// If it would extend beyond the container, adjust the width
				adjustedWidth = maxRightPosition - position;
			} else {
				adjustedWidth = buttonWidth;
			}
		}

		// Ensure the width is never negative
		adjustedWidth = Math.max(adjustedWidth, 0);

		// Set the width and position
		tabContainer.style.setProperty('--button-width', `${adjustedWidth}px`);
		tabContainer.style.setProperty('--slider-x', `${position}px`);
	}

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
				updateSlider(); // Update slider after changing active tab
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
				updateSlider(); // Update slider after changing active tab
				return type;
			}
		}

		return tabContainer.getAttribute('data-active-tab') || 'blog';
	}

	// Function to show the appropriate content based on tab type
	function showContent(type) {
		if (!postsContent || !projectsContent) return;

		// Apply CSS transitions for smoother content changes
		postsContent.style.transition = 'opacity 0.15s ease-in-out';
		projectsContent.style.transition = 'opacity 0.15s ease-in-out';

		// Only apply content changes on mobile/tablet
		if (document.body.classList.contains('device-desktop')) {
			// On desktop, both sections are visible
			postsContent.style.opacity = '1';
			projectsContent.style.opacity = '1';
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
			postsContent.style.opacity = '1';
			projectsContent.style.opacity = '0';

			// Use setTimeout to prevent content flashing
			setTimeout(() => {
				postsContent.style.display = 'block';
				projectsContent.style.display = 'none';
			}, 150);

			if (searchBar) searchBar.style.display = 'block';
		} else if (type === 'portfolio') {
			postsContent.style.opacity = '0';
			projectsContent.style.opacity = '1';

			// Use setTimeout to prevent content flashing
			setTimeout(() => {
				postsContent.style.display = 'none';
				projectsContent.style.display = 'block';
			}, 150);

			if (searchBar) searchBar.style.display = 'none';
		}
	}

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

		// Update the slider position and width
		updateSlider();

		// Show the appropriate content
		showContent(type);
	}

	// Set initial state
	const initialTab = validateActiveState();
	showContent(initialTab);
	updateSlider(); // Initialize slider position and width

	// Update slider after a short delay to ensure fonts are loaded
	setTimeout(updateSlider, 100);

	// Update slider when fonts are loaded (if the browser supports the fonts API)
	if (document.fonts && document.fonts.ready) {
		document.fonts.ready.then(() => {
			updateSlider();
		});
	}

	// Use ResizeObserver to monitor container size changes
	if (window.ResizeObserver) {
		const resizeObserver = new ResizeObserver(() => {
			updateSlider();
		});
		resizeObserver.observe(tabContainer);

		// Also observe each button for size changes
		tabButtons.forEach(button => {
			resizeObserver.observe(button);
		});
	}

	// Add click handlers for tab buttons
	tabButtons.forEach(button => {
		button.addEventListener('click', () => {
			const type = button.dataset.type;
			switchTab(type, true); // true indicates this is a user action
		});
	});

	// Handle window resize events - reduce debounce time for more responsive feel
	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);

		// Immediately detect device type change for faster response
		const newDeviceType = getDeviceType();
		if (newDeviceType !== currentDeviceType) {
			// Device type changed, update immediately
			currentDeviceType = newDeviceType;
			handleDeviceChange(true);
		}

		// Update slider on resize
		updateSlider();

		// Still use a short debounce for fine-tuning
		resizeTimer = setTimeout(() => {
			handleDeviceChange(false);
			updateSlider(); // Update slider again after resize completes
		}, 100); // Reduced from 250ms to 100ms for faster response
	});

	// Helper function to get current device type
	function getDeviceType() {
		const width = window.innerWidth;
		if (width >= 1024) return 'desktop';
		if (width >= 768) return 'tablet';
		return 'mobile';
	}

	// Function to handle device changes (desktop/tablet/mobile)
	function handleDeviceChange(isDeviceTypeChange = false) {
		const wasDesktop = document.body.classList.contains('device-desktop');
		const isDesktop = window.innerWidth >= 1024;
		const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
		const isMobile = window.innerWidth < 768;

		// Update current device type
		currentDeviceType = getDeviceType();

		// If transitioning from desktop to tablet/mobile, immediately apply tab visibility
		if ((wasDesktop && (isTablet || isMobile)) || isDeviceTypeChange) {
			// Get the current active tab or default to 'blog'
			const activeTab = tabContainer.getAttribute('data-active-tab') || userSelectedTab || 'blog';

			// Force the correct tab to be shown
			switchTab(activeTab);
		} else if (isDesktop) {
			// On desktop, show both sections with a smooth transition
			if (postsContent) {
				postsContent.style.opacity = '1';
				postsContent.style.display = 'block';
			}
			if (projectsContent) {
				projectsContent.style.opacity = '1';
				projectsContent.style.display = 'block';
			}

			// Hide tabs wrapper on desktop
			if (tabsWrapper) tabsWrapper.style.display = 'none';
		} else {
			// On mobile/tablet, validate and apply the current tab state
			const currentTab = validateActiveState();
			showContent(currentTab);
			updateSlider(); // Update slider after device change

			// Show tabs wrapper on mobile/tablet
			if (tabsWrapper) tabsWrapper.style.display = 'block';
		}
	}

	// Initial device check
	currentDeviceType = getDeviceType();
	handleDeviceChange(true);

	// Handle device orientation changes
	window.addEventListener('orientationchange', () => {
		// Apply changes more quickly after orientation change
		setTimeout(() => {
			validateActiveState();
			handleDeviceChange(true);
			updateSlider(); // Update slider after orientation change
		}, 150); // Reduced from 300ms to 150ms
	});

	// Listen for device class changes from other scripts
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.attributeName === 'class') {
				// If device class changed, update tab visibility
				if (mutation.target === document.body) {
					handleDeviceChange(true);
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
		updateSlider(); // Periodically update slider to ensure it stays aligned

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