document.addEventListener('DOMContentLoaded', function () {
	const navEl = document.getElementById('theme-nav');
	const navTitle = document.querySelector('.nav-title');
	let lastScrollPosition = 0;

	if (navEl) {
		navEl.addEventListener('click', (e) => {
			if (window.innerWidth <= 600) {
				if (navEl.classList.contains('open')) {
					navEl.style.height = '';
				} else {
					navEl.style.height = 48 + document.querySelector('#theme-nav .nav-items').clientHeight + 'px';
				}
				navEl.classList.toggle('open');
			} else {
				if (navEl.classList.contains('open')) {
					navEl.style.height = '';
					navEl.classList.remove('open');
				}
			}
		});

		window.addEventListener('resize', (e) => {
			if (navEl.classList.contains('open')) {
				navEl.style.height = 48 + document.querySelector('#theme-nav .nav-items').clientHeight + 'px';
			}
			if (window.innerWidth > 600) {
				if (navEl.classList.contains('open')) {
					navEl.style.height = '';
					navEl.classList.remove('open');
				}
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

	// Additional features like cookies and color scheme management remain unchanged
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

	const ColorScheme = new class {
		constructor() {
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { this.updateCurrent(Cookies.get('color-scheme', 'auto')) });
		}
		get() {
			const stored = Cookies.get('color-scheme', 'auto');
			this.updateCurrent(stored);
			return stored;
		}
		set(value) {
			bodyEl.setAttribute('data-color-scheme', value);
			Cookies.set('color-scheme', value);
			this.updateCurrent(value);
			return value;
		}
		updateCurrent(value) {
			var current = 'light';
			if (value == 'auto') {
				if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
					current = 'dark';
				}
			} else {
				current = value;
			}
			document.body.setAttribute('data-current-color-scheme', current);
		}
	};

	if (document.getElementById('theme-color-scheme-toggle')) {
		var bodyEl = document.body;
		var themeColorSchemeToggleEl = document.getElementById('theme-color-scheme-toggle');
		var options = themeColorSchemeToggleEl.getElementsByTagName('input');

		if (ColorScheme.get()) {
			bodyEl.setAttribute('data-color-scheme', ColorScheme.get());
		}

		for (const option of options) {
			if (option.value == bodyEl.getAttribute('data-color-scheme')) {
				option.checked = true;
			}
			option.addEventListener('change', (ev) => {
				var value = ev.target.value;
				ColorScheme.set(value);
				for (const o of options) {
					if (o.value != value) {
						o.checked = false;
					}
				}
			});
		}
	}

	// Add error handling for color scheme toggle
	if (document.getElementById('theme-color-scheme-toggle')) {
		try {
			// ... existing color scheme code ...
		} catch (error) {
			console.error('Error initializing color scheme:', error);
		}
	}

	// Initialize animations for sections
	if (typeof createScrollObserver === 'function') {
		createScrollObserver('.section');
		createScrollObserver('.blog-post');
		createScrollObserver('.portfolio-item');
	}

	const sections = document.querySelectorAll('.section');
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

	/**
	 * Column Title Scroll Detection
	 * Adds 'is-scrolling' class to column titles when content is scrolled
	 */
	document.addEventListener('DOMContentLoaded', function () {
		const postsContent = document.getElementById('postsContent');
		const projectsContent = document.getElementById('projectsContent');

		if (postsContent) {
			const blogColumnTitle = postsContent.querySelector('.column-title');

			if (blogColumnTitle) {
				// Always ensure the column title is visible
				blogColumnTitle.style.display = 'block';

				postsContent.addEventListener('scroll', function () {
					if (postsContent.scrollTop > 10) {
						blogColumnTitle.classList.add('is-scrolling');
					} else {
						blogColumnTitle.classList.remove('is-scrolling');
					}
				});
			}
		}

		if (projectsContent) {
			const portfolioColumnTitle = projectsContent.querySelector('.column-title');

			if (portfolioColumnTitle) {
				// Always ensure the column title is visible
				portfolioColumnTitle.style.display = 'block';

				projectsContent.addEventListener('scroll', function () {
					if (projectsContent.scrollTop > 10) {
						portfolioColumnTitle.classList.add('is-scrolling');
					} else {
						portfolioColumnTitle.classList.remove('is-scrolling');
					}
				});
			}
		}
	});
});
