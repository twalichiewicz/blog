/**
 * Mobile Tabs - Unified tab handling solution
 * This file handles all tab switching functionality and ensures consistent state
 * across window resizing and device orientation changes.
 */

import MobileTabs from './components/MobileTabs.js';

export function initializeMobileTabs() {
	console.log('[MobileTabs] initializeMobileTabs called');
	
	// Additional check: if we're on a standalone project page (not dynamic content)
	const currentPath = window.location.pathname;
	const isStandaloneProjectPage = currentPath.includes('/20') && 
									currentPath !== '/' && 
									!currentPath.includes('?') &&
									!document.querySelector('.blog-content'); // No dynamic content container
	
	if (isStandaloneProjectPage) {
		console.log('[MobileTabs] On standalone project page, skipping initialization');
		return;
	}
	
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
			return;
		}
		
		console.log('[MobileTabs] All elements found, proceeding with initialization');
		initializeTabsInternal();
	};
	
	// Try immediately, then with small delay if elements not ready
	if (document.querySelector('.tabs-wrapper')) {
		checkAndInitialize();
	} else {
		console.log('[MobileTabs] Elements not ready, trying with delay');
		setTimeout(checkAndInitialize, 50);
		// Add another fallback check
		setTimeout(checkAndInitialize, 200);
	}
}

function initializeTabsInternal() {
	console.log('[MobileTabs] initializeTabsInternal starting');

	// If an old instance exists and has a destroy method, call it
	if (window.mobileTabs && typeof window.mobileTabs.destroy === 'function') {
		try {
			console.log('[MobileTabs] Destroying existing instance');
			window.mobileTabs.destroy();
		} catch (error) {
			// Error handling tabs - non-critical UI component
			console.warn('[MobileTabs] Error destroying existing instance:', error);
		}
	}

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
	}
}

document.addEventListener('DOMContentLoaded', initializeMobileTabs);

window.addEventListener('pageshow', function (event) {
	if (event.persisted) {
		// Page is loaded from bfcache, re-initialize mobile tabs
		initializeMobileTabs();
	}
});