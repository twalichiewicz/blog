/**
 * Mobile Tabs Component
 * A unified tab handling solution for mobile devices
 */
export default class MobileTabs {
	/**
	 * Constructor
	 * @param {Object} options - Configuration options
	 */
	constructor(options = {}) {
		// Default configuration
		this.config = {
			tabsWrapperSelector: '.tabs-wrapper',
			tabContainerSelector: '.mobile-tabs',
			tabButtonSelector: '.tab-button',
			postsContentId: 'postsContent',
			projectsContentId: 'projectsContent',
			searchBarSelector: '.search-bar',
			activeClass: 'active',
			transitionDuration: 150,
			...options
		};

		// Store bound listeners for removal
		this.boundListeners = {
			handleTabClick: null,
			handleResize: null,
			handleOrientationChange: null
		};
		this.tabClickListeners = new Map(); // Store individual tab click listeners

		// Initialize state
		this.userSelectedTab = null;
		this.currentDeviceType = '';

		// Cache DOM elements
		this.cacheElements();

		// Exit if no tab container
		if (!this.tabContainer) return;

		// Set up event listeners
		this.setupEventListeners();

		// Initialize based on current device type
		this.currentDeviceType = this.getDeviceType();
		this.handleDeviceChange(true);

		// Initialize desktop view if needed
		this.initializeDesktopView();

		// Initialize the slider
		this.initializeSlider();

		// Validate active state to ensure UI consistency
		this.validateActiveState();
	}

	/**
	 * Cache DOM elements for better performance
	 */
	cacheElements() {
		this.tabsWrapper = document.querySelector(this.config.tabsWrapperSelector);
		this.tabContainer = document.querySelector(this.config.tabContainerSelector);

		if (!this.tabContainer) return;

		this.tabButtons = document.querySelectorAll(this.config.tabButtonSelector);
		this.postsContent = document.getElementById(this.config.postsContentId);
		this.projectsContent = document.getElementById(this.config.projectsContentId);
		this.searchBar = document.querySelector(this.config.searchBarSelector);
	}

	/**
	 * Set up event listeners
	 */
	setupEventListeners() {
		// Ensure previous listeners are removed before adding new ones
		this.removeEventListeners();

		// Create bound versions of handlers
		this.boundListeners.handleResize = this.handleResize.bind(this);
		this.boundListeners.handleOrientationChange = this.handleDeviceChange.bind(this);

		// Tab button click events
		this.tabButtons.forEach(button => {
			// Create a unique bound handler for each button to manage individually if needed,
			// or use a shared one if parameters aren't button-specific.
			// Here, we use a shared handler factory approach.
			const handler = (e) => {
				const type = e.currentTarget.dataset.type;
				this.switchTab(type, true);
			};
			this.tabClickListeners.set(button, handler); // Store handler associated with button
			button.addEventListener('click', handler);
		});

		// Window resize event
		window.addEventListener('resize', this.boundListeners.handleResize);

		// Device orientation change
		window.addEventListener('orientationchange', this.boundListeners.handleOrientationChange);
	}

	/**
	 * Remove all event listeners added by this instance.
	 */
	removeEventListeners() {
		// Remove tab button listeners
		this.tabClickListeners.forEach((handler, button) => {
			button.removeEventListener('click', handler);
		});
		this.tabClickListeners.clear(); // Clear the map after removing

		// Remove window listeners
		if (this.boundListeners.handleResize) {
			window.removeEventListener('resize', this.boundListeners.handleResize);
		}
		if (this.boundListeners.handleOrientationChange) {
			window.removeEventListener('orientationchange', this.boundListeners.handleOrientationChange);
		}
	}

	/**
	 * Destroy the component instance, removing listeners.
	 */
	destroy() {
		this.removeEventListeners();
		// Optional: Add any other cleanup logic here (e.g., removing added elements)
		const slider = this.tabContainer?.querySelector('.mobile-tabs-slider');
		if (slider) {
			// slider.remove(); // Decide if the slider element should be removed on destroy
		}
		this.tabContainer?.classList.remove('has-slider-element');
	}

