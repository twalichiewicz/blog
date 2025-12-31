import * as THREE from 'three';

const MODEL_COLORS = {
	operator: '#d6d2cc',
	architect: '#d2d5d2',
	behavior: '#d4d2d6'
};

class ImpactCharacterViewer {
	constructor(container) {
		this.container = container;
		this.viewport = container.querySelector('.impact-character-viewport');
		this.canvas = container.querySelector('.impact-character-canvas');
		this.chips = Array.from(container.querySelectorAll('.impact-character-chip'));
		this.isRunning = false;
		this.isDragging = false;
		this.pointerTarget = { x: 0, y: 0 };
		this.pointerCurrent = { x: 0, y: 0 };
		this.dragStart = { x: 0, y: 0 };
		this.dragStartRotation = { x: 0, y: 0 };
		this.baseRotation = { x: 0, y: 0 };
		this.archetype = container.getAttribute('data-archetype') || 'operator';
		this.hasReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

		this.onResize = this.onResize.bind(this);
		this.onPointerMove = this.onPointerMove.bind(this);
		this.onPointerDown = this.onPointerDown.bind(this);
		this.onPointerUp = this.onPointerUp.bind(this);
		this.animate = this.animate.bind(this);
		this.onChipClick = this.onChipClick.bind(this);
	}

	init() {
		if (this.initialized) return true;
		if (!this.viewport || !this.canvas) return false;

		try {
			this.scene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
			this.camera.position.set(0, 1.35, 4.2);
			this.camera.lookAt(0, 1.2, 0);

			this.renderer = new THREE.WebGLRenderer({
				canvas: this.canvas,
				alpha: true,
				antialias: true,
				powerPreference: 'high-performance'
			});
			this.renderer.setClearColor(0x000000, 0);
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
			this.renderer.outputColorSpace = THREE.SRGBColorSpace;
			this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
			this.renderer.toneMappingExposure = 1.1;

			this.buildLights();
			this.buildBust();
			this.applyArchetype(this.archetype);

			this.resizeObserver = new ResizeObserver(this.onResize);
			this.resizeObserver.observe(this.viewport);
			window.addEventListener('resize', this.onResize);

			this.viewport.addEventListener('pointermove', this.onPointerMove, { passive: true });
			this.viewport.addEventListener('pointerdown', this.onPointerDown, { passive: true });
			window.addEventListener('pointerup', this.onPointerUp, { passive: true });

			this.chips.forEach((chip) => {
				chip.addEventListener('click', this.onChipClick);
			});

			this.onResize();
			this.container.classList.add('is-three-ready');
			this.initialized = true;
			return true;
		} catch (error) {
			this.destroy();
			return false;
		}
	}

	buildLights() {
		const ambient = new THREE.AmbientLight(0xffffff, 0.55);
		this.scene.add(ambient);

		const key = new THREE.DirectionalLight(0xffffff, 1.25);
		key.position.set(3.5, 4, 4);
		this.scene.add(key);

		const fill = new THREE.DirectionalLight(0xcfe3ff, 0.55);
		fill.position.set(-3, 2.4, 3.2);
		this.scene.add(fill);

		const rim = new THREE.DirectionalLight(0xffe7bf, 0.65);
		rim.position.set(0, 4.2, -4.5);
		this.scene.add(rim);
	}

