/**
 * Code Sandbox System
 * Manages reusable code components that survive dynamic navigation
 */

class CodeSandbox {
	static instances = new Map();
	static sandboxTypes = new Map();
	
	/**
	 * Register a sandbox type with its initialization function
	 */
	static registerType(type, initFunction, cleanupFunction = null) {
		CodeSandbox.sandboxTypes.set(type, {
			init: initFunction,
			cleanup: cleanupFunction
		});
		console.log(`[CodeSandbox] Registered type: ${type}`);
	}
	
	static generateId() {
		return 'sandbox-' + Math.random().toString(36).substr(2, 9);
	}
	
	constructor(element) {
		this.element = element;
		this.id = element.dataset.sandboxId || CodeSandbox.generateId();
		this.type = element.dataset.sandboxType;
		this.config = this.parseConfig(element.dataset.sandboxConfig);
		this.state = {};
		this.eventListeners = [];
		this.intervals = [];
		this.timeouts = [];
		this.isActive = true;
		
		// Store instance
		CodeSandbox.instances.set(this.id, this);
		
		// Add ID to element for reference
		element.dataset.sandboxId = this.id;
		
		console.log(`[CodeSandbox] Created sandbox: ${this.id} (type: ${this.type})`);
		
		// Wrap with sandbox UI
		this.wrapWithUI();
		
		// Initialize
		this.init();
	}
	
	wrapWithUI() {
		// Check if already wrapped
		if (this.element.closest('.code-sandbox-wrapper')) {
			console.log('[CodeSandbox] Already wrapped, skipping UI creation');
			this.wrapper = this.element.closest('.code-sandbox-wrapper');
			this.container = this.wrapper.querySelector('.code-sandbox-container');
			this.chin = this.wrapper.querySelector('.code-sandbox-chin');
			this.sliderTrack = this.chin.querySelector('.code-sandbox-slider-track');
			this.sliderThumb = this.chin.querySelector('.code-sandbox-slider-thumb');
			
			// Re-attach event listener
			this.sliderTrack.onclick = () => this.toggle();
			return;
		}
		
		// Create wrapper
		const wrapper = document.createElement('div');
		wrapper.className = 'code-sandbox-wrapper';
		wrapper.dataset.sandboxId = this.id;
		
		// Create the sandbox container with content
		const sandboxContainer = document.createElement('div');
		sandboxContainer.className = 'code-sandbox-container';
		
		// Move the original element into the container
		this.element.parentNode.insertBefore(wrapper, this.element);
		sandboxContainer.appendChild(this.element);
		
		// Create the chin UI
		const chin = document.createElement('div');
		chin.className = 'code-sandbox-chin';
		chin.innerHTML = `
			<div class="code-sandbox-chin-content">
				<div class="code-sandbox-branding">
					<svg class="code-sandbox-logo" width="12" height="12" viewBox="0 0 288 273" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						<path d="M192 0C245.019 0 288 42.9807 288 96V177C288 230.019 245.019 273 192 273H96C42.9807 273 1.3048e-06 230.019 0 177V96C0 42.9807 42.9807 1.54624e-06 96 0H192ZM75 45C58.4315 45 45 58.4315 45 75V198C45 214.569 58.4315 228 75 228C91.5685 228 105 214.569 105 198V75C105 58.4315 91.5685 45 75 45ZM144 105C127.431 105 114 118.431 114 135V198C114 214.569 127.431 228 144 228C160.569 228 174 214.569 174 198V135C174 118.431 160.569 105 144 105ZM213 45C196.431 45 183 58.4315 183 75V198C183 214.569 196.431 228 213 228C229.569 228 243 214.569 243 198V75C243 58.4315 229.569 45 213 45Z"/>
					</svg>
					<span class="code-sandbox-label">Code Sandbox</span>
				</div>
				<div class="code-sandbox-controls">
					<div class="code-sandbox-slider-container">
						<div class="code-sandbox-slider-track">
							<div class="code-sandbox-slider-thumb"></div>
						</div>
					</div>
				</div>
			</div>
		`;
		
		// Assemble the wrapper
		wrapper.appendChild(sandboxContainer);
		wrapper.appendChild(chin);
		
		// Store references
		this.wrapper = wrapper;
		this.container = sandboxContainer;
		this.chin = chin;
		this.sliderTrack = chin.querySelector('.code-sandbox-slider-track');
		this.sliderThumb = chin.querySelector('.code-sandbox-slider-thumb');
		
		// Add toggle functionality
		this.sliderTrack.onclick = () => this.toggle();
		
		// Add CSS if not already present
		this.ensureStyles();
	}
	
