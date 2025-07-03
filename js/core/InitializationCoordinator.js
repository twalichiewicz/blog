/**
 * InitializationCoordinator.js
 * Manages system initialization order and dependencies
 * Ensures proper timing and coordination between different systems
 */

import { eventBus } from './StateEventBus.js';
import { stateManager } from './ApplicationStateManager.js';
import { safeVisibilityManager } from './SafeVisibilityManager.js';

export default class InitializationCoordinator {
	constructor() {
		this.config = {
			// Initialization phases and their dependencies
			phases: {
				core: {
					order: 1,
					systems: ['stateManager', 'eventBus', 'visibilityManager'],
					description: 'Core state management and event systems'
				},
				dom: {
					order: 2,
					systems: ['mobileTabs'],
					dependencies: ['core'],
					description: 'DOM-based systems that manage UI state'
				},
				content: {
					order: 3,
					systems: ['animations', 'carousel', 'demos'],
					dependencies: ['core', 'dom'],
					description: 'Content-dependent systems (animations, demos, etc.)'
				},
				finalization: {
					order: 4,
					systems: [],
					dependencies: ['core', 'dom', 'content'],
					description: 'Final initialization and URL processing'
				}
			},
			
			// Timeout settings
			initTimeouts: {
				perSystem: 5000,  // 5 seconds per system
				total: 30000      // 30 seconds total
			}
		};

		this.state = {
			currentPhase: 'none',
			initializedSystems: new Set(),
			failedSystems: new Set(),
			systemInitPromises: new Map(),
			startTime: null,
			phaseStartTime: null,
			debugMode: false
		};

		// Bind methods
		this.initializeSystem = this.initializeSystem.bind(this);
		this.onSystemReady = this.onSystemReady.bind(this);

		// Set up event listeners
		this.setupEventListeners();

		// Enable debug mode if needed
		if (stateManager.getStateValue('debugMode')) {
			this.enableDebug();
		}

		// Start initialization process
		this.startInitialization();
	}

	/**
	 * Enable debug mode
	 */
	enableDebug() {
		this.state.debugMode = true;
		console.log('[InitializationCoordinator] Debug mode enabled');
	}

	/**
	 * Set up event listeners
	 */
	setupEventListeners() {
		eventBus.on('systemReady', this.onSystemReady);
		eventBus.on('stateChanged', this.onStateChanged.bind(this));
	}

	/**
	 * Start the initialization process
	 */
	startInitialization() {
		this.state.startTime = Date.now();
		
		if (this.state.debugMode) {
			console.log('[InitializationCoordinator] Starting initialization process');
		}

		// Ensure all content is visible for initialization
		const restoreVisibility = safeVisibilityManager.makeAllVisibleForInitialization();

		// Store restore function for later
		this.restoreVisibility = restoreVisibility;

		// Start with core phase
		this.initializePhase('core');
	}

	/**
	 * Initialize a specific phase
	 * @param {string} phaseName - Name of the phase to initialize
	 */
	async initializePhase(phaseName) {
		const phase = this.config.phases[phaseName];
		if (!phase) {
			console.error('[InitializationCoordinator] Unknown phase:', phaseName);
			return;
		}

		// Check dependencies
		if (phase.dependencies) {
			const unmetDependencies = phase.dependencies.filter(dep => 
				!this.isPhaseComplete(dep)
			);
			
			if (unmetDependencies.length > 0) {
				if (this.state.debugMode) {
					console.log(`[InitializationCoordinator] Waiting for dependencies for phase '${phaseName}':`, unmetDependencies);
				}
				
				// Wait for dependencies and try again
				setTimeout(() => this.initializePhase(phaseName), 100);
				return;
			}
		}

		this.state.currentPhase = phaseName;
		this.state.phaseStartTime = Date.now();
		
		if (this.state.debugMode) {
			console.log(`[InitializationCoordinator] Starting phase '${phaseName}': ${phase.description}`);
		}

		eventBus.emit('initializationPhaseStarted', {
			phaseName,
			phase,
			timestamp: this.state.phaseStartTime
		});

		// Initialize systems in this phase
		const systemPromises = phase.systems.map(systemName => 
			this.initializeSystem(systemName)
		);

		// Wait for all systems in this phase to complete
		try {
			await Promise.all(systemPromises);
			await this.onPhaseComplete(phaseName);
		} catch (error) {
			console.error(`[InitializationCoordinator] Phase '${phaseName}' failed:`, error);
			this.onPhaseError(phaseName, error);
		}
	}

