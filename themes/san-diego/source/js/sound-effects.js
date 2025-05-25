(function () {
	'use strict';

	// Sound effects
	const sliderSound = new Audio('/media/slider.mp3');
	const buttonSoundUp = new Audio('/media/button-press-up.mp3');
	const buttonSoundDown = new Audio('/media/button-press-down.mp3');
	const buttonSound = new Audio('/media/button-press-down.mp3');
	const smallClickSound = new Audio('/media/smallClick.mp3');

	// Set volumes (clamp buttonSound volume to 1.0 max)
	sliderSound.volume = 0.15;
	buttonSoundUp.volume = 0.15;
	buttonSoundDown.volume = 0.15;
	buttonSound.volume = 1.0;
	smallClickSound.volume = 0.2;

	// Store references to handlers to allow removal
	const handlers = {
		contactButtonClickHandler: null,
		documentClickHandler: null,
		defaultButtonSoundHandler: () => window.playSmallClickSound(), // Changed to use small click as default
		mobileTabButtonSoundHandler: () => window.playSliderSound() // Mobile tabs use slider sound
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

	// Function to play small click sound - make it globally available
	if (!window.playSmallClickSound) {
		window.playSmallClickSound = function () {
			if (!smallClickSound.paused) {
				smallClickSound.currentTime = 0; // Reset if already playing
			}
			smallClickSound.play().catch(() => { });
		}
	}

	// Define event handler functions
	handlers.contactButtonClickHandler = (e) => {
		e.preventDefault();
		const contactButton = e.currentTarget;
		window.playSmallClickSound(); // Changed from playSliderSound to playSmallClickSound
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
		console.log('[sound-effects.js] Current page URL:', window.location.href);
		console.log('[sound-effects.js] Available buttons:', {
			contactButton: !!document.querySelector('.contact-button'),
			mobileTabButtons: document.querySelectorAll('.mobile-tabs .tab-button').length,
			otherTabButtons: document.querySelectorAll('.tab-button:not(.mobile-tabs .tab-button)').length,
			carouselButtons: document.querySelectorAll('.carousel-button').length,
			spotlightButtons: document.querySelectorAll('.spotlight-nav-button').length,
			contactOptions: document.querySelectorAll('.contact-option').length
		});
		// Remove existing listeners first

		// Contact button
		const contactButton = document.querySelector('.contact-button');
		if (contactButton) {
			contactButton.removeEventListener('click', handlers.contactButtonClickHandler);
			contactButton.addEventListener('click', handlers.contactButtonClickHandler);

			const contactOptionButtons = document.querySelectorAll('.contact-option');
			contactOptionButtons.forEach(button => {
				button.removeEventListener('click', handlers.defaultButtonSoundHandler);
				button.addEventListener('click', handlers.defaultButtonSoundHandler); // Changed to default sound
			});
		}

		// Document listener for closing contact dropdown
		document.removeEventListener('click', handlers.documentClickHandler);
		document.addEventListener('click', handlers.documentClickHandler);

		// Mobile tab buttons (Posts/Projects) - use slider sound
		const mobileTabButtons = document.querySelectorAll('.mobile-tabs .tab-button');
		mobileTabButtons.forEach(button => {
			button.removeEventListener('click', handlers.mobileTabButtonSoundHandler);
			button.addEventListener('click', handlers.mobileTabButtonSoundHandler);
		});

		// All other tab buttons (not in mobile-tabs) - use small click sound
		const otherTabButtons = document.querySelectorAll('.tab-button:not(.mobile-tabs .tab-button)');
		otherTabButtons.forEach(button => {
			button.removeEventListener('click', handlers.defaultButtonSoundHandler);
			button.addEventListener('click', handlers.defaultButtonSoundHandler);
		});

		// Other buttons - use small click sound (default)
		const otherSelectors = ['.carousel-button', '.spotlight-nav-button'];
		otherSelectors.forEach(selector => {
			const buttons = document.querySelectorAll(selector);
			buttons.forEach(button => {
				button.removeEventListener('click', handlers.defaultButtonSoundHandler);
				button.addEventListener('click', handlers.defaultButtonSoundHandler); // Changed to default sound
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

	// Also initialize on window load as a fallback
	window.addEventListener('load', function () {
		// Small delay to ensure all other scripts have run
		setTimeout(initializeSoundEffects, 100);
	});

	// Make the initialization function globally available for manual re-initialization
	window.initializeSoundEffects = initializeSoundEffects;

})(); // End of IIFE