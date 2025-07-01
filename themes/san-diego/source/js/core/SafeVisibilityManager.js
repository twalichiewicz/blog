/**
 * SafeVisibilityManager.js
 * Handles content visibility without breaking JavaScript dependencies
 * Ensures demos, animations, and other systems can initialize properly
 */

import { eventBus } from './StateEventBus.js';
import { stateManager } from './ApplicationStateManager.js';

export default class SafeVisibilityManager {
	constructor() {
		this.config = {
			// Content area selectors
			postsContentId: 'postsContent',
			projectsContentId: 'projectsContent',
			
			// Transition settings
			transitionDuration: 150,
			
			// Safe hiding methods that don't break JS
			safeHidingMethods: {
				// Method 1: Move off-screen (best for initialization)
				offscreen: {
					hidden: { transform: 'translateX(-100vw)', position: 'absolute' },
					visible: { transform: 'translateX(0)', position: 'relative' }
				},
				
				// Method 2: Use visibility (maintains layout but invisible)
				visibility: {
					hidden: { visibility: 'hidden', position: 'absolute' },
					visible: { visibility: 'visible', position: 'relative' }
				},
				
				// Method 3: Zero opacity with pointer-events disabled
				opacity: {
					hidden: { opacity: '0', pointerEvents: 'none' },
					visible: { opacity: '1', pointerEvents: 'auto' }
				}
			}
		};

		this.elements = {
			postsContent: null,
			projectsContent: null
		};

		this.currentMethod = 'offscreen'; // Default safe method
		this.isInitialized = false;
		this.debugMode = false;

		// Initialize
		this.init();
	}

	/**
	 * Initialize the visibility manager
	 */
	init() {
		// Cache DOM elements
		this.cacheElements();
		
		// Set up event listeners
		this.setupEventListeners();
		
		// Enable debug mode if needed
		if (stateManager.getStateValue('debugMode')) {
			this.enableDebug();
		}

		// Mark as initialized
		this.isInitialized = true;
		stateManager.registerSystemReady('visibilityManager');
		
		if (this.debugMode) {
			console.log('[SafeVisibilityManager] Initialized');
		}
	}

	/**
	 * Enable debug mode
	 */
	enableDebug() {
		this.debugMode = true;
		console.log('[SafeVisibilityManager] Debug mode enabled');
	}

	/**
	 * Cache DOM elements
	 */
	cacheElements() {
		this.elements.postsContent = document.getElementById(this.config.postsContentId);
		this.elements.projectsContent = document.getElementById(this.config.projectsContentId);

		if (!this.elements.postsContent || !this.elements.projectsContent) {
			console.warn('[SafeVisibilityManager] Could not find required content elements');
		}
	}

	/**
	 * Set up event listeners
	 */
	setupEventListeners() {
		// Listen for tab changes
		eventBus.on('tabChanged', this.handleTabChange.bind(this));
		
		// Listen for device type changes
		eventBus.on('deviceTypeChanged', this.handleDeviceTypeChange.bind(this));
		
		// Listen for content visibility requests
		eventBus.on('contentVisibilityChanged', this.handleContentVisibilityChange.bind(this));
		
		// Listen for initialization completion
		eventBus.on('allSystemsReady', this.handleAllSystemsReady.bind(this));
	}

	/**
	 * Handle tab changes
	 * @param {Object} data - Tab change event data
	 */
	handleTabChange(data) {
		const { newTab, deviceType } = data;
		
		if (this.debugMode) {
			console.log('[SafeVisibilityManager] Handling tab change:', { newTab, deviceType });
		}

		// On desktop, keep both areas visible
		if (deviceType === 'desktop') {
			this.showBothContentAreas();
		} else {
			// On mobile/tablet, show only the active tab
			this.showActiveTabContent(newTab);
		}
	}

	/**
	 * Handle device type changes
	 * @param {Object} data - Device type change event data
	 */
	handleDeviceTypeChange(data) {
		const { newType } = data;
		const activeTab = stateManager.getStateValue('activeTab');
		
		if (this.debugMode) {
			console.log('[SafeVisibilityManager] Handling device type change:', { newType, activeTab });
		}

		if (newType === 'desktop') {
			this.showBothContentAreas();
		} else if (activeTab) {
			this.showActiveTabContent(activeTab);
		}
	}

	/**
	 * Handle content visibility change requests
	 * @param {Object} data - Content visibility event data
	 */
	handleContentVisibilityChange(data) {
		const { contentArea, visibility } = data;
		
		if (this.debugMode) {
			console.log('[SafeVisibilityManager] Handling content visibility change:', { contentArea, visibility });
		}

		const element = this.elements[contentArea];
		if (!element) return;

		switch (visibility) {
			case 'visible':
				this.showElement(element);
				break;
			case 'hidden':
				this.hideElement(element);
				break;
			case 'auto':
				// Let tab/device logic handle this
				break;
		}
	}

	/**
	 * Handle all systems ready
	 */
	handleAllSystemsReady() {
		if (this.debugMode) {
			console.log('[SafeVisibilityManager] All systems ready - applying initial visibility');
		}

		// Apply initial visibility based on current state
		const activeTab = stateManager.getStateValue('activeTab');
		const deviceType = stateManager.getStateValue('deviceType');

		if (deviceType === 'desktop') {
			this.showBothContentAreas();
		} else if (activeTab) {
			this.showActiveTabContent(activeTab);
		}
	}

	/**
	 * Show both content areas (desktop mode)
	 */
	showBothContentAreas() {
		if (this.debugMode) {
			console.log('[SafeVisibilityManager] Showing both content areas');
		}

		this.showElement(this.elements.postsContent);
		this.showElement(this.elements.projectsContent);

		// Update state manager
		stateManager.setContentVisibility('postsContent', 'visible');
		stateManager.setContentVisibility('projectsContent', 'visible');
	}

