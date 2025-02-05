export const VISUAL_PRESETS = {
	default: {
		wave: {
			baseString: "Design in Everything ",
			frequency: 0.009,
			amplitude: 30,
			speed: 0.0003,
		},
		skull: {
			mouseLookFactor: 0.05,
			autoRotationSpeed: 0.0005,
		}
	},
	minimal: {
		wave: {
			baseString: "● ○ ● ○ ",
			frequency: 0.006,
			amplitude: 20,
			speed: 0.0002,
		},
		skull: {
			mouseLookFactor: 0.03,
			autoRotationSpeed: 0.0003,
		}
	}
	// Add more presets as needed
};

export class WaveAnimation {
	constructor(canvas, config = {}) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.config = {
			baseString: "Design in Everything ",
			frequency: 0.009,
			amplitude: 30,
			speed: 0.0003,
			font: {
				size: 21,
				lineHeight: 30,
				charWidth: 14
			},
			...config
		};
		this.textData = [];
		this.startTime = 0;
		this.needsResize = true;
	}

	init() {
		this.resizeCanvas();
		this.buildTextData();
		window.addEventListener("resize", () => this.onResize());
		requestAnimationFrame((t) => this.animate(t));
	}

	resizeCanvas() {
		const dpr = window.devicePixelRatio || 1;
		this.canvas.width = window.innerWidth * dpr;
		this.canvas.height = window.innerHeight * dpr;
		this.ctx.scale(dpr, dpr);
		this.buildTextData();
	}

	buildTextData() {
		const { charWidth, lineHeight } = this.config.font;
		const gridCols = Math.ceil(this.canvas.width / charWidth) + 2;
		const gridRows = Math.ceil(this.canvas.height / lineHeight);

		const repeatedLine = this.config.baseString.repeat(gridCols);
		this.textData = [];

		for (let row = 0; row < gridRows; row++) {
			for (let col = -1; col < gridCols; col++) {
				const char = repeatedLine[(row * gridCols + col + gridCols) % repeatedLine.length];
				this.textData.push({
					char,
					baseX: col * charWidth,
					baseY: row * lineHeight,
					currentX: col * charWidth,
					currentY: row * lineHeight,
				});
			}
		}
	}

	onResize() {
		this.needsResize = true;
	}

	animate(timestamp) {
		if (this.needsResize) {
			this.resizeCanvas();
			this.needsResize = false;
		}

		if (!this.startTime) this.startTime = timestamp;
		const elapsed = timestamp - this.startTime;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const textColor = prefersDarkMode ? "hsla(0, 0%, 85%," : "hsla(0, 6%, 37%,";

		for (const td of this.textData) {
			const wave = Math.sin(
				(td.baseY * this.config.frequency) -
				(elapsed * this.config.speed)
			) * this.config.amplitude;

			const springX = (td.baseX - td.currentX) * 0.3;
			const springY = (td.baseY - td.currentY) * 0.3;

			td.currentX += springX + wave * 0.5;
			td.currentY += springY;

			const depthColor = `${textColor} ${0.3 + 0.7 * (1 - Math.abs(wave) / this.config.amplitude)})`;

			this.ctx.font = this.config.font.size + 'px sans-serif';
			this.ctx.fillStyle = depthColor;
			this.ctx.fillText(td.char, td.currentX, td.currentY);
		}

		requestAnimationFrame((t) => this.animate(t));
	}

	destroy() {
		if (this.animationFrame) {
			cancelAnimationFrame(this.animationFrame);
		}
		window.removeEventListener('resize', this.onResize);
	}
}

