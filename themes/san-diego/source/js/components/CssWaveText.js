/**
 * A performant CSS-based implementation of the wave text animation
 * that replaces the canvas-based implementation
 */
export class CssWaveText {
	constructor(container, config = {}) {
		this.container = container;
		this.config = {
			baseString: "Design in Everything ",
			rows: 15,
			columns: 25,
			reducedMotion: false,
			font: {
				size: 21,
				lineHeight: 30,
				charWidth: 14
			},
			...config
		};

		// Ensure we get any deeply nested font config
		if (config.wave && !this.config.font) {
			this.config.font = config.wave.font || {
				size: 21,
				lineHeight: 30,
				charWidth: 14
			};
		}

		console.log('CssWaveText initialized with config:', this.config);
		this.initialized = false;
		this.resizeTimeoutId = null;
	}

	init() {
		if (this.initialized) return;

		console.log('Initializing CssWaveText');

		// Create grid container
		this.gridElement = document.createElement('div');
		this.gridElement.className = 'wave-grid';
		this.gridElement.style.position = 'absolute';
		this.gridElement.style.top = '0';
		this.gridElement.style.left = '0';
		this.gridElement.style.width = '100%';
		this.gridElement.style.height = '100%';
		this.gridElement.style.display = 'grid';
		this.gridElement.style.zIndex = '0';
		this.container.appendChild(this.gridElement);

		// Create a style element for our animations (unless reduced motion is preferred)
		if (!this.config.reducedMotion) {
			this.createAnimationStyles();
		}

		this.buildTextGrid();
		this.setupResizeObserver();
		this.initialized = true;

		console.log('CssWaveText initialization complete');
	}

	createAnimationStyles() {
		// Remove any existing style element we created
		const existingStyle = document.getElementById('wave-text-animations');
		if (existingStyle) {
			existingStyle.parentNode.removeChild(existingStyle);
		}

		// Create a new style element
		const styleElement = document.createElement('style');
		styleElement.id = 'wave-text-animations';

		// Create row-specific animations
		let styleContent = '';
		const rowCount = 21;

		// Use shorter animation duration on mobile
		const isMobile = window.innerWidth < 768;
		const animDuration = isMobile ? 1.2 : 3; // seconds - much faster on mobile

		// Create a different style for each row to create a wave effect
		for (let i = 0; i < rowCount; i++) {
			const delay = (i / rowCount) * (animDuration * 0.7); // Shorter delays on mobile
			// Reduce animation amplitude as we go down the rows, but make sure it's visible on mobile
			const baseAmplitude = isMobile ? 15 : 20; // Higher minimum amplitude on mobile
			const amplitude = Math.max(8, baseAmplitude - (i / rowCount) * 12); // Less reduction for visibility

			styleContent += `
				.wave-char-row-${i} {
					animation: wave-char-anim-${i} ${animDuration}s infinite ease-in-out;
					animation-delay: ${delay}s;
				}
				
				@keyframes wave-char-anim-${i} {
					0%, 100% {
						transform: translateY(0);
						opacity: 0.5;
					}
					50% {
						transform: translateY(${amplitude}px);
						opacity: 1;
					}
				}
			`;
		}

		// Create a diagonal wave effect for columns too
		const colCount = 15;
		for (let i = 0; i < colCount; i++) {
			const delayOffset = (i / colCount) * 0.5; // slightly less delay variation for columns
			styleContent += `
				.wave-char-col-${i} {
					animation-delay: calc(var(--base-delay) + ${delayOffset}s);
				}
			`;
		}

		// Add the style to the document
		styleElement.textContent = styleContent;
		document.head.appendChild(styleElement);
	}