	/**
	 * Initialize desktop view
	 */
	initializeDesktopView() {
		if (this.currentDeviceType === 'desktop') {
			// On desktop, both sections should be visible
			if (this.postsContent && this.projectsContent) {
				this.postsContent.style.opacity = '1';
				this.projectsContent.style.opacity = '1';
				this.postsContent.style.display = 'block';
				this.projectsContent.style.display = 'block';

				// Add desktop content rendering check with delay to allow for layout
				setTimeout(() => {
					this.checkDesktopContentRendering();
				}, 1000);
			}

			// Hide tabs wrapper on desktop
			if (this.tabsWrapper) {
				this.tabsWrapper.style.display = 'none';
			}
		}
	}

	/**
 * Check if desktop content is rendering properly and log debugging info
 */
	checkDesktopContentRendering() {
		if (this.currentDeviceType !== 'desktop') return;

		const postsItems = this.postsContent?.querySelectorAll('.post-list-item') || [];
		const projectItems = this.projectsContent?.querySelectorAll('.portfolio-item') || [];

		// Desktop content validation complete

		// Check for empty content areas that should have items
		if (postsItems.length === 0 && this.postsContent) {
			// Posts content appears empty on desktop - attempting recovery
			// Try to force re-render
			this.postsContent.style.display = 'none';
			setTimeout(() => {
				this.postsContent.style.display = 'block';
			}, 100);
		}
		if (projectItems.length === 0 && this.projectsContent) {
			// Projects content appears empty on desktop - attempting recovery
			// Try to force re-render
			this.projectsContent.style.display = 'none';
			setTimeout(() => {
				this.projectsContent.style.display = 'block';
			}, 100);
		}
	}

