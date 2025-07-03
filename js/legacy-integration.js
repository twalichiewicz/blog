/**
 * Legacy Integration Layer
 * Provides compatibility between new architecture and existing systems
 * This allows gradual migration without breaking existing functionality
 */

// Prevent multiple loading of legacy integration
if (window.useNewArchitecture !== undefined) {
	console.log('[LegacyIntegration] Already loaded, skipping duplicate initialization');
	return;
}

console.log('[LegacyIntegration] Legacy integration layer loaded');

// For now, use legacy mode by default
let useNewArchitecture = false;
window.useNewArchitecture = useNewArchitecture; // Store globally to prevent duplicates
let stateManager, eventBus, safeVisibilityManager;

/**
 * Set up hooks between new and old systems
 */
function setupIntegrationHooks() {
	if (!useNewArchitecture) return;

	// Hook into existing tab switching
	const originalSwitchTab = window.switchTab;
	if (originalSwitchTab) {
		window.switchTab = function(tab, userInitiated = true) {
			console.log('[LegacyIntegration] Intercepting switchTab call:', tab);
			
			if (stateManager) {
				stateManager.setActiveTab(tab, userInitiated, 'legacy');
			} else {
				// Fallback to original function
				originalSwitchTab.call(this, tab, userInitiated);
			}
		};
	}

	// Hook into existing URL parameter processing
	const originalProcessUrlParams = window.processUrlParameters;
	if (originalProcessUrlParams) {
		window.processUrlParameters = function() {
			console.log('[LegacyIntegration] Intercepting URL parameter processing');
			
			if (stateManager && stateManager.getStateValue('isInitialized')) {
				stateManager.processUrlParameters();
			} else {
				// Wait for initialization or fallback
				if (stateManager) {
					eventBus.once('allSystemsReady', () => {
						stateManager.processUrlParameters();
					});
				} else {
					originalProcessUrlParams.call(this);
				}
			}
		};
	}

	// Provide legacy-compatible functions
	window.setActiveTab = function(tab, userInitiated = true) {
		if (stateManager) {
			stateManager.setActiveTab(tab, userInitiated, 'legacy-api');
		}
	};

	window.getCurrentTab = function() {
		if (stateManager) {
			return stateManager.getStateValue('activeTab');
		}
		return null;
	};

	// Forward new architecture events to legacy systems
	eventBus.on('tabChanged', (data) => {
		const { newTab, oldTab } = data;
		
		// Trigger legacy events
		if (window.SD && window.SD.events) {
			window.SD.events.emit('tab:changed', { newTab, oldTab });
		}
		
		// Update legacy global variables
		if (window.activeTab !== undefined) {
			window.activeTab = newTab;
		}
		
		console.log('[LegacyIntegration] Forwarded tab change to legacy systems:', { newTab, oldTab });
	});

	// Forward visibility changes
	eventBus.on('contentVisibilityChanged', (data) => {
		if (window.SD && window.SD.events) {
			window.SD.events.emit('content:visibility-changed', data);
		}
	});

	console.log('[LegacyIntegration] Integration hooks set up successfully');
}

/**
 * Compatibility check - determines if new architecture should be used
 */
function shouldUseNewArchitecture() {
	return useNewArchitecture && 
	       stateManager && 
	       stateManager.getStateValue('isInitialized');
}

/**
 * Safe tab switching that works with both systems
 */
function safeTabSwitch(tab, userInitiated = true) {
	if (shouldUseNewArchitecture()) {
		stateManager.setActiveTab(tab, userInitiated, 'safe-switch');
	} else {
		// Fall back to direct DOM manipulation
		legacyTabSwitch(tab);
	}
}

/**
 * Legacy tab switching using direct DOM manipulation
 */
