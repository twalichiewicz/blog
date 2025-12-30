import * as THREE from 'three';

const DEFAULT_STATS = [
	{ value: '$40M+', label: 'ARR Impacted', detail: 'Cash‑sweep flows: +18–35% conversion' },
	{ value: '$3–5M/yr', label: 'Cost Savings Delivered', detail: 'Annual savings in development costs' },
	{ value: '85%', label: 'Support Tickets Reduced', detail: 'Universal overlay platform rollout' }
];

const SHADER_VERTEX = `
	varying vec2 vUv;

	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;

const SHADER_FRAGMENT = `
	precision highp float;

	uniform vec2 u_resolution;
	uniform float u_time;
	uniform float u_fill;
	uniform float u_hole;
	uniform sampler2D u_text;
	uniform float u_textAlpha;

	varying vec2 vUv;

	float hash(vec2 p) {
		p = fract(p * vec2(123.34, 456.21));
		p += dot(p, p + 45.32);
		return fract(p.x * p.y);
	}

	float noise(vec2 p) {
		vec2 i = floor(p);
		vec2 f = fract(p);
		float a = hash(i);
		float b = hash(i + vec2(1.0, 0.0));
		float c = hash(i + vec2(0.0, 1.0));
		float d = hash(i + vec2(1.0, 1.0));
		vec2 u = f * f * (3.0 - 2.0 * f);
		return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
	}

	float fbm(vec2 p) {
		float value = 0.0;
		float amplitude = 0.5;
		for (int i = 0; i < 5; i++) {
			value += amplitude * noise(p);
			p *= 2.02;
			amplitude *= 0.52;
		}
		return value;
	}

	vec3 metalShade(vec2 uv, float mask) {
		float t = u_time * 0.35;
		vec2 p = uv * 6.0;
		float height = fbm(p + t) * 0.8 + fbm(p * 2.6 - t * 1.4) * 0.35;
		float eps = 0.002;
		float hx = fbm((p + vec2(eps, 0.0)) + t) * 0.8 + fbm((p + vec2(eps, 0.0)) * 2.6 - t * 1.4) * 0.35;
		float hy = fbm((p + vec2(0.0, eps)) + t) * 0.8 + fbm((p + vec2(0.0, eps)) * 2.6 - t * 1.4) * 0.35;
		vec2 grad = vec2(hx - height, hy - height);
		vec3 normal = normalize(vec3(grad * 40.0, 1.0));
		vec3 viewDir = vec3(0.0, 0.0, 1.0);
		vec3 lightDir = normalize(vec3(-0.25, 0.65, 1.0));

		float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);
		vec3 halfDir = normalize(lightDir + viewDir);
		float spec = pow(clamp(dot(normal, halfDir), 0.0, 1.0), 80.0);

		float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 3.0);

		vec3 envTop = vec3(0.98, 0.985, 1.0);
		vec3 envBot = vec3(0.08, 0.08, 0.095);
		vec3 env = mix(envBot, envTop, pow(1.0 - uv.y, 1.15));

		vec3 base = vec3(0.72, 0.73, 0.76);
		vec3 color = base * 0.18;
		color += env * (0.75 * diffuse + 0.28);
		color += vec3(1.0) * (spec * 1.2);
		color += envTop * (fresnel * 0.45);
		color = mix(color, envTop, spec * 0.22);

		return color * mask;
	}

	void main() {
		vec2 uv = vUv;

		float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
		float maxEdge = 0.5;
		float fillFront = clamp(u_fill, 0.0, 1.0) * maxEdge;
		float edgeNoise = (fbm(uv * 4.5 + u_time * 0.15) - 0.5) * 0.045;
		float fillField = fillFront + edgeNoise;
		float fillMask = 1.0 - smoothstep(fillField, fillField + 0.02, edgeDist);

		float aspect = u_resolution.x / max(u_resolution.y, 1.0);
		vec2 centered = (uv - 0.5) * vec2(aspect, 1.0);
		float centerDist = length(centered);
		float holeRadius = clamp(u_hole, 0.0, 1.0);
		float holeNoise = (fbm(uv * 5.2 - u_time * 0.22) - 0.5) * 0.03;
		float holeField = holeRadius + holeNoise;
		float holeMask = smoothstep(holeField - 0.02, holeField + 0.02, centerDist);

		float liquidAlpha = clamp(fillMask * holeMask, 0.0, 1.0);

		float textMask = texture2D(u_text, uv).a;
		float textAlpha = textMask * clamp(u_textAlpha, 0.0, 1.0) * (1.0 - holeMask);

		vec3 liquidColor = metalShade(uv, liquidAlpha);
		vec3 textColor = metalShade(uv * 1.1 + vec2(0.05, 0.02), 1.0) * 1.05;
		vec3 outColor = mix(liquidColor, textColor, textAlpha);
		float outAlpha = max(liquidAlpha, textAlpha);

		gl_FragColor = vec4(outColor, outAlpha);
	}
