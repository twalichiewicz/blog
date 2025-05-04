/**
 * Main JavaScript Entry Point
 * Import and initialize all modules
 */
import ColorScheme from './utils/color-scheme.js';
import { initNavigation } from './utils/navigation.js';
import { initSectionAnimations, initColumnTitleScrollDetection } from './utils/animations.js';

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

		// Get the initial color scheme preference
		const currentScheme = ColorScheme.getCurrent();
		if (currentScheme) {
			bodyEl.setAttribute('data-color-scheme', currentScheme);
		}

		// Set up event listeners for the color scheme toggle
		for (const option of options) {
			if (option.value === bodyEl.getAttribute('data-color-scheme')) {
				option.checked = true;
			}
			option.addEventListener('change', (ev) => {
				const value = ev.target.value;
				ColorScheme.setCurrent(value);
				for (const o of options) {
					o.checked = (o.value === value);
				}
			});
		}
	} catch (error) {
		console.error('Error initializing color scheme:', error);
	}
}
