/**
 * Mobile Tabs Component
 * A unified tab handling solution for mobile devices
 */
import ScrollUtility from '../utils/scroll-utility.js';
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
			waresContentId: 'waresContent',
			searchBarSelector: '.search-bar',
			activeClass: 'active',
			transitionDuration: 400,
			...options
		};

		// Store bound listeners for removal
		this.boundListeners = {
			handleTabClick: null,
			handleResize: null,
			handleOrientationChange: null,
			handleSearchTriggerClick: null,
			handleSearchInputSync: null,
			handleSearchClear: null,
			handleSearchKeydown: null,
			handleOriginalSearchInput: null,
			handleSearchPostsOnlyClick: null,
			handleSearchScroll: null,
			handleStickyScroll: null
		};
		this.tabClickListeners = new Map(); // Store individual tab click listeners

		// Initialize state
		this.userSelectedTab = null;
		this.currentDeviceType = '';
		this.initialRenderComplete = false;
		this.tabScrollStates = new Map(); // Track whether each tab has already applied scroll-reset logic
		this.fadeTimeout = null;
		this.fadeInTimeout = null;
		this.initialRenderTimeout = null;
		this.scrollResetTimeouts = new Map(); // Track pending scroll resets per tab
		this.animationSuppressedUntil = 0;
		this.searchBarVisibilityTimeout = null;
		this.pendingLayoutCleanup = null;

		// Search integration state
		this.searchOverlayOpen = false;
		this.searchVisibilityObserver = null;

		// Mobile sticky tabs state
		this.isStickyFixed = false;
		this.stickyPlaceholder = null;

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

		// Reset wares carousel scroll on initial load
		if (this.waresContent) {
			this.resetWaresCarouselScroll(this.waresContent);
		}

		// Initialize search integration (mobile only)
		this.setupSearchIntegration();
	}

	/**
	 * Cache DOM elements for better performance
	 */
	cacheElements() {
		const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		console.log('[MobileTabs] Caching DOM elements (Safari:', isSafari + ')');

		// Clear existing references first (Safari fix)
		this.tabsWrapper = null;
		this.tabContainer = null;
		this.tabButtons = null;
		this.postsContent = null;
		this.projectsContent = null;
		this.waresContent = null;
		this.searchBar = null;

		// Clear search integration elements
		this.searchTrigger = null;
		this.searchReveal = null;
		this.tabsSearchInput = null;
		this.tabsSearchClear = null;
		this.originalSearchInput = null;
		this.inlineSearchContainer = null;

		// Re-query all elements
		this.tabsWrapper = document.querySelector(this.config.tabsWrapperSelector);
		this.tabContainer = document.querySelector(this.config.tabContainerSelector);

		if (!this.tabContainer) {
			return;
		}

		this.tabButtons = document.querySelectorAll(this.config.tabButtonSelector);
		this.postsContent = document.getElementById(this.config.postsContentId);
		this.projectsContent = document.getElementById(this.config.projectsContentId);
		this.waresContent = document.getElementById(this.config.waresContentId);
		this.searchBar = document.querySelector(this.config.searchBarSelector);

		// Cache search integration elements
		// Trigger and search reveal are now inside .mobile-tabs for magic reveal animation
		this.searchTrigger = this.tabContainer?.querySelector('.tabs-search-trigger');
		this.searchReveal = this.tabContainer?.querySelector('.tabs-search-reveal');
		this.tabsSearchInput = this.searchReveal?.querySelector('.tabs-search-input');
		this.tabsSearchClear = this.searchReveal?.querySelector('.tabs-search-clear');
		this.tabsSearchPostsOnly = this.searchReveal?.querySelector('.tabs-search-posts-only');
		this.tabsButtonsLayer = this.tabContainer?.querySelector('.tabs-buttons-layer');
		this.originalSearchInput = document.getElementById('postSearch');
		this.originalPostsOnlyButton = this.postsContent?.querySelector('.posts-only-button');
		this.inlineSearchContainer = this.postsContent?.querySelector('.search-container');

		this.ensurePaneClasses();

		console.log('[MobileTabs] Cached elements:', {
			tabButtons: this.tabButtons.length,
			postsContent: !!this.postsContent,
			projectsContent: !!this.projectsContent,
			waresContent: !!this.waresContent,
			searchTrigger: !!this.searchTrigger,
			searchReveal: !!this.searchReveal,
			isSafari: isSafari
		});
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
		this.tabButtons.forEach((button, index) => {
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
		if (typeof this.pendingLayoutCleanup === 'function') {
			this.pendingLayoutCleanup();
			this.pendingLayoutCleanup = null;
		}
		this.removeEventListeners();

		// Clean up search integration
		this.cleanupSearchIntegration();

		// Clean up mobile sticky behavior
		this.cleanupMobileStickyBehavior();

		// Remove the slider element to ensure clean state
		const slider = this.tabContainer?.querySelector('.mobile-tabs-slider');
		if (slider) {
			slider.remove();
		}
		this.tabContainer?.classList.remove('has-slider-element');

		// Clear all timeouts
		if (this.sliderUpdateTimeout) {
			clearTimeout(this.sliderUpdateTimeout);
			this.sliderUpdateTimeout = null;
		}

		if (this.fadeTimeout) {
			clearTimeout(this.fadeTimeout);
			this.fadeTimeout = null;
		}

		if (this.fadeInTimeout) {
			clearTimeout(this.fadeInTimeout);
			this.fadeInTimeout = null;
		}

		if (this.initialRenderTimeout) {
			clearTimeout(this.initialRenderTimeout);
			this.initialRenderTimeout = null;
		}

		if (this.scrollResetTimeouts) {
			this.scrollResetTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
			this.scrollResetTimeouts.clear();
		}

		// Clear cached elements
		this.tabsWrapper = null;
		this.tabContainer = null;
		this.tabButtons = null;
		this.postsContent = null;
		this.projectsContent = null;
		this.waresContent = null;
		this.searchBar = null;

		// Clear search integration elements
		this.searchTrigger = null;
		this.searchReveal = null;
		this.tabsSearchInput = null;
		this.tabsSearchClear = null;
		this.originalSearchInput = null;
		this.inlineSearchContainer = null;

		// Clear state
		this.userSelectedTab = null;
		this.currentDeviceType = null;
		this._mobileStickyState = null;
		if (this.tabScrollStates) {
			this.tabScrollStates.clear();
		}
		this.animationSuppressedUntil = 0;
		if (this.searchBarVisibilityTimeout) {
			clearTimeout(this.searchBarVisibilityTimeout);
			this.searchBarVisibilityTimeout = null;
		}
		this.pendingLayoutCleanup = null;
		this.searchOverlayOpen = false;
	}

	/**
	 * Initialize desktop view
	 */
	initializeDesktopView() {
		if (this.currentDeviceType === 'desktop') {
			this.ensurePaneClasses();

			// On desktop, both sections should be visible
			if (this.postsContent) {
				this.postsContent.style.display = 'block';
				this.postsContent.classList.add('is-visible');
				this.postsContent.setAttribute('aria-hidden', 'false');
			}
			if (this.projectsContent) {
				this.projectsContent.style.display = 'block';
				this.projectsContent.classList.add('is-visible');
				this.projectsContent.setAttribute('aria-hidden', 'false');
			}
			if (this.waresContent) {
				this.waresContent.style.display = 'block';
				this.waresContent.classList.add('is-visible');
				this.waresContent.setAttribute('aria-hidden', 'false');
			}

			// Add desktop content rendering check with delay to allow for layout
			setTimeout(() => {
				this.checkDesktopContentRendering();
			}, 1000);

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
		const wareItems = this.waresContent?.querySelectorAll('.wares-card') || [];

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
		if (wareItems.length === 0 && this.waresContent) {
			this.waresContent.style.display = 'none';
			setTimeout(() => {
				this.waresContent.style.display = 'block';
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
		// Safari fix: Re-check elements if they became null
		if (!this.tabContainer) {
			this.cacheElements();
		}
		if (!this.tabContainer || !this.tabButtons || this.tabButtons.length < 2) return;

		const activeButton = this.tabContainer.querySelector(
			`${this.config.tabButtonSelector}.${this.config.activeClass}`
		);

		if (!activeButton) return;

		// Get the slider element
		const slider = this.tabContainer.querySelector('.mobile-tabs-slider');
		if (!slider) return;

		try {
			if (this.tabContainer.offsetParent === null) {
				return;
			}

			// Get the active button's position and dimensions
			const buttonRect = activeButton.getBoundingClientRect();
			const containerRect = this.tabContainer.getBoundingClientRect();

			if (containerRect.width <= 0 || buttonRect.width <= 0) {
				return;
			}

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

			// Update search trigger position to align with slider
			this.updateSearchTriggerPosition();
		} catch (error) {
			// Error updating slider
		}
	}

	/**
	 * Ensure only one tab is active and return the active tab type
	 * @returns {string} The active tab type
	 */
	validateActiveState() {
		// Safari fix: Ensure we have valid tab buttons before proceeding
		if (!this.tabButtons || this.tabButtons.length === 0) {
			this.cacheElements();
			if (!this.tabButtons || this.tabButtons.length === 0) {
				return null;
			}
		}
		
		let activeButtons = [];
		this.tabButtons.forEach(button => {
			if (button && button.classList && button.classList.contains(this.config.activeClass)) {
				activeButtons.push(button);
			}
		});

		let targetTabType = this.userSelectedTab; // Prioritize user's last explicit selection

		// If a user selection exists and the UI matches it, we're good.
		if (targetTabType && activeButtons.length === 1 && activeButtons[0].dataset.type === targetTabType) {
			this.showContent(targetTabType, { animate: false }); // Ensure content is consistent
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
			
			if (tabParam && (tabParam === 'portfolio' || tabParam === 'blog' || tabParam === 'wares')) {
				targetTabType = tabParam;
				// Using URL parameter tab
			} else {
				// Check if we're on a standalone project page (not dynamic content)
				const currentPath = window.location.pathname;
				const isStandaloneProjectPage = currentPath.includes('/20') && 
												currentPath !== '/' && 
												!currentPath.includes('?') &&
												!document.querySelector('.blog-content'); // No dynamic content container
				
				if (isStandaloneProjectPage) {
					// We're on a standalone project page, don't interfere with tab logic
					return null;
				}
				
				// Fallback to referrer check for home page
				const referrer = document.referrer;
				const isFromProject = referrer && (
					referrer.includes('/20') && // matches year-based URLs like /2023/01/01/project-name
					!referrer.includes('#') && // not an anchor link
					referrer !== window.location.href // not the same page
				);
				const isFromWares = referrer && referrer.includes('/wares');
				
				// Default based on referrer
				if (isFromProject) {
					targetTabType = 'portfolio';
				} else if (isFromWares) {
					targetTabType = 'wares';
				} else {
					targetTabType = 'blog';
				}
			}
		}

		const targetButton = Array.from(this.tabButtons).find(
			btn => btn.dataset.type === targetTabType
		);

		if (targetButton) {
			targetButton.classList.add(this.config.activeClass);
			targetButton.setAttribute('aria-selected', 'true');
			this.tabContainer.setAttribute('data-active-tab', targetTabType);
			this.showContent(targetTabType, { animate: false });
			this.updateSlider();
			return targetTabType;
		} else if (this.tabButtons.length > 0) {
			// Absolute fallback: if targetButton somehow not found, activate the first available tab.
			const firstButton = this.tabButtons[0];
			targetTabType = firstButton.dataset.type;
			firstButton.classList.add(this.config.activeClass);
			firstButton.setAttribute('aria-selected', 'true');
			this.tabContainer.setAttribute('data-active-tab', targetTabType);
			this.showContent(targetTabType, { animate: false });
			this.updateSlider();
			return targetTabType;
		}

		return null; // Should ideally not be reached if there are tabs
	}

	/**
	 * Show the appropriate content based on tab type
	 * @param {string} type - The tab type to show
	 */
	showContent(type, options = {}) {
		const { animate = true } = options;
		// Safari fix: Re-cache elements if they became null after DOM replacement
		if (!this.postsContent || !this.projectsContent || !this.waresContent) {
			this.cacheElements();
			// If still null after re-caching, exit
			if (!this.postsContent || !this.projectsContent || !this.waresContent) {
				this.markInitialRenderComplete(type, 0);
				return;
			}
		}

		this.ensurePaneClasses();

		const targetPane = type === 'blog' ? this.postsContent :
			type === 'portfolio' ? this.projectsContent : this.waresContent;

		// Determine currently visible pane to fade out
		const currentPane = [this.postsContent, this.projectsContent, this.waresContent].find(pane => pane && pane.classList.contains('is-visible')) || null;

		const shouldAnimate = animate && this.initialRenderComplete && !this.areAnimationsSuppressed();

		// Desktop mode: show both panes side-by-side without animation
		if (this.currentDeviceType === 'desktop') {
			[this.postsContent, this.projectsContent, this.waresContent].forEach(pane => {
				if (pane) {
					pane.style.display = 'block';
					pane.classList.add('is-visible');
					pane.setAttribute('aria-hidden', 'false');
				}
			});
			if (this.searchBar) this.searchBar.style.display = 'block';

			// Hide tabs wrapper on desktop
			if (this.tabsWrapper) this.tabsWrapper.style.display = 'none';
			this.resetScrollPositionIfNeeded('blog', this.postsContent);
			this.resetScrollPositionIfNeeded('portfolio', this.projectsContent);
			this.resetScrollPositionIfNeeded('wares', this.waresContent);
			this.markInitialRenderComplete(type, 0);
			return;
		}

		// Tablet/mobile: ensure tabs wrapper is visible
		if (this.tabsWrapper) this.tabsWrapper.style.display = 'block';

		if (type === 'blog' && targetPane) {
		const { totalDuration, fadeOutDuration } = this.applyTabFade(targetPane, currentPane && currentPane !== targetPane ? currentPane : this.projectsContent, shouldAnimate);

		this.scheduleSearchBarVisibility(true, shouldAnimate ? fadeOutDuration : 0);

			if (window.initializePostsOnlyButton) {
				window.initializePostsOnlyButton();
			}

			this.scheduleScrollReset('blog', targetPane, shouldAnimate, totalDuration);
			this.markInitialRenderComplete(type, totalDuration);

			// Update search trigger visibility after transition
			setTimeout(() => {
				this.updateSearchTriggerVisibility();
			}, shouldAnimate ? totalDuration + 50 : 50);
		} else if (type === 'portfolio' && targetPane) {
		const { totalDuration, fadeOutDuration } = this.applyTabFade(targetPane, currentPane && currentPane !== targetPane ? currentPane : this.postsContent, shouldAnimate);

		this.scheduleSearchBarVisibility(false, shouldAnimate ? fadeOutDuration : 0);

			if (window.initializeProjectToggle) {
				window.initializeProjectToggle();
			}

			this.scheduleScrollReset('portfolio', targetPane, shouldAnimate, totalDuration);
			this.markInitialRenderComplete(type, totalDuration);

			// Hide search trigger on non-Words tabs
			this.hideSearchTrigger();

			// Dispatch portfolio-loaded event to trigger carousel initialization
			setTimeout(() => {
				document.dispatchEvent(new Event('portfolio-loaded'));

				// Also check if carousel needs position restoration
				if (window._notebookCarousel && window._notebookCarousel.reinitialize) {
					window._notebookCarousel.reinitialize();
				}
			}, 50);
		} else if (type === 'wares' && targetPane) {
		const { totalDuration, fadeOutDuration } = this.applyTabFade(targetPane, currentPane && currentPane !== targetPane ? currentPane : this.postsContent, shouldAnimate);

		this.scheduleSearchBarVisibility(false, shouldAnimate ? fadeOutDuration : 0);
			this.scheduleScrollReset('wares', targetPane, shouldAnimate, totalDuration);

			// Hide search trigger on non-Words tabs
			this.hideSearchTrigger();

			// Always reset wares carousel horizontal scroll to first item
			setTimeout(() => {
				this.resetWaresCarouselScroll(targetPane);
			}, shouldAnimate ? totalDuration + 50 : 50);

			this.markInitialRenderComplete(type, totalDuration);
		} else {
			this.markInitialRenderComplete(type, 0);
		}
	}

	/**
	 * Switch to the specified tab
	 * @param {string} type - The tab type to switch to
	 * @param {boolean} isUserAction - Whether this was triggered by user action
	 */
	switchTab(type, isUserAction = false) {
		// Close search overlay when switching tabs
		if (this.searchOverlayOpen) {
			this.closeSearchOverlay();
		}

		// If we're already on the requested tab, do nothing to avoid replaying animations
		const activeTab =
			this.tabContainer?.dataset?.activeTab ||
			Array.from(this.tabButtons || []).find(btn => btn.classList?.contains(this.config.activeClass))?.dataset?.type ||
			null;
		const needsHistorySync = !history.state ||
			history.state.fromTab !== type ||
			history.state.contentType !== type;
		const syncHistoryState = (nextUrl) => {
			const resolvedUrl = nextUrl || `${window.location.pathname}${window.location.search}${window.location.hash}`;
			const currentState = history.state || {};
			const nextState = {
				...currentState,
				path: resolvedUrl,
				isInitial: true,
				isDynamic: false,
				fromTab: type,
				contentType: type
			};
			history.replaceState(nextState, '', resolvedUrl);
		};

		if (!this.tabContainer || !this.tabButtons || this.tabButtons.length === 0) {
			return;
		}

		if (activeTab === type) {
			if (needsHistorySync) {
				syncHistoryState();
			}
			return;
		}

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
				syncHistoryState(newUrl);
			} else {
				syncHistoryState();
			}
		} else if (needsHistorySync) {
			syncHistoryState();
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
		this.suppressAnimations();
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

		if (this.currentDeviceType === 'mobile') {
			this.applyMobileOverflowFixes();
		}
	}

	/**
	 * Get current device type based on viewport width
	 * @returns {string} The device type: 'mobile', 'tablet', or 'desktop'
	 */
	getDeviceType() {
		const width = window.innerWidth;

		if (width <= 767) {
			return 'mobile';
		}

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
		if (isDeviceTypeChange) {
			this.suppressAnimations();
		}
		// For mobile and tablet, ensure tabs are properly shown and active tab has content displayed
		if (this.currentDeviceType === 'mobile' || this.currentDeviceType === 'tablet') {
			if (this.tabsWrapper) this.tabsWrapper.style.display = 'block';

			const activeTab = this.validateActiveState();
			const disableAnimation = Boolean(isDeviceTypeChange);
			this.showContent(activeTab, { animate: !disableAnimation });

			// Update tab container visible state
			this.ensureTabsVisibleInTabletMode();
			this.resetScrollContainersForDevice();

			// Update the slider for the active tab
			setTimeout(() => this.updateSlider(), 50);

			this.applyMobileOverflowFixes();

			// Set up mobile sticky behavior (tabs stick when header scrolls out)
			if (this.currentDeviceType === 'mobile') {
				this.setupMobileStickyBehavior();
			} else {
				this.cleanupMobileStickyBehavior();
			}
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

			this.clearMobileOverflowFixes();
			this.resetScrollContainersForDevice();

			// Clean up mobile sticky behavior on desktop
			this.cleanupMobileStickyBehavior();
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

	applyMobileOverflowFixes() {
		if (!this.tabsWrapper) return;

		// On mobile, we use JavaScript scroll detection (setupMobileStickyBehavior)
		// instead of CSS sticky, so skip the sticky positioning here
		if (this.currentDeviceType === 'mobile') {
			// Only ensure z-index is set for proper layering
			if (!this.tabsWrapper.style.zIndex) {
				this.tabsWrapper.style.zIndex = '1000';
			}
			return;
		}

		// Apply sticky positioning for tablet (needed for search trigger to work)
		const shouldBeSticky = this.currentDeviceType === 'tablet';

		if (!shouldBeSticky) {
			this.clearMobileOverflowFixes();
			return;
		}

		if (!this._mobileStickyState) {
			this._mobileStickyState = {
				position: this.tabsWrapper.style.position || '',
				top: this.tabsWrapper.style.top || '',
				zIndex: this.tabsWrapper.style.zIndex || ''
			};
		}

		this.tabsWrapper.style.position = 'sticky';
		this.tabsWrapper.style.top = '0px';
		if (!this.tabsWrapper.style.zIndex) {
			this.tabsWrapper.style.zIndex = '100';
		}
	}

	clearMobileOverflowFixes() {
		if (!this.tabsWrapper) return;

		if (this._mobileStickyState) {
			const { position, top, zIndex } = this._mobileStickyState;
			this.tabsWrapper.style.position = position;
			this.tabsWrapper.style.top = top;
			this.tabsWrapper.style.zIndex = zIndex;
		} else {
			this.tabsWrapper.style.position = '';
			this.tabsWrapper.style.top = '';
			this.tabsWrapper.style.zIndex = '';
		}
	}

	/**
	 * Set up mobile sticky behavior for tabs
	 * Tabs start in natural position below header, then stick to top when header scrolls out
	 */
	setupMobileStickyBehavior() {
		if (this.currentDeviceType !== 'mobile') return;

		const blogContainer = document.querySelector('.blog');
		const header = document.querySelector('.blog-header');

		if (!blogContainer || !header || !this.tabsWrapper) return;

		// Only set up once
		if (this.stickyPlaceholder) return;

		// Create placeholder for layout stability when tabs become fixed
		this.stickyPlaceholder = document.createElement('div');
		this.stickyPlaceholder.className = 'tabs-sticky-placeholder';
		this.stickyPlaceholder.style.display = 'none';
		this.tabsWrapper.parentNode.insertBefore(this.stickyPlaceholder, this.tabsWrapper);

		this.isStickyFixed = false;

		const checkStickyPosition = () => {
			const headerRect = header.getBoundingClientRect();
			// Tabs should become fixed when header's bottom edge is at or above the viewport top
			const shouldBeFixed = headerRect.bottom <= 0;

			if (shouldBeFixed && !this.isStickyFixed) {
				// Transition to fixed position
				this.isStickyFixed = true;
				// Set placeholder height to match tabs height to prevent content jump
				this.stickyPlaceholder.style.height = `${this.tabsWrapper.offsetHeight}px`;
				this.stickyPlaceholder.style.display = 'block';
				this.tabsWrapper.classList.add('is-sticky-fixed');
			} else if (!shouldBeFixed && this.isStickyFixed) {
				// Transition back to natural position
				this.isStickyFixed = false;
				this.stickyPlaceholder.style.display = 'none';
				this.tabsWrapper.classList.remove('is-sticky-fixed');
			}
		};

		// Throttled scroll handler using requestAnimationFrame for performance
		let ticking = false;
		this.boundListeners.handleStickyScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					checkStickyPosition();
					ticking = false;
				});
				ticking = true;
			}
		};

		// Listen for scroll on window (body/html scrolls on iOS Safari for toolbar collapse)
		// With body scrolling approach, .blog has overflow: visible and doesn't fire scroll events
		window.addEventListener('scroll', this.boundListeners.handleStickyScroll, { passive: true });

		// Store reference for cleanup
		this.stickyScrollContainer = window;

		// Initial check in case page is already scrolled
		checkStickyPosition();
	}

	/**
	 * Clean up mobile sticky behavior resources
	 */
	cleanupMobileStickyBehavior() {
		// Remove scroll listener
		if (this.boundListeners.handleStickyScroll && this.stickyScrollContainer) {
			this.stickyScrollContainer.removeEventListener('scroll', this.boundListeners.handleStickyScroll);
			this.boundListeners.handleStickyScroll = null;
			this.stickyScrollContainer = null;
		}

		// Remove placeholder
		if (this.stickyPlaceholder && this.stickyPlaceholder.parentNode) {
			this.stickyPlaceholder.parentNode.removeChild(this.stickyPlaceholder);
			this.stickyPlaceholder = null;
		}

		// Reset tabs wrapper state
		if (this.tabsWrapper) {
			this.tabsWrapper.classList.remove('is-sticky-fixed');
		}

		this.isStickyFixed = false;
	}

	resetScrollContainersForDevice() {
		const clearScrollableInlineStyles = (element) => {
			if (!element) return;
			element.style.removeProperty('height');
			element.style.removeProperty('max-height');
			element.style.removeProperty('min-height');
			element.style.removeProperty('overflow');
			element.style.removeProperty('overflow-y');
			element.style.removeProperty('overflow-x');
			element.style.removeProperty('position');
			element.style.removeProperty('top');
			element.style.removeProperty('right');
			element.style.removeProperty('bottom');
			element.style.removeProperty('left');
			element.style.removeProperty('width');
		};

		const normalize = () => {
			const blogElement = document.querySelector('.blog');
			if (!blogElement) return;

			const blogContent = blogElement.querySelector('.blog-content');
			const contentWrappers = blogElement.querySelectorAll('.content-wrapper');
			const innerWrappers = blogElement.querySelectorAll('.content-inner-wrapper');

			clearScrollableInlineStyles(blogElement);
			clearScrollableInlineStyles(blogContent);
			contentWrappers.forEach(clearScrollableInlineStyles);
			innerWrappers.forEach(clearScrollableInlineStyles);
		};

		// Defer to next frame so media queries have applied before we clear inline overrides
		requestAnimationFrame(() => {
			requestAnimationFrame(normalize);
		});
	}

	ensurePaneClasses() {
		[this.postsContent, this.projectsContent, this.waresContent].forEach(pane => {
			if (pane && !pane.classList.contains('mobile-tab-pane')) {
				pane.classList.add('mobile-tab-pane');
			}
		});
	}

	applyTabFade(showElement, hideElement, animate) {
		if (!showElement) {
			return { totalDuration: 0, fadeOutDuration: 0 };
		}

		this.ensurePaneClasses();

		if (this.fadeTimeout) {
			clearTimeout(this.fadeTimeout);
			this.fadeTimeout = null;
		}

		if (this.fadeInTimeout) {
			clearTimeout(this.fadeInTimeout);
			this.fadeInTimeout = null;
		}

		const duration = this.config.transitionDuration;
		const paneToHide = hideElement && hideElement !== showElement ? hideElement : null;
		const gapBetweenFades = Math.max(120, Math.round(duration * 0.35));
		const totalTransitionTime = paneToHide ? (duration * 2) + gapBetweenFades : duration;
		const fadeOutDuration = animate && paneToHide ? duration : 0;
		let cleanupLayout = null;

		if (typeof this.pendingLayoutCleanup === 'function') {
			try {
				this.pendingLayoutCleanup();
			} catch (error) {
				// Best-effort cleanup; ignore failures
			}
			this.pendingLayoutCleanup = null;
		}

		// Immediate switch without animation (initial render or missing counterpart)
		if (!animate || !paneToHide) {
			showElement.style.display = 'block';

			// Reset wares carousel scroll BEFORE making visible (after display:block so scrollIntoView works)
			if (showElement === this.waresContent) {
				this.resetWaresCarouselScroll(showElement);
			}

			showElement.classList.add('is-visible');
			showElement.setAttribute('aria-hidden', 'false');

			if (paneToHide) {
				paneToHide.classList.remove('is-visible');
				paneToHide.style.display = 'none';
				paneToHide.setAttribute('aria-hidden', 'true');
			}

			return {
				totalDuration: 0,
				fadeOutDuration: 0
			};
		}

		// Prepare panes for sequential fade
		showElement.style.display = 'block';

		// Reset wares carousel scroll BEFORE making visible (after display:block so scrollIntoView works)
		if (showElement === this.waresContent) {
			this.resetWaresCarouselScroll(showElement);
		}
		showElement.classList.remove('is-visible');
		showElement.setAttribute('aria-hidden', 'true');

		paneToHide.style.display = 'block';
		paneToHide.classList.add('is-visible');
		paneToHide.setAttribute('aria-hidden', 'true');

		// Stabilize layout during overlap so panes can fade without reflowing content
		try {
			const container = paneToHide.parentElement || showElement.parentElement;
			if (container) {
				const containerStyles = window.getComputedStyle(container);
				const originalContainerPosition = container.style.position;
				const originalContainerHeight = container.style.height;
				const originalContainerMinHeight = container.style.minHeight;
				const originalShowStyles = {
					position: showElement.style.position,
					top: showElement.style.top,
					left: showElement.style.left,
					right: showElement.style.right,
					bottom: showElement.style.bottom,
					width: showElement.style.width
				};
				const originalHideStyles = {
					position: paneToHide.style.position,
					top: paneToHide.style.top,
					left: paneToHide.style.left,
					right: paneToHide.style.right,
					bottom: paneToHide.style.bottom,
					width: paneToHide.style.width
				};

				const needsRelativePosition = containerStyles.position === 'static' || !containerStyles.position;
				const containerHeight = container.offsetHeight;
				const showHeight = showElement.offsetHeight;
				const hideHeight = paneToHide.offsetHeight;
				const targetHeight = Math.max(containerHeight, showHeight, hideHeight);

				if (needsRelativePosition) {
					container.style.position = 'relative';
				}
				if (!Number.isNaN(targetHeight) && targetHeight > 0) {
					container.style.height = `${targetHeight}px`;
					container.style.minHeight = `${targetHeight}px`;
				}

				const applyOverlayStyles = (element) => {
					element.style.position = 'absolute';
					element.style.top = '0';
					element.style.left = '0';
					element.style.right = '0';
					element.style.width = '100%';
				};

				applyOverlayStyles(showElement);
				applyOverlayStyles(paneToHide);

				cleanupLayout = () => {
					showElement.style.position = originalShowStyles.position || '';
					showElement.style.top = originalShowStyles.top || '';
					showElement.style.left = originalShowStyles.left || '';
					showElement.style.right = originalShowStyles.right || '';
					showElement.style.bottom = originalShowStyles.bottom || '';
					showElement.style.width = originalShowStyles.width || '';

					paneToHide.style.position = originalHideStyles.position || '';
					paneToHide.style.top = originalHideStyles.top || '';
					paneToHide.style.left = originalHideStyles.left || '';
					paneToHide.style.right = originalHideStyles.right || '';
					paneToHide.style.bottom = originalHideStyles.bottom || '';
					paneToHide.style.width = originalHideStyles.width || '';

					if (needsRelativePosition) {
						container.style.position = originalContainerPosition || '';
					}
					if (originalContainerHeight) {
						container.style.height = originalContainerHeight;
					} else {
						container.style.removeProperty('height');
					}
					if (originalContainerMinHeight) {
						container.style.minHeight = originalContainerMinHeight;
					} else {
						container.style.removeProperty('min-height');
					}
				};
			}
		} catch (error) {
			cleanupLayout = null;
		}

		// Start fade out on the currently visible pane
		requestAnimationFrame(() => {
			paneToHide.classList.remove('is-visible');
		});

		// After fade out completes, hide old pane
		this.fadeTimeout = window.setTimeout(() => {
			paneToHide.style.display = 'none';
			this.fadeTimeout = null;
		}, duration);

		// Fade in the new pane after the gap, then restore layout
		this.fadeInTimeout = window.setTimeout(() => {
			showElement.setAttribute('aria-hidden', 'false');
			showElement.classList.add('is-visible');
			if (typeof cleanupLayout === 'function') {
				cleanupLayout();
				if (this.pendingLayoutCleanup === cleanupLayout) {
					this.pendingLayoutCleanup = null;
				}
			}
			this.fadeInTimeout = null;
		}, duration + gapBetweenFades);

		if (typeof cleanupLayout === 'function') {
			this.pendingLayoutCleanup = cleanupLayout;
		}

		return {
			totalDuration: totalTransitionTime,
			fadeOutDuration
		};
	}

	scheduleSearchBarVisibility(isVisible, delay = 0) {
		if (!this.searchBar) {
			return;
		}

		if (this.searchBarVisibilityTimeout) {
			clearTimeout(this.searchBarVisibilityTimeout);
			this.searchBarVisibilityTimeout = null;
		}

		const applyVisibility = () => {
			const computedDisplay = window.getComputedStyle(this.searchBar).display;
			const currentlyVisible = computedDisplay !== 'none';
			if (isVisible && !currentlyVisible) {
				const originalDisplay = this.searchBar.dataset.originalDisplay || '';
				this.searchBar.style.display = originalDisplay;
				delete this.searchBar.dataset.originalDisplay;
			} else if (!isVisible && currentlyVisible) {
				if (!this.searchBar.dataset.originalDisplay) {
					this.searchBar.dataset.originalDisplay = computedDisplay === 'none' ? '' : computedDisplay;
				}
				this.searchBar.style.display = 'none';
			}
			this.searchBarVisibilityTimeout = null;
		};

		const additionalDelay = isVisible ? 100 : 0;
		const totalDelay = Math.max(0, delay + additionalDelay);

		if (totalDelay > 0) {
			this.searchBarVisibilityTimeout = window.setTimeout(applyVisibility, totalDelay);
		} else {
			applyVisibility();
		}
	}

	scheduleScrollReset(tabType, contentElement, animate, transitionTime = 0) {
		if (!contentElement) {
			return;
		}

		const delay = animate ? transitionTime + 120 : 80;
		const behavior = 'auto';

		if (this.scrollResetTimeouts.has(tabType)) {
			clearTimeout(this.scrollResetTimeouts.get(tabType));
		}

		const timeoutId = window.setTimeout(() => {
			this.resetScrollPositionIfNeeded(tabType, contentElement, { behavior });
			this.scrollResetTimeouts.delete(tabType);
		}, delay);

		this.scrollResetTimeouts.set(tabType, timeoutId);
	}

	resetScrollPositionIfNeeded(tabType, contentElement, options = {}) {
		if (!contentElement) {
			return;
		}

		const { behavior = 'smooth' } = options;

		const contentWrapper = contentElement.closest('.content-wrapper');
		if (!contentWrapper) {
			return;
		}

		const currentState = this.tabScrollStates.get(tabType);
		if (currentState?.initialScrollResetDone) {
			return;
		}

		const currentScrollTop = contentWrapper.scrollTop || 0;
		if (currentScrollTop <= 0) {
			this.tabScrollStates.set(tabType, { initialScrollResetDone: true });
			return;
		}

		requestAnimationFrame(() => {
			if (ScrollUtility && typeof ScrollUtility.scrollToElement === 'function') {
				ScrollUtility.scrollToElement(contentWrapper, {
					behavior,
					block: 'start'
				});
			} else if (typeof contentWrapper.scrollTo === 'function') {
				contentWrapper.scrollTo({
					top: 0,
					behavior
				});
			} else {
				contentWrapper.scrollTop = 0;
			}

			// Also reset horizontal scroll for wares carousel
			if (tabType === 'wares') {
				this.resetWaresCarouselScroll(contentElement);
			}

			this.tabScrollStates.set(tabType, { initialScrollResetDone: true });
		});
	}

	/**
	 * Reset the wares carousel horizontal scroll to the first item
	 * @param {HTMLElement} waresContent - The wares content container
	 */
	resetWaresCarouselScroll(waresContent) {
		if (!waresContent) return;

		const waresGrid = waresContent.querySelector('.wares-grid');
		if (!waresGrid) return;

		// Find the first actual card (not the ::before pseudo-element spacer)
		const firstCard = waresGrid.querySelector('.wares-card');

		if (firstCard) {
			// Temporarily disable scroll-snap to prevent fighting with our scroll position
			const originalSnapType = waresGrid.style.scrollSnapType;
			waresGrid.style.scrollSnapType = 'none';

			// Calculate the horizontal scroll position to center the first card
			// Use scrollLeft instead of scrollIntoView to avoid vertical scrolling
			const gridRect = waresGrid.getBoundingClientRect();
			const cardRect = firstCard.getBoundingClientRect();
			const cardCenterOffset = (cardRect.left - gridRect.left) + waresGrid.scrollLeft;
			const centerPosition = cardCenterOffset - (gridRect.width / 2) + (cardRect.width / 2);

			// Set horizontal scroll position directly (no vertical scroll)
			waresGrid.scrollLeft = Math.max(0, centerPosition);

			// Re-enable scroll-snap after a microtask to ensure scroll position is set
			requestAnimationFrame(() => {
				waresGrid.style.scrollSnapType = originalSnapType || '';
				waresGrid.classList.add('scroll-ready');
			});
		} else {
			// Fallback if no cards found
			waresGrid.scrollLeft = 0;
			waresGrid.classList.add('scroll-ready');
		}
	}

	markInitialRenderComplete(type, delay = 0) {
		if (this.initialRenderComplete) {
			return;
		}

		let effectiveDelay = delay;
		if (!effectiveDelay || effectiveDelay < 0) {
			effectiveDelay = Math.max(250, this.config.transitionDuration + 150);
		}

		const finalize = () => {
			if (this.initialRenderComplete) {
				return;
			}

			this.initialRenderComplete = true;
			this.initialRenderTimeout = null;

			const activeTab =
				type ||
				this.tabContainer?.dataset?.activeTab ||
				(Array.from(this.tabButtons || []).find(btn => btn.classList?.contains(this.config.activeClass))?.dataset?.type) ||
				null;

			if (typeof document !== 'undefined' && document.body) {
				document.body.classList.add('tabs-initial-rendered');

				if (activeTab) {
					document.body.setAttribute('data-active-tab', activeTab);
				}
			}

			try {
				const eventDetail = { activeTab };
				document.dispatchEvent(new CustomEvent('mobileTabs:initial-render', { detail: eventDetail }));
			} catch (error) {
				// CustomEvent might fail in very old browsers; ignore silently.
			}
		};

		if (effectiveDelay > 0) {
			if (this.initialRenderTimeout) {
				clearTimeout(this.initialRenderTimeout);
			}
			this.initialRenderTimeout = window.setTimeout(finalize, effectiveDelay);
		} else {
			finalize();
		}
	}

	suppressAnimations(duration = this.config.transitionDuration + 200) {
		if (typeof Date === 'undefined') {
			return;
		}

		const now = Date.now();
		const safeDuration = Math.max(0, duration);
		const suppressionUntil = now + safeDuration;

		this.animationSuppressedUntil = Math.max(this.animationSuppressedUntil || 0, suppressionUntil);
	}

	areAnimationsSuppressed() {
		if (!this.animationSuppressedUntil) {
			return false;
		}

		const now = Date.now();
		if (now >= this.animationSuppressedUntil) {
			this.animationSuppressedUntil = 0;
			return false;
		}

		return true;
	}

	// ============================================
	// Search Integration Methods
	// ============================================

	/**
	 * Set up the tabs-integrated search functionality
	 */
	setupSearchIntegration() {
		console.log('[MobileTabs] Setting up search integration...', {
			searchTrigger: !!this.searchTrigger,
			searchReveal: !!this.searchReveal,
			tabsSearchInput: !!this.tabsSearchInput,
			inlineSearchContainer: !!this.inlineSearchContainer,
			deviceType: this.currentDeviceType
		});

		// Only set up if required elements exist
		if (!this.searchTrigger || !this.searchReveal || !this.tabsSearchInput) {
			console.log('[MobileTabs] Search integration skipped - missing elements');
			return;
		}

		// Mark body that tabs search is available (used to hide floating search)
		document.body.classList.add('tabs-search-available');

		// Set up IntersectionObserver to track inline search visibility
		this.setupSearchVisibilityObserver();

		// Set up event listeners
		// Trigger acts as both open and close button depending on state
		this.boundListeners.handleSearchTriggerClick = (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (this.searchOverlayOpen) {
				console.log('[MobileTabs] Search trigger clicked - closing');
				this.closeSearchOverlay();
			} else {
				console.log('[MobileTabs] Search trigger clicked - opening');
				this.openSearchOverlay();
			}
		};
		this.searchTrigger.addEventListener('click', this.boundListeners.handleSearchTriggerClick);
		console.log('[MobileTabs] Click listener attached to search trigger');

		// Sync tabs search input with original search input
		this.boundListeners.handleSearchInputSync = this.syncSearchInputs.bind(this);
		this.tabsSearchInput.addEventListener('input', this.boundListeners.handleSearchInputSync);

		// Sync original search input to tabs search input (bidirectional)
		if (this.originalSearchInput) {
			this.boundListeners.handleOriginalSearchInput = () => {
				if (this.tabsSearchInput && this.tabsSearchInput.value !== this.originalSearchInput.value) {
					this.tabsSearchInput.value = this.originalSearchInput.value;
					this.updateSearchClearVisibility();
				}
			};
			this.originalSearchInput.addEventListener('input', this.boundListeners.handleOriginalSearchInput);
		}

		// Clear button functionality
		this.boundListeners.handleSearchClear = this.clearSearchInput.bind(this);
		this.tabsSearchClear?.addEventListener('click', this.boundListeners.handleSearchClear);

		// Keyboard handling (Escape to close)
		this.boundListeners.handleSearchKeydown = (e) => {
			if (e.key === 'Escape' && this.searchOverlayOpen) {
				e.preventDefault();
				this.closeSearchOverlay();
			}
		};
		document.addEventListener('keydown', this.boundListeners.handleSearchKeydown);

		// Posts only button - sync with original
		this.boundListeners.handleSearchPostsOnlyClick = () => {
			this.togglePostsOnlyFilter();
		};
		this.tabsSearchPostsOnly?.addEventListener('click', this.boundListeners.handleSearchPostsOnlyClick);

		console.log('[MobileTabs] Search integration initialized');
	}

	/**
	 * Set up scroll listener to track when inline search scrolls off-screen
	 */
	setupSearchVisibilityObserver() {
		// Find the inline search container within posts content
		if (!this.inlineSearchContainer) {
			this.inlineSearchContainer = this.postsContent?.querySelector('.search-container');
		}

		// If no inline search container, we can't observe it
		if (!this.inlineSearchContainer) {
			console.log('[MobileTabs] No inline search container found for observation');
			return;
		}

		// Create scroll handler with throttling
		let ticking = false;
		this.boundListeners.handleSearchScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					this.checkSearchVisibility();
					ticking = false;
				});
				ticking = true;
			}
		};

		// Listen on multiple potential scroll containers to catch scroll events
		// regardless of where they originate (postsContent, parent wrappers, or window)
		const scrollTargets = new Set();

		// Always listen on postsContent if it exists (scrolls on mobile, might scroll on tablet)
		if (this.postsContent) {
			scrollTargets.add(this.postsContent);
		}

		// Also check parent containers that might scroll
		const contentWrapper = this.postsContent?.closest('.content-wrapper');
		const blogContent = this.postsContent?.closest('.blog-content');
		const blogContainer = document.querySelector('.blog');
		if (contentWrapper) scrollTargets.add(contentWrapper);
		if (blogContent) scrollTargets.add(blogContent);
		if (blogContainer) scrollTargets.add(blogContainer);

		// Always listen on window and document for body/html scrolling
		// This is critical for iOS Safari where body scrolls to enable toolbar collapse
		scrollTargets.add(window);
		scrollTargets.add(document);

		// Attach scroll listeners to all potential scroll containers
		scrollTargets.forEach(target => {
			target.addEventListener('scroll', this.boundListeners.handleSearchScroll, { passive: true });
		});

		// Store for cleanup
		this.scrollTargets = scrollTargets;

		console.log('[MobileTabs] Scroll listeners set up on', scrollTargets.size, 'targets');

		// Position the trigger initially
		requestAnimationFrame(() => {
			this.updateSearchTriggerPosition();
			// Check initial visibility
			this.checkSearchVisibility();
		});
	}

	/**
	 * Check if the inline search is visible and update trigger accordingly
	 */
	checkSearchVisibility() {
		if (!this.inlineSearchContainer || !this.searchTrigger) {
			return;
		}

		const activeTab = this.tabContainer?.dataset?.activeTab || 'blog';
		const isWordsTab = activeTab === 'blog';
		// Search is available on all device types where tabs are shown (mobile, tablet, and desktop)
		const isTabsVisible = this.currentDeviceType === 'mobile' || this.currentDeviceType === 'tablet' || this.currentDeviceType === 'desktop';

		// Get the search container's position relative to the viewport
		const rect = this.inlineSearchContainer.getBoundingClientRect();
		// Use actual tabs height instead of hardcoded value for accurate threshold
		const tabsHeight = this.tabContainer?.offsetHeight || 60;
		// Consider the search "off-screen" when its bottom edge is above the tabs area
		const isOffScreen = rect.bottom < tabsHeight;
		// Consider inline search "visible" when it's scrolled into view
		const isInlineSearchVisible = rect.top > tabsHeight && rect.bottom > 0;

		// If search overlay is open and user scrolls to reveal inline search, auto-close overlay
		if (this.searchOverlayOpen && isInlineSearchVisible) {
			this.transferSearchToInline();
			return;
		}

		// If search overlay is open but input is not focused AND has no value, close on scroll
		if (this.searchOverlayOpen) {
			const inputHasFocus = document.activeElement === this.tabsSearchInput;
			const inputHasValue = this.tabsSearchInput?.value?.length > 0;
			// Only auto-close if user isn't actively searching (no focus AND no value)
			if (!inputHasFocus && !inputHasValue) {
				// Close and clear since user is scrolling away without actively searching
				this.closeSearchOverlay(true);
				return;
			}
		}

		// Inverse: if inline search is focused/has value and scrolls off-screen, open tabs search
		if (isWordsTab && isTabsVisible && isOffScreen && !this.searchOverlayOpen) {
			const inlineHasFocus = document.activeElement === this.originalSearchInput;
			const inlineHasValue = this.originalSearchInput?.value?.length > 0;

			if (inlineHasFocus || inlineHasValue) {
				this.transferSearchToTabs();
				return;
			}
		}

		if (!isWordsTab || !isTabsVisible || this.searchOverlayOpen) {
			this.hideSearchTrigger();
			return;
		}

		if (isOffScreen) {
			// Ensure trigger position is up-to-date before showing
			this.updateSearchTriggerPosition();
			this.searchTrigger.classList.remove('is-hiding'); // Cancel any pending hide
			this.searchTrigger.classList.add('is-visible');
		} else {
			this.hideSearchTrigger();
		}
	}

	/**
	 * Transfer search from tabs overlay to inline search bar
	 * Called when user scrolls up to reveal inline search while overlay is open
	 */
	transferSearchToInline() {
		if (!this.searchOverlayOpen) {
			return;
		}

		console.log('[MobileTabs] Transferring search to inline search bar');

		// Get the current search value from tabs input before closing
		const searchValue = this.tabsSearchInput?.value || '';
		const hadFocus = document.activeElement === this.tabsSearchInput;

		// Close the overlay without clearing search (transfer preserves value)
		this.closeSearchOverlay(false);

		// The values should already be synced via input event listeners,
		// but ensure the inline search has the correct value
		if (this.originalSearchInput) {
			// Only update if values differ (avoid unnecessary events)
			if (this.originalSearchInput.value !== searchValue) {
				this.originalSearchInput.value = searchValue;
			}
			// If user was actively typing, focus the inline search so they can continue
			if (hadFocus && searchValue) {
				this.originalSearchInput.focus();
				// Place cursor at end of text
				this.originalSearchInput.setSelectionRange(searchValue.length, searchValue.length);
			}
		}
	}

	/**
	 * Transfer search from inline search bar to tabs overlay
	 * Called when user scrolls down while inline search is active
	 */
	transferSearchToTabs() {
		if (this.searchOverlayOpen) {
			return;
		}

		console.log('[MobileTabs] Transferring search to tabs overlay');

		// Get the current search value from inline input
		const searchValue = this.originalSearchInput?.value || '';
		const hadFocus = document.activeElement === this.originalSearchInput;

		// Blur the inline input first
		this.originalSearchInput?.blur();

		// Open the search overlay (this will sync the value and focus)
		this.openSearchOverlay();

		// Ensure the value is transferred (openSearchOverlay already syncs, but ensure)
		if (this.tabsSearchInput && searchValue) {
			this.tabsSearchInput.value = searchValue;
			// If user was actively typing, ensure cursor is at end
			if (hadFocus) {
				this.tabsSearchInput.setSelectionRange(searchValue.length, searchValue.length);
			}
		}
	}

	/**
	 * Open the search overlay with magic reveal animation
	 * The slider shrinks right to reveal the search content beneath it
	 */
	openSearchOverlay() {
		if (!this.searchReveal || !this.tabsSearchInput || this.searchOverlayOpen) {
			return;
		}

		// Save current scroll position to restore if user cancels search
		this.savedScrollPosition = window.scrollY;

		this.searchOverlayOpen = true;

		// Calculate slider end position (ring around trigger)
		// The trigger is positioned at right: 4px inside mobile-tabs
		// We need the slider to end up centered on the trigger
		const triggerSize = 24;
		const tabsRect = this.tabContainer?.getBoundingClientRect();
		const tabsWidth = tabsRect?.width || 600;

		// Slider end position: 2px from right edge
		const sliderEndLeft = tabsWidth - 6 - triggerSize;

		// Set CSS custom properties for the animation
		this.tabContainer?.style.setProperty('--slider-end-left', `${sliderEndLeft}px`);
		this.tabContainer?.style.setProperty('--slider-end-size', `${triggerSize}px`);

		// Add active class to trigger the magic reveal animation
		this.tabContainer?.classList.add('search-reveal-active');
		this.searchReveal.setAttribute('aria-hidden', 'false');
		this.searchTrigger?.setAttribute('aria-expanded', 'true');

		// Switch trigger icon to close mode
		this.searchTrigger?.classList.add('is-close-mode');

		// Sync value from original search input
		if (this.originalSearchInput && this.tabsSearchInput) {
			this.tabsSearchInput.value = this.originalSearchInput.value;
		}

		// Sync posts only button state
		this.syncPostsOnlyState();

		// Focus the input after animation completes
		setTimeout(() => {
			this.tabsSearchInput?.focus();
			this.updateSearchClearVisibility();
		}, 350); // Match --reveal-duration

		// Play click sound
		if (window.soundEffects && window.soundEffects.isEnabled()) {
			window.soundEffects.play('click');
		}

		console.log('[MobileTabs] Search reveal opened');
	}

	/**
	 * Close the search overlay with reverse magic reveal animation
	 * The slider expands left from the trigger ring back to its original position
	 * @param {boolean} clearSearch - Whether to clear the search input (default: true for (x) button)
	 */
	closeSearchOverlay(clearSearch = true) {
		if (!this.searchReveal || !this.searchOverlayOpen) {
			return;
		}

		this.searchOverlayOpen = false;

		// Remove active class to trigger reverse animation
		this.tabContainer?.classList.remove('search-reveal-active');
		this.searchReveal.setAttribute('aria-hidden', 'true');
		this.searchTrigger?.setAttribute('aria-expanded', 'false');

		// Switch trigger icon back to search mode
		this.searchTrigger?.classList.remove('is-close-mode');

		// Clear search input if requested (default for (x) button close)
		if (clearSearch) {
			if (this.tabsSearchInput) {
				this.tabsSearchInput.value = '';
			}
			if (this.originalSearchInput) {
				this.originalSearchInput.value = '';
				// Trigger input event to reset filtering
				const inputEvent = new Event('input', { bubbles: true });
				this.originalSearchInput.dispatchEvent(inputEvent);
			}
			this.updateSearchClearVisibility();

			// Restore scroll position to where user was before opening search
			if (typeof this.savedScrollPosition === 'number') {
				window.scrollTo({
					top: this.savedScrollPosition,
					behavior: 'smooth'
				});
				this.savedScrollPosition = null;
			}
		} else {
			// Not restoring scroll, but clear saved position since search continues
			this.savedScrollPosition = null;
		}

		// Blur the input
		this.tabsSearchInput?.blur();

		// After animation completes, update slider to follow active tab
		setTimeout(() => {
			this.updateSlider();
			this.updateSearchTriggerVisibility();
		}, 350); // Match --reveal-duration

		// Play click sound
		if (window.soundEffects && window.soundEffects.isEnabled()) {
			window.soundEffects.play('click');
		}

		console.log('[MobileTabs] Search reveal closed');
	}

	/**
	 * Sync the tabs search input value to the original search input
	 */
	syncSearchInputs() {
		if (!this.tabsSearchInput || !this.originalSearchInput) {
			return;
		}

		// Update original search input value
		this.originalSearchInput.value = this.tabsSearchInput.value;

		// Trigger input event on original to activate filtering
		const inputEvent = new Event('input', { bubbles: true });
		this.originalSearchInput.dispatchEvent(inputEvent);

		// Update clear button visibility
		this.updateSearchClearVisibility();
	}

	/**
	 * Clear the search input
	 */
	clearSearchInput() {
		if (!this.tabsSearchInput) {
			return;
		}

		this.tabsSearchInput.value = '';
		this.syncSearchInputs();
		this.tabsSearchInput.focus();
	}

	/**
	 * Toggle the posts only filter and sync with original button
	 */
	togglePostsOnlyFilter() {
		if (!this.tabsSearchPostsOnly || !this.originalPostsOnlyButton) {
			return;
		}

		// Trigger click on original button to activate/deactivate filter
		this.originalPostsOnlyButton.click();

		// Sync the active state after a brief delay to let original handler complete
		setTimeout(() => {
			this.syncPostsOnlyState();
		}, 10);
	}

	/**
	 * Sync the active state of the posts only button with the original
	 */
	syncPostsOnlyState() {
		if (!this.tabsSearchPostsOnly || !this.originalPostsOnlyButton) {
			return;
		}

		const isActive = this.originalPostsOnlyButton.classList.contains('active');
		this.tabsSearchPostsOnly.classList.toggle('active', isActive);
	}

	/**
	 * Update the visibility of the search clear button
	 */
	updateSearchClearVisibility() {
		if (!this.tabsSearchClear || !this.tabsSearchInput) {
			return;
		}

		const hasValue = this.tabsSearchInput.value.length > 0;
		this.tabsSearchClear.style.display = hasValue ? 'flex' : 'none';
	}

	/**
	 * Update the position of the search trigger to align with slider's right edge
	 * Also sets the slider end position for the magic reveal animation
	 */
	updateSearchTriggerPosition() {
		if (!this.searchTrigger || !this.tabContainer) {
			return;
		}

		const slider = this.tabContainer.querySelector('.mobile-tabs-slider');
		if (!slider) return;

		const triggerSize = 24; // Match CSS width/height
		const tabsRect = this.tabContainer.getBoundingClientRect();
		const sliderRect = slider.getBoundingClientRect();

		// Position trigger inside slider, aligned to slider's right edge
		const sliderRightEdge = sliderRect.right - tabsRect.left;
		const triggerLeft = sliderRightEdge - triggerSize - 4; // 4px padding from edge

		// Set trigger position
		this.tabContainer.style.setProperty('--trigger-left', `${triggerLeft}px`);

		// Calculate slider end position for magic reveal (where slider shrinks to)
		// Position 4px from right edge
		const tabsWidth = tabsRect.width;
		const sliderEndLeft = tabsWidth - 6 - triggerSize; // 2px from right edge
		this.tabContainer.style.setProperty('--slider-end-left', `${sliderEndLeft}px`);
	}

	/**
	 * Hide the search trigger with animation
	 * @param {boolean} animate - Whether to animate the hiding
	 */
	hideSearchTrigger(animate = true) {
		if (!this.searchTrigger) return;

		// If not visible, nothing to hide
		if (!this.searchTrigger.classList.contains('is-visible')) {
			return;
		}

		if (animate) {
			// Add hiding class to trigger pop-out animation
			this.searchTrigger.classList.add('is-hiding');
			this.searchTrigger.classList.remove('is-visible');

			// Remove hiding class after animation completes
			setTimeout(() => {
				this.searchTrigger?.classList.remove('is-hiding');
			}, 200); // Match animation duration
		} else {
			// Instant hide
			this.searchTrigger.classList.remove('is-visible', 'is-hiding');
		}
	}

	/**
	 * Update the visibility of the search trigger based on current state
	 */
	updateSearchTriggerVisibility() {
		if (!this.searchTrigger || !this.inlineSearchContainer) {
			return;
		}

		const activeTab = this.tabContainer?.dataset?.activeTab || 'blog';
		const isWordsTab = activeTab === 'blog';
		// Search trigger is available on all device types where tabs are shown
		const isTabsVisible = this.currentDeviceType === 'mobile' || this.currentDeviceType === 'tablet' || this.currentDeviceType === 'desktop';

		if (!isWordsTab || !isTabsVisible || this.searchOverlayOpen) {
			this.hideSearchTrigger();
			return;
		}

		// Check if inline search is currently visible
		const rect = this.inlineSearchContainer.getBoundingClientRect();
		const isVisible = rect.top > 60 && rect.bottom > 0;

		if (isVisible) {
			this.hideSearchTrigger();
		} else {
			this.searchTrigger.classList.remove('is-hiding'); // Cancel any pending hide
			this.searchTrigger.classList.add('is-visible');
		}
	}

	/**
	 * Clean up search integration resources
	 */
	cleanupSearchIntegration() {
		// Remove event listeners
		if (this.boundListeners.handleSearchTriggerClick) {
			this.searchTrigger?.removeEventListener('click', this.boundListeners.handleSearchTriggerClick);
		}
		if (this.boundListeners.handleSearchInputSync) {
			this.tabsSearchInput?.removeEventListener('input', this.boundListeners.handleSearchInputSync);
		}
		if (this.boundListeners.handleOriginalSearchInput) {
			this.originalSearchInput?.removeEventListener('input', this.boundListeners.handleOriginalSearchInput);
		}
		if (this.boundListeners.handleSearchClear) {
			this.tabsSearchClear?.removeEventListener('click', this.boundListeners.handleSearchClear);
		}
		if (this.boundListeners.handleSearchKeydown) {
			document.removeEventListener('keydown', this.boundListeners.handleSearchKeydown);
		}
		if (this.boundListeners.handleSearchPostsOnlyClick) {
			this.tabsSearchPostsOnly?.removeEventListener('click', this.boundListeners.handleSearchPostsOnlyClick);
		}

		// Remove scroll listeners from all targets
		if (this.boundListeners.handleSearchScroll && this.scrollTargets) {
			this.scrollTargets.forEach(target => {
				target?.removeEventListener('scroll', this.boundListeners.handleSearchScroll);
			});
			this.scrollTargets.clear();
		}

		// Remove body class
		document.body.classList.remove('tabs-search-available');

		// Reset state
		this.searchOverlayOpen = false;
	}
}