`;

function easeInOutCubic(t) {
	if (t <= 0) return 0;
	if (t >= 1) return 1;
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

function normalizeWhitespace(value) {
	return (value || '').replace(/\s+/g, ' ').trim();
}

function resolveStats(stats) {
	if (Array.isArray(stats) && stats.length) {
		return stats
			.map((stat) => ({
				value: normalizeWhitespace(stat?.value),
				label: normalizeWhitespace(stat?.label),
				detail: normalizeWhitespace(stat?.detail)
			}))
			.filter((stat) => stat.value);
	}
	return DEFAULT_STATS;
}

class ImpactLiquidOverlay {
	constructor({ stats, onRequestClose } = {}) {
		this.stats = resolveStats(stats);
		this.onRequestClose = typeof onRequestClose === 'function' ? onRequestClose : null;
		this.activeIndex = 0;
		this.phase = 'enter-fill';
		this.phaseStart = performance.now();
		this.fill = 0;
		this.hole = 0;
		this.textAlpha = 0;
		this.isExiting = false;
		this.pointerDown = null;

		this.handleResize = this.handleResize.bind(this);
		this.handlePointerDown = this.handlePointerDown.bind(this);
		this.handlePointerUp = this.handlePointerUp.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.animate = this.animate.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);
	}

	mount() {
		if (this.root && document.contains(this.root)) return;
		this.root = document.createElement('div');
		this.root.className = 'impact-liquid-overlay';
		this.root.setAttribute('aria-hidden', 'false');
		this.root.setAttribute('role', 'presentation');

		this.canvas = document.createElement('canvas');
		this.canvas.className = 'impact-liquid-canvas';
		this.root.appendChild(this.canvas);

		this.closeButton = document.createElement('button');
		this.closeButton.type = 'button';
		this.closeButton.className = 'impact-liquid-close';
		this.closeButton.setAttribute('aria-label', 'Close stats');
		this.closeButton.innerHTML = `
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<path fill="currentColor" d="M6.4 5.3L5.3 6.4 10.9 12 5.3 17.6l1.1 1.1L12 13.1l5.6 5.6 1.1-1.1L13.1 12l5.6-5.6-1.1-1.1L12 10.9 6.4 5.3z"/>
			</svg>
		`;
		this.closeButton.addEventListener('pointerdown', (event) => event.stopPropagation());
		this.closeButton.addEventListener('pointerup', (event) => event.stopPropagation());
		this.closeButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.requestClose();
		});
		this.root.appendChild(this.closeButton);

		this.caption = document.createElement('div');
		this.caption.className = 'impact-liquid-caption';
		this.caption.setAttribute('aria-live', 'polite');
		this.caption.innerHTML = `
			<div class="impact-liquid-caption-inner">
				<div class="impact-liquid-caption-label"></div>
				<div class="impact-liquid-caption-detail"></div>
			</div>
		`;
		this.root.appendChild(this.caption);

		document.body.appendChild(this.root);

		this.root.addEventListener('pointerdown', this.handlePointerDown);
		this.root.addEventListener('pointerup', this.handlePointerUp);
		this.root.addEventListener('touchmove', this.handleTouchMove, { passive: false });
		window.addEventListener('resize', this.handleResize);
		window.addEventListener('orientationchange', this.handleResize);
		window.addEventListener('keydown', this.handleKeydown);

		this.initThree();
		this.setStat(0);
		this.handleResize();
		this.phase = 'enter-fill';
		this.phaseStart = performance.now();
		this.running = true;
		this.animationFrame = requestAnimationFrame(this.animate);
	}

	initThree() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			alpha: true,
			antialias: true,
			powerPreference: 'high-performance'
		});
		this.renderer.setClearColor(0x000000, 0);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

		this.textCanvas = document.createElement('canvas');
		this.textContext = this.textCanvas.getContext('2d');
		this.textTexture = new THREE.CanvasTexture(this.textCanvas);
		this.textTexture.minFilter = THREE.LinearFilter;
		this.textTexture.magFilter = THREE.LinearFilter;
		this.textTexture.wrapS = THREE.ClampToEdgeWrapping;
		this.textTexture.wrapT = THREE.ClampToEdgeWrapping;
		this.textTexture.colorSpace = THREE.SRGBColorSpace;

		this.uniforms = {
			u_resolution: { value: new THREE.Vector2(1, 1) },
			u_time: { value: 0 },
			u_fill: { value: 0 },
			u_hole: { value: 0 },
			u_text: { value: this.textTexture },
			u_textAlpha: { value: 0 }
		};

		this.material = new THREE.ShaderMaterial({
			transparent: true,
			depthTest: false,
			depthWrite: false,
			uniforms: this.uniforms,
			vertexShader: SHADER_VERTEX,
			fragmentShader: SHADER_FRAGMENT
		});

		this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
		this.scene.add(this.mesh);
	}

	handleResize() {
		if (!this.renderer || !this.uniforms) return;
		const width = Math.max(1, Math.floor(window.innerWidth));
		const height = Math.max(1, Math.floor(window.innerHeight));
		this.renderer.setSize(width, height, false);
		this.uniforms.u_resolution.value.set(width, height);
		this.resizeTextCanvas(width, height);
		this.redrawText();
	}

	resizeTextCanvas(width, height) {
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const size = Math.max(720, Math.floor(Math.min(width, height) * dpr));
		if (this.textCanvas.width === size && this.textCanvas.height === size) return;
		this.textCanvas.width = size;
		this.textCanvas.height = size;
		this.textTexture.needsUpdate = true;
	}

	setStat(index) {
		const safeIndex = ((index % this.stats.length) + this.stats.length) % this.stats.length;
		this.activeIndex = safeIndex;
		const stat = this.stats[this.activeIndex];
		const labelEl = this.caption?.querySelector('.impact-liquid-caption-label');
		const detailEl = this.caption?.querySelector('.impact-liquid-caption-detail');
		if (labelEl) labelEl.textContent = stat.label || '';
		if (detailEl) detailEl.textContent = stat.detail || '';
		this.currentValue = stat.value;
		this.redrawText();
	}

	redrawText() {
		if (!this.textContext || !this.textCanvas) return;
		const ctx = this.textContext;
		const { width, height } = this.textCanvas;
		ctx.clearRect(0, 0, width, height);
		ctx.save();
		ctx.translate(width / 2, height / 2);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		const value = this.currentValue || '';
		const maxWidth = width * 0.86;
		let fontSize = Math.floor(width * 0.22);
		fontSize = clamp(fontSize, 72, 220);
		ctx.font = `700 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
		while (fontSize > 42 && ctx.measureText(value).width > maxWidth) {
			fontSize -= 6;
			ctx.font = `700 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
		}

		ctx.fillStyle = '#ffffff';
		ctx.shadowColor = 'rgba(255,255,255,0.35)';
		ctx.shadowBlur = Math.max(12, fontSize * 0.12);
		ctx.fillText(value, 0, 0);
		ctx.restore();
		this.textTexture.needsUpdate = true;
	}

	handlePointerDown(event) {
		this.pointerDown = {
			x: event.clientX,
			y: event.clientY,
			time: performance.now()
		};
	}

	handlePointerUp(event) {
		if (!this.pointerDown) return;
		const dx = event.clientX - this.pointerDown.x;
		const dy = event.clientY - this.pointerDown.y;
		const dist = Math.hypot(dx, dy);
		const elapsed = performance.now() - this.pointerDown.time;
		this.pointerDown = null;

		if (dist > 14 || elapsed > 800) return;
		this.advance();
	}

	handleTouchMove(event) {
		event.preventDefault();
	}

	handleKeydown(event) {
		if (event.key === 'Escape') {
			this.requestClose();
		}
	}

	advance() {
		if (this.isExiting) return;
		if (this.phase !== 'show-stat') return;

		this.phase = 'cycle-close';
		this.phaseStart = performance.now();
		this.nextIndex = (this.activeIndex + 1) % this.stats.length;
	}

	requestClose() {
		if (this.isExiting) return;
		this.isExiting = true;
		this.phase = 'exit';
		this.phaseStart = performance.now();
		if (this.onRequestClose) {
			this.onRequestClose();
		}
	}

	animate(now) {
		if (!this.running || !this.renderer || !this.uniforms) return;
		const elapsed = now - this.phaseStart;

		if (this.phase === 'enter-fill') {
			const t = easeInOutCubic(clamp(elapsed / 1100, 0, 1));
			this.fill = t;
			this.hole = 0;
			this.textAlpha = 0;
			if (t >= 1) {
				this.phase = 'enter-fill-delay';
				this.phaseStart = now;
			}
		} else if (this.phase === 'enter-fill-delay') {
			this.fill = 1;
			this.hole = 0;
			this.textAlpha = 0;
			if (elapsed >= 260) {
				this.phase = 'enter-reveal';
				this.phaseStart = now;
			}
		} else if (this.phase === 'enter-reveal') {
			const t = easeInOutCubic(clamp(elapsed / 920, 0, 1));
			this.fill = 1;
			this.hole = t * 0.42;
			this.textAlpha = clamp((t - 0.22) / 0.78, 0, 1);
			if (t >= 1) {
				this.phase = 'show-stat';
				this.phaseStart = now;
			}
		} else if (this.phase === 'cycle-close') {
			const t = easeInOutCubic(clamp(elapsed / 520, 0, 1));
			this.fill = 1;
			this.hole = (1 - t) * 0.42;
			this.textAlpha = clamp(1 - t * 1.2, 0, 1);
			if (t >= 1) {
				this.phase = 'cycle-delay';
				this.phaseStart = now;
				this.setStat(this.nextIndex);
			}
		} else if (this.phase === 'cycle-delay') {
			this.fill = 1;
			this.hole = 0;
			this.textAlpha = 0;
			if (elapsed >= 240) {
				this.phase = 'enter-reveal';
				this.phaseStart = now;
			}
		} else if (this.phase === 'exit') {
			const t = easeInOutCubic(clamp(elapsed / 760, 0, 1));
			this.textAlpha = 0;
			this.hole = 0;
			this.fill = 1 - t;
			if (t >= 1) {
				this.dispose();
				return;
			}
		}

		this.uniforms.u_time.value = now / 1000;
		this.uniforms.u_fill.value = this.fill;
		this.uniforms.u_hole.value = this.hole;
		this.uniforms.u_textAlpha.value = this.textAlpha;

		this.renderer.render(this.scene, this.camera);
		this.animationFrame = requestAnimationFrame(this.animate);
	}

	dispose() {
		this.running = false;
		if (this.animationFrame) {
			cancelAnimationFrame(this.animationFrame);
			this.animationFrame = null;
		}

		this.root?.removeEventListener('pointerdown', this.handlePointerDown);
		this.root?.removeEventListener('pointerup', this.handlePointerUp);
		this.root?.removeEventListener('touchmove', this.handleTouchMove);
		window.removeEventListener('resize', this.handleResize);
		window.removeEventListener('orientationchange', this.handleResize);
		window.removeEventListener('keydown', this.handleKeydown);

		if (this.mesh) {
			this.mesh.geometry?.dispose();
			this.material?.dispose();
		}

		this.textTexture?.dispose();
		this.renderer?.dispose();
		this.scene = null;
		this.camera = null;
		this.mesh = null;
		this.material = null;
		this.renderer = null;
		this.uniforms = null;

		if (this.root?.parentElement) {
			this.root.parentElement.removeChild(this.root);
		}
		this.root = null;
	}
}

let overlay = null;

export function startImpactLiquidOverlay(options = {}) {
	if (overlay) return overlay;
	overlay = new ImpactLiquidOverlay(options);
	overlay.mount();
	return overlay;
}

export function stopImpactLiquidOverlay() {
	if (!overlay) return Promise.resolve();
	overlay.isExiting = true;
	overlay.phase = 'exit';
	overlay.phaseStart = performance.now();

	return new Promise((resolve) => {
		const check = () => {
			if (!overlay || overlay.running) {
				requestAnimationFrame(check);
				return;
			}
			overlay = null;
			resolve();
		};
		check();
	});
}

export function isImpactLiquidOverlayActive() {
	return Boolean(overlay);
}
