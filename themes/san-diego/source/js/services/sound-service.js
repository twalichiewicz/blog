/**
 * Centralized Sound Service
 * Manages all sound effects for the portfolio with Web Audio API
 * for low-latency playback, pooling, and cross-browser compatibility
 */

import { SoundRegistry, SoundRegistryHelper } from './sound-registry.js';

class SoundService {
	constructor() {
		// Singleton pattern
		if (SoundService.instance) {
			return SoundService.instance;
		}

		// Core properties
		this.enabled = this.loadSetting('soundEnabled', true);
		this.volume = this.loadSetting('soundVolume', 0.5);
		this.autoplayAllowed = null;
		this.pendingSounds = [];

		// Web Audio API (primary - low latency)
		this.audioContext = null;
		this.audioBuffers = new Map();
		this.gainNode = null;

		// HTML5 Audio fallback with pooling
		this.audioPools = new Map();
		this.poolSize = 4; // Pre-create 4 instances per sound

		// Loading state
		this.loadingPromises = new Map();

		// Feature detection
		this.useWebAudio = this.detectWebAudioSupport();
		this.supportedFormats = this.detectSupportedFormats();

		// Initialize
		this.init();

		SoundService.instance = this;
	}

	/**
	 * Detect Web Audio API support
	 */
	detectWebAudioSupport() {
		return typeof (window.AudioContext || window.webkitAudioContext) !== 'undefined';
	}

	/**
	 * Initialize the sound service
	 */
	init() {
		// Test autoplay on first user interaction
		this.setupAutoplayDetection();

		// Listen for volume/enabled changes
		this.setupStorageListener();

		// Expose global for backward compatibility
		if (typeof window !== 'undefined') {
			window.soundService = this;
		}
	}

	/**
	 * Initialize Web Audio API context (must be called after user interaction)
	 */
	initAudioContext() {
		if (this.audioContext) {
			return;
		}

		try {
			const AudioContext = window.AudioContext || window.webkitAudioContext;
			this.audioContext = new AudioContext();

			// Create master gain node for volume control
			this.gainNode = this.audioContext.createGain();
			this.gainNode.connect(this.audioContext.destination);
			this.gainNode.gain.value = this.volume;

			// Resume context if suspended (required by some browsers)
			if (this.audioContext.state === 'suspended') {
				this.audioContext.resume();
			}
		} catch (e) {
			console.warn('Web Audio API not available, falling back to HTML5 Audio');
			this.useWebAudio = false;
		}
	}

