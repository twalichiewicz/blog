/**
 * Sound Registry
 * Central configuration for all available sounds in the portfolio
 */

const SoundRegistry = {
	// UI interaction sounds
	ui: {
		button: {
			name: 'Button Click',
			category: 'ui',
			formats: {
				mp3: '/media/button-press-down.mp3',
				m4a: '/media/button-press-down.m4a'
			},
			volume: 0.6,
			preload: true
		},
		buttonUp: {
			name: 'Button Release',
			category: 'ui',
			formats: {
				mp3: '/media/button-press-up.mp3',
				m4a: '/media/button-press-up.m4a'
			},
			volume: 0.4,
			preload: false
		},
		toggle: {
			name: 'Toggle Switch',
			category: 'ui',
			formats: {
				mp3: '/media/toggleSound.mp3',
				m4a: '/media/toggleSound.m4a',
				ogg: '/media/toggleSound.ogg'
			},
			volume: 0.5,
			preload: true
		},
		smallClick: {
			name: 'Small Click',
			category: 'ui',
			formats: {
				mp3: '/media/smallClick.mp3'
			},
			volume: 0.4,
			preload: true
		},
		slider: {
			name: 'Slider',
			category: 'ui',
			formats: {
				mp3: '/media/slider.mp3'
			},
			volume: 0.3,
			preload: false
		}
	},
	
	// Navigation sounds
	navigation: {
		book: {
			name: 'Book Page',
			category: 'navigation',
			formats: {
				mp3: '/media/book.mp3',
				m4a: '/media/book.m4a'
			},
			volume: 0.5,
			preload: false
		}
	},
	
	// Ambient/background sounds
	ambient: {
		wavey: {
			name: 'Wave Effect',
			category: 'ambient',
			formats: {
				mp3: '/media/wavey.mp3'
			},
			volume: 0.2,
			preload: false,
			loop: true
		},
		deepHouse: {
			name: 'Deep House',
			category: 'ambient',
			formats: {
				mp3: '/media/deepHouse.mp3'
			},
			volume: 0.1,
			preload: false,
			loop: true
		}
	}
};

/**
 * Helper class to work with the registry
 */
class SoundRegistryHelper {
	/**
	 * Get all sounds as a flat list
	 */
	static getAllSounds() {
		const sounds = {};
		
		Object.entries(SoundRegistry).forEach(([category, categorySounds]) => {
			Object.entries(categorySounds).forEach(([key, config]) => {
				sounds[key] = { ...config, key, category };
			});
		});
		
		return sounds;
	}
	
	/**
	 * Get sounds by category
	 */
	static getSoundsByCategory(category) {
		return SoundRegistry[category] || {};
	}
	
	/**
	 * Get sounds that should be preloaded
	 */
	static getPreloadSounds() {
		const preloadSounds = [];
		const allSounds = this.getAllSounds();
		
		Object.entries(allSounds).forEach(([key, config]) => {
			if (config.preload) {
				preloadSounds.push(key);
			}
		});
		
		return preloadSounds;
	}
	
	/**
	 * Get sound configuration
	 */
	static getSoundConfig(soundKey) {
		const allSounds = this.getAllSounds();
		return allSounds[soundKey] || null;
	}
	
	/**
	 * Register a new sound dynamically
	 */
	static registerSound(key, config, category = 'custom') {
		if (!SoundRegistry[category]) {
			SoundRegistry[category] = {};
		}
		
		SoundRegistry[category][key] = {
			name: config.name || key,
			category,
			formats: config.formats || { mp3: config.url },
			volume: config.volume ?? 0.5,
			preload: config.preload ?? false,
			loop: config.loop ?? false,
			...config
		};
	}
	
	/**
	 * Get volume for a specific sound
	 */
	static getSoundVolume(soundKey) {
		const config = this.getSoundConfig(soundKey);
		return config ? config.volume : 0.5;
	}
}

// Export both the registry and helper
export { SoundRegistry, SoundRegistryHelper };

// Also expose for non-module environments
if (typeof window !== 'undefined') {
	window.SoundRegistry = SoundRegistry;
	window.SoundRegistryHelper = SoundRegistryHelper;
}