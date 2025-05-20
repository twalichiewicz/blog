/**
 * Mobile Tabs - Unified tab handling solution
 * This file handles all tab switching functionality and ensures consistent state
 * across window resizing and device orientation changes.
 */

import MobileTabs from './components/MobileTabs.js';

export function initializeMobileTabs() {
	console.log('[mobile-tabs.js] initializeMobileTabs Start');
	// If an old instance exists and has a destroy method, call it
	if (window.mobileTabs && typeof window.mobileTabs.destroy === 'function') {
		try {
			window.mobileTabs.destroy();
		} catch (error) {
			console.error('Error destroying previous MobileTabs instance:', error);
		}
	}

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
	} catch (error) {
		console.error('Error initializing mobile tabs:', error);
	}
	console.log('[mobile-tabs.js] initializeMobileTabs End');
}

document.addEventListener('DOMContentLoaded', initializeMobileTabs);

window.addEventListener('pageshow', function (event) {
	if (event.persisted) {
		console.log('[mobile-tabs.js pageshow] Start - bfcache');
		// Page is loaded from bfcache, re-initialize mobile tabs
		console.log('Page loaded from bfcache, re-initializing mobile tabs.');
		initializeMobileTabs();
		console.log('[mobile-tabs.js pageshow] End - bfcache');
	}
});