	ensureStyles() {
		if (document.querySelector('#code-sandbox-styles')) return;
		
		const style = document.createElement('style');
		style.id = 'code-sandbox-styles';
		style.textContent = `
			.code-sandbox-wrapper {
				position: relative;
				margin: 24px 0;
				border: 1px solid rgba(0, 0, 0, 0.1);
				border-radius: 12px;
				overflow: hidden;
				background: white;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
			}
			
			@media (prefers-color-scheme: dark) {
				.code-sandbox-wrapper {
					border-color: rgba(255, 255, 255, 0.1);
					background: rgb(20, 20, 20);
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
				}
			}
			
			.code-sandbox-container {
				position: relative;
				overflow: hidden;
				transition: opacity 0.3s ease, filter 0.3s ease;
				padding: 9px;
			}
			
			.code-sandbox-container.inactive {
				opacity: 0.5;
				filter: grayscale(100%);
				pointer-events: none;
			}
			
			.code-sandbox-chin {
				position: relative;
				background: rgba(0, 0, 0, 0.02);
				border-top: 1px solid rgba(0, 0, 0, 0.08);
				padding: 8px 12px;
			}
			
			@media (prefers-color-scheme: dark) {
				.code-sandbox-chin {
					background: rgba(255, 255, 255, 0.02);
					border-top-color: rgba(255, 255, 255, 0.08);
				}
			}
			
			.code-sandbox-chin-content {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 12px;
			}
			
			.code-sandbox-branding {
				display: flex;
				align-items: center;
				gap: 6px;
			}
			
			.code-sandbox-logo {
				width: 12px;
				height: 12px;
				opacity: 0.4;
			}
			
			.code-sandbox-label {
				font-size: 9px;
				font-weight: 500;
				text-transform: uppercase;
				letter-spacing: 0.5px;
				opacity: 0.4;
				font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif;
			}
			
			.code-sandbox-controls {
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}
			
			.code-sandbox-slider-container {
				display: flex;
				align-items: center;
			}
			
			.code-sandbox-slider-track {
				position: relative;
				width: 28px;
				height: 18px;
				background: #e5e7eb;
				border-radius: 3px;
				box-shadow: 
					inset 0 1px 2px rgba(0, 0, 0, 0.1),
					0 0.5px 0 rgba(255, 255, 255, 0.5);
				cursor: pointer;
				transition: all 0.2s ease;
			}
			
			.code-sandbox-wrapper:not(.inactive) .code-sandbox-slider-track {
				background: #10b981;
				box-shadow: 
					inset 0 1px 2px rgba(0, 0, 0, 0.15),
					0 0.5px 0 rgba(255, 255, 255, 0.2);
			}
			
			@media (prefers-color-scheme: dark) {
				.code-sandbox-slider-track {
					background: #374151;
					box-shadow: 
						inset 0 1px 2px rgba(0, 0, 0, 0.2),
						0 0.5px 0 rgba(255, 255, 255, 0.05);
				}
				
				.code-sandbox-wrapper:not(.inactive) .code-sandbox-slider-track {
					background: #10b981;
					box-shadow: 
						inset 0 1px 2px rgba(0, 0, 0, 0.2),
						0 0.5px 0 rgba(255, 255, 255, 0.1);
				}
			}
			
			.code-sandbox-slider-thumb {
				position: absolute;
				top: 1px;
				left: 1px;
				width: 10px;
				height: 16px;
				background: #ffffff;
				border-radius: 2px;
				box-shadow: 
					0 1px 2px rgba(0, 0, 0, 0.15),
					inset 0 1px 0 rgba(255, 255, 255, 0.9);
				transition: left 0.2s ease;
				pointer-events: none;
			}
			
			@media (prefers-color-scheme: dark) {
				.code-sandbox-slider-thumb {
					background: #9ca3af;
					box-shadow: 
						0 1px 2px rgba(0, 0, 0, 0.3),
						inset 0 1px 0 rgba(255, 255, 255, 0.2);
				}
			}
			
			.code-sandbox-wrapper.inactive .code-sandbox-slider-thumb {
				left: 1px;
			}
			
			.code-sandbox-wrapper:not(.inactive) .code-sandbox-slider-thumb {
				left: calc(100% - 11px);
			}
			
		`;
		document.head.appendChild(style);
	}
	
