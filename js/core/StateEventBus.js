/**
 * StateEventBus.js
 * Event-driven communication system for application state management
 * Provides pub/sub pattern for coordinating between different systems
 */

export default class StateEventBus {
	constructor() {
		this.listeners = new Map();
		this.debugMode = false;
	}

	/**
	 * Enable debug logging for state events
	 */
	enableDebug() {
		this.debugMode = true;
	}

	/**
	 * Subscribe to state events
	 * @param {string} event - Event name
	 * @param {function} callback - Callback function
	 * @param {Object} options - Options for the listener
	 */
	on(event, callback, options = {}) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, []);
		}

		const listener = {
			callback,
			once: options.once || false,
			priority: options.priority || 0
		};

		this.listeners.get(event).push(listener);

		// Sort by priority (higher priority first)
		this.listeners.get(event).sort((a, b) => b.priority - a.priority);

		if (this.debugMode) {
			console.log(`[StateEventBus] Registered listener for '${event}'`, { options });
		}
	}

	/**
	 * Subscribe to event that fires only once
	 * @param {string} event - Event name
	 * @param {function} callback - Callback function
	 */
	once(event, callback) {
		this.on(event, callback, { once: true });
	}

	/**
	 * Unsubscribe from events
	 * @param {string} event - Event name
	 * @param {function} callback - Callback function to remove
	 */
	off(event, callback) {
		if (!this.listeners.has(event)) return;

		const listeners = this.listeners.get(event);
		const index = listeners.findIndex(listener => listener.callback === callback);
		
		if (index !== -1) {
			listeners.splice(index, 1);
			if (this.debugMode) {
				console.log(`[StateEventBus] Removed listener for '${event}'`);
			}
		}

		// Clean up empty event arrays
		if (listeners.length === 0) {
			this.listeners.delete(event);
		}
	}

	/**
	 * Emit state events
	 * @param {string} event - Event name
	 * @param {*} data - Data to pass to listeners
	 */
	emit(event, data = null) {
		if (this.debugMode) {
			console.log(`[StateEventBus] Emitting '${event}'`, data);
		}

		if (!this.listeners.has(event)) {
			if (this.debugMode) {
				console.log(`[StateEventBus] No listeners for '${event}'`);
			}
			return;
		}

		const listeners = this.listeners.get(event);
		const toRemove = [];

		// Execute listeners in priority order
		listeners.forEach((listener, index) => {
			try {
				listener.callback(data);
				
				// Mark once listeners for removal
				if (listener.once) {
					toRemove.push(index);
				}
			} catch (error) {
				console.error(`[StateEventBus] Error in listener for '${event}':`, error);
			}
		});

		// Remove once listeners (in reverse order to maintain indices)
		toRemove.reverse().forEach(index => {
			listeners.splice(index, 1);
		});

		// Clean up empty event arrays
		if (listeners.length === 0) {
			this.listeners.delete(event);
		}
	}

	/**
	 * Get all registered events (for debugging)
	 */
	getEvents() {
		return Array.from(this.listeners.keys());
	}

	/**
	 * Get listener count for an event (for debugging)
	 * @param {string} event - Event name
	 */
	getListenerCount(event) {
		return this.listeners.has(event) ? this.listeners.get(event).length : 0;
	}

	/**
	 * Clear all listeners
	 */
	clear() {
		this.listeners.clear();
		if (this.debugMode) {
			console.log('[StateEventBus] Cleared all listeners');
		}
	}
}

// Create singleton instance
const eventBus = new StateEventBus();
export { eventBus };