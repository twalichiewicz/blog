/**
 * ApplicationStateManager.js
 * Centralized state management system for the blog/portfolio application
 * Manages tab state, URL parameters, and coordinates system initialization
 */

import { eventBus } from './StateEventBus.js';

export default class ApplicationStateManager {
	constructor() {
		this.state = {
			// Core application state
			activeTab: null,
			deviceType: 'mobile',
			isInitialized: false,
			initializationPhase: 'none', // none, core, systems, complete
			
			// URL and navigation state
			urlParams: new URLSearchParams(),
			navigationHistory: [],
			userSelectedTab: false,
			
			// System readiness state
			systemsReady: {
				mobileTabs: false,
				animations: false,
				carousel: false,
				demos: false,
				visibilityManager: false
			},
			
			// Content state
			contentVisibility: {
				postsContent: 'auto',  // auto, visible, hidden
				projectsContent: 'auto'
			},
			
			// Debug and monitoring
			debugMode: false,
			stateHistory: []
		};

		// Bind methods
		this.setState = this.setState.bind(this);
		this.getState = this.getState.bind(this);
		
		// Initialize device type detection
		this.detectDeviceType();
		
		// Set up window event listeners
		this.setupEventListeners();
		
		// Enable debug mode if needed
		if (window.location.search.includes('debug=state')) {
			this.enableDebug();
		}
	}

	/**
	 * Enable debug mode for state management
	 */
	enableDebug() {
		this.state.debugMode = true;
		eventBus.enableDebug();
		console.log('[ApplicationStateManager] Debug mode enabled');
	}

	/**
	 * Detect device type based on screen size
	 */
	detectDeviceType() {
		const width = window.innerWidth;
		const newDeviceType = width > 1023 ? 'desktop' : width >= 768 ? 'tablet' : 'mobile';
		
		if (newDeviceType !== this.state.deviceType) {
			this.setState({ deviceType: newDeviceType });
			eventBus.emit('deviceTypeChanged', {
				oldType: this.state.deviceType,
				newType: newDeviceType
			});
		}
	}