	/**
	 * Initialize the slider element for tab indicators
	 */
	initializeSlider() {
		if (!this.tabContainer || this.tabButtons.length < 2) return;

		// Get the slider element directly
		let slider = this.tabContainer.querySelector('.mobile-tabs-slider');

		// If slider doesn't exist, create it
		if (!slider) {
			// Slider element not found, creating it.
			slider = document.createElement('div');
			slider.className = 'mobile-tabs-slider';
			this.tabContainer.appendChild(slider);
		}

		// Ensure the class to hide the ::after pseudo-element is present
		// regardless of whether the slider was found or created.
		this.tabContainer.classList.add('has-slider-element');

		// Position the slider initially
		// setTimeout(() => this.updateSlider(), 10);
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				this.updateSlider();
			});
		});
	}

	/**
	 * Update the slider width and position based on active button
	 */
	updateSlider() {
		if (!this.tabContainer || this.tabButtons.length < 2) return;

		const activeButton = this.tabContainer.querySelector(
			`${this.config.tabButtonSelector}.${this.config.activeClass}`
		);

		if (!activeButton) return;

		// Get the slider element
		const slider = this.tabContainer.querySelector('.mobile-tabs-slider');
		if (!slider) return;

		try {
			// Get the active button's position and dimensions
			const buttonRect = activeButton.getBoundingClientRect();
			const containerRect = this.tabContainer.getBoundingClientRect();

			// Get computed styles to account for potential padding differences
			const containerStyle = window.getComputedStyle(this.tabContainer);
			const containerPadding = parseFloat(containerStyle.paddingLeft) || 4;

			// Calculate position relative to container, accounting for padding
			const left = buttonRect.left - containerRect.left;
			const width = buttonRect.width;

			// Apply the position and dimensions directly to the slider element
			slider.style.width = `${width}px`;
			slider.style.transform = `translateX(${left}px)`;

			// Also update the top position to account for potential padding differences
			slider.style.top = `${containerPadding}px`;
			slider.style.height = `calc(100% - ${containerPadding * 2}px)`;
		} catch (error) {
			// Error updating slider
		}
	}

	/**
	 * Ensure only one tab is active and return the active tab type
	 * @returns {string} The active tab type
	 */
	validateActiveState() {
		let activeButtons = [];
		this.tabButtons.forEach(button => {
			if (button.classList.contains(this.config.activeClass)) {
				activeButtons.push(button);
			}
		});

		let targetTabType = this.userSelectedTab; // Prioritize user's last explicit selection

		// If a user selection exists and the UI matches it, we're good.
		if (targetTabType && activeButtons.length === 1 && activeButtons[0].dataset.type === targetTabType) {
			this.showContent(targetTabType); // Ensure content is consistent
			this.updateSlider();
			return targetTabType;
		}

		// If UI is inconsistent or no user selection yet, reset and apply a sensible default.
		this.tabButtons.forEach(button => {
			button.classList.remove(this.config.activeClass);
			button.setAttribute('aria-selected', 'false');
		});

		if (!targetTabType && this.tabContainer.dataset.activeTab) {
			// Fallback to data-active-tab if no user selection (e.g. from previous state or HTML)
			targetTabType = this.tabContainer.dataset.activeTab;
		} else if (!targetTabType) {
			// Check URL parameter first
			const urlParams = new URLSearchParams(window.location.search);
			const tabParam = urlParams.get('tab');
			
			if (tabParam && (tabParam === 'portfolio' || tabParam === 'blog')) {
				targetTabType = tabParam;
				// Using URL parameter tab
			} else {
				// Fallback to referrer check
				const referrer = document.referrer;
				const isFromProject = referrer && (
					referrer.includes('/20') && // matches year-based URLs like /2023/01/01/project-name
					!referrer.includes('#') && // not an anchor link
					referrer !== window.location.href // not the same page
				);
				
				// Referrer detection complete
				
				// If coming from a project, default to 'portfolio', otherwise 'blog'
				targetTabType = isFromProject ? 'portfolio' : 'blog';
				// Setting default tab
			}
		}

		const targetButton = Array.from(this.tabButtons).find(
			btn => btn.dataset.type === targetTabType
		);

		if (targetButton) {
			targetButton.classList.add(this.config.activeClass);
			targetButton.setAttribute('aria-selected', 'true');
			this.tabContainer.setAttribute('data-active-tab', targetTabType);
			this.showContent(targetTabType);
			this.updateSlider();
			return targetTabType;
		} else if (this.tabButtons.length > 0) {
			// Absolute fallback: if targetButton somehow not found, activate the first available tab.
			const firstButton = this.tabButtons[0];
			targetTabType = firstButton.dataset.type;
			firstButton.classList.add(this.config.activeClass);
			firstButton.setAttribute('aria-selected', 'true');
			this.tabContainer.setAttribute('data-active-tab', targetTabType);
			this.showContent(targetTabType);
			this.updateSlider();
			return targetTabType;
		}

		return null; // Should ideally not be reached if there are tabs
	}

	/**
	 * Show the appropriate content based on tab type
	 * @param {string} type - The tab type to show
	 */
	showContent(type) {
		if (!this.postsContent || !this.projectsContent) return;

		// Apply CSS transitions for smoother content changes
		this.postsContent.style.transition = `opacity ${this.config.transitionDuration}ms ease-in-out`;
		this.projectsContent.style.transition = `opacity ${this.config.transitionDuration}ms ease-in-out`;

		// EMERGENCY FIX: Device-desktop class no longer exists, check by device type instead
		if (this.currentDeviceType === 'desktop') {
			this.postsContent.style.opacity = '1';
			this.projectsContent.style.opacity = '1';
			this.postsContent.style.display = 'block';
			this.projectsContent.style.display = 'block';
			if (this.searchBar) this.searchBar.style.display = 'block';

			// Hide tabs wrapper on desktop
			if (this.tabsWrapper) this.tabsWrapper.style.display = 'none';
			return;
		}

		// Show tabs wrapper on mobile/tablet
		if (this.tabsWrapper) this.tabsWrapper.style.display = 'block';

		// On mobile/tablet, show only the active tab
		if (type === 'blog') {
			this.postsContent.style.opacity = '1';
			this.projectsContent.style.opacity = '0';

			// Use setTimeout to prevent content flashing
			setTimeout(() => {
				this.postsContent.style.display = 'block';
				this.projectsContent.style.display = 'none';
			}, this.config.transitionDuration);

			if (this.searchBar) this.searchBar.style.display = 'block';
			
			// Initialize posts only button when blog tab is shown
			if (window.initializePostsOnlyButton) {
				window.initializePostsOnlyButton();
			}
		} else if (type === 'portfolio') {
			this.postsContent.style.opacity = '0';
			this.projectsContent.style.opacity = '1';

			// Use setTimeout to prevent content flashing
			setTimeout(() => {
				this.postsContent.style.display = 'none';
				this.projectsContent.style.display = 'block';
			}, this.config.transitionDuration);

			if (this.searchBar) this.searchBar.style.display = 'none';
			
			// Initialize project toggle when portfolio tab is shown
			if (window.initializeProjectToggle) {
				window.initializeProjectToggle();
			}
		}
	}

	/**
	 * Switch to the specified tab
	 * @param {string} type - The tab type to switch to
	 * @param {boolean} isUserAction - Whether this was triggered by user action
	 */
	switchTab(type, isUserAction = false) {
		if (isUserAction) {
			this.userSelectedTab = type; // Remember user's choice
			
			// Play slider sound effect when user switches tabs
			if (window.soundEffects && window.soundEffects.isEnabled()) {
				window.soundEffects.play('slider');
			}
			
			// Clean up URL parameter when user manually switches tabs
			const urlParams = new URLSearchParams(window.location.search);
			if (urlParams.has('tab')) {
				urlParams.delete('tab');
				const newUrl = urlParams.toString() ? '?' + urlParams.toString() : '/';
				history.replaceState({ path: newUrl, isInitial: true, isDynamic: false }, '', newUrl);
			}
		}

		// Remove active class from all buttons
		this.tabButtons.forEach(btn => {
			btn.classList.remove(this.config.activeClass);
			btn.setAttribute('aria-selected', 'false');
		});

		// Add active class to selected button
		const selectedButton = Array.from(this.tabButtons).find(btn => btn.dataset.type === type);
		if (selectedButton) {
			selectedButton.classList.add(this.config.activeClass);
			selectedButton.setAttribute('aria-selected', 'true');
		}

		// Update active tab attribute
		this.tabContainer.setAttribute('data-active-tab', type);

		// Show appropriate content
		this.showContent(type);

		// Update slider position with debouncing
		if (this.sliderUpdateTimeout) clearTimeout(this.sliderUpdateTimeout);
		this.sliderUpdateTimeout = setTimeout(() => this.updateSlider(), 16);
	}

	/**
	 * Handle window resize event
	 */
	handleResize() {
		const newDeviceType = this.getDeviceType();
		if (newDeviceType !== this.currentDeviceType) {
			this.currentDeviceType = newDeviceType;
			this.handleDeviceChange(true);
		}

		// Force slider recalculation on every resize
		// First, force immediate recalculation
		this.updateSlider();
		
		// Then schedule another update after layout is complete
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				this.updateSlider();
			});
		});

		// Ensure UI updates appropriately with resize
		this.ensureTabsVisibleInTabletMode();

		// Re-validate active state
		this.validateActiveState();
	}

	/**
	 * Get current device type based on viewport width
	 * @returns {string} The device type: 'mobile', 'tablet', or 'desktop'
	 */
	getDeviceType() {
		const width = window.innerWidth;
		if (width < 600) return 'mobile';
		// EMERGENCY FIX: Force tablet mode instead of desktop due to Chrome rendering issues
		// Desktop mode causes: flickering, broken rendering, project items not displaying
		// TODO: Re-enable after fixing backdrop-filter, contain, and transform issues
		// if (width < 1024) return 'tablet';
		// return 'desktop';
		return 'tablet'; // Temporarily disable desktop mode
	}

	/**
	 * Handle device type change
	 * @param {boolean} isDeviceTypeChange - Whether this was triggered by a device type change
	 */
	handleDeviceChange(isDeviceTypeChange = false) {
		// For mobile and tablet, ensure tabs are properly shown and active tab has content displayed
		if (this.currentDeviceType === 'mobile' || this.currentDeviceType === 'tablet') {
			if (this.tabsWrapper) this.tabsWrapper.style.display = 'block';

			const activeTab = this.validateActiveState();
			this.showContent(activeTab);

			// Update tab container visible state
			this.ensureTabsVisibleInTabletMode();

			// Update the slider for the active tab
			setTimeout(() => this.updateSlider(), 50);
		} else {
			// On desktop, show both sections and hide tabs
			if (this.postsContent && this.projectsContent) {
				this.postsContent.style.display = 'block';
				this.projectsContent.style.display = 'block';
				this.postsContent.style.opacity = '1';
				this.projectsContent.style.opacity = '1';
			}

			if (this.tabsWrapper) this.tabsWrapper.style.display = 'none';
			if (this.searchBar) this.searchBar.style.display = 'block';
		}
	}

	/**
	 * Ensure tabs are visible in tablet mode
	 */
	ensureTabsVisibleInTabletMode() {
		if (!this.tabsWrapper) return;

		// In tablet mode, always show the tabs
		if (this.currentDeviceType === 'tablet') {
			this.tabsWrapper.style.display = 'block';
		} else if (this.currentDeviceType === 'desktop') {
			// In desktop mode, always hide the tabs
			this.tabsWrapper.style.display = 'none';
		}
	}
} 