class DesktopWidgets {
	constructor() {
		console.log('[DesktopWidgets] Constructor called');
		this.widgets = [];
		this.activeWidget = null;
		this.offset = { x: 0, y: 0 };
		this.container = null;
		this.boundDragStart = this.handleDragStart.bind(this);
		this.boundDrag = this.handleDrag.bind(this);
		this.boundDragEnd = this.handleDragEnd.bind(this);

		// Only initialize on desktop
		if (window.innerWidth > 768) {
			this.init();
		} else {
			console.log('[DesktopWidgets] Not initializing on mobile/tablet.');
		}
	}

	init() {
		console.log('[DesktopWidgets] init()');
		this.container = document.createElement('div');
		this.container.className = 'desktop-widgets';
		document.body.appendChild(this.container);

		// Create widgets for main section (index only)
		['index'].forEach((section, index) => {
			this.createWidget(section, {
				x: 40 + (index * 40),
				y: 40 + (index * 40),
				width: 800,
				height: 600,
				isMain: true
			});
		});

		this.setupEventListeners();
	}

	createWidget(section, position) {
		console.log(`[DesktopWidgets] createWidget(${section})`);
		const widget = document.createElement('div');
		widget.className = `widget ${position.isMain ? 'main-widget' : ''}`;
		widget.style.left = `${position.x}px`;
		widget.style.top = `${position.y}px`;
		widget.style.width = `${position.width}px`;
		widget.style.height = `${position.height}px`;
		widget.style.zIndex = position.isMain ? 1 : 2;

		widget.innerHTML = `
      <div class="widget-header">
        <div class="widget-controls">
          <button class="close"></button>
          <button class="minimize"></button>
          <button class="maximize"></button>
        </div>
        <h3 class="widget-title">${section.charAt(0).toUpperCase() + section.slice(1)}</h3>
      </div>
      <div class="widget-content">
        Loading ${section}...
      </div>
    `;

		document.querySelector('.desktop-widgets').appendChild(widget);
		this.widgets.push(widget);

		// Load content
		const contentPath = section === 'index' ? '/' : `/${section}`;
		fetch(contentPath)
			.then(response => {
				if (!response.ok) throw new Error(`Failed to fetch ${section}: ${response.statusText}`);
				return response.text();
			})
			.then(html => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, 'text/html');
				const content = section === 'index'
					? doc.querySelector('#canvasWrapper')  // Get the canvas wrapper for index
					: doc.querySelector('main');  // Get main content for other pages

				if (content) {
					widget.querySelector('.widget-content').innerHTML = '';
					widget.querySelector('.widget-content').appendChild(content);

					// If this is the index widget, initialize its scripts
					if (section === 'index') {
						// Re-run any scripts from the index page
						const scripts = doc.querySelectorAll('script');
						scripts.forEach(script => {
							if (script.type === 'module' || script.src) {
								const newScript = document.createElement('script');
								if (script.src) {
									newScript.src = script.src;
								}
								if (script.type) {
									newScript.type = script.type;
								}
								newScript.textContent = script.textContent;
								widget.querySelector('.widget-content').appendChild(newScript);
							}
						});
					}
				}
			})
			.catch(error => {
				console.error(`[DesktopWidgets] Error loading content for ${section}:`, error);
				widget.querySelector('.widget-content').textContent = `Error loading ${section}.`;
			});
	}

	setupEventListeners() {
		console.log('[DesktopWidgets] setupEventListeners()');
		// Remove first to ensure no duplicates if called again
		document.removeEventListener('mousedown', this.boundDragStart);
		document.removeEventListener('mousemove', this.boundDrag);
		document.removeEventListener('mouseup', this.boundDragEnd);

		// Add listeners
		document.addEventListener('mousedown', this.boundDragStart);
		document.addEventListener('mousemove', this.boundDrag);
		document.addEventListener('mouseup', this.boundDragEnd);

		// Add window control functionality
		// Note: If widgets are destroyed/recreated, these might need re-attaching
		// or use event delegation on the container.
		this.widgets.forEach(widget => {
			const controls = widget.querySelector('.widget-controls');
			// Consider adding checks if controls exist
			controls?.addEventListener('click', (e) => {
				const button = e.target;
				if (button.classList.contains('close')) {
					widget.style.display = 'none';
				} else if (button.classList.contains('minimize')) {
					widget.classList.toggle('minimized');
				} else if (button.classList.contains('maximize')) {
					widget.classList.toggle('maximized');
				}
			});
		});
	}

	destroy() {
		console.log('[DesktopWidgets] destroy()');
		document.removeEventListener('mousedown', this.boundDragStart);
		document.removeEventListener('mousemove', this.boundDrag);
		document.removeEventListener('mouseup', this.boundDragEnd);

		if (this.container) {
			this.container.remove();
			this.container = null;
		}
		this.widgets = [];
		this.activeWidget = null;
		console.log('[DesktopWidgets] Instance destroyed');
	}

	handleDragStart(e) {
		const widget = e.target.closest('.widget');
		if (!widget || !e.target.closest('.widget-header')) return;

		this.activeWidget = widget;
		this.offset = {
			x: e.clientX - widget.offsetLeft,
			y: e.clientY - widget.offsetTop
		};

		// Bring to front
		this.widgets.forEach(w => {
			if (w !== widget) {
				w.style.zIndex = 1;
			}
		});
		widget.style.zIndex = 3;
		widget.classList.add('dragging');
	}

	handleDrag(e) {
		if (!this.activeWidget) return;

		const container = document.querySelector('.desktop-widgets');
		const bounds = container.getBoundingClientRect();

		let x = e.clientX - this.offset.x;
		let y = e.clientY - this.offset.y;

		// Keep widget within bounds
		x = Math.max(0, Math.min(x, bounds.width - this.activeWidget.offsetWidth));
		y = Math.max(0, Math.min(y, bounds.height - this.activeWidget.offsetHeight));

		this.activeWidget.style.left = `${x}px`;
		this.activeWidget.style.top = `${y}px`;
	}

	handleDragEnd() {
		if (this.activeWidget) {
			this.activeWidget.classList.remove('dragging');
			this.activeWidget = null;
		}
	}
}

