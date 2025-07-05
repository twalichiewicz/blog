/**
 * Sound Service Loader
 * Drop-in replacement for sound-effects.js that loads the new system
 * with full backward compatibility
 */

(function() {
	'use strict';
	
	// Dynamic import to load the ES6 modules
	const loadSoundSystem = async () => {
		try {
			// Import the compatibility layer which will set up everything
			const module = await import('./sound-compatibility.js');
			
			// The compatibility layer already sets up window.soundEffects
			// and all the global functions, so we're done!
			
		} catch (error) {
			console.error('Failed to load sound system:', error);
			
			// Fallback: Create stub functions so the site doesn't break
			const noop = () => {};
			window.soundEffects = {
				play: noop,
				setEnabled: noop,
				setVolume: noop,
				isEnabled: () => false,
				getVolume: () => 0.5,
				loadSound: noop,
				preloadCommonSounds: noop
			};
			window.playButtonSound = noop;
			window.playBookSound = noop;
			window.playSmallClickSound = noop;
			window.playToggleSound = noop;
			window.playSliderSound = noop;
			window.initializeSoundEffects = noop;
		}
	};
	
	// Check if browser supports dynamic imports
	try {
		new Function('import("")');
		// Browser supports dynamic imports, use them
		loadSoundSystem();
	} catch (err) {
		// Browser doesn't support dynamic imports, load via script tags
		const loadScript = (src, type = 'text/javascript') => {
			return new Promise((resolve, reject) => {
				const script = document.createElement('script');
				script.type = type;
				script.src = src;
				script.onload = resolve;
				script.onerror = reject;
				document.head.appendChild(script);
			});
		};
		
		// Load modules in order
		const basePath = '/js/services/';
		
		loadScript(basePath + 'sound-registry.js', 'module')
			.then(() => loadScript(basePath + 'sound-service.js', 'module'))
			.then(() => loadScript(basePath + 'sound-compatibility.js', 'module'))
			.catch(error => {
				console.error('Failed to load sound system via script tags:', error);
				
				// Create stubs
				const noop = () => {};
				window.soundEffects = {
					play: noop,
					setEnabled: noop,
					setVolume: noop,
					isEnabled: () => false,
					getVolume: () => 0.5,
					loadSound: noop,
					preloadCommonSounds: noop
				};
				window.playButtonSound = noop;
				window.playBookSound = noop;
				window.playSmallClickSound = noop;
				window.playToggleSound = noop;
				window.playSliderSound = noop;
				window.initializeSoundEffects = noop;
			});
	}
})();