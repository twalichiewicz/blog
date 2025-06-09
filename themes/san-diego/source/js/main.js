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

	// Initialize mobile expandable header
	initMobileExpandableHeader();

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

/**
 * Initialize mobile expandable header functionality
 */
function initMobileExpandableHeader() {
	const expandButton = document.querySelector('.mobile-expand-button');
	const profileHeader = document.querySelector('.profile-header');
	const expandableContent = document.querySelector('.mobile-expandable-content');
	const blogContent = document.querySelector('.blog-content');
	
	if (!expandButton || !profileHeader || !expandableContent) return;
	
	// Add click event listener to the expand button
	expandButton.addEventListener('click', function() {
		const isExpanded = profileHeader.getAttribute('data-expanded') === 'true';
		
		// Toggle expanded state
		profileHeader.setAttribute('data-expanded', !isExpanded);
		expandButton.setAttribute('aria-expanded', !isExpanded);
		
		// Add sliding animation to blog content
		if (!isExpanded && blogContent) {
			blogContent.style.transition = 'transform 0.3s ease';
			blogContent.style.transform = 'translateY(0)';
			// Reset after animation
			setTimeout(() => {
				blogContent.style.transition = '';
				blogContent.style.transform = '';
			}, 300);
		}
		
		// Trigger sound effect if available
		if (window.playButtonSound) {
			window.playButtonSound();
		}
	});
	
	// Close on outside click
	document.addEventListener('click', function(event) {
		const isExpanded = profileHeader.getAttribute('data-expanded') === 'true';
		if (isExpanded && !profileHeader.contains(event.target)) {
			profileHeader.setAttribute('data-expanded', 'false');
			expandButton.setAttribute('aria-expanded', 'false');
		}
	});
}
