/**
 * Sound Service Compatibility Layer
 * Provides backward compatibility for existing sound-effects.js usage
 * while using the new centralized SoundService
 */

import SoundService from './sound-service.js';

// Initialize the new sound service
const soundService = new SoundService();

/**
 * Legacy SoundEffects class that wraps the new SoundService
 * Maintains the exact same API as the old implementation
 */
class SoundEffectsCompat {
	constructor() {
		// Use the singleton sound service
		this.service = soundService;
		
		// Create a sounds map for legacy compatibility
		this.sounds = new Map();
		
		// Proxy properties to the service
		Object.defineProperty(this, 'enabled', {
			get: () => this.service.enabled,
			set: (value) => this.service.setEnabled(value)
		});
		
		Object.defineProperty(this, 'volume', {
			get: () => this.service.volume,
			set: (value) => this.service.setVolume(value)
		});
	}

	/**
	 * Legacy loadSound method
	 * Maps old format to new registry-based system
	 */
	loadSound(name, basePath, formats = ['mp3', 'ogg', 'm4a']) {
		// Map legacy names to registry keys
		const nameMap = {
			'toggle': 'toggle',
			'buttonDown': 'button',
			'buttonUp': 'buttonUp',
			'smallClick': 'smallClick',
			'slider': 'slider',
			'book': 'book'
		};
		
		const registryKey = nameMap[name] || name;
		
		// The new service will handle loading from registry
		// Store a reference for compatibility
		this.sounds.set(name, { registryKey });
		
		// Return a mock audio object for compatibility
		return {
			src: basePath + '.mp3',
			volume: this.service.volume,
			addEventListener: () => {},
			removeEventListener: () => {}
		};
	}

	/**
	 * Play a sound using the new service
	 */
	play(name, volume = null) {
		// Get the registry key
		const soundRef = this.sounds.get(name);
		const registryKey = soundRef ? soundRef.registryKey : name;
		
		// Play using the new service
		this.service.play(registryKey, { 
			volume: volume !== null ? volume / this.service.volume : undefined 
		});
	}

	/**
	 * Enable/disable sounds (proxy to service)
	 */
	setEnabled(enabled) {
		this.service.setEnabled(enabled);
	}

	/**
	 * Set volume (proxy to service)
	 */
	setVolume(volume) {
		this.service.setVolume(volume);
	}

	/**
	 * Check if enabled (proxy to service)
	 */
	isEnabled() {
		return this.service.enabled;
	}

	/**
	 * Get volume (proxy to service)
	 */
	getVolume() {
		return this.service.volume;
	}

	/**
	 * Preload common sounds
	 */
	preloadCommonSounds() {
		// Map old names to new registry keys
		this.loadSound('toggle', '/media/toggleSound', ['mp3', 'ogg', 'm4a']);
		this.loadSound('buttonDown', '/media/button-press-down', ['mp3', 'm4a']);
		this.loadSound('buttonUp', '/media/button-press-up', ['mp3', 'm4a']);
		this.loadSound('smallClick', '/media/smallClick', ['mp3']);
		this.loadSound('slider', '/media/slider', ['mp3']);
		this.loadSound('book', '/media/book', ['mp3', 'm4a']);
		
		// Actually preload using the service
		this.service.preload(['toggle', 'button', 'buttonUp', 'smallClick', 'slider', 'book']);
	}
}

// Create global instance for backward compatibility
const soundEffectsCompat = new SoundEffectsCompat();

/**
 * Initialize function for backward compatibility
 */
function initializeSoundEffects() {
	soundEffectsCompat.preloadCommonSounds();
	
	// Log migration notice in development
	if (process.env.NODE_ENV !== 'production') {
		console.info(
			'%c[Sound Service] Using compatibility layer. Consider migrating to new SoundService API.',
			'color: #ff9800; font-weight: bold'
		);
	}
}

// Expose global objects for backward compatibility
if (typeof window !== 'undefined') {
	// Expose the compatibility instance as soundEffects
	window.soundEffects = soundEffectsCompat;
	window.initializeSoundEffects = initializeSoundEffects;
	
	// Define global playback functions
	window.playButtonSound = function() {
		soundService.play('smallClick');
	};
	
	window.playBookSound = function() {
		soundService.play('book');
	};
	
	window.playSmallClickSound = function() {
		soundService.play('smallClick');
	};
	
	window.playToggleSound = function() {
		soundService.play('toggle');
	};
	
	window.playSliderSound = function() {
		soundService.play('slider');
	};
	
	// Initialize on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initializeSoundEffects);
	} else {
		initializeSoundEffects();
	}
}

// Also export for module usage
export { soundEffectsCompat, initializeSoundEffects };
export default soundEffectsCompat;