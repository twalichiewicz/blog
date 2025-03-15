/**
 * Blog functionality - Simplified
 * Handles search, mobile tabs, and device detection
 */

document.addEventListener('DOMContentLoaded', function () {
	// Cache DOM elements
	const elements = {
		searchInput: document.getElementById('blogSearch'),
		searchButton: document.querySelector('.search-button'),
		expandButtons: document.querySelectorAll('.expand-button'),
		carousels: document.querySelectorAll('.carousel'),
		contactButton: document.querySelector('.contact-button'),
		contactWrapper: document.querySelector('.contact-wrapper')
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

	// Initialize contact button - simplified approach
	if (elements.contactButton) {
		elements.contactButton.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			elements.contactWrapper.classList.toggle('active');
		});

		// Close dropdown when clicking outside
		document.addEventListener('click', function (e) {
			if (elements.contactWrapper && !elements.contactWrapper.contains(e.target)) {
				elements.contactWrapper.classList.remove('active');
			}
		});
	}

	// Search functionality
	function handleSearch(e) {
		const query = e.target.value.toLowerCase();
		const posts = document.querySelectorAll('.post-list-item');
		let visibleCount = 0;

		posts.forEach(post => {
			const title = post.querySelector('h3')?.textContent.toLowerCase() || '';
			const content = post.textContent.toLowerCase();
			const isMatch = title.includes(query) || content.includes(query);

			post.style.display = isMatch ? 'block' : 'none';
			if (isMatch) visibleCount++;
		});

		// Update dividers visibility
		dividers.forEach((divider, index) => {
			divider.style.display = index < visibleCount - 1 ? 'block' : 'none';
		});
	}

	// Toggle search visibility
	function toggleSearch() {
		const searchContainer = document.querySelector('.search-container');
		if (searchContainer) {
			searchContainer.classList.toggle('active');
			if (searchContainer.classList.contains('active')) {
				elements.searchInput.focus();
			}
		}
	}

	// Function to toggle expand
	function toggleExpand() {
		const overflow = this.nextElementSibling;
		const isExpanded = this.getAttribute('aria-expanded') === 'true';

		this.setAttribute('aria-expanded', !isExpanded);
		overflow.style.maxHeight = isExpanded ? null : `${overflow.scrollHeight}px`;
		this.textContent = isExpanded ? 'Read more' : 'Show less';
	}

	// Initialize carousel
	function initializeCarousel(carousel) {
		const slides = carousel.querySelectorAll('.carousel-slide');
		const prevButton = carousel.querySelector('.carousel-button.prev');
		const nextButton = carousel.querySelector('.carousel-button.next');
		let currentIndex = 0;

		// Set first slide as active
		if (slides.length > 0) {
			slides[0].classList.add('active');
		}

		// Add event listeners to buttons
		if (prevButton) {
			prevButton.addEventListener('click', () => {
				currentIndex = (currentIndex - 1 + slides.length) % slides.length;
				updateSlides();
			});
		}

		if (nextButton) {
			nextButton.addEventListener('click', () => {
				currentIndex = (currentIndex + 1) % slides.length;
				updateSlides();
			});
		}

		// Update slides to show current index
		function updateSlides() {
			slides.forEach((slide, index) => {
				slide.classList.toggle('active', index === currentIndex);
			});
		}

		// Add swipe support for mobile
		let touchStartX = 0;
		let touchEndX = 0;

		carousel.addEventListener('touchstart', e => {
			touchStartX = e.changedTouches[0].screenX;
		}, { passive: true });

		carousel.addEventListener('touchend', e => {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
		}, { passive: true });

		function handleSwipe() {
			const swipeThreshold = 50;
			if (touchEndX < touchStartX - swipeThreshold) {
				// Swipe left, go to next slide
				currentIndex = (currentIndex + 1) % slides.length;
				updateSlides();
			} else if (touchEndX > touchStartX + swipeThreshold) {
				// Swipe right, go to previous slide
				currentIndex = (currentIndex - 1 + slides.length) % slides.length;
				updateSlides();
			}
		}
	}
}); 