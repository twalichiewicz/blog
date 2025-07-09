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
	
	// Clear any pending initialization
	if (initializationTimeout) {
		clearTimeout(initializationTimeout);
		initializationTimeout = null;
	}
	
	// Prevent concurrent initialization
	if (isInitializing) {
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
			isInitializing = false;
			return;
		}
		
		initializeTabsInternal();
		isInitializing = false;
	};
	
	// Try immediately, then with small delay if elements not ready
	if (document.querySelector('.tabs-wrapper')) {
		checkAndInitialize();
	} else {
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

	// If an old instance exists and has a destroy method, call it
	if (window.mobileTabs && typeof window.mobileTabs.destroy === 'function') {
		try {
			window.mobileTabs.destroy();
			window.mobileTabs = null; // Clear the reference
		} catch (error) {
			// Error handling tabs - non-critical UI component
			window.mobileTabs = null; // Clear anyway
		}
	}

	// Ensure we have fresh DOM elements
	const tabContainer = document.querySelector('.mobile-tabs');
	const tabButtons = document.querySelectorAll('.tab-button');
	

	try {
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
		
		// Verify the instance is working
		setTimeout(() => {
			if (window.mobileTabs) {
				const buttons = document.querySelectorAll('.tab-button');
			}
		}, 100);

		// Check URL parameters for initial tab selection
		const urlParams = new URLSearchParams(window.location.search);
		const tabParam = urlParams.get('tab');
		
		if (tabParam === 'portfolio' || tabParam === 'works') {
			// Switch to Works tab
			tabs.switchTab('portfolio', false);
		}
		
		// Check sessionStorage for tab switch request from other pages
		if (sessionStorage.getItem('switchToPortfolio') === 'true') {
			sessionStorage.removeItem('switchToPortfolio');
			// Small delay to ensure everything is loaded
			setTimeout(() => {
				tabs.switchTab('portfolio', true);
			}, 100);
		} else if (tabParam === 'blog' || tabParam === 'words') {
			// Switch to Words tab
			tabs.switchTab('blog', false);
		}
		
	} catch (error) {
		window.mobileTabs = null;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	initializeMobileTabs();
});

window.addEventListener('pageshow', function (event) {
	if (event.persisted) {
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
				if (!hasListener) {
					window.mobileTabs.cacheElements();
					window.mobileTabs.setupEventListeners();
				}
			}
		}
	}, true); // Use capture phase
}