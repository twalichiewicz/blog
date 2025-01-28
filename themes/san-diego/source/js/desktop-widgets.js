class DesktopWidgets {
	constructor() {
		this.widgets = [];
		this.activeWidget = null;
		this.offset = { x: 0, y: 0 };

		// Only initialize on desktop
		if (window.innerWidth > 768) {
			this.init();
		}
	}

	init() {
		const container = document.createElement('div');
		container.className = 'desktop-widgets';
		document.body.appendChild(container);

		// Create widgets for each main section, with index as the main view
		['index', 'blog', 'about'].forEach((section, index) => {
			this.createWidget(section, {
				x: 40 + (index * 40),
				y: 40 + (index * 40),
				width: section === 'index' ? 800 : 400,
				height: section === 'index' ? 600 : 500,
				isMain: section === 'index'
			});
		});

		this.setupEventListeners();
	}

	createWidget(section, position) {
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
			.then(response => response.text())
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
			});
	}

	setupEventListeners() {
		document.addEventListener('mousedown', this.handleDragStart.bind(this));
		document.addEventListener('mousemove', this.handleDrag.bind(this));
		document.addEventListener('mouseup', this.handleDragEnd.bind(this));

		// Add window control functionality
		this.widgets.forEach(widget => {
			const controls = widget.querySelector('.widget-controls');
			controls.addEventListener('click', (e) => {
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
	new DesktopWidgets();
}); 