function legacyTabSwitch(tab, userInitiated = false) {
	console.log('[LegacyIntegration] Using legacy tab switch for:', tab);
	
	// Play slider sound effect when user switches tabs
	if (userInitiated && window.soundEffects && window.soundEffects.isEnabled()) {
		window.soundEffects.play('slider');
	}
	
	const tabButtons = document.querySelectorAll('.tab-button');
	const postsContent = document.getElementById('postsContent');
	const projectsContent = document.getElementById('projectsContent');
	const tabsWrapper = document.querySelector('.tabs-wrapper');
	const searchBar = document.querySelector('.search-bar');
	
	console.log('[LegacyIntegration] Found elements:', {
		tabButtons: tabButtons.length,
		postsContent: !!postsContent,
		projectsContent: !!projectsContent,
		tabsWrapper: !!tabsWrapper
	});
	
	// Detect device type (using > 1023 to match CSS max-width: 1023px)
	const isDesktop = window.innerWidth > 1023;
	console.log('[LegacyIntegration] Device type:', isDesktop ? 'desktop' : 'mobile');
	
	// Update tab buttons
	tabButtons.forEach(button => {
		if (button.dataset.type === tab) {
			button.classList.add('active');
			button.setAttribute('aria-selected', 'true');
		} else {
			button.classList.remove('active');
			button.setAttribute('aria-selected', 'false');
		}
	});
	
	// Update tab container data attribute
	const tabContainer = document.querySelector('.mobile-tabs');
	if (tabContainer) {
		tabContainer.setAttribute('data-active-tab', tab);
	}
	
	// Handle content visibility - now unified for all screen sizes since tabs are visible everywhere
	if (tabsWrapper) {
		tabsWrapper.classList.add('js-initialized');
		console.log('[LegacyIntegration] Added js-initialized to tabs-wrapper');
		
		// Initialize slider if not already present
		initializeMobileTabsSlider();
	}
	
	// Apply tab switching logic for ALL screen sizes - using classes only
	if (tab === 'blog') {
		if (postsContent) {
			// Remove all inline styles to let CSS handle visibility
			postsContent.style.display = '';
			postsContent.style.opacity = '';
			postsContent.style.position = '';
			postsContent.style.left = '';
			postsContent.classList.add('js-active');
			postsContent.classList.remove('js-inactive');
		}
		if (projectsContent) {
			// Remove all inline styles to let CSS handle visibility
			projectsContent.style.display = '';
			projectsContent.style.opacity = '';
			projectsContent.style.position = '';
			projectsContent.style.left = '';
			projectsContent.classList.add('js-inactive');
			projectsContent.classList.remove('js-active');
		}
		if (searchBar) {
			searchBar.classList.add('js-visible');
			searchBar.classList.remove('js-hidden');
		}
	} else if (tab === 'portfolio') {
		if (postsContent) {
			// Remove all inline styles to let CSS handle visibility
			postsContent.style.display = '';
			postsContent.style.opacity = '';
			postsContent.style.position = '';
			postsContent.style.left = '';
			postsContent.classList.add('js-inactive');
			postsContent.classList.remove('js-active');
		}
		if (projectsContent) {
			// Remove all inline styles to let CSS handle visibility
			projectsContent.style.display = '';
			projectsContent.style.opacity = '';
			projectsContent.style.position = '';
			projectsContent.style.left = '';
			projectsContent.classList.add('js-active');
			projectsContent.classList.remove('js-inactive');
		}
		if (searchBar) {
			searchBar.classList.add('js-hidden');
			searchBar.classList.remove('js-visible');
		}
		
		// Trigger portfolio-loaded event for carousel initialization
		setTimeout(() => {
			console.log('[LegacyIntegration] Dispatching portfolio-loaded event');
			document.dispatchEvent(new Event('portfolio-loaded'));
			
			// Also check if carousel needs position restoration
			if (window._notebookCarousel && window._notebookCarousel.reinitialize) {
				console.log('[LegacyIntegration] Triggering carousel reinitialization');
				window._notebookCarousel.reinitialize();
			}
		}, 50);
	}
	
	// Update URL if user initiated
	if (userInitiated) {
		const url = new URL(window.location);
		url.searchParams.set('tab', tab);
		window.history.pushState({ tab }, '', url);
	}
	
	// Update slider position after tab switch (with small delay to ensure DOM is updated)
	// Now update slider on ALL screen sizes since tabs are visible everywhere
	setTimeout(() => {
		updateMobileTabsSlider();
	}, 50);
	
	console.log('[LegacyIntegration] Tab switch complete for:', tab);
}

/**
 * Initialize legacy integration
 */