export class SkullAnimation {
	constructor(canvas, modelPath, config = {}) {
		this.canvas = canvas;
		this.modelPath = modelPath;
		this.config = {
			mouseLookFactor: 0.05,
			dragRotationSpeed: 0.005,
			resetDelay: 2000,
			resetSpeed: 0.05,
			autoRotationSpeed: 0.0005,
			...config
		};

		// Initialize Three.js components
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
		this.camera.position.set(0, -6, 20);
		this.camera.lookAt(0, 0, 0);

		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
			alpha: true,
			powerPreference: "high-performance"
		});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
		this.scene.add(ambientLight);

		// Load the skull model
		const loader = new THREE.GLTFLoader();
		loader.load(this.modelPath, (gltf) => {
			this.skull = gltf.scene;
			this.scene.add(this.skull);
			this.centerModel();
			this.animate();
		});

		// Event listeners
		this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this));
		this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
		this.canvas.addEventListener('pointerup', this.onPointerUp.bind(this));
		window.addEventListener('resize', this.onWindowResize.bind(this));
	}

	centerModel() {
		const box = new THREE.Box3().setFromObject(this.skull);
		const center = box.getCenter(new THREE.Vector3());
		this.skull.position.x += (this.skull.position.x - center.x);
		this.skull.position.y += (this.skull.position.y - center.y);
		this.skull.position.z += (this.skull.position.z - center.z);
	}

	updateInteractionTime() {
		this.lastInteractionTime = performance.now();
	}

	onPointerMove(event) {
		if (this.isDragging) {
			this.updateInteractionTime();
		}

		// Convert to normalized device coords (-1..1)
		this.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
		this.pointerY = -((event.clientY / window.innerHeight) * 2 - 1);

		if (this.isDragging) {
			const deltaX = event.clientX - this.previousMouseX;
			const deltaY = event.clientY - this.previousMouseY;

			this.rotationY += deltaX * this.config.dragRotationSpeed;
			this.rotationX += deltaY * this.config.dragRotationSpeed;

			// Clamp vertical rotation to prevent flipping
			this.rotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.rotationX));

			this.previousMouseX = event.clientX;
			this.previousMouseY = event.clientY;
		}
	}

	onPointerDown(event) {
		this.updateInteractionTime();
		this.isDragging = true;
		this.canvas.classList.add('dragging');
		this.previousMouseX = event.clientX;
		this.previousMouseY = event.clientY;
	}

	onPointerUp() {
		this.canvas.classList.remove('dragging');
		this.isDragging = false;
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	animate(timestamp = 0) {
		const deltaTime = timestamp - this.lastFrameTime;
		const timeSinceInteraction = timestamp - this.lastInteractionTime;

		if (this.skull) {
			if (this.isDragging) {
				// When dragging, use direct rotation values
				this.skull.rotation.y = this.rotationY + this.pointerX * this.config.mouseLookFactor;
				this.skull.rotation.x = this.rotationX + this.pointerY * this.config.mouseLookFactor;
			} else {
				// When not dragging, apply smooth auto-rotation
				this.skull.rotation.y = this.rotationY + (timestamp * this.config.autoRotationSpeed);
				this.skull.rotation.x = this.rotationX;

				if (timeSinceInteraction > this.config.resetDelay) {
					// Smoothly reset X rotation to 0 when idle
					this.rotationX *= (1 - this.config.resetSpeed * (deltaTime / 16.67)); // 16.67ms is roughly 60fps
				}
			}
		}

		this.renderer.render(this.scene, this.camera);
		this.lastFrameTime = timestamp;
		this.animationFrameId = requestAnimationFrame((t) => this.animate(t));
	}

	destroy() {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
		}

		// Remove event listeners
		this.canvas.removeEventListener('pointermove', this.onPointerMove);
		this.canvas.removeEventListener('pointerdown', this.onPointerDown);
		this.canvas.removeEventListener('pointerup', this.onPointerUp);
		window.removeEventListener('resize', this.onWindowResize);

		// Dispose of Three.js resources
		if (this.skull) {
			this.scene.remove(this.skull);
			this.skull.traverse((child) => {
				if (child.geometry) child.geometry.dispose();
				if (child.material) {
					if (Array.isArray(child.material)) {
						child.material.forEach(material => material.dispose());
					} else {
						child.material.dispose();
					}
				}
			});
		}

		this.renderer.dispose();
	}
} 