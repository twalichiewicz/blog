/**
 * Blog functionality - Simplified
 * Handles search, mobile tabs, and device detection
 */

document.addEventListener('DOMContentLoaded', function () {
	// Cache DOM elements
	const elements = {
		searchInput: document.getElementById('blogSearch'),
		searchButton: document.querySelector('.search-button'),
		tabButtons: document.querySelectorAll('.tab-button'),
		postsContent: document.getElementById('postsContent'),
		projectsContent: document.getElementById('projectsContent'),
		tabContainer: document.querySelector('.mobile-tabs'),
		expandButtons: document.querySelectorAll('.expand-button'),
		carousels: document.querySelectorAll('.carousel')
	};

	// Device detection
	const isMobile = window.innerWidth <= 768;
	const isDesktop = document.body.classList.contains('device-desktop');

	// Initialize search functionality
	if (elements.searchInput) {
		elements.searchInput.addEventListener('input', handleSearch);
	}

	// Initialize search button toggle
	if (elements.searchButton) {
		elements.searchButton.addEventListener('click', toggleSearch);
	}

	// Initialize tabs
	if (elements.tabContainer && elements.postsContent && elements.projectsContent && window.self === window.top) {
		initTabs();
	}

	// Initialize expand buttons
	if (elements.expandButtons.length) {
		elements.expandButtons.forEach(btn => btn.addEventListener('click', toggleExpand));
	}

	// Initialize carousels
	if (elements.carousels.length) {
		elements.carousels.forEach(carousel => {
			if (!carousel.dataset.initialized) {
				initializeCarousel(carousel);
				carousel.dataset.initialized = 'true';
			}
		});
	}

	// Function to handle search
	function handleSearch(e) {
		const searchTerm = e.target.value.toLowerCase();
		const posts = document.querySelectorAll('.post-list-item');

		posts.forEach(post => {
			const title = post.querySelector('h3')?.textContent.toLowerCase() || '';
			const content = post.querySelector('p')?.textContent.toLowerCase() || '';
			const isMatch = title.includes(searchTerm) || content.includes(searchTerm);

			if (searchTerm === '') {
				post.style.display = '';
				post.style.opacity = '1';
			} else if (isMatch) {
				post.style.display = '';
				post.style.opacity = '1';
			} else {
				post.style.opacity = '0';
				setTimeout(() => post.style.display = 'none', 300);
			}
		});
	}

	// Function to toggle search
	function toggleSearch() {
		const input = document.querySelector('.search-input');
		const button = this;

		if (!input.classList.contains('expanded')) {
			input.classList.add('expanded');
			button.classList.add('expanded');
			button.innerHTML = '<img src="/img/close.svg" alt="Close">';
			input.focus();
		} else {
			input.classList.remove('expanded');
			button.classList.remove('expanded');
			button.innerHTML = '<img src="/img/search.svg" alt="Search">';
			input.value = '';
			input.dispatchEvent(new Event('input'));
		}
	}

	// Function to initialize tabs
	function initTabs() {
		// Show tabs on mobile/tablet
		if (document.body.classList.contains('device-mobile') ||
			document.body.classList.contains('device-tablet')) {
			elements.tabContainer.style.display = 'flex';
		}

		// On desktop, show both sections
		if (isDesktop) {
			elements.postsContent.style.display = 'block';
			elements.projectsContent.style.display = 'block';
		} else {
			// On mobile/tablet, show posts by default
			elements.postsContent.style.display = 'block';
			elements.projectsContent.style.display = 'none';
		}

		// Add click handlers for tab buttons
		elements.tabButtons.forEach(button => {
			button.addEventListener('click', () => {
				const type = button.dataset.type;

				// Update button states
				elements.tabButtons.forEach(btn => {
					btn.classList.toggle('active', btn === button);
					btn.setAttribute('aria-selected', btn === button);
				});

				// Only toggle visibility on non-desktop devices
				if (!isDesktop) {
					elements.postsContent.style.display = type === 'blog' ? 'block' : 'none';
					elements.projectsContent.style.display = type === 'portfolio' ? 'block' : 'none';
				}
			});
		});
	}

	// Function to toggle expand
	function toggleExpand() {
		const overflow = this.nextElementSibling;
		if (overflow) {
			const isExpanded = overflow.classList.toggle('expanded');
			this.textContent = isExpanded ? 'Show less' : 'Show more';
		}
	}

	// Function to initialize carousel
	function initializeCarousel(carousel) {
		const images = Array.from(carousel.querySelectorAll('.carousel-slide img'));

		// Add click handlers to images
		images.forEach((img, index) => {
			if (img) {
				img.addEventListener('click', () => {
					if (window.Spotlight) {
						Spotlight.show(images, {
							index: index,
							theme: 'white',
							animation: 'fade',
							control: 'arrows',
							arrows: true,
							keyboard: true,
							draggable: true
						});
					}
				});
			}
		});

		// Additional carousel functionality can be added here
	}
}); 