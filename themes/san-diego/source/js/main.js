/**
 * Main JavaScript Entry Point
 * Import and initialize all modules
 */
import { initSectionAnimations, initColumnTitleScrollDetection } from './utils/animations.js';
import { initializeSoundEffects } from './utils/sound-effects.js';

document.addEventListener('DOMContentLoaded', function () {
	// Initialize sound effects first
	initializeSoundEffects();

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
});

/**
 * Initialize color scheme functionality
 */
function initColorScheme() {
	const colorSchemeToggle = document.getElementById('theme-color-scheme-toggle');
	if (!colorSchemeToggle) return;

	const bodyEl = document.body;
	const options = colorSchemeToggle.getElementsByTagName('input');

	// Load saved theme preference
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme) {
		bodyEl.setAttribute('data-color-scheme', savedTheme);
	}

	// Set up event listeners for the color scheme toggle
	for (const option of options) {
		if (option.value === bodyEl.getAttribute('data-color-scheme')) {
			option.checked = true;
		}
		option.addEventListener('change', (ev) => {
			const value = ev.target.value;
			bodyEl.setAttribute('data-color-scheme', value);
			localStorage.setItem('theme', value);
			for (const o of options) {
				o.checked = (o.value === value);
			}
		});
	}
}
