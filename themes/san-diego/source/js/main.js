/**
 * Main JavaScript Entry Point
 * Import and initialize all modules
 */
// import ColorScheme from './components/ColorScheme.js'; // Commented out - file not found
import { initSectionAnimations, initColumnTitleScrollDetection } from './utils/animations.js';
import { initializeSoundEffects } from './utils/sound-effects.js';

document.addEventListener('DOMContentLoaded', function () {
	try {
		// Initialize sound effects first
		initializeSoundEffects();

		// Navigation functionality removed - using project-specific navigation instead

		// Initialize color scheme functionality
		initColorScheme();

		// Initialize layout toggle functionality
		initLayoutToggle();

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

		// San Diego theme initialized successfully
	} catch (error) {
		// Error initializing theme
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
		// Error initializing color scheme
	}
}

/**
 * Initialize layout toggle functionality
 */
function initLayoutToggle() {
	const layoutToggle = document.querySelector('.layout-toggle');
	const blogElement = document.querySelector('.blog');

	if (!layoutToggle || !blogElement) return;

	// Set layout to grid by default and hide the toggle
	setLayout('grid');
	layoutToggle.style.display = 'none';

	function setLayout(layout) {
		layoutToggle.setAttribute('data-layout', layout);
		blogElement.setAttribute('data-layout', layout);
	}

	// Layout set to grid by default
}

// Handle bfcache for widgets (or remove if module handles it)
window.addEventListener('pageshow', (event) => {
	if (event.persisted) {
		// main.js pageshow Start - bfcache
		// Desktop widgets functionality removed
		// main.js pageshow End - bfcache
	}
});
