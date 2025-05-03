document.addEventListener('DOMContentLoaded', function () {
	const carousel = document.querySelector('.text-carousel');
	if (!carousel) {
		return;
	}

	const track = carousel.querySelector('.text-carousel-track');
	const slides = carousel.querySelectorAll('.text-carousel-slide');
	const prevButton = carousel.querySelector('.text-carousel-button.prev');
	const nextButton = carousel.querySelector('.text-carousel-button.next');
	const indicators = carousel.querySelectorAll('.text-carousel-indicators .indicator');

	let currentSlide = 0;
	const totalSlides = slides.length;

	function goToSlide(index) {
		if (index < 0) index = totalSlides - 1;
		if (index >= totalSlides) index = 0;
		track.style.transform = `translateX(-${index * 100}%)`;
		currentSlide = index;
		updateIndicators();
	}

	function updateIndicators() {
		indicators.forEach((indicator, i) => {
			if (i === currentSlide) {
				indicator.classList.add('active');
			} else {
				indicator.classList.remove('active');
			}
		});
	}

	if (prevButton) {
		prevButton.addEventListener('click', () => {
			goToSlide(currentSlide - 1);
		});
	}

	if (nextButton) {
		nextButton.addEventListener('click', () => {
			goToSlide(currentSlide + 1);
		});
	}

	// Set up indicator click events
	indicators.forEach((indicator, i) => {
		indicator.addEventListener('click', () => {
			goToSlide(i);
		});
	});
}); 