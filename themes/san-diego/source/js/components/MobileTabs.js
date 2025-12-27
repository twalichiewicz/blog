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
			searchBarSelector: '.search-bar',
			activeClass: 'active',
			transitionDuration: 400,
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
		this.initialRenderComplete = false;
		this.tabScrollStates = new Map(); // Track whether each tab has already applied scroll-reset logic
		this.fadeTimeout = null;
		this.fadeInTimeout = null;
		this.initialRenderTimeout = null;
		this.scrollResetTimeouts = new Map(); // Track pending scroll resets per tab
		this.animationSuppressedUntil = 0;
		this.searchBarVisibilityTimeout = null;
		this.pendingLayoutCleanup = null;

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
		const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		console.log('[MobileTabs] Caching DOM elements (Safari:', isSafari + ')');
		
		// Clear existing references first (Safari fix)
		this.tabsWrapper = null;
		this.tabContainer = null;
		this.tabButtons = null;
		this.postsContent = null;
		this.projectsContent = null;
		this.searchBar = null;
		
		// Re-query all elements
		this.tabsWrapper = document.querySelector(this.config.tabsWrapperSelector);
		this.tabContainer = document.querySelector(this.config.tabContainerSelector);

		if (!this.tabContainer) {
			return;
		}

		this.tabButtons = document.querySelectorAll(this.config.tabButtonSelector);
		this.postsContent = document.getElementById(this.config.postsContentId);
		this.projectsContent = document.getElementById(this.config.projectsContentId);
		this.searchBar = document.querySelector(this.config.searchBarSelector);

		this.ensurePaneClasses();
		
		console.log('[MobileTabs] Cached elements:', {
			tabButtons: this.tabButtons.length,
			postsContent: !!this.postsContent,
			projectsContent: !!this.projectsContent,
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
		this.searchBar = null;
		
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
			
			if (tabParam && (tabParam === 'portfolio' || tabParam === 'blog')) {
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
				
				// If coming from a project, default to 'portfolio', otherwise 'blog'
				targetTabType = isFromProject ? 'portfolio' : 'blog';
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
		if (!this.postsContent || !this.projectsContent) {
			this.cacheElements();
			// If still null after re-caching, exit
			if (!this.postsContent || !this.projectsContent) {
				this.markInitialRenderComplete(type, 0);
				return;
			}
		}

		this.ensurePaneClasses();

		const shouldAnimate = animate && this.initialRenderComplete && !this.areAnimationsSuppressed();

		// Desktop mode: show both panes side-by-side without animation
		if (this.currentDeviceType === 'desktop') {
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
			if (this.searchBar) this.searchBar.style.display = 'block';

			// Hide tabs wrapper on desktop
			if (this.tabsWrapper) this.tabsWrapper.style.display = 'none';
			this.resetScrollPositionIfNeeded('blog', this.postsContent);
			this.resetScrollPositionIfNeeded('portfolio', this.projectsContent);
			this.markInitialRenderComplete(type, 0);
			return;
		}

		// Tablet/mobile: ensure tabs wrapper is visible
		if (this.tabsWrapper) this.tabsWrapper.style.display = 'block';

		if (type === 'blog') {
		const { totalDuration, fadeOutDuration } = this.applyTabFade(this.postsContent, this.projectsContent, shouldAnimate);

		this.scheduleSearchBarVisibility(true, shouldAnimate ? fadeOutDuration : 0);

			if (window.initializePostsOnlyButton) {
				window.initializePostsOnlyButton();
			}

			this.scheduleScrollReset('blog', this.postsContent, shouldAnimate, totalDuration);
			this.markInitialRenderComplete(type, totalDuration);
		} else if (type === 'portfolio') {
		const { totalDuration, fadeOutDuration } = this.applyTabFade(this.projectsContent, this.postsContent, shouldAnimate);

		this.scheduleSearchBarVisibility(false, shouldAnimate ? fadeOutDuration : 0);

			if (window.initializeProjectToggle) {
				window.initializeProjectToggle();
			}

			this.scheduleScrollReset('portfolio', this.projectsContent, shouldAnimate, totalDuration);
			this.markInitialRenderComplete(type, totalDuration);

			// Dispatch portfolio-loaded event to trigger carousel initialization
			setTimeout(() => {
				document.dispatchEvent(new Event('portfolio-loaded'));

				// Also check if carousel needs position restoration
				if (window._notebookCarousel && window._notebookCarousel.reinitialize) {
					window._notebookCarousel.reinitialize();
				}
			}, 50);
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
		// If we're already on the requested tab, do nothing to avoid replaying animations
		const activeTab =
			this.tabContainer?.dataset?.activeTab ||
			Array.from(this.tabButtons || []).find(btn => btn.classList?.contains(this.config.activeClass))?.dataset?.type ||
			null;

		if (!this.tabContainer || !this.tabButtons || this.tabButtons.length === 0) {
			return;
		}

		if (activeTab === type) {
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

		if (this.currentDeviceType !== 'mobile') {
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
		[this.postsContent, this.projectsContent].forEach(pane => {
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

			this.tabScrollStates.set(tabType, { initialScrollResetDone: true });
		});
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
}
