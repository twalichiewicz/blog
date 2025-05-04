/**
 * Cookie utility class
 * Modern ES6 implementation for cookie management
 */
export class CookieManager {
	/**
	 * Get a cookie value by key
	 * @param {string} key - The cookie key to retrieve
	 * @param {string} fallback - Default value if cookie doesn't exist
	 * @returns {string} Cookie value or fallback
	 */
	get(key, fallback) {
		const temp = document.cookie.split('; ').find(row => row.startsWith(key + '='));
		if (temp) {
			return temp.split('=')[1];
		}
		return fallback;
	}

	/**
	 * Set a cookie value
	 * @param {string} key - The cookie key to set
	 * @param {string} value - The value to store
	 * @param {object} options - Optional parameters like path, expires
	 */
	set(key, value, options = {}) {
		const path = options.path || document.body.getAttribute('data-config-root') || '/';
		let cookieString = `${key}=${value}; path=${path}`;

		if (options.expires) {
			cookieString += `; expires=${options.expires}`;
		}

		if (options.secure) {
			cookieString += '; secure';
		}

		if (options.sameSite) {
			cookieString += `; samesite=${options.sameSite}`;
		}

		document.cookie = cookieString;
	}

	/**
	 * Delete a cookie
	 * @param {string} key - The cookie to delete
	 */
	delete(key) {
		this.set(key, '', { expires: 'Thu, 01 Jan 1970 00:00:00 GMT' });
	}
}

// Create and export a singleton instance
export default new CookieManager(); 