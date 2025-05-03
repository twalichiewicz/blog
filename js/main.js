document.addEventListener('DOMContentLoaded', function () {
	// Initialize navigation functionality
	initNavigation();
	
	// Initialize color scheme functionality
	initColorScheme();

	// Initialize animations for sections
	initSectionAnimations();
	
	// Initialize column title scroll detection
	initColumnTitleScrollDetection();
});

/**
 * Initialize navigation functionality
 */
function initNavigation() {
	const navEl = document.getElementById('theme-nav');
	const navTitle = document.querySelector('.nav-title');
	let lastScrollPosition = 0;

	if (navEl) {
		navEl.addEventListener('click', () => {
			if (window.innerWidth <= 600) {
				if (navEl.classList.contains('open')) {
					navEl.style.height = '';
				} else {
					navEl.style.height = 48 + document.querySelector('#theme-nav .nav-items').clientHeight + 'px';
				}
				navEl.classList.toggle('open');
			} else if (navEl.classList.contains('open')) {
				navEl.style.height = '';
				navEl.classList.remove('open');
			}
		});

		window.addEventListener('resize', () => {
			if (navEl.classList.contains('open')) {
				navEl.style.height = 48 + document.querySelector('#theme-nav .nav-items').clientHeight + 'px';
			}
			if (window.innerWidth > 600 && navEl.classList.contains('open')) {
				navEl.style.height = '';
				navEl.classList.remove('open');
			}
		});
	}

	// Hide the nav-title when scrolling down
	if (navTitle) {
		window.addEventListener('scroll', function () {
			const currentScrollPosition = window.scrollY;

			if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 50) {
				// User is scrolling down, hide the nav-title
				navTitle.style.height = '0px';
				navTitle.style.opacity = '0';
				navTitle.style.transition = 'all 300ms ease-in-out';
			} else {
				// User is scrolling up, show the nav-title
				navTitle.style.height = '';
				navTitle.style.opacity = '1';
			}

			lastScrollPosition = currentScrollPosition;
		});
	}
}

	/**
 * Cookie utility class
 */
const Cookies = new class {
	get(key, fallback) {
		const temp = document.cookie.split('; ').find(row => row.startsWith(key + '='));
		if (temp) {
			return temp.split('=')[1];
		} else {
			return fallback;
		}
	}
	set(key, value) {
		document.cookie = key + '=' + value + '; path=' + document.body.getAttribute('data-config-root');
	}
};

/**
 * Color scheme management class
 */
const ColorScheme = new class {
	constructor() {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { 
			this.updateCurrent(Cookies.get('color-scheme', 'auto')) 
		});
	}
	get() {
		const stored = Cookies.get('color-scheme', 'auto');
		this.updateCurrent(stored);
		return stored;
	}
	set(value) {
		const bodyEl = document.body;
		bodyEl.setAttribute('data-color-scheme', value);
		Cookies.set('color-scheme', value);
		this.updateCurrent(value);
		return value;
	}
	updateCurrent(value) {
		let current = 'light';
		if (value === 'auto') {
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				current = 'dark';
			}
		} else {
			current = value;
		}
		document.body.setAttribute('data-current-color-scheme', current);
	}
};

/**
 * Initialize color scheme functionality
 */
function initColorScheme() {
	const colorSchemeToggle = document.getElementById('theme-color-scheme-toggle');
	if (!colorSchemeToggle) return;
	
	try {
		const bodyEl = document.body;
		const options = colorSchemeToggle.getElementsByTagName('input');

		if (ColorScheme.get()) {
			bodyEl.setAttribute('data-color-scheme', ColorScheme.get());
		}

		for (const option of options) {
			if (option.value === bodyEl.getAttribute('data-color-scheme')) {
				option.checked = true;
			}
			option.addEventListener('change', (ev) => {
				const value = ev.target.value;
				ColorScheme.set(value);
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
 * Initialize section animations using IntersectionObserver
 */
function initSectionAnimations() {
	// External scroll observer if available
	if (typeof createScrollObserver === 'function') {
		createScrollObserver('.section');
		createScrollObserver('.blog-post');
		createScrollObserver('.portfolio-item');
	}

	// Built-in IntersectionObserver for sections
	const sections = document.querySelectorAll('.section');
	if (sections.length === 0) return;
	
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
			}
		});
	}, {
		threshold: 0.1
	});

	sections.forEach(section => observer.observe(section));
}

	/**
 * Column Title Scroll Detection
 * Adds 'is-scrolling' class to column titles when content is scrolled
 */
function initColumnTitleScrollDetection() {
	// Setup scroll detection for posts content
	setupColumnTitleScroll('postsContent');
	
	// Setup scroll detection for projects content
	setupColumnTitleScroll('projectsContent');
}

/**
 * Helper function to set up scroll detection for a specific content container
 * @param {string} contentId - The ID of the content container element
 */
function setupColumnTitleScroll(contentId) {
	const contentEl = document.getElementById(contentId);
	if (!contentEl) return;
	
	const columnTitle = contentEl.querySelector('.column-title');
	if (!columnTitle) return;
	
	// Always ensure the column title is visible
	columnTitle.style.display = 'block';
	
	contentEl.addEventListener('scroll', function() {
		if (contentEl.scrollTop > 10) {
			columnTitle.classList.add('is-scrolling');
		} else {
			columnTitle.classList.remove('is-scrolling');
		}
	});
}
});