function initLegacyIntegration() {
	console.log('[LegacyIntegration] Initializing legacy integration layer');
	
	// IMMEDIATE mobile tabs initialization (run immediately, not in DOMContentLoaded)
	function initializeMobileTabsImmediate() {
		const tabsWrapper = document.querySelector('.tabs-wrapper');
		const mobileTabs = document.querySelector('.mobile-tabs');
		const isDesktop = window.innerWidth > 1023;
		
		if (tabsWrapper && mobileTabs) {
			console.log('[LegacyIntegration] IMMEDIATE: Initializing tabs for all screen sizes');
			tabsWrapper.classList.add('js-initialized');
			
			// Initialize slider on all screen sizes
			let slider = mobileTabs.querySelector('.mobile-tabs-slider');
			if (!slider) {
				slider = document.createElement('div');
				slider.className = 'mobile-tabs-slider';
				mobileTabs.appendChild(slider);
			}
			mobileTabs.classList.add('has-slider-element');
			
			console.log('[LegacyIntegration] IMMEDIATE: Tabs initialized for', isDesktop ? 'desktop' : 'mobile');
		} else {
			console.log('[LegacyIntegration] IMMEDIATE: Elements not found, skipping tab init');
		}
	}
	
	// Try immediate initialization - run multiple times to ensure it works
	const tryInitialization = () => {
		const tabsWrapper = document.querySelector('.tabs-wrapper');
		if (tabsWrapper) {
			initializeMobileTabsImmediate();
			return true;
		}
		return false;
	};

	// Try immediately
	if (!tryInitialization()) {
		// If elements don't exist yet, wait for DOM
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				setTimeout(tryInitialization, 100); // Small delay to ensure all elements are ready
			});
		} else {
			// DOM is ready but elements might still be loading
			setTimeout(tryInitialization, 100);
		}
	}
	
	// Set up click handlers for tab buttons
	document.addEventListener('DOMContentLoaded', () => {
		console.log('[LegacyIntegration] DOM loaded, setting up tab handlers');
		
		// Mark body as JS loaded to enable CSS transitions
		document.body.classList.add('js-loaded');
		
		const tabButtons = document.querySelectorAll('.tab-button');
		const tabsWrapper = document.querySelector('.tabs-wrapper');
		const mobileTabs = document.querySelector('.mobile-tabs');
		
		console.log('[LegacyIntegration] Found elements:', {
			tabButtons: tabButtons.length,
			tabsWrapper: !!tabsWrapper,
			mobileTabs: !!mobileTabs
		});
		
		if (tabsWrapper) {
			console.log('[LegacyIntegration] tabs-wrapper classes:', tabsWrapper.className);
			console.log('[LegacyIntegration] tabs-wrapper computed style:', {
				display: window.getComputedStyle(tabsWrapper).display,
				opacity: window.getComputedStyle(tabsWrapper).opacity,
				visibility: window.getComputedStyle(tabsWrapper).visibility
			});
		}
		
		if (mobileTabs) {
			console.log('[LegacyIntegration] mobile-tabs classes:', mobileTabs.className);
			console.log('[LegacyIntegration] mobile-tabs computed style:', {
				display: window.getComputedStyle(mobileTabs).display,
				opacity: window.getComputedStyle(mobileTabs).opacity,
				visibility: window.getComputedStyle(mobileTabs).visibility
			});
		}
		
		tabButtons.forEach(button => {
			// Remove any existing listeners
			button.replaceWith(button.cloneNode(true));
		});
		
		// Re-query after cloning
		const newTabButtons = document.querySelectorAll('.tab-button');
		newTabButtons.forEach(button => {
			button.addEventListener('click', (e) => {
				e.preventDefault();
				const tab = e.currentTarget.dataset.type;
				console.log('[LegacyIntegration] Tab button clicked:', tab);
				legacyTabSwitch(tab, true);
			});
		});
		
		// Mobile tabs should already be initialized by immediate function above
		
		// Set initial state immediately to prevent flash
		const postsContent = document.getElementById('postsContent');
		const projectsContent = document.getElementById('projectsContent');
		const searchBar = document.querySelector('.search-bar');
		
		// Initialize with blog tab active by default
		if (postsContent) {
			postsContent.classList.add('js-active');
			postsContent.classList.remove('js-inactive');
		}
		if (projectsContent) {
			projectsContent.classList.remove('js-active');
			projectsContent.classList.add('js-inactive');
		}
		if (searchBar) {
			searchBar.classList.add('js-visible');
			searchBar.classList.remove('js-hidden');
		}
		
		// Set initial tab state after a small delay
		setTimeout(() => {
			const urlParams = new URLSearchParams(window.location.search);
			const tabParam = urlParams.get('tab');
			let initialTab = 'blog'; // default
			
			if (tabParam && (tabParam === 'blog' || tabParam === 'portfolio')) {
				initialTab = tabParam;
				console.log('[LegacyIntegration] Using URL parameter tab:', tabParam);
			} else {
				// Check referrer for default tab
				const referrer = document.referrer;
				if (referrer && referrer.includes('/20') && !referrer.includes('#')) {
					initialTab = 'portfolio';
					console.log('[LegacyIntegration] Setting portfolio tab based on referrer');
				}
			}
			
			console.log('[LegacyIntegration] Setting initial tab:', initialTab);
			legacyTabSwitch(initialTab, false);
		}, 100);
		
		// Handle window resize
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				// Re-apply current tab state on resize
				const currentTab = getCurrentActiveTab();
				if (currentTab) {
					console.log('[LegacyIntegration] Handling resize, re-applying tab:', currentTab);
					legacyTabSwitch(currentTab, false);
					
					// Initialize slider when transitioning to mobile
					const isDesktop = window.innerWidth > 1023;
					if (!isDesktop && tabsWrapper && mobileTabs) {
						console.log('[LegacyIntegration] Transitioning to mobile, initializing slider');
						initializeMobileTabsSlider();
					}
				}
			}, 100);
		});
	});
}

