/**
 * Main JavaScript Entry Point
 * Import and initialize all modules
 */
// import ColorScheme from './components/ColorScheme.js'; // Commented out - file not found
import { initNavigation } from './utils/navigation.js';
import { initSectionAnimations, initColumnTitleScrollDetection } from './utils/animations.js';
import { initializeSoundEffects } from './utils/sound-effects.js';

document.addEventListener('DOMContentLoaded', function () {
	try {
		// Initialize sound effects first
		initializeSoundEffects();

		// Initialize navigation functionality
		initNavigation({
			navSelector: '#theme-nav',
			titleSelector: '.nav-title',
			mobileBreakpoint: 600
		});

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

/**
 * Initialize layout toggle functionality
 */
function initLayoutToggle() {
	const layoutToggle = document.querySelector('.layout-toggle');
	const blogElement = document.querySelector('.blog');

	if (!layoutToggle || !blogElement) return;

	const toggleSwitch = layoutToggle.querySelector('.layout-toggle__switch');

	// Load saved layout preference from localStorage
	const savedLayout = localStorage.getItem('portfolio-layout') || 'column';
	setLayout(savedLayout);

	// Handle click events
	function handleToggle() {
		const currentLayout = layoutToggle.getAttribute('data-layout');
		const newLayout = currentLayout === 'column' ? 'grid' : 'column';
		setLayout(newLayout);

		// Play toggle sound effect
		if (window.soundEffects) {
			window.soundEffects.play('toggle');
		}

		// Save preference
		localStorage.setItem('portfolio-layout', newLayout);
	}

	function setLayout(layout) {
		layoutToggle.setAttribute('data-layout', layout);
		blogElement.setAttribute('data-layout', layout);
	}

	// Add event listeners
	toggleSwitch.addEventListener('click', handleToggle);

	// Keyboard accessibility
	toggleSwitch.addEventListener('keydown', function (e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleToggle();
		}
	});

	console.log('Layout toggle initialized with sound effects');
}

// Handle bfcache for widgets (or remove if module handles it)
window.addEventListener('pageshow', (event) => {
	if (event.persisted) {
		console.log("[main.js pageshow] Start - bfcache");
		// Desktop widgets functionality removed
		console.log("[main.js pageshow] End - bfcache");
	}
});
