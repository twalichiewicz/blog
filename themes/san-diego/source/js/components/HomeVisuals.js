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