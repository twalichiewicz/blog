/**
 * Animations Module
 * Handles section animations using IntersectionObserver
 */

/**
 * Initialize animations for sections
 * @param {Object} options - Configuration options
 */
export function initSectionAnimations(options = {}) {
	const defaults = {
		sectionSelector: '.section',
		blogPostSelector: '.blog-post',
		portfolioItemSelector: '.portfolio-item',
		threshold: 0.1,
		visibleClass: 'is-visible'
	};

	const config = { ...defaults, ...options };

	try {
		// Use external scroll observer if available
		if (typeof createScrollObserver === 'function') {
			createScrollObserver(config.sectionSelector);
			createScrollObserver(config.blogPostSelector);
			createScrollObserver(config.portfolioItemSelector);
		} else {
			// Fall back to built-in IntersectionObserver
			const sections = document.querySelectorAll(config.sectionSelector);
			if (sections.length === 0) return;

			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add(config.visibleClass);
					}
				});
			}, {
				threshold: config.threshold
			});

			sections.forEach(section => observer.observe(section));
		}
	} catch (error) {
		// Section animations initialization error
	}
}

/**
 * Initialize column title scroll detection
 * @param {Object} options - Configuration options
 */
export function initColumnTitleScrollDetection(options = {}) {
	const defaults = {
		postsContentId: 'postsContent',
		projectsContentId: 'projectsContent',
		scrollThreshold: 10,
		scrollingClass: 'is-scrolling'
	};

	const config = { ...defaults, ...options };

	try {
		// Setup scroll detection for posts content
		setupColumnTitleScroll(config.postsContentId, config);

		// Setup scroll detection for projects content
		setupColumnTitleScroll(config.projectsContentId, config);
	} catch (error) {
		// Column title scroll detection error
	}
}

/**
 * Helper function to set up scroll detection for a specific content container
 * @param {string} contentId - The ID of the content container element
 * @param {Object} config - Configuration options
 */
function setupColumnTitleScroll(contentId, config) {
	const contentEl = document.getElementById(contentId);
	if (!contentEl) return;

	const columnTitle = contentEl.querySelector('.column-title');
	if (!columnTitle) return;

	// Only ensure the column title is visible on desktop
	// Let CSS handle visibility for mobile/tablet
	if (document.body.classList.contains('device-desktop')) {
		columnTitle.style.display = 'block';
	} else {
		// Reset any inline styles to let CSS control display
		columnTitle.style.display = '';
	}

	// Handle device type changes
	const handleDeviceChange = () => {
		if (document.body.classList.contains('device-desktop')) {
			columnTitle.style.display = 'block';
		} else {
			columnTitle.style.display = '';
		}
	};

	// Listen for class changes on body (device type changes)
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.attributeName === 'class') {
				handleDeviceChange();
			}
		});
	});

	// Start observing
	observer.observe(document.body, { attributes: true });

	// Set up scroll event handling
	let ticking = false;

	const handleScroll = () => {
		if (contentEl.scrollTop > config.scrollThreshold) {
			columnTitle.classList.add(config.scrollingClass);
		} else {
			columnTitle.classList.remove(config.scrollingClass);
		}
		ticking = false;
	};

	const requestTick = () => {
		if (!ticking) {
			requestAnimationFrame(handleScroll);
			ticking = true;
		}
	};

	contentEl.addEventListener('scroll', requestTick, { passive: true });
}

export default {
	initSectionAnimations,
	initColumnTitleScrollDetection
}; 