	toggle() {
		this.isActive = !this.isActive;
		
		if (this.isActive) {
			this.activate();
		} else {
			this.deactivate();
		}
	}
	
	activate() {
		console.log('[CodeSandbox] Activating sandbox:', this.id);
		this.isActive = true;
		
		// Update UI
		this.wrapper.classList.remove('inactive');
		this.container.classList.remove('inactive');
		
		// Re-initialize the sandbox content
		this.init();
		
		// Play activation sound if available
		if (window.playSmallClickSound) {
			window.playSmallClickSound();
		}
	}
	
	deactivate() {
		console.log('[CodeSandbox] Deactivating sandbox:', this.id);
		this.isActive = false;
		
		// Update UI
		this.wrapper.classList.add('inactive');
		this.container.classList.add('inactive');
		
		// Cleanup
		this.cleanup();
		
		// Play deactivation sound if available
		if (window.playSmallClickSound) {
			window.playSmallClickSound();
		}
	}
	
	parseConfig(configStr) {
		try {
			return configStr ? JSON.parse(configStr) : {};
		} catch (e) {
			console.warn('[CodeSandbox] Invalid config JSON:', configStr);
			return {};
		}
	}
	
	init() {
		const sandboxType = CodeSandbox.sandboxTypes.get(this.type);
		if (!sandboxType) {
			console.warn(`[CodeSandbox] Unknown sandbox type: ${this.type}`);
			return;
		}
		
		console.log(`[CodeSandbox] Initializing sandbox ${this.id} with type ${this.type}`);
		
		// Call the init function with context
		if (sandboxType.init) {
			sandboxType.init.call(this, this.element, this.config);
		}
	}
	
	cleanup() {
		console.log(`[CodeSandbox] Cleaning up sandbox: ${this.id}`);
		
		// Call type-specific cleanup
		const sandboxType = CodeSandbox.sandboxTypes.get(this.type);
		if (sandboxType && sandboxType.cleanup) {
			sandboxType.cleanup.call(this, this.element, this.state);
		}
		
		// Clear all event listeners
		this.eventListeners.forEach(({ element, event, handler }) => {
			element.removeEventListener(event, handler);
		});
		this.eventListeners = [];
		
		// Clear all intervals
		this.intervals.forEach(clearInterval);
		this.intervals = [];
		
		// Clear all timeouts
		this.timeouts.forEach(clearTimeout);
		this.timeouts = [];
		
		// Clear state
		this.state = {};
	}
	
	destroy() {
		console.log(`[CodeSandbox] Destroying sandbox: ${this.id}`);
		
		// Cleanup first
		this.cleanup();
		
		// Remove from instances
		CodeSandbox.instances.delete(this.id);
		
		// Remove wrapper UI if it exists
		if (this.wrapper && this.wrapper.parentNode) {
			// Move element back to original position
			this.wrapper.parentNode.insertBefore(this.element, this.wrapper);
			this.wrapper.remove();
		}
	}
	
	// Helper methods for sandbox implementations
	addEventListener(element, event, handler) {
		element.addEventListener(event, handler);
		this.eventListeners.push({ element, event, handler });
	}
	
	setInterval(callback, delay) {
		const id = setInterval(callback, delay);
		this.intervals.push(id);
		return id;
	}
	
	setTimeout(callback, delay) {
		const id = setTimeout(callback, delay);
		this.timeouts.push(id);
		return id;
	}
}

// Initialize function
function initializeCodeSandboxes(container = document) {
	console.log('[CodeSandbox] Initializing code sandboxes in container');
	
	const sandboxElements = container.querySelectorAll('[data-sandbox-type]');
	sandboxElements.forEach(element => {
		// Skip if already initialized
		if (element.dataset.sandboxId && CodeSandbox.instances.has(element.dataset.sandboxId)) {
			console.log('[CodeSandbox] Sandbox already initialized:', element.dataset.sandboxId);
			return;
		}
		
		// Create new sandbox
		new CodeSandbox(element);
	});
}

