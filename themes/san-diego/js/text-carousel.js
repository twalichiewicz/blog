document.addEventListener('DOMContentLoaded', function () {
	console.log('Text carousel initialization started');
	const carousel = document.querySelector('.text-carousel');
	if (!carousel) {
		console.log('No text carousel found');
		return;
	}
	console.log('Text carousel found', carousel);

	const track = carousel.querySelector('.text-carousel-track');
	console.log('Track element:', track);
	const slides = carousel.querySelectorAll('.text-carousel-slide');
	console.log('Number of slides:', slides.length);
	const prevButton = carousel.querySelector('.text-carousel-button.prev');
	const nextButton = carousel.querySelector('.text-carousel-button.next');
	const indicators = carousel.querySelectorAll('.text-carousel-indicators .indicator');

	let currentSlide = 0;
	const totalSlides = slides.length;

	function goToSlide(index) {
		console.log('Attempting to go to slide', index);
		if (index < 0) index = totalSlides - 1;
		if (index >= totalSlides) index = 0;
		track.style.transform = `translateX(-${index * 100}%)`;
		currentSlide = index;
		updateIndicators();
		console.log('Now on slide', index);
	}

	function updateIndicators() {
		indicators.forEach((indicator, i) => {
			if (i === currentSlide) {
				indicator.classList.add('active');
			} else {
				indicator.classList.remove('active');
			}
		});
		console.log('Indicators updated, current slide:', currentSlide);
	}

	if (prevButton) {
		prevButton.addEventListener('click', () => {
			console.log('prevButton clicked');
			goToSlide(currentSlide - 1);
		});
	} else {
		console.log('prevButton not found');
	}

	if (nextButton) {
		nextButton.addEventListener('click', () => {
			console.log('nextButton clicked');
			goToSlide(currentSlide + 1);
		});
	} else {
		console.log('nextButton not found');
	}

	// Set up indicator click events
	indicators.forEach((indicator, i) => {
		indicator.addEventListener('click', () => {
			console.log('Indicator', i, 'clicked');
			goToSlide(i);
		});
	});
	console.log('Text carousel initialization complete');
}); 