	/**
	 * Initialize a specific system
	 * @param {string} systemName - Name of the system to initialize
	 */
	async initializeSystem(systemName) {
		if (this.state.initializedSystems.has(systemName)) {
			if (this.state.debugMode) {
				console.log(`[InitializationCoordinator] System '${systemName}' already initialized`);
			}
			return;
		}

		if (this.state.debugMode) {
			console.log(`[InitializationCoordinator] Initializing system '${systemName}'`);
		}

		const startTime = Date.now();

		// Create a promise that resolves when the system is ready
		const systemPromise = new Promise((resolve, reject) => {
			// Set up timeout
			const timeout = setTimeout(() => {
				reject(new Error(`System '${systemName}' initialization timeout`));
			}, this.config.initTimeouts.perSystem);

			// Listen for system ready event
			const onReady = (data) => {
				if (data.systemName === systemName) {
					clearTimeout(timeout);
					eventBus.off('systemReady', onReady);
					resolve(data);
				}
			};

			eventBus.on('systemReady', onReady);

			// Trigger system initialization based on system type
			this.triggerSystemInitialization(systemName);
		});

		this.state.systemInitPromises.set(systemName, systemPromise);

		try {
			await systemPromise;
			const duration = Date.now() - startTime;
			
			if (this.state.debugMode) {
				console.log(`[InitializationCoordinator] System '${systemName}' initialized in ${duration}ms`);
			}
		} catch (error) {
			this.state.failedSystems.add(systemName);
			console.error(`[InitializationCoordinator] System '${systemName}' failed to initialize:`, error);
			throw error;
		}
	}

	/**
	 * Trigger initialization for a specific system
	 * @param {string} systemName - Name of the system to trigger
	 */
	triggerSystemInitialization(systemName) {
		switch (systemName) {
			case 'stateManager':
				// State manager is already initialized
				stateManager.registerSystemReady('stateManager');
				break;
				
			case 'eventBus':
				// Event bus is already initialized
				stateManager.registerSystemReady('eventBus');
				break;
				
			case 'visibilityManager':
				// Visibility manager should already be initialized
				// It registers itself when ready
				break;
				
			case 'mobileTabs':
				// Mobile tabs will initialize itself and register when ready
				eventBus.emit('initializeMobileTabs');
				break;
				
			case 'animations':
				// Trigger animation system initialization
				eventBus.emit('initializeAnimations');
				break;
				
			case 'carousel':
				// Trigger carousel initialization
				eventBus.emit('initializeCarousel');
				break;
				
			case 'demos':
				// Trigger demo system initialization
				eventBus.emit('initializeDemos');
				break;
				
			default:
				console.warn(`[InitializationCoordinator] Unknown system: ${systemName}`);
				break;
		}
	}

	/**
	 * Handle system ready events
	 * @param {Object} data - System ready event data
	 */
	onSystemReady(data) {
		const { systemName } = data;
		this.state.initializedSystems.add(systemName);
		
		if (this.state.debugMode) {
			console.log(`[InitializationCoordinator] System ready: ${systemName}`);
		}

		// Check if current phase is complete
		this.checkPhaseCompletion();
	}

	/**
	 * Handle state changes
	 * @param {Object} data - State change event data
	 */
	onStateChanged(data) {
		// Monitor state changes for debugging
		if (this.state.debugMode && data.updates.initializationPhase) {
			console.log('[InitializationCoordinator] State manager initialization phase changed:', data.updates.initializationPhase);
		}
	}

	/**
	 * Check if the current phase is complete
	 */
	checkPhaseCompletion() {
		const currentPhase = this.config.phases[this.state.currentPhase];
		if (!currentPhase) return;

		const requiredSystems = currentPhase.systems;
		const completedSystems = requiredSystems.filter(systemName => 
			this.state.initializedSystems.has(systemName)
		);

		if (completedSystems.length === requiredSystems.length) {
			this.onPhaseComplete(this.state.currentPhase);
		}
	}