	buildBust() {
		this.bustGroup = new THREE.Group();
		this.scene.add(this.bustGroup);

		const material = new THREE.MeshStandardMaterial({
			color: new THREE.Color('#d6d2cc'),
			roughness: 0.55,
			metalness: 0.12
		});
		this.bustMaterial = material;

		const head = new THREE.Mesh(new THREE.SphereGeometry(0.62, 64, 64), material);
		head.position.y = 1.55;
		this.bustGroup.add(head);

		const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.28, 32), material);
		neck.position.y = 1.17;
		this.bustGroup.add(neck);

		const shoulders = new THREE.Mesh(new THREE.CapsuleGeometry(0.85, 1.02, 8, 22), material);
		shoulders.position.y = 0.42;
		shoulders.scale.set(1.35, 0.85, 1);
		this.bustGroup.add(shoulders);

		const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 1.05, 36, 1, true), material);
		chest.position.y = -0.25;
		chest.scale.set(1.1, 1, 0.75);
		this.bustGroup.add(chest);

		this.bustGroup.rotation.y = 0.35;
		this.baseRotation.x = this.bustGroup.rotation.x;
		this.baseRotation.y = this.bustGroup.rotation.y;
	}

	onResize() {
		if (!this.renderer || !this.camera || !this.viewport) return;
		const rect = this.viewport.getBoundingClientRect();
		const width = Math.max(1, Math.floor(rect.width));
		const height = Math.max(1, Math.floor(rect.height));
		this.renderer.setSize(width, height, false);
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderOnce();
	}

	renderOnce() {
		if (!this.renderer || !this.scene || !this.camera) return;
		this.renderer.render(this.scene, this.camera);
	}

	onPointerMove(event) {
		if (!this.viewport) return;
		const rect = this.viewport.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
		this.pointerTarget.x = x;
		this.pointerTarget.y = y;

		if (this.isDragging) {
			const dx = event.clientX - this.dragStart.x;
			const dy = event.clientY - this.dragStart.y;
			this.dragRotationTargetY = this.dragStartRotation.y + dx * 0.006;
			this.dragRotationTargetX = this.dragStartRotation.x + dy * 0.004;
		}
	}

	onPointerDown(event) {
		this.isDragging = true;
		this.dragStart.x = event.clientX;
		this.dragStart.y = event.clientY;
		this.dragStartRotation.x = this.dragRotationTargetX || 0;
		this.dragStartRotation.y = this.dragRotationTargetY || 0;
	}

	onPointerUp() {
		this.isDragging = false;
	}

	onChipClick(event) {
		const button = event.currentTarget;
		const archetype = button?.dataset?.archetype;
		if (!archetype || archetype === this.archetype) return;

		this.archetype = archetype;
		this.container.setAttribute('data-archetype', archetype);
		this.chips.forEach((chip) => {
			const isActive = chip === button;
			chip.classList.toggle('is-active', isActive);
			chip.setAttribute('aria-selected', isActive ? 'true' : 'false');
		});
		this.applyArchetype(archetype);
	}

	applyArchetype(archetype) {
		if (this.bustMaterial) {
			this.bustMaterial.color.set(MODEL_COLORS[archetype] || MODEL_COLORS.operator);
			this.bustMaterial.needsUpdate = true;
		}
	}

	start() {
		if (!this.initialized || this.isRunning) return;
		this.isRunning = true;
		this.lastTime = performance.now();
		this.animationFrameId = requestAnimationFrame(this.animate);
	}

	stop() {
		this.isRunning = false;
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	animate(now) {
		if (!this.isRunning || !this.renderer || !this.camera || !this.scene || !this.bustGroup) {
			return;
		}

		const dt = Math.min(64, now - (this.lastTime || now));
		this.lastTime = now;

		this.pointerCurrent.x += (this.pointerTarget.x - this.pointerCurrent.x) * (this.hasReducedMotion ? 0.08 : 0.12);
		this.pointerCurrent.y += (this.pointerTarget.y - this.pointerCurrent.y) * (this.hasReducedMotion ? 0.08 : 0.12);

		const dragY = this.dragRotationTargetY || 0;
		const dragX = this.dragRotationTargetX || 0;

		const targetY = this.baseRotation.y + dragY + this.pointerCurrent.x * 0.25;
		const targetX = this.baseRotation.x + dragX + this.pointerCurrent.y * 0.12;

		this.bustGroup.rotation.y += (targetY - this.bustGroup.rotation.y) * (dt / 120);
		this.bustGroup.rotation.x += (targetX - this.bustGroup.rotation.x) * (dt / 140);

		this.renderer.render(this.scene, this.camera);
		this.animationFrameId = requestAnimationFrame(this.animate);
	}

	destroy() {
		this.stop();

		this.chips.forEach((chip) => {
			chip.removeEventListener('click', this.onChipClick);
		});

		if (this.viewport) {
			this.viewport.removeEventListener('pointermove', this.onPointerMove);
			this.viewport.removeEventListener('pointerdown', this.onPointerDown);
		}
		window.removeEventListener('pointerup', this.onPointerUp);
		window.removeEventListener('resize', this.onResize);

		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}

		if (this.bustGroup) {
			this.bustGroup.traverse((child) => {
				if (child.isMesh) {
					child.geometry?.dispose();
					if (Array.isArray(child.material)) {
						child.material.forEach((material) => material.dispose());
					} else {
						child.material?.dispose();
					}
				}
			});
		}

		this.renderer?.dispose();
		this.renderer = null;
		this.scene = null;
		this.camera = null;
		this.bustGroup = null;
		this.bustMaterial = null;
	}
}

let viewer = null;
let latestStartToken = 0;

export function startImpactCharacter() {
	const token = ++latestStartToken;
	const container = document.querySelector('.impact-character[data-impact-character]');
	if (!container) return;

	if (!viewer || viewer.container !== container) {
		viewer?.destroy();
		viewer = new ImpactCharacterViewer(container);
	}

	const ready = viewer.init();
	if (!ready) return;
	if (token !== latestStartToken) return;
	viewer.start();
}

export function stopImpactCharacter() {
	latestStartToken++;
	viewer?.stop();
}
