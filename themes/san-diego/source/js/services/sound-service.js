/**
 * Centralized Sound Service
 * Manages all sound effects for the portfolio with lazy loading,
 * caching, and cross-browser compatibility
 */

import { SoundRegistry, SoundRegistryHelper } from './sound-registry.js';

class SoundService {
	constructor() {
		// Singleton pattern
		if (SoundService.instance) {
			return SoundService.instance;
		}

		// Core properties
		this.sounds = new Map();
		this.loadingPromises = new Map();
		this.enabled = this.loadSetting('soundEnabled', true);
		this.volume = this.loadSetting('soundVolume', 0.5);
		this.autoplayAllowed = null;
		this.pendingSounds = [];
		
		// Audio context for better performance (optional)
		this.audioContext = null;
		this.useWebAudio = false;
		
		// Feature detection
		this.supportedFormats = this.detectSupportedFormats();
		
		// Initialize
		this.init();
		
		SoundService.instance = this;
	}

	/**
	 * Initialize the sound service
	 */
	init() {
		// Test autoplay on first user interaction
		this.setupAutoplayDetection();
		
		// Listen for volume/enabled changes
		this.setupStorageListener();
		
		// Preload critical sounds
		this.preloadCriticalSounds();
		
		// Expose global for backward compatibility (will be deprecated)
		if (typeof window !== 'undefined') {
			window.soundService = this;
		}
	}

	/**
	 * Preload critical sounds on initialization
	 * @private
	 */
	async preloadCriticalSounds() {
		// Wait for user interaction first
		if (this.autoplayAllowed === false) {
			return;
		}
		
		const criticalSounds = SoundRegistryHelper.getPreloadSounds();
		if (criticalSounds.length > 0) {
			await this.preload(criticalSounds);
		}
	}

	/**
	 * Detect supported audio formats
	 */
	detectSupportedFormats() {
		const audio = new Audio();
		const formats = {
			mp3: 'audio/mpeg',
			ogg: 'audio/ogg',
			m4a: 'audio/mp4',
			wav: 'audio/wav',
			webm: 'audio/webm'
		};
		
		const supported = {};
		for (const [ext, mime] of Object.entries(formats)) {
			supported[ext] = audio.canPlayType(mime) !== '';
		}
		
		return supported;
	}

	/**
	 * Setup autoplay detection
	 */
	setupAutoplayDetection() {
		const testAutoplay = async () => {
			try {
				const audio = new Audio();
				audio.volume = 0;
				audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
				await audio.play();
				this.autoplayAllowed = true;
				this.processPendingSounds();
				// Preload critical sounds now that autoplay is allowed
				this.preloadCriticalSounds();
			} catch (e) {
				this.autoplayAllowed = false;
				console.info('Sound autoplay requires user interaction');
			}
		};

		// Test on first user interaction
		if (typeof document !== 'undefined') {
			['click', 'touchstart', 'keydown'].forEach(event => {
				document.addEventListener(event, () => {
					if (this.autoplayAllowed === null) {
						testAutoplay();
					}
				}, { once: true, passive: true });
			});
		}
	}

