/**
 * Mobile Tabs - Unified tab handling solution
 * This file handles all tab switching functionality and ensures consistent state
 * across window resizing and device orientation changes.
 */

import MobileTabs from './components/MobileTabs.js';

// Debounce initialization to prevent multiple rapid calls
let initializationTimeout = null;
let isInitializing = false;

export function initializeMobileTabs() {
	console.log('[MobileTabs] initializeMobileTabs called');
	
	// Clear any pending initialization
	if (initializationTimeout) {
		clearTimeout(initializationTimeout);
		initializationTimeout = null;
	}
	
	// Prevent concurrent initialization
	if (isInitializing) {
		console.log('[MobileTabs] Already initializing, queuing for later');
		initializationTimeout = setTimeout(() => initializeMobileTabs(), 300);
		return;
	}
	
	// Additional check: if we're on a standalone project page (not dynamic content)
	const currentPath = window.location.pathname;
	const isStandaloneProjectPage = currentPath.includes('/20') && 
									currentPath !== '/' && 
									!currentPath.includes('?') &&
									!document.querySelector('.blog-content'); // No dynamic content container
	
	if (isStandaloneProjectPage) {
		console.log('[MobileTabs] On standalone project page, skipping initialization');
		isInitializing = false;
		return;
	}
	
	isInitializing = true;
	
	// Check if we actually have tab content in the DOM
	// Add a small delay to ensure DOM is ready after innerHTML replacement
	const checkAndInitialize = () => {
		const tabsWrapper = document.querySelector('.tabs-wrapper');
		const postsContent = document.getElementById('postsContent');
		const projectsContent = document.getElementById('projectsContent');
		
		console.log('[MobileTabs] DOM check:', {
			tabsWrapper: !!tabsWrapper,
			postsContent: !!postsContent,
			projectsContent: !!projectsContent,
			url: window.location.pathname
		});
		
		// If we don't have the required tab elements, don't initialize
		if (!tabsWrapper || !postsContent || !projectsContent) {
			console.log('[MobileTabs] Required tab elements not found, skipping initialization');
			isInitializing = false;
			return;
		}
		
		console.log('[MobileTabs] All elements found, proceeding with initialization');
		initializeTabsInternal();
		isInitializing = false;
	};
	
	// Try immediately, then with small delay if elements not ready
	if (document.querySelector('.tabs-wrapper')) {
		checkAndInitialize();
	} else {
		console.log('[MobileTabs] Elements not ready, trying with delay');
		setTimeout(() => {
			checkAndInitialize();
			// If still not initialized after delay, clear the flag
			if (!window.mobileTabs) {
				isInitializing = false;
			}
		}, 50);
		// Add another fallback check
		setTimeout(() => {
			checkAndInitialize();
			isInitializing = false; // Final attempt, always clear
		}, 200);
	}
}

function initializeTabsInternal() {
	console.log('[MobileTabs] initializeTabsInternal starting');

	// If an old instance exists and has a destroy method, call it
	if (window.mobileTabs && typeof window.mobileTabs.destroy === 'function') {
		try {
			console.log('[MobileTabs] Destroying existing instance');
			window.mobileTabs.destroy();
			window.mobileTabs = null; // Clear the reference
		} catch (error) {
			// Error handling tabs - non-critical UI component
			console.warn('[MobileTabs] Error destroying existing instance:', error);
			window.mobileTabs = null; // Clear anyway
		}
	}

	// Ensure we have fresh DOM elements
	const tabContainer = document.querySelector('.mobile-tabs');
	const tabButtons = document.querySelectorAll('.tab-button');
	
	console.log('[MobileTabs] Pre-creation check:', {
		tabContainer: !!tabContainer,
		tabButtons: tabButtons.length,
		DOM: document.readyState
	});

	try {
		console.log('[MobileTabs] Creating new MobileTabs instance');
		// Initialize mobile tabs component with default configuration
		const tabs = new MobileTabs({
			tabsWrapperSelector: '.tabs-wrapper',
			tabContainerSelector: '.mobile-tabs',
			tabButtonSelector: '.tab-button',
			postsContentId: 'postsContent',
			projectsContentId: 'projectsContent',
			searchBarSelector: '.search-bar'
		});

		// Store the new tabs instance in window for potential external access
		window.mobileTabs = tabs;
		console.log('[MobileTabs] New instance created and stored');
		
		// Verify the instance is working
		setTimeout(() => {
			if (window.mobileTabs) {
				const buttons = document.querySelectorAll('.tab-button');
				console.log('[MobileTabs] Post-creation verification:', {
					instanceExists: !!window.mobileTabs,
					buttonsFound: buttons.length,
					listenersMap: window.mobileTabs.tabClickListeners?.size || 0
				});
			}
		}, 100);

		// Check URL parameters for initial tab selection
		const urlParams = new URLSearchParams(window.location.search);
		const tabParam = urlParams.get('tab');
		
		if (tabParam === 'portfolio' || tabParam === 'works') {
			// Switch to Works tab
			console.log('[MobileTabs] Switching to portfolio tab from URL param');
			tabs.switchTab('portfolio', false);
		} else if (tabParam === 'blog' || tabParam === 'words') {
			// Switch to Words tab
			console.log('[MobileTabs] Switching to blog tab from URL param');
			tabs.switchTab('blog', false);
		}
		
		console.log('[MobileTabs] Initialization complete');
	} catch (error) {
		console.error('[MobileTabs] Error during initialization:', error);
		window.mobileTabs = null;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	console.log('[MobileTabs] DOMContentLoaded fired');
	initializeMobileTabs();
});

window.addEventListener('pageshow', function (event) {
	if (event.persisted) {
		console.log('[MobileTabs] Pageshow with persisted=true');
		// Page is loaded from bfcache, re-initialize mobile tabs
		initializeMobileTabs();
	}
});

// Global diagnostic handler to check if clicks are working at all
if (typeof window._mobiletabs_diagnostic === 'undefined') {
	window._mobiletabs_diagnostic = true;
	document.addEventListener('click', (e) => {
		if (e.target.closest('.tab-button')) {
			const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
			console.log('[MobileTabs-Diagnostic] Tab button clicked:', {
				target: e.target,
				closest: e.target.closest('.tab-button'),
				type: e.target.closest('.tab-button')?.dataset.type,
				instanceExists: !!window.mobileTabs,
				defaultPrevented: e.defaultPrevented,
				isSafari: isSafari,
				listenersAttached: window.mobileTabs?.tabClickListeners?.size || 0,
				buttonStillInDOM: document.contains(e.target.closest('.tab-button'))
			});
			
			// Safari-specific debugging: check if the click will actually be handled
			if (isSafari && window.mobileTabs) {
				const button = e.target.closest('.tab-button');
				const hasListener = window.mobileTabs.tabClickListeners.has(button);
				console.log('[Safari-Debug] Button has listener:', hasListener);
				if (!hasListener) {
					console.error('[Safari-Debug] Button missing click listener! Re-caching elements...');
					window.mobileTabs.cacheElements();
					window.mobileTabs.setupEventListeners();
				}
			}
		}
	}, true); // Use capture phase
}