/**
 * Get current active tab
 */
function getCurrentActiveTab() {
	const activeButton = document.querySelector('.tab-button.active');
	return activeButton ? activeButton.dataset.type : null;
}

/**
 * Initialize mobile tabs slider
 */
function initializeMobileTabsSlider() {
	const tabContainer = document.querySelector('.mobile-tabs');
	if (!tabContainer) return;

	// Get or create slider element
	let slider = tabContainer.querySelector('.mobile-tabs-slider');
	if (!slider) {
		console.log('[LegacyIntegration] Creating mobile-tabs-slider');
		slider = document.createElement('div');
		slider.className = 'mobile-tabs-slider';
		tabContainer.appendChild(slider);
	}

	// Ensure the class to hide the ::after pseudo-element is present
	tabContainer.classList.add('has-slider-element');

	// Update slider position for active tab
	updateMobileTabsSlider();
}

/**
 * Update mobile tabs slider position
 */
function updateMobileTabsSlider() {
	const tabContainer = document.querySelector('.mobile-tabs');
	const slider = tabContainer?.querySelector('.mobile-tabs-slider');
	
	if (!tabContainer || !slider) return;

	const activeButton = tabContainer.querySelector('.tab-button.active');
	if (!activeButton) return;

	try {
		// Get the active button's position and dimensions
		const buttonRect = activeButton.getBoundingClientRect();
		const containerRect = tabContainer.getBoundingClientRect();

		// Get computed styles to account for potential padding differences
		const containerStyle = window.getComputedStyle(tabContainer);
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

		console.log('[LegacyIntegration] Updated slider position:', { left, width });
	} catch (error) {
		console.warn('[LegacyIntegration] Error updating slider:', error);
	}
}

// Export functions for global access
window.safeTabSwitch = safeTabSwitch;
window.shouldUseNewArchitecture = shouldUseNewArchitecture;
window.legacyTabSwitch = legacyTabSwitch;

// Initialize with retry mechanism
function initWithRetry() {
	const maxRetries = 5;
	let retryCount = 0;
	
	function tryInit() {
		const tabsWrapper = document.querySelector('.tabs-wrapper');
		const mobileTabs = document.querySelector('.mobile-tabs');
		
		if (tabsWrapper && mobileTabs) {
			console.log('[LegacyIntegration] Elements found, initializing...');
			initLegacyIntegration();
			return true;
		} else if (retryCount < maxRetries) {
			retryCount++;
			console.log(`[LegacyIntegration] Elements not ready, retry ${retryCount}/${maxRetries} in 50ms...`);
			setTimeout(tryInit, 50);
			return false;
		} else {
			console.warn('[LegacyIntegration] Failed to find elements after', maxRetries, 'retries');
			return false;
		}
	}
	
	// Try immediately first
	if (!tryInit()) {
		// If immediate fails, also try on DOMContentLoaded as backup
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', tryInit);
		}
	}
}

// Initialize with retry mechanism
initWithRetry();

// AGGRESSIVE FALLBACK: Force initialization after delay if not already done
setTimeout(() => {
	const tabsWrapper = document.querySelector('.tabs-wrapper');
	if (tabsWrapper && !tabsWrapper.classList.contains('js-initialized')) {
		console.warn('[LegacyIntegration] FALLBACK: Force initializing tabs after 1 second delay');
		initLegacyIntegration();
	}
}, 1000);

// NUCLEAR FALLBACK: Force show tabs after 2 seconds no matter what
setTimeout(() => {
	const tabsWrapper = document.querySelector('.tabs-wrapper');
	const mobileTabs = document.querySelector('.mobile-tabs');
	
	if (tabsWrapper) {
		tabsWrapper.style.opacity = '1';
		tabsWrapper.style.visibility = 'visible';
		tabsWrapper.style.display = 'block';
		tabsWrapper.classList.add('js-initialized', 'force-visible');
	}
	
	if (mobileTabs) {
		mobileTabs.style.opacity = '1';
		mobileTabs.style.visibility = 'visible';
		mobileTabs.style.display = 'flex';
		mobileTabs.classList.add('force-visible');
	}
	
	console.log('[LegacyIntegration] NUCLEAR: Force showed tabs after 2 second delay');
}, 2000);

console.log('[LegacyIntegration] Legacy integration layer loaded');