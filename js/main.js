/**
 * Main JavaScript Entry Point
 * Import and initialize all modules
 */
// import ColorScheme from './components/ColorScheme.js'; // Commented out - file not found
import { initNavigation } from './utils/navigation.js';
import { initSectionAnimations, initColumnTitleScrollDetection } from './utils/animations.js';
import { initializeDesktopWidgets, cleanupDesktopWidgetsInstance } from './desktop-widgets.js';

document.addEventListener('DOMContentLoaded', function () {
	try {
		// Initialize navigation functionality
		initNavigation({
			navSelector: '#theme-nav',
			titleSelector: '.nav-title',
			mobileBreakpoint: 600
		});

		// Initialize color scheme functionality
		initColorScheme();

		// Initialize animations for sections
		initSectionAnimations({
			sectionSelector: '.section',
			blogPostSelector: '.blog-post',
			portfolioItemSelector: '.portfolio-item'
		});

		// Initialize column title scroll detection
		initColumnTitleScrollDetection({
			postsContentId: 'postsContent',
			projectsContentId: 'projectsContent'
		});

		console.log('San Diego theme initialized successfully');
	} catch (error) {
		console.error('Error initializing theme:', error);
	}
});

/**
 * Initialize color scheme functionality
 */
function initColorScheme() {
	const colorSchemeToggle = document.getElementById('theme-color-scheme-toggle');
	if (!colorSchemeToggle) return;

	try {
		const bodyEl = document.body;
		const options = colorSchemeToggle.getElementsByTagName('input');

		// Get the initial color scheme preference - Requires ColorScheme class
		/* Commented out due to missing ColorScheme.js
		const currentScheme = ColorScheme.getCurrent();
		if (currentScheme) {
			bodyEl.setAttribute('data-color-scheme', currentScheme);
		}
		*/

		// Set up event listeners for the color scheme toggle
		for (const option of options) {
			if (option.value === bodyEl.getAttribute('data-color-scheme')) { // Check against existing attribute
				option.checked = true;
			}
			option.addEventListener('change', (ev) => {
				const value = ev.target.value;
				// ColorScheme.setCurrent(value); // Requires ColorScheme class
				bodyEl.setAttribute('data-color-scheme', value); // Directly set attribute for now
				localStorage.setItem('theme', value); // Also save to localStorage
				for (const o of options) {
					o.checked = (o.value === value);
				}
			});
		}
	} catch (error) {
		console.error('Error initializing color scheme:', error);
	}
}

// Handle bfcache for widgets (or remove if module handles it)
window.addEventListener('pageshow', (event) => {
	if (event.persisted) {
		console.log("[main.js pageshow] Start - bfcache");
		// Desktop widgets initialization/cleanup is handled within its own module's pageshow
		console.log("[main.js pageshow] End - bfcache");
	}
});