let desktopWidgetsInstance = null;

export function initializeDesktopWidgets() {
	console.log('[desktop-widgets.js] initializeDesktopWidgets Start');
	// Cleanup existing instance if it exists
	if (desktopWidgetsInstance && typeof desktopWidgetsInstance.destroy === 'function') {
		cleanupDesktopWidgetsInstance();
	}

	// Only initialize on desktop
	if (window.innerWidth > 768) {
		try {
			desktopWidgetsInstance = new DesktopWidgets();
		} catch (error) {
			console.error('[desktop-widgets.js] Error initializing DesktopWidgets:', error);
			desktopWidgetsInstance = null; // Ensure instance is null on error
		}
	} else {
		console.log('[desktop-widgets.js] Not initializing on mobile/tablet.');
		desktopWidgetsInstance = null; // Ensure instance is null when not initialized
	}
	console.log('[desktop-widgets.js] initializeDesktopWidgets End');
}

export function cleanupDesktopWidgetsInstance() {
	console.log('[desktop-widgets.js] cleanupDesktopWidgetsInstance');
	if (desktopWidgetsInstance && typeof desktopWidgetsInstance.destroy === 'function') {
		try {
			desktopWidgetsInstance.destroy();
		} catch (error) {
			console.error('[desktop-widgets.js] Error destroying DesktopWidgets instance:', error);
		}
	}
	desktopWidgetsInstance = null;
}

// Handle bfcache restore
window.addEventListener('pageshow', (event) => {
	if (event.persisted) {
		console.log('[desktop-widgets.js pageshow] Start - bfcache');
		// Re-initialize (will handle cleanup internally)
		initializeDesktopWidgets();
		console.log('[desktop-widgets.js pageshow] End - bfcache');
	}
});

// Initial load logic (since it's a module)
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeDesktopWidgets);
} else {
	initializeDesktopWidgets();
} 