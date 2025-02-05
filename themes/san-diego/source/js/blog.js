document.addEventListener('DOMContentLoaded', () => {
	const pages = document.querySelectorAll('.page');

	// Check for content overflow
	pages.forEach(page => {
		const content = page.querySelector('.content-overflow');
		if (content.scrollHeight > content.clientHeight) {
			const expandBtn = page.querySelector('.expand-button');
			expandBtn.classList.add('visible');
		}
	});

	// Handle expand button clicks
	document.querySelectorAll('.expand-button').forEach(button => {
		button.addEventListener('click', () => {
			const overflow = button.nextElementSibling;
			overflow.classList.toggle('expanded');
			button.textContent = overflow.classList.contains('expanded') ? 'Show less' : 'Show more';
		});
	});

	// Handle page turning
	const rightPages = document.querySelectorAll('.right-page');
	rightPages.forEach(page => {
		page.addEventListener('click', () => {
			page.classList.add('turning');
			setTimeout(() => {
				// Load next set of posts or handle pagination here
				page.classList.remove('turning');
			}, 600);
		});
	});

	let currentSpotlightCarousel = null;

	function initializeCarousel(carousel) {
		const track = carousel.querySelector('.carousel-track');
		const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
		const indicators = Array.from(carousel.querySelectorAll('.indicator'));
		const prevButton = carousel.querySelector('.carousel-button.prev');
		const nextButton = carousel.querySelector('.carousel-button.next');
		let currentIndex = slides.findIndex(slide => slide.classList.contains('active'));

		// Initialize Spotlight functionality for this carousel
		const images = slides.map(slide => slide.querySelector('img'));
		images.forEach((img, index) => {
			if (img) {
				img.addEventListener('click', () => {
					// Update the current spotlight carousel reference
					currentSpotlightCarousel = carousel;

					// Reset and initialize Spotlight with images from this carousel only
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

		// Rest of your carousel functionality...
		// (Previous/Next buttons, indicators, etc.)
	}

	// Initialize all carousels on the page
	document.querySelectorAll('.carousel').forEach(carousel => {
		if (!carousel.dataset.initialized) {
			initializeCarousel(carousel);
			carousel.dataset.initialized = 'true';
		}
	});
}); 