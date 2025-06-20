/**
 * Navigation functionality
 * Handles theme navigation behaviors
 */

/**
 * Initialize navigation functionality
 * @param {Object} options - Configuration options
 */
export function initNavigation(options = {}) {
	const defaults = {
		navSelector: '#theme-nav',
		titleSelector: '.nav-title',
		mobileBreakpoint: 600,
		scrollThreshold: 50
	};

	const config = { ...defaults, ...options };

	const navEl = document.getElementById(config.navSelector.replace('#', ''));
	const navTitle = document.querySelector(config.titleSelector);
	let lastScrollPosition = 0;

	if (!navEl) {
		return;
	}

	// Toggle mobile menu
	navEl.addEventListener('click', () => {
		try {
			if (window.innerWidth <= config.mobileBreakpoint) {
				if (navEl.classList.contains('open')) {
					navEl.style.height = '';
				} else {
					const navItems = document.querySelector(`${config.navSelector} .nav-items`);
					if (navItems) {
						navEl.style.height = `${48 + navItems.clientHeight}px`;
					}
				}
				navEl.classList.toggle('open');
			} else if (navEl.classList.contains('open')) {
				navEl.style.height = '';
				navEl.classList.remove('open');
			}
		} catch (error) {
			// Navigation toggle error
		}
	});

	// Handle window resize
	window.addEventListener('resize', () => {
		try {
			if (navEl.classList.contains('open')) {
				const navItems = document.querySelector(`${config.navSelector} .nav-items`);
				if (navItems) {
					navEl.style.height = `${48 + navItems.clientHeight}px`;
				}
			}

			if (window.innerWidth > config.mobileBreakpoint && navEl.classList.contains('open')) {
				navEl.style.height = '';
				navEl.classList.remove('open');
			}
		} catch (error) {
			// Navigation resize error
		}
	});

	// Handle scroll for navbar title
	if (navTitle) {
		window.addEventListener('scroll', () => {
			try {
				const currentScrollPosition = window.scrollY;

				if (currentScrollPosition > lastScrollPosition && currentScrollPosition > config.scrollThreshold) {
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
			} catch (error) {
				// Navigation scroll error
			}
		});
	}
}

export default { initNavigation }; 