	/**
	 * Set up window event listeners
	 */
	setupEventListeners() {
		// Handle window resize
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				this.detectDeviceType();
			}, 100);
		});

		// Handle orientation change
		window.addEventListener('orientationchange', () => {
			setTimeout(() => {
				this.detectDeviceType();
			}, 100);
		});

		// Handle browser navigation (back/forward)
		window.addEventListener('popstate', (event) => {
			this.handlePopState(event);
		});
	}

	/**
	 * Handle browser back/forward navigation
	 */
	handlePopState(event) {
		if (this.state.debugMode) {
			console.log('[ApplicationStateManager] Handling popstate', event.state);
		}

		// Update URL parameters from current location
		this.updateUrlParams();
		
		// Process navigation state
		if (event.state && event.state.tab) {
			this.setActiveTab(event.state.tab, false, 'popstate');
		} else {
			// Fallback to URL parameter processing
			this.processUrlParameters();
		}
	}

	/**
	 * Update internal URL parameters from current window location
	 */
	updateUrlParams() {
		const newParams = new URLSearchParams(window.location.search);
		const oldParams = this.state.urlParams;
		
		this.setState({ urlParams: newParams });
		
		// Emit event if parameters changed
		if (newParams.toString() !== oldParams.toString()) {
			eventBus.emit('urlParametersChanged', {
				oldParams: oldParams,
				newParams: newParams
			});
		}
	}

	/**
	 * Process URL parameters and update state accordingly
	 */
	processUrlParameters() {
		const tabParam = this.state.urlParams.get('tab');
		
		if (tabParam && (tabParam === 'portfolio' || tabParam === 'blog')) {
			if (this.state.debugMode) {
				console.log('[ApplicationStateManager] Processing URL tab parameter:', tabParam);
			}
			
			this.setActiveTab(tabParam, false, 'url-parameter');
		} else {
			// Use referrer-based detection for default tab
			this.setDefaultTab();
		}
	}

	/**
	 * Set default tab based on referrer and other heuristics
	 */
	setDefaultTab() {
		const referrer = document.referrer;
		const isFromProject = referrer && (
			referrer.includes('/20') && // matches year-based URLs like /2023/01/01/project-name
			!referrer.includes('#') && // not an anchor link
			referrer !== window.location.href // not the same page
		);
		
		const defaultTab = isFromProject ? 'portfolio' : 'blog';
		
		if (this.state.debugMode) {
			console.log('[ApplicationStateManager] Setting default tab:', defaultTab, { 
				referrer, 
				isFromProject 
			});
		}
		
		this.setActiveTab(defaultTab, false, 'default');
	}

	/**
	 * Set the active tab with proper state management
	 * @param {string} tab - Tab to activate ('portfolio' or 'blog')
	 * @param {boolean} userSelected - Whether this was a user-initiated change
	 * @param {string} source - Source of the tab change (user, url-parameter, default, popstate)
	 */
	setActiveTab(tab, userSelected = false, source = 'unknown') {
		if (!['portfolio', 'blog'].includes(tab)) {
			console.warn('[ApplicationStateManager] Invalid tab:', tab);
			return;
		}

		const oldTab = this.state.activeTab;
		
		this.setState({
			activeTab: tab,
			userSelectedTab: userSelected
		});

		if (this.state.debugMode) {
			console.log('[ApplicationStateManager] Tab changed:', {
				oldTab,
				newTab: tab,
				userSelected,
				source
			});
		}

		// Emit tab change event
		eventBus.emit('tabChanged', {
			oldTab,
			newTab: tab,
			userSelected,
			source,
			deviceType: this.state.deviceType
		});

		// Update URL if this was a user-initiated change
		if (userSelected && source === 'user') {
			this.updateUrl(tab);
		}
	}

	/**
	 * Update the URL with current tab state
	 * @param {string} tab - Tab to set in URL
	 */
	updateUrl(tab) {
		const url = new URL(window.location);
		url.searchParams.set('tab', tab);
		
		const state = { 
			tab,
			timestamp: Date.now(),
			userSelected: true
		};
		
		window.history.pushState(state, '', url);
		this.updateUrlParams();
		
		// Track navigation history
		this.state.navigationHistory.push({
			url: url.toString(),
			tab,
			timestamp: Date.now()
		});
		
		// Keep history manageable
		if (this.state.navigationHistory.length > 10) {
			this.state.navigationHistory.shift();
		}
	}

	/**
	 * Register a system as ready
	 * @param {string} systemName - Name of the system
	 */
	registerSystemReady(systemName) {
		if (this.state.systemsReady.hasOwnProperty(systemName)) {
			this.setState({
				systemsReady: {
					...this.state.systemsReady,
					[systemName]: true
				}
			});

			if (this.state.debugMode) {
				console.log(`[ApplicationStateManager] System ready: ${systemName}`);
			}

			eventBus.emit('systemReady', { systemName });
			this.checkInitializationComplete();
		}
	}

	/**
	 * Check if all systems are ready and mark initialization as complete
	 */
	checkInitializationComplete() {
		const allSystemsReady = Object.values(this.state.systemsReady).every(ready => ready);
		
		if (allSystemsReady && !this.state.isInitialized) {
			this.setState({
				isInitialized: true,
				initializationPhase: 'complete'
			});

			if (this.state.debugMode) {
				console.log('[ApplicationStateManager] All systems initialized');
			}

			eventBus.emit('allSystemsReady');
			
			// Now it's safe to process URL parameters
			this.processUrlParameters();
		}
	}

	/**
	 * Set content visibility state
	 * @param {string} contentArea - 'postsContent' or 'projectsContent'
	 * @param {string} visibility - 'visible', 'hidden', or 'auto'
	 */
	setContentVisibility(contentArea, visibility) {
		if (!['postsContent', 'projectsContent'].includes(contentArea)) {
			console.warn('[ApplicationStateManager] Invalid content area:', contentArea);
			return;
		}

		if (!['visible', 'hidden', 'auto'].includes(visibility)) {
			console.warn('[ApplicationStateManager] Invalid visibility state:', visibility);
			return;
		}

		this.setState({
			contentVisibility: {
				...this.state.contentVisibility,
				[contentArea]: visibility
			}
		});

		eventBus.emit('contentVisibilityChanged', {
			contentArea,
			visibility,
			allVisibility: this.state.contentVisibility
		});
	}

	/**
	 * Update state and trigger events
	 * @param {Object} updates - State updates to apply
	 */
	setState(updates) {
		const oldState = { ...this.state };
		this.state = { ...this.state, ...updates };

		// Track state history for debugging
		if (this.state.debugMode) {
			this.state.stateHistory.push({
				timestamp: Date.now(),
				updates,
				fullState: { ...this.state }
			});

			// Keep history manageable
			if (this.state.stateHistory.length > 50) {
				this.state.stateHistory.shift();
			}
		}

		// Emit state change event
		eventBus.emit('stateChanged', {
			oldState,
			newState: this.state,
			updates
		});
	}

	/**
	 * Get current state (read-only)
	 */
	getState() {
		return { ...this.state };
	}

	/**
	 * Get specific state value
	 * @param {string} key - State key to retrieve
	 */
	getStateValue(key) {
		return this.state[key];
	}

	/**
	 * Check if a system is ready
	 * @param {string} systemName - Name of the system to check
	 */
	isSystemReady(systemName) {
		return this.state.systemsReady[systemName] || false;
	}

	/**
	 * Get initialization status
	 */
	getInitializationStatus() {
		return {
			isInitialized: this.state.isInitialized,
			phase: this.state.initializationPhase,
			systemsReady: { ...this.state.systemsReady },
			readyCount: Object.values(this.state.systemsReady).filter(ready => ready).length,
			totalSystems: Object.keys(this.state.systemsReady).length
		};
	}

	/**
	 * Reset state to initial values (for testing)
	 */
	reset() {
		this.state = {
			activeTab: null,
			deviceType: 'mobile',
			isInitialized: false,
			initializationPhase: 'none',
			urlParams: new URLSearchParams(),
			navigationHistory: [],
			userSelectedTab: false,
			systemsReady: {
				mobileTabs: false,
				animations: false,
				carousel: false,
				demos: false,
				visibilityManager: false
			},
			contentVisibility: {
				postsContent: 'auto',
				projectsContent: 'auto'
			},
			debugMode: this.state.debugMode,
			stateHistory: []
		};

		eventBus.emit('stateReset');
	}
}

// Create singleton instance
const stateManager = new ApplicationStateManager();
export { stateManager };