	/**
	 * Listen for storage changes (cross-tab sync)
	 */
	setupStorageListener() {
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', (e) => {
				if (e.key === 'soundEnabled') {
					this.enabled = e.newValue === 'true';
				} else if (e.key === 'soundVolume') {
					this.volume = parseFloat(e.newValue) || 0.5;
					this.updateAllVolumes();
				}
			});
		}
	}

	/**
	 * Load a sound file (lazy loading)
	 * @param {string} name - Sound identifier
	 * @param {string|Object} source - Sound source URL or config object
	 * @returns {Promise<Audio>}
	 */
	async load(name, source) {
		// Return cached sound if available
		if (this.sounds.has(name)) {
			return this.sounds.get(name);
		}

		// Return existing loading promise if already loading
		if (this.loadingPromises.has(name)) {
			return this.loadingPromises.get(name);
		}

		// Start loading
		const loadPromise = this.loadSound(name, source);
		this.loadingPromises.set(name, loadPromise);

		try {
			const audio = await loadPromise;
			this.sounds.set(name, audio);
			this.loadingPromises.delete(name);
			return audio;
		} catch (error) {
			this.loadingPromises.delete(name);
			throw error;
		}
	}

	/**
	 * Load a sound file
	 * @private
	 */
	async loadSound(name, source) {
		const config = typeof source === 'string' 
			? { url: source } 
			: source;

		const audio = new Audio();
		audio.volume = this.volume;
		
		// Find best format
		const url = this.getBestFormat(config);
		if (!url) {
			throw new Error(`No supported format found for sound: ${name}`);
		}

		return new Promise((resolve, reject) => {
			audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
			audio.addEventListener('error', () => reject(new Error(`Failed to load sound: ${name}`)), { once: true });
			audio.src = url;
			audio.load();
		});
	}

	/**
	 * Get the best supported format URL
	 * @private
	 */
	getBestFormat(config) {
		// Simple URL provided
		if (typeof config === 'string') {
			return config;
		}
		
		if (config.url) {
			return config.url;
		}

		// Check multiple format options
		if (config.formats) {
			for (const format of Object.keys(config.formats)) {
				if (this.supportedFormats[format]) {
					return config.formats[format];
				}
			}
		}

		return null;
	}

	/**
	 * Play a sound
	 * @param {string} name - Sound identifier
	 * @param {Object} options - Playback options
	 * @returns {Promise<void>}
	 */
	async play(name, options = {}) {
		if (!this.enabled) {
			return;
		}

		// Queue if autoplay not yet tested
		if (this.autoplayAllowed === null) {
			this.pendingSounds.push({ name, options });
			return;
		}

		if (!this.autoplayAllowed) {
			console.debug(`Sound playback blocked: ${name}`);
			return;
		}

		try {
			// Get sound config from registry if no source provided
			let source = options.source;
			if (!source) {
				const config = SoundRegistryHelper.getSoundConfig(name);
				if (!config) {
					console.warn(`Sound not found in registry: ${name}`);
					return;
				}
				source = config;
			}
			
			const audio = await this.load(name, source);
			
			// Clone for concurrent playback
			const instance = audio.cloneNode(true);
			
			// Use sound-specific volume from registry or options
			const soundConfig = SoundRegistryHelper.getSoundConfig(name);
			const defaultVolume = soundConfig ? soundConfig.volume : this.volume;
			instance.volume = (options.volume ?? defaultVolume) * this.volume;
			
			// Handle looping if specified
			if (soundConfig && soundConfig.loop && options.loop !== false) {
				instance.loop = true;
			}
			
			// Play and cleanup
			await instance.play();
			
			// Cleanup after playback (unless looping)
			if (!instance.loop) {
				instance.addEventListener('ended', () => {
					instance.remove();
				}, { once: true });
			}
			
			// Return instance for potential control (stop, volume change, etc.)
			return instance;
			
		} catch (error) {
			console.error(`Failed to play sound: ${name}`, error);
		}
	}

	/**
	 * Preload sounds for better performance
	 * @param {string[]} names - Sound identifiers to preload
	 */
	async preload(names) {
		const promises = names.map(name => {
			const config = SoundRegistryHelper.getSoundConfig(name);
			if (!config) {
				console.warn(`Sound not found in registry for preload: ${name}`);
				return Promise.resolve();
			}
			return this.load(name, config).catch(e => 
				console.warn(`Failed to preload sound: ${name}`, e)
			);
		});
		
		await Promise.allSettled(promises);
	}

	/**
	 * Process pending sounds after autoplay is allowed
	 * @private
	 */
	processPendingSounds() {
		if (!this.autoplayAllowed || this.pendingSounds.length === 0) {
			return;
		}

		const pending = [...this.pendingSounds];
		this.pendingSounds = [];
		
		pending.forEach(({ name, options }) => {
			this.play(name, options);
		});
	}

	/**
	 * Update volume for all cached sounds
	 * @private
	 */
	updateAllVolumes() {
		this.sounds.forEach(audio => {
			audio.volume = this.volume;
		});
	}

	/**
	 * Register a new sound dynamically
	 * @param {string} key - Sound identifier
	 * @param {Object} config - Sound configuration
	 * @param {string} category - Sound category
	 */
	registerSound(key, config, category = 'custom') {
		SoundRegistryHelper.registerSound(key, config, category);
	}
	
	/**
	 * Get all available sound keys
	 * @returns {string[]} Array of sound identifiers
	 */
	getAvailableSounds() {
		return Object.keys(SoundRegistryHelper.getAllSounds());
	}
	
	/**
	 * Get sounds by category
	 * @param {string} category - Category name
	 * @returns {Object} Sounds in the category
	 */
	getSoundsByCategory(category) {
		return SoundRegistryHelper.getSoundsByCategory(category);
	}
	
	/**
	 * Stop all playing sounds (useful for cleanup)
	 */
	stopAll() {
		// This would require tracking playing instances
		// Will be implemented in a future milestone if needed
		console.info('stopAll not yet implemented');
	}

	/**
	 * Enable/disable sounds
	 */
	setEnabled(enabled) {
		this.enabled = enabled;
		this.saveSetting('soundEnabled', enabled);
	}

	/**
	 * Set volume (0-1)
	 */
	setVolume(volume) {
		this.volume = Math.max(0, Math.min(1, volume));
		this.saveSetting('soundVolume', this.volume);
		this.updateAllVolumes();
	}

	/**
	 * Load setting from localStorage
	 * @private
	 */
	loadSetting(key, defaultValue) {
		if (typeof localStorage === 'undefined') {
			return defaultValue;
		}
		
		const value = localStorage.getItem(key);
		if (value === null) {
			return defaultValue;
		}
		
		return key === 'soundEnabled' ? value === 'true' : parseFloat(value);
	}

	/**
	 * Save setting to localStorage
	 * @private
	 */
	saveSetting(key, value) {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(key, value.toString());
		}
	}

	/**
	 * Clean up resources
	 */
	destroy() {
		this.sounds.forEach(audio => {
			audio.pause();
			audio.src = '';
		});
		
		this.sounds.clear();
		this.loadingPromises.clear();
		this.pendingSounds = [];
		
		if (this.audioContext) {
			this.audioContext.close();
		}
	}
}

// Export as ES6 module
export default SoundService;

// Also expose for non-module environments
if (typeof window !== 'undefined') {
	window.SoundService = SoundService;
}