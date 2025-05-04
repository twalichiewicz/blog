/**
 * Color scheme management module
 * Modern ES6 implementation for theme handling
 */
import Cookies from './cookies.js';

export class ColorSchemeManager {
	constructor() {
		this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		// Set up event listener for system preference changes
		this.mediaQuery.addEventListener('change', () => {
			this.updateCurrent(this.getCurrent());
		});
	}

	/**
	 * Get current color scheme from cookies
	 * @returns {string} Current color scheme ('light', 'dark', or 'auto')
	 */
	getCurrent() {
		const stored = Cookies.get('color-scheme', 'auto');
		this.updateCurrent(stored);
		return stored;
	}

	/**
	 * Set color scheme
	 * @param {string} value - The color scheme to set ('light', 'dark', or 'auto')
	 * @returns {string} The color scheme that was set
	 */
	setCurrent(value) {
		// Validate input
		if (!['light', 'dark', 'auto'].includes(value)) {
			console.error(`Invalid color scheme value: ${value}. Using default 'auto'.`);
			value = 'auto';
		}

		const bodyEl = document.body;
		bodyEl.setAttribute('data-color-scheme', value);
		Cookies.set('color-scheme', value);
		this.updateCurrent(value);
		return value;
	}

	/**
	 * Update the current color scheme appearance
	 * @param {string} value - The color scheme preference
	 */
	updateCurrent(value) {
		try {
			let current = 'light';

			// Determine actual appearance based on preference
			if (value === 'auto') {
				if (this.mediaQuery.matches) {
					current = 'dark';
				}
			} else {
				current = value;
			}

			// Apply to body
			document.body.setAttribute('data-current-color-scheme', current);

			// Dispatch event for other components to react
			document.dispatchEvent(new CustomEvent('colorschemechange', {
				detail: { scheme: current, preference: value }
			}));
		} catch (error) {
			console.error('Error updating color scheme:', error);
		}
	}

	/**
	 * Get the actual appearance (light or dark), not the preference
	 * @returns {string} The active appearance ('light' or 'dark')
	 */
	getActiveAppearance() {
		return document.body.getAttribute('data-current-color-scheme') || 'light';
	}
}

// Create and export a singleton instance
export default new ColorSchemeManager(); 