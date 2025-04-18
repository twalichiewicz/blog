/**
 * An optimized canvas-based wave text animation
 * with better performance than the original implementation
 */
export class OptimizedWaveAnimation {
	constructor(canvas, config = {}) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.config = {
			baseString: "Design in Everything ",
			frequency: 0.009,
			amplitude: 30,
			speed: 0.0003,
			throttleFPS: 30, // Limit FPS for performance
			font: {
				size: 21,
				lineHeight: 30,
				charWidth: 14
			},
			...config
		};
		this.textData = [];
		this.startTime = 0;
		this.lastFrameTime = 0;
		this.frameInterval = 1000 / this.config.throttleFPS;
		this.needsResize = true;
		this.isVisible = true;
		this.animationFrame = null;
		this.resizeTimeoutId = null;

		// Further reduce the frame rate on mobile
		const isMobile = window.innerWidth < 768;
		if (isMobile) {
			this.frameInterval = 1000 / 24; // Higher FPS on mobile for smoother animation

			// Adjust animation parameters for mobile
			if (this.config.speed) {
				this.config.speed *= 3.0; // Much faster on mobile
			}
			if (this.config.frequency) {
				this.config.frequency *= 1.5; // More waves on mobile
			}
		}
	}

	init() {
		this.resizeCanvas();
		this.buildTextData();

		// Set up visibility observer to pause when not visible
		this.setupVisibilityObserver();

		// Set up resize handling
		this.resizeHandler = () => this.onResize();
		window.addEventListener("resize", this.resizeHandler);

		// Handle orientation changes
		window.addEventListener('orientationchange', () => {
			// Delay resize handling to give the browser time to update dimensions
			setTimeout(() => this.onResize(), 300);
		});

		// Start animation
		this.lastFrameTime = performance.now();
		this.animationFrame = requestAnimationFrame((t) => this.animate(t));
	}

	setupVisibilityObserver() {
		if ('IntersectionObserver' in window) {
			this.observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					this.isVisible = entry.isIntersecting;
				});
			}, { threshold: 0.1 });

			this.observer.observe(this.canvas);
		}
	}

	resizeCanvas() {
		// Use lower resolution on mobile for better performance
		const isMobile = window.innerWidth < 768;
		const scaleFactor = isMobile ? 0.4 : 0.8; // More aggressive scaling for mobile
		const dpr = window.devicePixelRatio * scaleFactor || 1;

		// Store original dimensions
		const displayWidth = this.canvas.clientWidth || window.innerWidth;
		const displayHeight = this.canvas.clientHeight || 300;

		// Set actual drawing dimensions
		this.canvas.width = displayWidth * dpr;
		this.canvas.height = 300 * dpr;

		// Maintain the CSS display size
		this.canvas.style.width = displayWidth + 'px';
		this.canvas.style.height = '300px';

		// Scale the context according to the device pixel ratio and performance factor
		this.ctx.scale(dpr, dpr);
	}

	buildTextData() {
		// Cache font settings
		this.ctx.font = this.config.font.size + 'px sans-serif';

		const { charWidth, lineHeight } = this.config.font;

		// Calculate grid size based on screen size - use fewer columns on mobile
		const isMobile = window.innerWidth < 768;
		const density = isMobile ? 0.85 : 0.8; // Less aggressive density reduction for mobile

		const gridCols = Math.ceil(this.canvas.width / charWidth / density);
		const gridRows = Math.ceil(this.canvas.height / lineHeight / density);

		const repeatedLine = this.config.baseString.repeat(Math.ceil(gridCols / this.config.baseString.length) + 1);
		this.textData = [];

		// Only build characters that will be visible (with some margin)
		for (let row = 0; row < gridRows; row++) {
			for (let col = -1; col < gridCols; col++) {
				const char = repeatedLine[(row + col) % repeatedLine.length];
				this.textData.push({
					char,
					baseX: col * charWidth * (1 / density),
					baseY: row * lineHeight * (1 / density),
					currentX: col * charWidth * (1 / density),
					currentY: row * lineHeight * (1 / density),
				});
			}
		}
	}

	onResize() {
		// Debounce resize to avoid excessive calculations
		if (this.resizeTimeoutId) {
			clearTimeout(this.resizeTimeoutId);
		}

		this.resizeTimeoutId = setTimeout(() => {
			this.needsResize = true;
			this.resizeTimeoutId = null;
		}, 150);
	}

	animate(timestamp) {
		// Throttle frame rate for performance
		if (timestamp - this.lastFrameTime < this.frameInterval || !this.isVisible) {
			this.animationFrame = requestAnimationFrame((t) => this.animate(t));
			return;
		}

		this.lastFrameTime = timestamp;

		if (this.needsResize) {
			this.resizeCanvas();
			this.buildTextData();
			this.needsResize = false;
		}

		if (!this.startTime) this.startTime = timestamp;
		const elapsed = timestamp - this.startTime;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Cache color calculations
		const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const textColor = prefersDarkMode ? "hsla(0, 0%, 85%," : "hsla(0, 6%, 37%,";

		// Pre-set the font just once per frame
		this.ctx.font = this.config.font.size + 'px sans-serif';

		// Rather than render every character, on mobile we'll skip some for performance
		const isMobile = window.innerWidth < 768;
		const renderStep = isMobile ? 1 : 1; // Render all characters on mobile for better appearance

		// Precalculate wave values to avoid repetitive calculations
		for (let i = 0; i < this.textData.length; i += renderStep) {
			const td = this.textData[i];
			// Optimize wave calculation
			const wave = Math.sin(
				(td.baseY * this.config.frequency) -
				(elapsed * this.config.speed)
			) * this.config.amplitude;

			// Simple spring physics
			td.currentX = td.baseX + wave * 0.5;
			td.currentY = td.baseY;

			const opacity = 0.3 + 0.7 * (1 - Math.abs(wave) / this.config.amplitude);
			this.ctx.fillStyle = `${textColor} ${opacity})`;
			this.ctx.fillText(td.char, td.currentX, td.currentY);
		}

		this.animationFrame = requestAnimationFrame((t) => this.animate(t));
	}

	destroy() {
		if (this.animationFrame) {
			cancelAnimationFrame(this.animationFrame);
		}

		window.removeEventListener('resize', this.resizeHandler);
		window.removeEventListener('orientationchange', this.resizeHandler);

		if (this.resizeTimeoutId) {
			clearTimeout(this.resizeTimeoutId);
		}

		if (this.observer) {
			this.observer.disconnect();
		}
	}
} 