// Cleanup function
function cleanupCodeSandboxes(container = document) {
	console.log('[CodeSandbox] Cleaning up code sandboxes in container');
	
	const sandboxElements = container.querySelectorAll('[data-sandbox-id]');
	sandboxElements.forEach(element => {
		const id = element.dataset.sandboxId;
		const instance = CodeSandbox.instances.get(id);
		if (instance) {
			instance.destroy();
		}
	});
}

// Register the YouTube timecode sandbox type
CodeSandbox.registerType('youtube-timecode-legacy', function(element, config) {
	console.log('[CodeSandbox] Initializing YouTube timecode demo with config:', config);
	
	// Find the actual demo element
	const demo = element.querySelector('.youtube-demo');
	if (!demo) {
		console.error('[CodeSandbox] YouTube demo element not found');
		return;
	}
	
	// Find all script tags in the element
	const scripts = element.querySelectorAll('script');
	console.log('[CodeSandbox] Found ' + scripts.length + ' scripts to re-execute');
	
	// Re-execute each script to initialize the demo
	scripts.forEach((script, index) => {
		if (script.textContent || script.innerHTML) {
			console.log('[CodeSandbox] Re-executing script ' + index);
			try {
				// Extract the code inside DOMContentLoaded if present
				let code = script.textContent || script.innerHTML;
				
				// Check if code uses DOMContentLoaded
				if (code.includes('DOMContentLoaded')) {
					console.log('[CodeSandbox] Script uses DOMContentLoaded, extracting inner code');
					// Extract the function body from DOMContentLoaded
					const match = code.match(/document\.addEventListener\s*\(\s*['"]DOMContentLoaded['"]\s*,\s*function\s*\(\s*\)\s*\{([\s\S]*)\}\s*\)/);
					if (match && match[1]) {
						code = match[1];
						console.log('[CodeSandbox] Extracted DOMContentLoaded body');
					}
				}
				
				// Create a new function with the code and execute it
				const func = new Function(code);
				func.call(window);
				console.log('[CodeSandbox] Script executed successfully');
			} catch (error) {
				console.error('[CodeSandbox] Error executing script:', error);
			}
		}
	});
	
	// After scripts are executed, check if prototype needs to be turned on
	this.setTimeout(() => {
		const prototypeToggle = element.querySelector('.prototype-toggle');
		if (prototypeToggle && prototypeToggle.textContent === 'ON') {
			console.log('[CodeSandbox] Prototype is off, turning it on');
			prototypeToggle.click();
		}
		
		// If there's an autoplay config, trigger play after a delay
		if (config.autoplay) {
			this.setTimeout(() => {
				const playBtn = demo.querySelector('.play-btn');
				if (playBtn && demo.dataset.playing !== 'true') {
					console.log('[CodeSandbox] Triggering autoplay');
					playBtn.click();
				}
			}, 300);
		}
	}, 100);
}, function(element, state) {
	// Cleanup function
	console.log('[CodeSandbox] Cleaning up YouTube timecode demo');
	
	const demo = element.querySelector('.youtube-demo');
	if (!demo) return;
	
	// First, pause any playing video
	if (demo.dataset.playing === 'true') {
		const playBtn = demo.querySelector('.play-btn');
		if (playBtn) {
			console.log('[CodeSandbox] Pausing video before cleanup');
			playBtn.click();
		}
	}
	
	// Clear any intervals that might be running
	// The YouTube demo stores playInterval on the window, so clear it
	if (window.playInterval) {
		clearInterval(window.playInterval);
		window.playInterval = null;
	}
	
	// Clear comment timeouts if they exist
	if (window.commentTimeouts) {
		window.commentTimeouts.forEach(timeout => clearTimeout(timeout));
		window.commentTimeouts.clear();
	}
	
	// Turn off the prototype
	const prototypeToggle = element.querySelector('.prototype-toggle');
	if (prototypeToggle && prototypeToggle.textContent === 'OFF') {
		// Button shows "OFF" which means prototype is ON, so click to turn it off
		console.log('[CodeSandbox] Turning off prototype');
		prototypeToggle.click();
	}
});

// Export functions globally for blog-standalone.js to use
window.initializeCodeSandboxes = initializeCodeSandboxes;
window.cleanupCodeSandboxes = cleanupCodeSandboxes;

// Auto-initialize on DOM ready if this script loads after content
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		initializeCodeSandboxes(document);
	});
} else {
	// DOM already loaded
	initializeCodeSandboxes(document);
}