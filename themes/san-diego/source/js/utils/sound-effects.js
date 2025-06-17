/**
 * Sound Effects Utility
 * Provides cross-browser compatible audio playback for UI interactions
 */

class SoundEffects {
	constructor() {
		this.sounds = new Map();
		this.enabled = true;
		this.volume = 0.5;

		// Load user preference for sound effects
		const soundPref = localStorage.getItem('sound-effects-enabled');
		this.enabled = soundPref !== null ? soundPref === 'true' : true;

		const volumePref = localStorage.getItem('sound-effects-volume');
		this.volume = volumePref !== null ? parseFloat(volumePref) : 0.5;
	}

	/**
	 * Load a sound with multiple format support for cross-browser compatibility
	 * @param {string} name - Identifier for the sound
	 * @param {string} basePath - Base path without extension (e.g., '/media/toggleSound')
	 * @param {Array} formats - Array of formats to try ['mp3', 'ogg', 'm4a']
	 */
	loadSound(name, basePath, formats = ['mp3', 'ogg', 'm4a']) {
		const audio = new Audio();

		// Test which format is supported
		for (const format of formats) {
			const canPlay = audio.canPlayType(`audio/${format === 'm4a' ? 'mp4' : format}`);
			if (canPlay === 'probably' || canPlay === 'maybe') {
				audio.src = `${basePath}.${format}`;
				break;
			}
		}

		// If no format was explicitly supported, default to mp3
		if (!audio.src) {
			audio.src = `${basePath}.mp3`;
		}

		audio.preload = 'auto';
		audio.volume = this.volume;

		// Handle loading errors gracefully
		audio.addEventListener('error', (e) => {
			console.warn(`Failed to load sound "${name}":`, e);
		});

		this.sounds.set(name, audio);
		return audio;
	}

	/**
	 * Play a sound by name
	 * @param {string} name - Sound identifier
	 * @param {number} volume - Optional volume override (0-1)
	 */
	play(name, volume = null) {
		if (!this.enabled) return;

		const sound = this.sounds.get(name);
		if (!sound) {
			console.warn(`Sound "${name}" not found`);
			return;
		}

		try {
			// Reset to beginning in case it was played recently
			sound.currentTime = 0;

			// Set volume
			sound.volume = volume !== null ? volume : this.volume;

			// Play the sound
			const playPromise = sound.play();

			// Handle play promise for browsers that support it
			if (playPromise !== undefined) {
				playPromise.catch(error => {
					console.warn(`Failed to play sound "${name}":`, error);
				});
			}
		} catch (error) {
			console.warn(`Error playing sound "${name}":`, error);
		}
	}

	/**
	 * Enable or disable sound effects
	 * @param {boolean} enabled - Whether sound effects should be enabled
	 */
	setEnabled(enabled) {
		this.enabled = enabled;
		localStorage.setItem('sound-effects-enabled', enabled.toString());
	}

	/**
	 * Set global volume for all sound effects
	 * @param {number} volume - Volume level (0-1)
	 */
	setVolume(volume) {
		this.volume = Math.max(0, Math.min(1, volume));
		localStorage.setItem('sound-effects-volume', this.volume.toString());

		// Update volume for all loaded sounds
		this.sounds.forEach(sound => {
			sound.volume = this.volume;
		});
	}

	/**
	 * Check if sound effects are enabled
	 * @returns {boolean}
	 */
	isEnabled() {
		return this.enabled;
	}

	/**
	 * Get current volume level
	 * @returns {number}
	 */
	getVolume() {
		return this.volume;
	}

	/**
	 * Preload commonly used sounds
	 */
	preloadCommonSounds() {
		// Load all available UI sounds
		this.loadSound('toggle', '/media/toggleSound', ['mp3', 'ogg', 'm4a']);
		this.loadSound('buttonDown', '/media/button-press-down', ['mp3', 'm4a']);
		this.loadSound('buttonUp', '/media/button-press-up', ['mp3', 'm4a']);
		this.loadSound('smallClick', '/media/smallClick', ['mp3']);
		this.loadSound('slider', '/media/slider', ['mp3']);
		this.loadSound('wavey', '/media/wavey', ['mp3']);

		console.log('Sound effects preloaded');
	}
}

// Create global instance
const soundEffects = new SoundEffects();

/**
 * Initialize sound effects and preload sounds
 */
function initializeSoundEffects() {
	soundEffects.preloadCommonSounds();

	// Make it globally available for other modules
	window.soundEffects = soundEffects;
	window.initializeSoundEffects = initializeSoundEffects;

	// Add convenient global functions for common sounds
	window.playButtonSound = function() {
		soundEffects.play('smallClick');
	};

	window.playSmallClickSound = function() {
		soundEffects.play('smallClick');
	};

	window.playToggleSound = function() {
		soundEffects.play('toggle');
	};

	window.playSliderSound = function() {
		soundEffects.play('slider');
	};

	console.log('Sound effects initialized');
}

export { soundEffects, initializeSoundEffects };
export default soundEffects; 