	/**
	 * Handle phase completion
	 * @param {string} phaseName - Name of the completed phase
	 */
	async onPhaseComplete(phaseName) {
		const duration = Date.now() - this.state.phaseStartTime;
		
		if (this.state.debugMode) {
			console.log(`[InitializationCoordinator] Phase '${phaseName}' completed in ${duration}ms`);
		}

		eventBus.emit('initializationPhaseCompleted', {
			phaseName,
			duration,
			timestamp: Date.now()
		});

		// Move to next phase
		const nextPhase = this.getNextPhase(phaseName);
		if (nextPhase) {
			await this.initializePhase(nextPhase);
		} else {
			// All phases complete
			this.onAllPhasesComplete();
		}
	}

	/**
	 * Handle phase errors
	 * @param {string} phaseName - Name of the failed phase
	 * @param {Error} error - Error that occurred
	 */
	onPhaseError(phaseName, error) {
		console.error(`[InitializationCoordinator] Phase '${phaseName}' failed:`, error);
		
		eventBus.emit('initializationPhaseError', {
			phaseName,
			error,
			timestamp: Date.now()
		});

		// Try to continue with next phase or fail gracefully
		this.attemptRecovery(phaseName, error);
	}

	/**
	 * Handle completion of all initialization phases
	 */
	onAllPhasesComplete() {
		const totalDuration = Date.now() - this.state.startTime;
		
		if (this.state.debugMode) {
			console.log(`[InitializationCoordinator] All phases completed in ${totalDuration}ms`);
			console.log('[InitializationCoordinator] Initialized systems:', Array.from(this.state.initializedSystems));
			console.log('[InitializationCoordinator] Failed systems:', Array.from(this.state.failedSystems));
		}

		// Restore proper visibility now that initialization is complete
		if (this.restoreVisibility) {
			this.restoreVisibility();
		}

		// Emit completion event
		eventBus.emit('initializationComplete', {
			totalDuration,
			initializedSystems: Array.from(this.state.initializedSystems),
			failedSystems: Array.from(this.state.failedSystems),
			timestamp: Date.now()
		});

		// Mark state manager as fully initialized
		stateManager.setState({
			isInitialized: true,
			initializationPhase: 'complete'
		});
	}

	/**
	 * Get the next phase in the initialization sequence
	 * @param {string} currentPhase - Current phase name
	 */
	getNextPhase(currentPhase) {
		const phases = Object.keys(this.config.phases);
		const currentOrder = this.config.phases[currentPhase].order;
		
		// Find next phase by order
		for (const phaseName of phases) {
			const phase = this.config.phases[phaseName];
			if (phase.order === currentOrder + 1) {
				return phaseName;
			}
		}
		
		return null; // No next phase
	}

	/**
	 * Check if a phase is complete
	 * @param {string} phaseName - Phase name to check
	 */
	isPhaseComplete(phaseName) {
		const phase = this.config.phases[phaseName];
		if (!phase) return false;

		return phase.systems.every(systemName => 
			this.state.initializedSystems.has(systemName)
		);
	}

	/**
	 * Attempt recovery from phase failure
	 * @param {string} phaseName - Failed phase name
	 * @param {Error} error - Error that occurred
	 */
	attemptRecovery(phaseName, error) {
		// For now, try to continue with next phase
		// In a more sophisticated system, we could have specific recovery strategies
		const nextPhase = this.getNextPhase(phaseName);
		if (nextPhase) {
			console.warn(`[InitializationCoordinator] Attempting to continue with next phase: ${nextPhase}`);
			setTimeout(() => this.initializePhase(nextPhase), 1000);
		} else {
			console.error('[InitializationCoordinator] No recovery possible, initialization failed');
			this.onAllPhasesComplete(); // Complete anyway with errors
		}
	}

	/**
	 * Get current initialization status
	 */
	getStatus() {
		return {
			currentPhase: this.state.currentPhase,
			initializedSystems: Array.from(this.state.initializedSystems),
			failedSystems: Array.from(this.state.failedSystems),
			elapsedTime: this.state.startTime ? Date.now() - this.state.startTime : 0,
			phaseElapsedTime: this.state.phaseStartTime ? Date.now() - this.state.phaseStartTime : 0,
			isComplete: this.state.currentPhase === 'finalization' && this.isPhaseComplete('finalization')
		};
	}

	/**
	 * Force complete initialization (for emergency situations)
	 */
	forceComplete() {
		console.warn('[InitializationCoordinator] Force completing initialization');
		this.onAllPhasesComplete();
	}
}

// Create singleton instance
const initializationCoordinator = new InitializationCoordinator();
export { initializationCoordinator };