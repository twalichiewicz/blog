// Sound effects
const sliderSound = new Audio('/media/slider.mp3');
const buttonSoundUp = new Audio('/media/button-press-up.mp3');
const buttonSoundDown = new Audio('/media/button-press-down.mp3');
const buttonSound = new Audio('/media/button-press.mp3');

// Set volumes (clamp buttonSound volume to 1.0 max)
sliderSound.volume = 0.15;
buttonSoundUp.volume = 0.15;
buttonSoundDown.volume = 0.15;
buttonSound.volume = 1.0;

// Function to play slider sound - make it globally available
window.playSliderSound = function () {
	if (!sliderSound.paused) {
		sliderSound.currentTime = 0; // Reset if already playing
	}
	sliderSound.play().catch(() => { });
}

// Add sound effects to all interactive elements
document.addEventListener('DOMContentLoaded', function () {
	// Contact button
	const contactButton = document.querySelector('.contact-button');
	const contactOptions = document.querySelector('.contact-options');
	if (contactButton) {
		// On click, play sound and toggle the active state
		contactButton.addEventListener('click', (e) => {
			e.preventDefault();
			playSliderSound();
			contactButton.classList.toggle('active');
		});

		// Close contact options when clicking outside (no sound)
		document.addEventListener('click', (e) => {
			if (!e.target.closest('.contact-wrapper')) {
				contactButton.classList.remove('active');
			}
		});

		// Play sound when clicking on contact option buttons
		const contactOptionButtons = document.querySelectorAll('.contact-option');
		contactOptionButtons.forEach(button => {
			button.addEventListener('click', playSliderSound);
		});
	}

	// Tab buttons
	const tabButtons = document.querySelectorAll('.tab-button');
	tabButtons.forEach(button => {
		button.addEventListener('click', playSliderSound);
	});

	// Carousel buttons
	const carouselButtons = document.querySelectorAll('.carousel-button');
	carouselButtons.forEach(button => {
		button.addEventListener('click', playSliderSound);
	});

	// Spotlight buttons
	const spotlightButtons = document.querySelectorAll('.spotlight-nav-button');
	spotlightButtons.forEach(button => {
		button.addEventListener('click', playSliderSound);
	});
});