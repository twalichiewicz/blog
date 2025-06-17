/**
 * Mobile Tabs - Unified tab handling solution
 * This file handles all tab switching functionality and ensures consistent state
 * across window resizing and device orientation changes.
 */

import MobileTabs from './components/MobileTabs.js';

export function initializeMobileTabs() {
	// If an old instance exists and has a destroy method, call it
	if (window.mobileTabs && typeof window.mobileTabs.destroy === 'function') {
		try {
			window.mobileTabs.destroy();
		} catch (error) {
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

		// Check URL parameters for initial tab selection
		const urlParams = new URLSearchParams(window.location.search);
		const tabParam = urlParams.get('tab');
		
		if (tabParam === 'portfolio' || tabParam === 'works') {
			// Switch to Works tab
			tabs.switchTab('portfolio', false);
		} else if (tabParam === 'blog' || tabParam === 'words') {
			// Switch to Words tab
			tabs.switchTab('blog', false);
		}
	} catch (error) {
	}
}

document.addEventListener('DOMContentLoaded', initializeMobileTabs);

window.addEventListener('pageshow', function (event) {
	if (event.persisted) {
		// Page is loaded from bfcache, re-initialize mobile tabs
		initializeMobileTabs();
	}
});