	/**
	 * Preload critical sounds on initialization
	 */
	async preloadCriticalSounds() {
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
			// Initialize audio context on user interaction
			this.initAudioContext();

			try {
				const audio = new Audio();
				audio.volume = 0;
				audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
				await audio.play();
				audio.pause();
				this.autoplayAllowed = true;
				this.processPendingSounds();
				this.preloadCriticalSounds();
			} catch (e) {
				this.autoplayAllowed = false;
				console.info('Sound autoplay requires user interaction');
			}
		};

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
					this.updateVolume();
				}
			});
		}
	}

	/**
	 * Load a sound using Web Audio API
	 * @private
	 */
	async loadWebAudio(name, url) {
		if (this.audioBuffers.has(name)) {
			return this.audioBuffers.get(name);
		}

		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

		this.audioBuffers.set(name, audioBuffer);
		return audioBuffer;
	}

	/**
	 * Create an HTML5 Audio pool for a sound
	 * @private
	 */
	createAudioPool(name, url) {
		const pool = [];
		for (let i = 0; i < this.poolSize; i++) {
			const audio = new Audio(url);
			audio.volume = this.volume;
			audio.preload = 'auto';
			pool.push({
				audio,
				inUse: false
			});
		}
		this.audioPools.set(name, pool);
		return pool;
	}

	/**
	 * Get an available audio instance from the pool
	 * @private
	 */
	getPooledAudio(name) {
		const pool = this.audioPools.get(name);
		if (!pool) return null;

		// Find an available instance
		for (const item of pool) {
			if (!item.inUse) {
				return item;
			}
		}

		// All in use - find one that's finished playing
		for (const item of pool) {
			if (item.audio.ended || item.audio.paused) {
				item.inUse = false;
				return item;
			}
		}

		// All truly busy - return first one (will interrupt)
		return pool[0];
	}

	/**
	 * Load a sound (Web Audio or HTML5 pool)
	 * @param {string} name - Sound identifier
	 * @param {string|Object} source - Sound source URL or config object
	 */
	async load(name, source) {
		// Return if already loaded
		if (this.useWebAudio && this.audioBuffers.has(name)) {
			return;
		}
		if (!this.useWebAudio && this.audioPools.has(name)) {
			return;
		}

		// Return existing loading promise if already loading
		if (this.loadingPromises.has(name)) {
			return this.loadingPromises.get(name);
		}

		const config = typeof source === 'string' ? { url: source } : source;
		const url = this.getBestFormat(config);

		if (!url) {
			console.warn(`No supported format found for sound: ${name}`);
			return;
		}

		const loadPromise = (async () => {
			try {
				if (this.useWebAudio && this.audioContext) {
					await this.loadWebAudio(name, url);
				} else {
					this.createAudioPool(name, url);
				}
			} catch (error) {
				console.warn(`Failed to load sound: ${name}`, error);
				// Fallback to HTML5 if Web Audio fails
				if (this.useWebAudio) {
					this.createAudioPool(name, url);
				}
			}
		})();

		this.loadingPromises.set(name, loadPromise);
		await loadPromise;
		this.loadingPromises.delete(name);
	}

	/**
	 * Get the best supported format URL
	 * @private
	 */
	getBestFormat(config) {
		if (typeof config === 'string') {
			return config;
		}

		if (config.url) {
			return config.url;
		}

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
	 * Play a sound with minimal latency
	 * @param {string} name - Sound identifier
	 * @param {Object} options - Playback options
	 */
	play(name, options = {}) {
		if (!this.enabled) {
			return;
		}

		// Queue if autoplay not yet tested
		if (this.autoplayAllowed === null) {
			this.pendingSounds.push({ name, options });
			return;
		}

		if (!this.autoplayAllowed) {
			return;
		}

		// Get sound config
		const soundConfig = SoundRegistryHelper.getSoundConfig(name);
		if (!soundConfig) {
			console.warn(`Sound not found in registry: ${name}`);
			return;
		}

		// Calculate final volume
		const soundVolume = soundConfig.volume ?? 1;
		const optionVolume = options.volume ?? 1;
		const finalVolume = this.volume * soundVolume * optionVolume;

		// Try Web Audio first (lowest latency)
		if (this.useWebAudio && this.audioBuffers.has(name)) {
			this.playWebAudio(name, finalVolume, soundConfig.loop && options.loop !== false);
			return;
		}

		// Fall back to HTML5 Audio pool
		if (this.audioPools.has(name)) {
			this.playPooledAudio(name, finalVolume);
			return;
		}

		// Sound not loaded - load and play (will have latency on first play)
		this.load(name, soundConfig).then(() => {
			this.play(name, options);
		});
	}

	/**
	 * Play using Web Audio API (lowest latency)
	 * @private
	 */
	playWebAudio(name, volume, loop = false) {
		const buffer = this.audioBuffers.get(name);
		if (!buffer || !this.audioContext) return;

		// Resume context if suspended
		if (this.audioContext.state === 'suspended') {
			this.audioContext.resume();
		}

		// Create source node (these are one-shot, cheap to create)
		const source = this.audioContext.createBufferSource();
		source.buffer = buffer;
		source.loop = loop;

		// Create individual gain for this sound
		const gainNode = this.audioContext.createGain();
		gainNode.gain.value = volume;

		// Connect: source -> gain -> master gain -> destination
		source.connect(gainNode);
		gainNode.connect(this.gainNode);

		// Play immediately
		source.start(0);

		return source;
	}

	/**
	 * Play using HTML5 Audio pool
	 * @private
	 */
	playPooledAudio(name, volume) {
		const poolItem = this.getPooledAudio(name);
		if (!poolItem) return;

		const { audio } = poolItem;
		poolItem.inUse = true;

		// Reset and play
		audio.currentTime = 0;
		audio.volume = volume;

		const playPromise = audio.play();
		if (playPromise) {
			playPromise
				.then(() => {
					// Mark as available when done
					audio.addEventListener('ended', () => {
						poolItem.inUse = false;
					}, { once: true });
				})
				.catch(() => {
					poolItem.inUse = false;
				});
		}
	}

	/**
	 * Preload sounds for instant playback
	 * @param {string[]} names - Sound identifiers to preload
	 */
	async preload(names) {
		const promises = names.map(name => {
			const config = SoundRegistryHelper.getSoundConfig(name);
			if (!config) {
				console.warn(`Sound not found in registry for preload: ${name}`);
				return Promise.resolve();
			}
			return this.load(name, config);
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
	 * Update master volume
	 * @private
	 */
	updateVolume() {
		// Update Web Audio gain
		if (this.gainNode) {
			this.gainNode.gain.value = this.volume;
		}

		// Update all pooled audio volumes
		this.audioPools.forEach(pool => {
			pool.forEach(item => {
				item.audio.volume = this.volume;
			});
		});
	}

	/**
	 * Register a new sound dynamically
	 */
	registerSound(key, config, category = 'custom') {
		SoundRegistryHelper.registerSound(key, config, category);
	}

	/**
	 * Get all available sound keys
	 */
	getAvailableSounds() {
		return Object.keys(SoundRegistryHelper.getAllSounds());
	}

	/**
	 * Get sounds by category
	 */
	getSoundsByCategory(category) {
		return SoundRegistryHelper.getSoundsByCategory(category);
	}

	/**
	 * Stop all playing sounds
	 */
	stopAll() {
		// Stop all pooled audio
		this.audioPools.forEach(pool => {
			pool.forEach(item => {
				item.audio.pause();
				item.audio.currentTime = 0;
				item.inUse = false;
			});
		});
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
		this.updateVolume();
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
		// Stop all sounds
		this.stopAll();

		// Clear pools
		this.audioPools.forEach(pool => {
			pool.forEach(item => {
				item.audio.src = '';
			});
		});
		this.audioPools.clear();

		// Clear Web Audio buffers
		this.audioBuffers.clear();

		// Close audio context
		if (this.audioContext) {
			this.audioContext.close();
			this.audioContext = null;
		}

		this.loadingPromises.clear();
		this.pendingSounds = [];
	}
}

// Export as ES6 module
export default SoundService;

// Also expose for non-module environments
if (typeof window !== 'undefined') {
	window.SoundService = SoundService;
}