	/**
	 * Show only the active tab content (mobile/tablet mode)
	 * @param {string} activeTab - Active tab ('blog' or 'portfolio')
	 */
	showActiveTabContent(activeTab) {
		if (this.debugMode) {
			console.log('[SafeVisibilityManager] Showing active tab content:', activeTab);
		}

		if (activeTab === 'blog') {
			this.showElement(this.elements.postsContent);
			this.hideElement(this.elements.projectsContent);
			
			stateManager.setContentVisibility('postsContent', 'visible');
			stateManager.setContentVisibility('projectsContent', 'hidden');
		} else if (activeTab === 'portfolio') {
			this.hideElement(this.elements.postsContent);
			this.showElement(this.elements.projectsContent);
			
			stateManager.setContentVisibility('postsContent', 'hidden');
			stateManager.setContentVisibility('projectsContent', 'visible');
		}
	}

	/**
	 * Safely show an element
	 * @param {HTMLElement} element - Element to show
	 */
	showElement(element) {
		if (!element) return;

		const method = this.config.safeHidingMethods[this.currentMethod];
		
		// Apply transition
		element.style.transition = `opacity ${this.config.transitionDuration}ms ease-in-out, transform ${this.config.transitionDuration}ms ease-in-out`;
		
		// Apply visible styles
		Object.assign(element.style, method.visible);

		if (this.debugMode) {
			console.log('[SafeVisibilityManager] Showed element:', element.id);
		}
	}

	/**
	 * Safely hide an element without breaking JS
	 * @param {HTMLElement} element - Element to hide
	 */
	hideElement(element) {
		if (!element) return;

		const method = this.config.safeHidingMethods[this.currentMethod];
		
		// Apply transition
		element.style.transition = `opacity ${this.config.transitionDuration}ms ease-in-out, transform ${this.config.transitionDuration}ms ease-in-out`;
		
		// Apply hidden styles
		Object.assign(element.style, method.hidden);

		if (this.debugMode) {
			console.log('[SafeVisibilityManager] Hid element:', element.id);
		}
	}

	/**
	 * Temporarily make all content visible for initialization
	 * This ensures all JavaScript systems can initialize properly
	 */
	makeAllVisibleForInitialization() {
		if (this.debugMode) {
			console.log('[SafeVisibilityManager] Making all content visible for initialization');
		}

		// Temporarily show both areas without transitions
		[this.elements.postsContent, this.elements.projectsContent].forEach(element => {
			if (element) {
				element.style.transition = 'none';
				element.style.opacity = '1';
				element.style.visibility = 'visible';
				element.style.transform = 'translateX(0)';
				element.style.position = 'relative';
				element.style.pointerEvents = 'auto';
			}
		});

		// Return a function to restore proper visibility
		return () => {
			if (this.debugMode) {
				console.log('[SafeVisibilityManager] Restoring proper visibility after initialization');
			}

			// Restore proper visibility based on current state
			const activeTab = stateManager.getStateValue('activeTab');
			const deviceType = stateManager.getStateValue('deviceType');

			if (deviceType === 'desktop') {
				this.showBothContentAreas();
			} else if (activeTab) {
				this.showActiveTabContent(activeTab);
			}
		};
	}

	/**
	 * Change the hiding method
	 * @param {string} method - Method to use ('offscreen', 'visibility', 'opacity')
	 */
	setHidingMethod(method) {
		if (!this.config.safeHidingMethods[method]) {
			console.warn('[SafeVisibilityManager] Invalid hiding method:', method);
			return;
		}

		this.currentMethod = method;
		
		if (this.debugMode) {
			console.log('[SafeVisibilityManager] Changed hiding method to:', method);
		}

		// Re-apply current visibility with new method
		const activeTab = stateManager.getStateValue('activeTab');
		const deviceType = stateManager.getStateValue('deviceType');

		if (deviceType === 'desktop') {
			this.showBothContentAreas();
		} else if (activeTab) {
			this.showActiveTabContent(activeTab);
		}
	}

	/**
	 * Get current visibility state
	 */
	getVisibilityState() {
		return {
			currentMethod: this.currentMethod,
			elements: {
				postsContent: this.elements.postsContent ? this.getElementVisibilityInfo(this.elements.postsContent) : null,
				projectsContent: this.elements.projectsContent ? this.getElementVisibilityInfo(this.elements.projectsContent) : null
			}
		};
	}

	/**
	 * Get visibility information for an element
	 * @param {HTMLElement} element - Element to analyze
	 */
	getElementVisibilityInfo(element) {
		const computedStyle = window.getComputedStyle(element);
		const rect = element.getBoundingClientRect();
		
		return {
			display: computedStyle.display,
			visibility: computedStyle.visibility,
			opacity: computedStyle.opacity,
			transform: computedStyle.transform,
			position: computedStyle.position,
			pointerEvents: computedStyle.pointerEvents,
			boundingRect: {
				width: rect.width,
				height: rect.height,
				top: rect.top,
				left: rect.left
			},
			isVisible: rect.width > 0 && rect.height > 0 && computedStyle.opacity !== '0'
		};
	}

	/**
	 * Reset all visibility to default state
	 */
	reset() {
		[this.elements.postsContent, this.elements.projectsContent].forEach(element => {
			if (element) {
				element.style.transition = '';
				element.style.opacity = '';
				element.style.visibility = '';
				element.style.transform = '';
				element.style.position = '';
				element.style.pointerEvents = '';
			}
		});

		if (this.debugMode) {
			console.log('[SafeVisibilityManager] Reset all visibility');
		}
	}
}

// Create singleton instance
const safeVisibilityManager = new SafeVisibilityManager();
export { safeVisibilityManager };