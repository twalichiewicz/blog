/**
 * Core Architecture Entry Point
 * Initializes the new state management system
 */

// Import core modules
import { eventBus } from './StateEventBus.js';
import { stateManager } from './ApplicationStateManager.js';
import { safeVisibilityManager } from './SafeVisibilityManager.js';
import { initializationCoordinator } from './InitializationCoordinator.js';

// Import existing systems that need to be integrated
import MobileTabs from '../components/MobileTabs.js';

/**
 * Initialize the new core architecture
 */
function initializeCoreArchitecture() {
	// Check if new architecture should be enabled
	const enableNewArchitecture = window.location.search.includes('new-arch=true') || 
	                              window.location.search.includes('debug=state');
	
	if (!enableNewArchitecture) {
		console.log('[CoreArchitecture] New architecture disabled, skipping initialization');
		return;
	}

	console.log('[CoreArchitecture] Starting initialization');

	// Enable debug mode if requested
	if (window.location.search.includes('debug=state') || window.location.search.includes('debug=all')) {
		console.log('[CoreArchitecture] Debug mode enabled');
		eventBus.enableDebug();
		stateManager.enableDebug();
		safeVisibilityManager.enableDebug();
	}

	// Create mobile tabs instance (will wait for initialization signal)
	const mobileTabs = new MobileTabs();

	// Store references globally for debugging
	if (stateManager.getStateValue('debugMode')) {
		window._coreArchitecture = {
			eventBus,
			stateManager,
			safeVisibilityManager,
			initializationCoordinator,
			mobileTabs
		};
	}

	// Set up global event listeners for legacy compatibility
	setupLegacyCompatibility();

	console.log('[CoreArchitecture] Core architecture initialized');
}

/**
 * Set up compatibility with existing systems
 */
function setupLegacyCompatibility() {
	// Listen for initialization events and forward to old systems
	eventBus.on('initializeAnimations', () => {
		// Import and initialize animation systems
		import('../utils/animations.js').then(module => {
			if (module.initSectionAnimations) {
				module.initSectionAnimations({
					sectionSelector: '.section',
					blogPostSelector: '.blog-post',
					portfolioItemSelector: '.portfolio-item'
				});
			}
			if (module.initColumnTitleScrollDetection) {
				module.initColumnTitleScrollDetection({
					postsContentId: 'postsContent',
					projectsContentId: 'projectsContent'
				});
			}
			stateManager.registerSystemReady('animations');
		});
	});

	eventBus.on('initializeCarousel', () => {
		// Carousel system should initialize itself
		// For now, mark as ready (will be updated later)
		setTimeout(() => {
			stateManager.registerSystemReady('carousel');
		}, 100);
	});

	eventBus.on('initializeDemos', () => {
		// Import and initialize demo systems
		import('../project-demo.js').then(() => {
			// Demo system should register itself when ready
			setTimeout(() => {
				stateManager.registerSystemReady('demos');
			}, 100);
		});
	});

	// Forward important events to legacy systems
	eventBus.on('allSystemsReady', () => {
		console.log('[CoreArchitecture] All systems ready - legacy compatibility active');
	});
}

/**
 * Initialize on DOM ready
 */
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeCoreArchitecture);
} else {
	initializeCoreArchitecture();
}

// Export for external access
export {
	eventBus,
	stateManager,
	safeVisibilityManager,
	initializationCoordinator
};