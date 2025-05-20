(function () {
	'use strict';

	// Sound effects
	const sliderSound = new Audio('/media/slider.mp3');
	const buttonSoundUp = new Audio('/media/button-press-up.mp3');
	const buttonSoundDown = new Audio('/media/button-press-down.mp3');
	const buttonSound = new Audio('/media/button-press-down.mp3');

	// Set volumes (clamp buttonSound volume to 1.0 max)
	sliderSound.volume = 0.15;
	buttonSoundUp.volume = 0.15;
	buttonSoundDown.volume = 0.15;
	buttonSound.volume = 1.0;

	// Store references to handlers to allow removal
	const handlers = {
		contactButtonClickHandler: null,
		documentClickHandler: null,
		genericButtonSoundHandler: window.playSliderSound // Use existing global function
	};

	// Function to play slider sound - make it globally available
	if (!window.playSliderSound) {
		window.playSliderSound = function () {
			if (!sliderSound.paused) {
				sliderSound.currentTime = 0; // Reset if already playing
			}
			sliderSound.play().catch(() => { });
		}
	}

	// Define event handler functions
	handlers.contactButtonClickHandler = (e) => {
		e.preventDefault();
		const contactButton = e.currentTarget;
		window.playSliderSound();
		contactButton.classList.toggle('active');
	};

	handlers.documentClickHandler = (e) => {
		const contactButton = document.querySelector('.contact-button.active');
		if (contactButton && !e.target.closest('.contact-wrapper')) {
			contactButton.classList.remove('active');
		}
	};

	// Function to initialize or re-initialize sound effect listeners
	function initializeSoundEffects() {
		console.log('[sound-effects.js] initializeSoundEffects Start');
		// Remove existing listeners first

		// Contact button
		const contactButton = document.querySelector('.contact-button');
		if (contactButton) {
			contactButton.removeEventListener('click', handlers.contactButtonClickHandler);
			contactButton.addEventListener('click', handlers.contactButtonClickHandler);

			const contactOptionButtons = document.querySelectorAll('.contact-option');
			contactOptionButtons.forEach(button => {
				button.removeEventListener('click', handlers.genericButtonSoundHandler);
				button.addEventListener('click', handlers.genericButtonSoundHandler);
			});
		}

		// Document listener for closing contact dropdown
		document.removeEventListener('click', handlers.documentClickHandler);
		document.addEventListener('click', handlers.documentClickHandler);

		// Generic sound listeners for other buttons
		const selectors = ['.tab-button', '.carousel-button', '.spotlight-nav-button'];
		selectors.forEach(selector => {
			const buttons = document.querySelectorAll(selector);
			buttons.forEach(button => {
				button.removeEventListener('click', handlers.genericButtonSoundHandler);
				button.addEventListener('click', handlers.genericButtonSoundHandler);
			});
		});
		console.log('[sound-effects.js] initializeSoundEffects End');
	}

	// Initial setup on DOMContentLoaded
	document.addEventListener('DOMContentLoaded', initializeSoundEffects);

	// Re-initialize if loaded from bfcache
	window.addEventListener('pageshow', function (event) {
		if (event.persisted) {
			console.log('[sound-effects.js pageshow] Start - bfcache');
			initializeSoundEffects();
			console.log('[sound-effects.js pageshow] End - bfcache');
		}
	});

})(); // End of IIFE