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
		contactButton.addEventListener('mousedown', playSliderSound);
		contactButton.addEventListener('mouseup', playSliderSound);
		contactButton.addEventListener('touchstart', playSliderSound);
		contactButton.addEventListener('touchend', playSliderSound);

		// Add click handler to toggle active state
		contactButton.addEventListener('click', (e) => {
			e.preventDefault();
			contactButton.classList.toggle('active');
		});

		// Close contact options when clicking outside
		document.addEventListener('click', (e) => {
			if (!e.target.closest('.contact-wrapper')) {
				contactButton.classList.remove('active');
				// Don't play sound when closing via outside click
			}
		});

		// Play sound when clicking contact options
		const contactOptionButtons = document.querySelectorAll('.contact-option');
		contactOptionButtons.forEach(button => {
			button.addEventListener('mousedown', playSliderSound);
			button.addEventListener('mouseup', playSliderSound);
			button.addEventListener('touchstart', playSliderSound);
			button.addEventListener('touchend', playSliderSound);
		});
	}

	// Tab buttons
	const tabButtons = document.querySelectorAll('.tab-button');
	tabButtons.forEach(button => {
		button.addEventListener('mousedown', playSliderSound);
		button.addEventListener('mouseup', playSliderSound);
		button.addEventListener('touchstart', playSliderSound);
		button.addEventListener('touchend', playSliderSound);
	});

	// Carousel buttons
	const carouselButtons = document.querySelectorAll('.carousel-button');
	carouselButtons.forEach(button => {
		button.addEventListener('mousedown', playSliderSound);
		button.addEventListener('mouseup', playSliderSound);
		button.addEventListener('touchstart', playSliderSound);
		button.addEventListener('touchend', playSliderSound);
	});

	// Spotlight buttons
	const spotlightButtons = document.querySelectorAll('.spotlight-nav-button');
	spotlightButtons.forEach(button => {
		button.addEventListener('mousedown', playSliderSound);
		button.addEventListener('mouseup', playSliderSound);
		button.addEventListener('touchstart', playSliderSound);
		button.addEventListener('touchend', playSliderSound);
	});

	// Book/List mode toggle buttons
	const bookModeBtn = document.getElementById('bookModeBtn');
	const listModeBtn = document.getElementById('listModeBtn');
	if (bookModeBtn) {
		bookModeBtn.addEventListener('mousedown', playSliderSound);
		bookModeBtn.addEventListener('mouseup', playSliderSound);
		bookModeBtn.addEventListener('touchstart', playSliderSound);
		bookModeBtn.addEventListener('touchend', playSliderSound);
	}
	if (listModeBtn) {
		listModeBtn.addEventListener('mousedown', playSliderSound);
		listModeBtn.addEventListener('mouseup', playSliderSound);
		listModeBtn.addEventListener('touchstart', playSliderSound);
		listModeBtn.addEventListener('touchend', playSliderSound);
	}
});