	buildTextGrid() {
		// Clear existing content
		this.gridElement.innerHTML = '';

		// Get dimensions
		const containerWidth = this.container.clientWidth || window.innerWidth;
		const containerHeight = this.container.clientHeight || 300;

		console.log(`Building grid: container size = ${containerWidth}x${containerHeight}`);

		// Calculate rows and columns to fill the container
		const { charWidth, lineHeight } = this.config.font;

		// Reduce density on mobile devices for better performance
		const isMobile = window.innerWidth < 768;
		const densityFactor = isMobile ? 1.1 : 1;

		const cols = Math.ceil(containerWidth / (charWidth * densityFactor)) + 2;
		const rows = Math.ceil(containerHeight / lineHeight);

		console.log(`Grid size: ${cols}x${rows} (${cols * rows} characters)`);

		// Style the grid
		this.gridElement.style.gridTemplateRows = `repeat(${rows}, ${lineHeight}px)`;
		this.gridElement.style.gridTemplateColumns = `repeat(${cols}, ${charWidth * densityFactor}px)`;
		this.gridElement.style.width = '100%';
		this.gridElement.style.height = '100%';

		// Create characters
		const baseString = this.config.baseString || "Design in Everything ";
		const repeatedString = baseString.repeat(Math.ceil(cols / baseString.length) + 1);

		let charCount = 0;
		const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const baseColor = isDarkMode ? "hsla(0, 0%, 85%," : "hsla(0, 6%, 37%,";

		for (let row = 0; row < rows; row++) {
			// Calculate vertical fade - stronger at the bottom
			const verticalFadeMultiplier = Math.max(0.3, 1 - (row / rows * 1.5)); // Fade out more aggressively

			// Create row container
			const rowDiv = document.createElement('div');
			rowDiv.className = `wave-row wave-row-${row % 21}`;
			rowDiv.style.display = 'contents';

			for (let col = 0; col < cols; col++) {
				const index = (row * cols + col) % repeatedString.length;
				const char = repeatedString[index];

				const charSpan = document.createElement('span');
				// Apply both row and column classes for diagonal wave effect
				const classNames = ['wave-char'];

				if (!this.config.reducedMotion) {
					classNames.push(`wave-char-row-${row % 21}`);
					classNames.push(`wave-char-col-${col % 15}`);
				}

				charSpan.className = classNames.join(' ');
				charSpan.textContent = char;

				// Set base delay as custom property for column offset
				charSpan.style.setProperty('--base-delay', `${(row % 21) / 21 * 3}s`);

				// Apply styles directly to ensure visibility
				charSpan.style.fontSize = `${this.config.font.size}px`;
				charSpan.style.lineHeight = `${this.config.font.lineHeight}px`;
				charSpan.style.display = 'flex';
				charSpan.style.justifyContent = 'center';
				charSpan.style.alignItems = 'center';

				// Calculate gradation based on position
				let opacity;
				if (this.config.reducedMotion) {
					// For reduced motion, create a static wave pattern
					opacity = 0.4 + (0.6 * Math.sin((row / 4) + (col / 6)));
				} else {
					// For normal animation, use a combination of horizontal and vertical gradation
					const horizontalGradation = 0.4 + (0.3 * Math.sin((row / rows) * Math.PI));
					opacity = horizontalGradation * verticalFadeMultiplier;
				}

				charSpan.style.color = `${baseColor} ${opacity})`;
				charSpan.style.textShadow = '0 0 1px rgba(0,0,0,0.1)';

				// On mobile, reduce the performance impact of will-change
				if (!isMobile) {
					charSpan.style.willChange = 'transform, opacity';
				}

				charSpan.style.position = 'relative';
				charSpan.style.fontWeight = '500';

				rowDiv.appendChild(charSpan);
				charCount++;
			}

			this.gridElement.appendChild(rowDiv);
		}

		console.log(`Created ${charCount} characters in the wave grid`);
	}

	setupResizeObserver() {
		// Use ResizeObserver to rebuild the grid when container size changes
		if ('ResizeObserver' in window) {
			this.resizeObserver = new ResizeObserver(entries => {
				// Debounce resize events to prevent loops and improve performance
				if (this.resizeTimeoutId) {
					clearTimeout(this.resizeTimeoutId);
				}

				this.resizeTimeoutId = setTimeout(() => {
					for (const entry of entries) {
						if (entry.target === this.container) {
							console.log('Container resized, rebuilding grid');
							this.buildTextGrid();
							break;
						}
					}
					this.resizeTimeoutId = null;
				}, 150); // 150ms debounce delay
			});

			this.resizeObserver.observe(this.container);
		}

		// Also listen for window resize as fallback, with debouncing
		this.resizeHandler = () => {
			if (this.resizeTimeoutId) {
				clearTimeout(this.resizeTimeoutId);
			}

			this.resizeTimeoutId = setTimeout(() => {
				this.buildTextGrid();
				this.resizeTimeoutId = null;
			}, 150);
		};

		window.addEventListener('resize', this.resizeHandler);

		// Also handle orientation change on mobile
		window.addEventListener('orientationchange', () => {
			// Give the browser time to complete the orientation change
			setTimeout(() => this.buildTextGrid(), 300);
		});
	}

	destroy() {
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		}

		if (this.resizeTimeoutId) {
			clearTimeout(this.resizeTimeoutId);
		}

		window.removeEventListener('resize', this.resizeHandler);

		if (this.gridElement && this.gridElement.parentNode) {
			this.gridElement.parentNode.removeChild(this.gridElement);
		}

		// Remove animation styles
		const styleElement = document.getElementById('wave-text-animations');
		if (styleElement) {
			styleElement.parentNode.removeChild(styleElement);
		}

		this.initialized = false;
	}
} 