import * as THREE from 'three';

const DEFAULT_STATS = [
	{ value: '$40M+', label: 'ARR Impacted', detail: 'Cash‑sweep flows: +18–35% conversion' },
	{ value: '$3–5M/yr', label: 'Cost Savings Delivered', detail: 'Annual savings in development costs' },
	{ value: '85%', label: 'Support Tickets Reduced', detail: 'Universal overlay platform rollout' }
];

const FLUID_SIM = {
	maxDelta: 1 / 30,
	targetScale: 0.35,
	minSize: 96,
	maxSize: 420,
	pressureIterations: 14,
	vorticityStrength: 18,
	velocityDissipation: 0.22,
	dyeDissipation: 0.07,
	noiseStrength: 55,
	centerStrength: 145,
	centerRadiusBase: 0.12
};

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
	uniform sampler2D u_dye;
	uniform sampler2D u_velocity;
	uniform vec2 u_texelSize;

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

	float heightField(vec2 uv) {
		vec4 dye = texture2D(u_dye, clamp(uv, 0.0, 1.0));
		return dye.r * 0.72 + dye.g * 0.28;
	}

	float coverageField(vec2 uv) {
		return texture2D(u_dye, clamp(uv, 0.0, 1.0)).a;
	}

	vec2 velocityField(vec2 uv) {
		return texture2D(u_velocity, clamp(uv, 0.0, 1.0)).xy;
	}

	vec3 metalShade(vec2 uv, float mask, float detailBoost) {
		float height = heightField(uv);
		float hx = heightField(uv + vec2(u_texelSize.x, 0.0));
		float hy = heightField(uv + vec2(0.0, u_texelSize.y));
		vec2 grad = vec2(hx - height, hy - height);

		float micro = fbm(uv * 42.0 + u_time * 0.06) - 0.5;
		grad += vec2(micro) * 0.02;

		vec3 normal = normalize(vec3(grad * (28.0 * detailBoost), 1.0));
		vec3 viewDir = vec3(0.0, 0.0, 1.0);
		vec3 lightDir = normalize(vec3(-0.25, 0.65, 1.0));

		float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);
		vec3 halfDir = normalize(lightDir + viewDir);
		float spec = pow(clamp(dot(normal, halfDir), 0.0, 1.0), mix(48.0, 96.0, clamp(detailBoost - 0.9, 0.0, 1.0)));

		float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 3.0);

		vec3 envTop = vec3(0.98, 0.985, 1.0);
		vec3 envBot = vec3(0.22, 0.22, 0.245);
		float envFactor = pow(clamp(1.0 - uv.y, 0.0, 1.0), 1.15);
		vec3 env = mix(envBot, envTop, envFactor);

		vec3 base = vec3(0.72, 0.73, 0.76) + (height - 0.5) * 0.08;
		vec3 color = base * 0.18;
		color += env * (0.75 * diffuse + 0.28);
		color += vec3(1.0) * (spec * 1.2);
		color += envTop * (fresnel * 0.45);
		color = mix(color, envTop, spec * 0.22);

		return color * mask;
	}

	void main() {
		vec2 uv = vUv;
		vec2 vel = velocityField(uv);
		vec2 warp = vel * u_texelSize * 0.75;
		vec2 uvFlow = clamp(uv + warp, 0.0, 1.0);
		float turbulence = heightField(uvFlow) - 0.5;

		float coverage = coverageField(uvFlow);
		float coverageSmooth = smoothstep(0.06, 0.92, coverage);

		vec2 textWarp = vel * u_texelSize * 0.28 + vec2(turbulence) * 0.02;
		textWarp += vec2(noise(uvFlow * 8.0 + u_time * 0.3) - 0.5) * 0.012;
		vec2 textUv = clamp(uv + textWarp, 0.0, 1.0);
		float rawText = texture2D(u_text, textUv).a;
		float edgeNoise = (noise(textUv * 18.0 + u_time * 0.55) - 0.5) * 0.18;
		float textMask = smoothstep(0.38 + edgeNoise, 0.72 + edgeNoise, rawText) * clamp(u_textAlpha, 0.0, 1.0);

		float liquidAlpha = max(coverageSmooth, textMask * 0.98);
		float detailBoost = mix(1.0, 1.4, textMask);

		vec3 outColor = metalShade(uvFlow + warp * 0.2, liquidAlpha, detailBoost);
		outColor = mix(outColor, outColor + vec3(0.12, 0.13, 0.15) * liquidAlpha, textMask * 0.7);

		gl_FragColor = vec4(outColor, liquidAlpha);
	}
`;

const SIM_VERTEX = `
	varying vec2 vUv;
	void main() {
		vUv = uv;
		gl_Position = vec4(position, 1.0);
	}
`;

const SIM_COMMON = `
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
		for (int i = 0; i < 4; i++) {
			value += amplitude * noise(p);
			p *= 2.08;
			amplitude *= 0.53;
		}
		return value;
	}

	float flowPotential(vec2 p) {
		float n = noise(p);
		n += 0.55 * noise(p * 2.12 + vec2(17.2, 9.2));
		n += 0.28 * noise(p * 4.03 - vec2(4.2, 11.7));
		return n / 1.83;
	}

	vec2 curlNoise(vec2 uv, float t) {
		vec2 p = uv * 3.1 + vec2(t * 0.16, -t * 0.12);
		float e = 0.18;
		float nT = flowPotential(p + vec2(0.0, e));
		float nB = flowPotential(p - vec2(0.0, e));
		float nR = flowPotential(p + vec2(e, 0.0));
		float nL = flowPotential(p - vec2(e, 0.0));
		float dy = (nT - nB) / (2.0 * e);
		float dx = (nR - nL) / (2.0 * e);
		return vec2(dy, -dx);
	}
`;

const SIM_SEED_FRAGMENT = `
	precision highp float;
	varying vec2 vUv;
	uniform float u_seed;
	${SIM_COMMON}
	void main() {
		vec2 uv = vUv;
		float n1 = fbm(uv * 7.5 + u_seed);
		float n2 = fbm(uv * 11.0 - u_seed * 0.7);
		float n3 = fbm(uv * 17.0 + vec2(u_seed * 0.3, -u_seed * 0.5));
		gl_FragColor = vec4(n1, n2, n3, 0.0);
	}
`;

const SIM_FORCE_FRAGMENT = `
	precision highp float;
	varying vec2 vUv;
	uniform sampler2D u_velocity;
	uniform float u_time;
	uniform float u_dt;
	uniform float u_noiseStrength;
	uniform float u_centerStrength;
	uniform vec2 u_center;
	uniform float u_centerRadius;
	uniform float u_aspect;
	${SIM_COMMON}
	void main() {
		vec2 uv = vUv;
		vec2 vel = texture2D(u_velocity, uv).xy;

		vec2 noiseForce = curlNoise(uv, u_time) * u_noiseStrength;

		vec2 toCenter = uv - u_center;
		vec2 toCenterScaled = vec2(toCenter.x * u_aspect, toCenter.y);
		float dist = length(toCenterScaled);
		float falloff = smoothstep(u_centerRadius, 0.0, dist);
		vec2 dir = normalize(toCenterScaled + vec2(0.0004));
		vec2 radial = dir * (u_centerStrength * falloff);
		vec2 tangential = vec2(-dir.y, dir.x) * (abs(u_centerStrength) * 0.42) * falloff * sign(u_centerStrength);

		vel += (noiseForce + radial + tangential) * u_dt;
		vel = clamp(vel, vec2(-10.0), vec2(10.0));
		vel *= 0.993;

		gl_FragColor = vec4(vel, 0.0, 1.0);
	}
`;

const SIM_ADVECT_FRAGMENT = `
	precision highp float;
	varying vec2 vUv;
	uniform sampler2D u_velocity;
	uniform sampler2D u_source;
	uniform vec2 u_texelSize;
	uniform float u_dt;
	uniform float u_dissipation;
	void main() {
		vec2 uv = vUv;
		vec2 vel = texture2D(u_velocity, uv).xy;
		vec2 coord = uv - vel * u_texelSize * (u_dt * 1.65);
		coord = clamp(coord, 0.0, 1.0);
		vec4 result = texture2D(u_source, coord);
		result /= (1.0 + u_dissipation * u_dt);
		gl_FragColor = result;
	}
`;

const SIM_ADVECT_DYE_FRAGMENT = `
	precision highp float;
	varying vec2 vUv;
	uniform sampler2D u_velocity;
	uniform sampler2D u_source;
	uniform vec2 u_texelSize;
	uniform float u_dt;
	uniform float u_dissipation;
	void main() {
		vec2 uv = vUv;
		vec2 vel = texture2D(u_velocity, uv).xy;
		vec2 coord = uv - vel * u_texelSize * (u_dt * 1.65);
		coord = clamp(coord, 0.0, 1.0);
		vec4 result = texture2D(u_source, coord);
		result.rgb /= (1.0 + u_dissipation * u_dt);
		gl_FragColor = result;
	}
`;

const SIM_DIVERGENCE_FRAGMENT = `
	precision highp float;
	varying vec2 vUv;
	uniform sampler2D u_velocity;
	uniform vec2 u_texelSize;
	void main() {
		vec2 uv = vUv;
		float L = texture2D(u_velocity, uv - vec2(u_texelSize.x, 0.0)).x;
		float R = texture2D(u_velocity, uv + vec2(u_texelSize.x, 0.0)).x;
		float B = texture2D(u_velocity, uv - vec2(0.0, u_texelSize.y)).y;
		float T = texture2D(u_velocity, uv + vec2(0.0, u_texelSize.y)).y;
		float div = 0.5 * (R - L + T - B);
		gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
	}
`;

const SIM_CURL_FRAGMENT = `
	precision highp float;
	varying vec2 vUv;
	uniform sampler2D u_velocity;
	uniform vec2 u_texelSize;
	void main() {
		vec2 uv = vUv;
		float vL = texture2D(u_velocity, uv - vec2(u_texelSize.x, 0.0)).y;
		float vR = texture2D(u_velocity, uv + vec2(u_texelSize.x, 0.0)).y;
		float uB = texture2D(u_velocity, uv - vec2(0.0, u_texelSize.y)).x;
		float uT = texture2D(u_velocity, uv + vec2(0.0, u_texelSize.y)).x;
		float curl = 0.5 * (vR - vL - uT + uB);
		gl_FragColor = vec4(curl, 0.0, 0.0, 1.0);
	}
`;

const SIM_VORTICITY_FRAGMENT = `
	precision highp float;
	varying vec2 vUv;
	uniform sampler2D u_velocity;
	uniform sampler2D u_curl;
	uniform vec2 u_texelSize;
	uniform float u_dt;
	uniform float u_strength;
	void main() {
		vec2 uv = vUv;
		float L = abs(texture2D(u_curl, uv - vec2(u_texelSize.x, 0.0)).x);
		float R = abs(texture2D(u_curl, uv + vec2(u_texelSize.x, 0.0)).x);
		float B = abs(texture2D(u_curl, uv - vec2(0.0, u_texelSize.y)).x);
		float T = abs(texture2D(u_curl, uv + vec2(0.0, u_texelSize.y)).x);
		float C = texture2D(u_curl, uv).x;

		vec2 grad = vec2(R - L, T - B) * 0.5;
		vec2 n = normalize(grad + vec2(0.00012));
		vec2 force = vec2(n.y, -n.x) * C * u_strength;

		vec2 vel = texture2D(u_velocity, uv).xy;
		vel += force * u_dt;
		vel = clamp(vel, vec2(-10.0), vec2(10.0));
		gl_FragColor = vec4(vel, 0.0, 1.0);
	}
`;

const SIM_CLEAR_FRAGMENT = `
	precision highp float;
	varying vec2 vUv;
	uniform sampler2D u_texture;
	uniform float u_value;
	void main() {
		vec4 tex = texture2D(u_texture, vUv);
		gl_FragColor = tex * u_value;
	}
`;

const SIM_PRESSURE_FRAGMENT = `
	precision highp float;
	varying vec2 vUv;
	uniform sampler2D u_pressure;
	uniform sampler2D u_divergence;
	uniform vec2 u_texelSize;
	void main() {
		vec2 uv = vUv;
		float L = texture2D(u_pressure, uv - vec2(u_texelSize.x, 0.0)).x;
		float R = texture2D(u_pressure, uv + vec2(u_texelSize.x, 0.0)).x;
		float B = texture2D(u_pressure, uv - vec2(0.0, u_texelSize.y)).x;
		float T = texture2D(u_pressure, uv + vec2(0.0, u_texelSize.y)).x;
		float div = texture2D(u_divergence, uv).x;
		float pressure = (L + R + B + T - div) * 0.25;
		gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
	}
`;

const SIM_GRADIENT_FRAGMENT = `
	precision highp float;
	varying vec2 vUv;
	uniform sampler2D u_pressure;
	uniform sampler2D u_velocity;
	uniform vec2 u_texelSize;
	void main() {
		vec2 uv = vUv;
		float L = texture2D(u_pressure, uv - vec2(u_texelSize.x, 0.0)).x;
		float R = texture2D(u_pressure, uv + vec2(u_texelSize.x, 0.0)).x;
		float B = texture2D(u_pressure, uv - vec2(0.0, u_texelSize.y)).x;
		float T = texture2D(u_pressure, uv + vec2(0.0, u_texelSize.y)).x;
		vec2 vel = texture2D(u_velocity, uv).xy;
		vel -= vec2(R - L, T - B) * 0.5;
		gl_FragColor = vec4(vel, 0.0, 1.0);
	}
`;

const SIM_INJECT_FRAGMENT = `
	precision highp float;
	varying vec2 vUv;
	uniform sampler2D u_dye;
	uniform float u_time;
	uniform float u_strength;
	${SIM_COMMON}
	void main() {
		vec2 uv = vUv;
		vec4 dye = texture2D(u_dye, uv);
		float n1 = fbm(uv * 6.0 + vec2(u_time * 0.05, -u_time * 0.03));
		float n2 = fbm(uv * 9.3 + vec2(-u_time * 0.04, u_time * 0.06));
		float n3 = fbm(uv * 14.8 + vec2(u_time * 0.02, u_time * 0.01));
		vec3 target = vec3(n1, n2, n3);
		dye.rgb = mix(dye.rgb, target, u_strength);
		gl_FragColor = clamp(dye, 0.0, 1.0);
	}
`;

const SIM_COVERAGE_FRAGMENT = `
	precision highp float;
	varying vec2 vUv;
	uniform sampler2D u_dye;
	uniform float u_time;
	uniform sampler2D u_velocity;
	uniform sampler2D u_text;
	uniform vec2 u_texelSize;
	uniform float u_dt;
	uniform float u_aspect;
	uniform float u_fillAmount;
	uniform float u_fillStrength;
	uniform float u_holeRadius;
	uniform float u_holeStrength;
	uniform float u_holeHardness;
	uniform float u_textStrength;
	${SIM_COMMON}
	float edgeDistance(vec2 uv) {
		return min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
	}
	void main() {
		vec2 uv = vUv;
		vec4 dye = texture2D(u_dye, uv);
		float coverage = dye.a;

		vec2 vel = texture2D(u_velocity, uv).xy;
		vec2 uvFlow = clamp(uv + vel * u_texelSize * 1.35, 0.0, 1.0);

		float baseNoise = fbm(uvFlow * 6.3 + vec2(u_time * 0.06, -u_time * 0.04)) - 0.5;

		float holeMask = 0.0;
		float holeDist = 0.0;
		float holeRadius = clamp(u_holeRadius, 0.0, 0.5);
		if (holeRadius > 0.001) {
			vec2 centerWarp = curlNoise(uvFlow * 1.35 + 0.12, u_time * 0.6) * (u_texelSize * 26.0);
			vec2 centered = (uvFlow - 0.5 + centerWarp) * vec2(u_aspect, 1.0);
			float dist = length(centered);
			holeDist = dist;
			float angle = atan(centered.y, centered.x);
			float angleNorm = angle * 0.15915494309 + 0.5;
			float angularNoise = fbm(vec2(angleNorm * 6.4, u_time * 0.08)) - 0.5;
			angularNoise += (fbm(vec2(angleNorm * 14.8, u_time * 0.11)) - 0.5) * 0.35;

			float holeWobble = baseNoise * u_holeHardness * 2.6;
			holeWobble += (fbm(uvFlow * 9.6 + vec2(u_time * 0.08, u_time * 0.06)) - 0.5) * u_holeHardness * 1.4;
			holeWobble += (fbm(centered * 4.2 + vec2(u_time * 0.12, -u_time * 0.1)) - 0.5) * u_holeHardness * 1.1;
			holeWobble += angularNoise * u_holeHardness * 2.0;
			float radius = max(0.0, holeRadius + holeWobble);
			float holeSoft = max(0.02, u_holeHardness * (0.55 + abs(holeWobble) * 3.6));
			holeMask = 1.0 - smoothstep(radius, radius + holeSoft, dist);
		}

		float fillFront = clamp(u_fillAmount, 0.0, 1.0) * 0.5;
		float edgeDist = edgeDistance(uvFlow);
		float edgeJitter = baseNoise * 0.06 + (fbm(uvFlow * 16.0 - u_time * 0.1) - 0.5) * 0.03;
		float edgeSoft = 0.03 + abs(edgeJitter) * 0.85;
		float edgeMask = 1.0 - smoothstep(fillFront, fillFront + edgeSoft, edgeDist + edgeJitter);
		float fillDelta = edgeMask * u_fillStrength * u_dt;
		fillDelta *= (1.0 - holeMask * 0.98);
		coverage = clamp(coverage + fillDelta, 0.0, 1.0);

		float textFill = clamp(u_textStrength, 0.0, 1.0);
		float textMask = 0.0;
		if (textFill > 0.001) {
			vec2 curlWarp = curlNoise(uvFlow * 2.2 + vec2(0.2, -0.3), u_time * 0.45) * (u_texelSize * 6.5);
			vec2 textWarp = vel * u_texelSize * (0.22 + holeRadius * 0.18);
			textWarp += curlWarp;
			textWarp += vec2(baseNoise) * 0.008;
			vec2 textUv = clamp(uv + textWarp, 0.0, 1.0);
			float rawText = texture2D(u_text, textUv).a;
			float melt = baseNoise * 0.32 + (fbm(uvFlow * 18.0 + vec2(u_time * 0.22, -u_time * 0.18)) - 0.5) * 0.24;
			float edge = 0.5 + melt * 0.08;
			float softness = 0.14 + abs(melt) * 0.22;
			textMask = smoothstep(edge - softness, edge + softness, rawText);
		}

		float textPresence = textMask * textFill;

		if (u_holeStrength > 0.0 && holeRadius > 0.001) {
			float drain = holeMask * u_holeStrength * u_dt;
			drain *= (1.0 - textPresence * 0.985);
			coverage = clamp(coverage - drain, 0.0, 1.0);
		}

		if (textFill > 0.001 && holeRadius > 0.001) {
			float sculpt = holeMask * textFill * u_dt * (5.4 + holeRadius * 6.0);
			coverage = clamp(coverage + (textMask - coverage) * sculpt, 0.0, 1.0);

			vec2 swirlUv = uvFlow * 12.0 + vel * 0.05 + vec2(u_time * 0.25, -u_time * 0.19);
			float s1 = fbm(swirlUv) - 0.5;
			float s2 = fbm(swirlUv * 1.85 + vec2(4.7, -3.3)) - 0.5;
			float s3 = fbm(swirlUv * 2.6 + vec2(-2.1, 5.9)) - 0.5;
			vec3 shimmer = vec3(0.62 + s1 * 0.22, 0.6 + s2 * 0.2, 0.58 + s3 * 0.18);
			vec3 embossed = clamp(shimmer + vec3(0.16), 0.0, 1.0);
			dye.rgb = mix(dye.rgb, embossed, textPresence * 0.75);
		}

		dye.a = coverage;

		gl_FragColor = clamp(dye, 0.0, 1.0);
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

class FluidSim {
	constructor(renderer) {
		this.renderer = renderer;
		this.scene = new THREE.Scene();
		this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
		this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial());
		this.scene.add(this.mesh);

		this.supportsLinearFiltering =
			renderer.capabilities.isWebGL2 ||
			Boolean(renderer.extensions?.get?.('OES_texture_half_float_linear')) ||
			Boolean(renderer.extensions?.get?.('OES_texture_float_linear'));

		this.seedMaterial = new THREE.ShaderMaterial({
			vertexShader: SIM_VERTEX,
			fragmentShader: SIM_SEED_FRAGMENT,
			uniforms: { u_seed: { value: Math.random() * 1000 } }
		});

		this.forceMaterial = new THREE.ShaderMaterial({
			vertexShader: SIM_VERTEX,
			fragmentShader: SIM_FORCE_FRAGMENT,
			uniforms: {
				u_velocity: { value: null },
				u_time: { value: 0 },
				u_dt: { value: 0.016 },
				u_noiseStrength: { value: FLUID_SIM.noiseStrength },
				u_centerStrength: { value: 0 },
				u_center: { value: new THREE.Vector2(0.5, 0.5) },
				u_centerRadius: { value: 0.3 },
				u_aspect: { value: 1 }
			}
		});

		this.advectMaterial = new THREE.ShaderMaterial({
			vertexShader: SIM_VERTEX,
			fragmentShader: SIM_ADVECT_FRAGMENT,
			uniforms: {
				u_velocity: { value: null },
				u_source: { value: null },
				u_texelSize: { value: new THREE.Vector2(1 / 64, 1 / 64) },
				u_dt: { value: 0.016 },
				u_dissipation: { value: 0.08 }
			}
		});

		this.advectDyeMaterial = new THREE.ShaderMaterial({
			vertexShader: SIM_VERTEX,
			fragmentShader: SIM_ADVECT_DYE_FRAGMENT,
			uniforms: {
				u_velocity: { value: null },
				u_source: { value: null },
				u_texelSize: { value: new THREE.Vector2(1 / 64, 1 / 64) },
				u_dt: { value: 0.016 },
				u_dissipation: { value: 0.08 }
			}
		});

		this.divergenceMaterial = new THREE.ShaderMaterial({
			vertexShader: SIM_VERTEX,
			fragmentShader: SIM_DIVERGENCE_FRAGMENT,
			uniforms: { u_velocity: { value: null }, u_texelSize: { value: new THREE.Vector2(1 / 64, 1 / 64) } }
		});

		this.curlMaterial = new THREE.ShaderMaterial({
			vertexShader: SIM_VERTEX,
			fragmentShader: SIM_CURL_FRAGMENT,
			uniforms: { u_velocity: { value: null }, u_texelSize: { value: new THREE.Vector2(1 / 64, 1 / 64) } }
		});

		this.vorticityMaterial = new THREE.ShaderMaterial({
			vertexShader: SIM_VERTEX,
			fragmentShader: SIM_VORTICITY_FRAGMENT,
			uniforms: {
				u_velocity: { value: null },
				u_curl: { value: null },
				u_texelSize: { value: new THREE.Vector2(1 / 64, 1 / 64) },
				u_dt: { value: 0.016 },
				u_strength: { value: FLUID_SIM.vorticityStrength }
			}
		});

		this.clearMaterial = new THREE.ShaderMaterial({
			vertexShader: SIM_VERTEX,
			fragmentShader: SIM_CLEAR_FRAGMENT,
			uniforms: { u_texture: { value: null }, u_value: { value: 0 } }
		});

		this.pressureMaterial = new THREE.ShaderMaterial({
			vertexShader: SIM_VERTEX,
			fragmentShader: SIM_PRESSURE_FRAGMENT,
			uniforms: {
				u_pressure: { value: null },
				u_divergence: { value: null },
				u_texelSize: { value: new THREE.Vector2(1 / 64, 1 / 64) }
			}
		});

		this.gradientMaterial = new THREE.ShaderMaterial({
			vertexShader: SIM_VERTEX,
			fragmentShader: SIM_GRADIENT_FRAGMENT,
			uniforms: {
				u_pressure: { value: null },
				u_velocity: { value: null },
				u_texelSize: { value: new THREE.Vector2(1 / 64, 1 / 64) }
			}
		});

		this.injectMaterial = new THREE.ShaderMaterial({
			vertexShader: SIM_VERTEX,
			fragmentShader: SIM_INJECT_FRAGMENT,
			uniforms: { u_dye: { value: null }, u_time: { value: 0 }, u_strength: { value: 0.016 } }
		});

		this.coverageMaterial = new THREE.ShaderMaterial({
			vertexShader: SIM_VERTEX,
			fragmentShader: SIM_COVERAGE_FRAGMENT,
			uniforms: {
				u_dye: { value: null },
				u_velocity: { value: null },
				u_text: { value: null },
				u_texelSize: { value: new THREE.Vector2(1 / 64, 1 / 64) },
				u_time: { value: 0 },
				u_dt: { value: 0.016 },
				u_aspect: { value: 1 },
				u_fillAmount: { value: 0 },
				u_fillStrength: { value: 4.8 },
				u_holeRadius: { value: 0 },
				u_holeStrength: { value: 0 },
				u_holeHardness: { value: 0.12 },
				u_textStrength: { value: 0 }
			}
		});

		this.resize(64, 64);
	}

	get texelSize() {
		return this._texelSize || new THREE.Vector2(1, 1);
	}

	get velocityTexture() {
		return this.velocity?.read?.texture || null;
	}

	get dyeTexture() {
		return this.dye?.read?.texture || null;
	}

	resize(viewWidth, viewHeight) {
		const width = Math.max(1, Math.floor(viewWidth));
		const height = Math.max(1, Math.floor(viewHeight));
		const aspect = width / Math.max(height, 1);
		this.viewAspect = aspect;
		const scaledW = Math.floor(width * FLUID_SIM.targetScale);
		const scaledH = Math.floor(height * FLUID_SIM.targetScale);
		let simW = Math.max(FLUID_SIM.minSize, Math.min(FLUID_SIM.maxSize, scaledW));
		let simH = Math.max(FLUID_SIM.minSize, Math.min(FLUID_SIM.maxSize, scaledH));

		if (aspect > 1.05) {
			simH = Math.max(FLUID_SIM.minSize, Math.round(simW / aspect));
		} else if (aspect < 0.95) {
			simW = Math.max(FLUID_SIM.minSize, Math.round(simH * aspect));
		}

		simW = Math.max(FLUID_SIM.minSize, Math.min(FLUID_SIM.maxSize, simW));
		simH = Math.max(FLUID_SIM.minSize, Math.min(FLUID_SIM.maxSize, simH));

		this.forceMaterial.uniforms.u_aspect.value = this.viewAspect;
		this.coverageMaterial.uniforms.u_aspect.value = this.viewAspect;

		if (this.simWidth === simW && this.simHeight === simH) return;

		this.simWidth = simW;
		this.simHeight = simH;
		this._texelSize = new THREE.Vector2(1 / simW, 1 / simH);
		const filter = this.supportsLinearFiltering ? THREE.LinearFilter : THREE.NearestFilter;

		const options = {
			type: THREE.HalfFloatType,
			format: THREE.RGBAFormat,
			minFilter: filter,
			magFilter: filter,
			depthBuffer: false,
			stencilBuffer: false,
			wrapS: THREE.ClampToEdgeWrapping,
			wrapT: THREE.ClampToEdgeWrapping
		};

		const buildTarget = () => new THREE.WebGLRenderTarget(simW, simH, options);

		this.velocity?.read?.dispose?.();
		this.velocity?.write?.dispose?.();
		this.dye?.read?.dispose?.();
		this.dye?.write?.dispose?.();
		this.pressure?.read?.dispose?.();
		this.pressure?.write?.dispose?.();
		this.divergence?.dispose?.();
		this.curl?.dispose?.();

		this.velocity = { read: buildTarget(), write: buildTarget() };
		this.dye = { read: buildTarget(), write: buildTarget() };
		this.pressure = { read: buildTarget(), write: buildTarget() };
		this.divergence = buildTarget();
		this.curl = buildTarget();

		this.advectMaterial.uniforms.u_texelSize.value.copy(this._texelSize);
		this.advectDyeMaterial.uniforms.u_texelSize.value.copy(this._texelSize);
		this.divergenceMaterial.uniforms.u_texelSize.value.copy(this._texelSize);
		this.curlMaterial.uniforms.u_texelSize.value.copy(this._texelSize);
		this.vorticityMaterial.uniforms.u_texelSize.value.copy(this._texelSize);
		this.pressureMaterial.uniforms.u_texelSize.value.copy(this._texelSize);
		this.gradientMaterial.uniforms.u_texelSize.value.copy(this._texelSize);
		this.coverageMaterial.uniforms.u_texelSize.value.copy(this._texelSize);

		this.reset();
	}

	reset() {
		this.renderPass(this.seedMaterial, this.dye.read);
		this.renderPass(this.seedMaterial, this.dye.write);
		this.clearRenderTarget(this.velocity.read);
		this.clearRenderTarget(this.velocity.write);
		this.clearRenderTarget(this.pressure.read);
		this.clearRenderTarget(this.pressure.write);
		this.clearRenderTarget(this.divergence);
		this.clearRenderTarget(this.curl);
	}

	clearRenderTarget(target) {
		const prevTarget = this.renderer.getRenderTarget();
		this.renderer.setRenderTarget(target);
		this.renderer.clearColor();
		this.renderer.clear(true, true, true);
		this.renderer.setRenderTarget(prevTarget);
	}

	swap(pair) {
		const temp = pair.read;
		pair.read = pair.write;
		pair.write = temp;
	}

	renderPass(material, target) {
		const prevTarget = this.renderer.getRenderTarget();
		const prevMaterial = this.mesh.material;
		this.mesh.material = material;
		this.renderer.setRenderTarget(target);
		this.renderer.render(this.scene, this.camera);
		this.renderer.setRenderTarget(prevTarget);
		this.mesh.material = prevMaterial;
	}

	step({
		dt,
		time,
		centerStrength = 0,
		centerRadius = 0.3,
		fillAmount = 0,
		fillStrength = 4.8,
		holeRadius = 0,
		holeStrength = 0,
		holeHardness = 0.12,
		textTexture = null,
		textStrength = 0
	} = {}) {
		const delta = Math.min(Math.max(dt || 0, 0), FLUID_SIM.maxDelta);
		if (!delta) return;

		// 1) External forces -> velocity
		this.forceMaterial.uniforms.u_velocity.value = this.velocity.read.texture;
		this.forceMaterial.uniforms.u_time.value = time;
		this.forceMaterial.uniforms.u_dt.value = delta;
		this.forceMaterial.uniforms.u_noiseStrength.value = FLUID_SIM.noiseStrength;
		this.forceMaterial.uniforms.u_centerStrength.value = centerStrength;
		this.forceMaterial.uniforms.u_centerRadius.value = centerRadius;
		this.renderPass(this.forceMaterial, this.velocity.write);
		this.swap(this.velocity);

		// 2) Advect velocity
		this.advectMaterial.uniforms.u_velocity.value = this.velocity.read.texture;
		this.advectMaterial.uniforms.u_source.value = this.velocity.read.texture;
		this.advectMaterial.uniforms.u_dt.value = delta;
		this.advectMaterial.uniforms.u_dissipation.value = FLUID_SIM.velocityDissipation;
		this.renderPass(this.advectMaterial, this.velocity.write);
		this.swap(this.velocity);

		// 3) Divergence
		this.curlMaterial.uniforms.u_velocity.value = this.velocity.read.texture;
		this.renderPass(this.curlMaterial, this.curl);

		this.vorticityMaterial.uniforms.u_velocity.value = this.velocity.read.texture;
		this.vorticityMaterial.uniforms.u_curl.value = this.curl.texture;
		this.vorticityMaterial.uniforms.u_dt.value = delta;
		this.vorticityMaterial.uniforms.u_strength.value = FLUID_SIM.vorticityStrength;
		this.renderPass(this.vorticityMaterial, this.velocity.write);
		this.swap(this.velocity);

		// 4) Divergence
		this.divergenceMaterial.uniforms.u_velocity.value = this.velocity.read.texture;
		this.renderPass(this.divergenceMaterial, this.divergence);

		// 5) Clear pressure (fade)
		this.clearMaterial.uniforms.u_texture.value = this.pressure.read.texture;
		this.clearMaterial.uniforms.u_value.value = 0.0;
		this.renderPass(this.clearMaterial, this.pressure.write);
		this.swap(this.pressure);

		// 6) Pressure solve (Jacobi)
		this.pressureMaterial.uniforms.u_divergence.value = this.divergence.texture;
		for (let i = 0; i < FLUID_SIM.pressureIterations; i += 1) {
			this.pressureMaterial.uniforms.u_pressure.value = this.pressure.read.texture;
			this.renderPass(this.pressureMaterial, this.pressure.write);
			this.swap(this.pressure);
		}

		// 7) Subtract pressure gradient from velocity
		this.gradientMaterial.uniforms.u_pressure.value = this.pressure.read.texture;
		this.gradientMaterial.uniforms.u_velocity.value = this.velocity.read.texture;
		this.renderPass(this.gradientMaterial, this.velocity.write);
		this.swap(this.velocity);

		// 8) Advect dye (height map + coverage)
		this.advectDyeMaterial.uniforms.u_velocity.value = this.velocity.read.texture;
		this.advectDyeMaterial.uniforms.u_source.value = this.dye.read.texture;
		this.advectDyeMaterial.uniforms.u_dt.value = delta;
		this.advectDyeMaterial.uniforms.u_dissipation.value = FLUID_SIM.dyeDissipation;
		this.renderPass(this.advectDyeMaterial, this.dye.write);
		this.swap(this.dye);

		// 9) Update coverage + inject text after advection (keeps digits legible)
		this.coverageMaterial.uniforms.u_dye.value = this.dye.read.texture;
		this.coverageMaterial.uniforms.u_velocity.value = this.velocity.read.texture;
		this.coverageMaterial.uniforms.u_text.value = textTexture;
		this.coverageMaterial.uniforms.u_texelSize.value.copy(this._texelSize);
		this.coverageMaterial.uniforms.u_time.value = time;
		this.coverageMaterial.uniforms.u_dt.value = delta;
		this.coverageMaterial.uniforms.u_fillAmount.value = fillAmount;
		this.coverageMaterial.uniforms.u_fillStrength.value = fillStrength;
		this.coverageMaterial.uniforms.u_holeRadius.value = holeRadius;
		this.coverageMaterial.uniforms.u_holeStrength.value = holeStrength;
		this.coverageMaterial.uniforms.u_holeHardness.value = holeHardness;
		this.coverageMaterial.uniforms.u_textStrength.value = textStrength;
		this.renderPass(this.coverageMaterial, this.dye.write);
		this.swap(this.dye);

		// 10) Re-inject subtle noise so the surface keeps flowing
		this.injectMaterial.uniforms.u_dye.value = this.dye.read.texture;
		this.injectMaterial.uniforms.u_time.value = time;
		this.injectMaterial.uniforms.u_strength.value = 0.006;
		this.renderPass(this.injectMaterial, this.dye.write);
		this.swap(this.dye);
	}

	dispose() {
		this.velocity?.read?.dispose?.();
		this.velocity?.write?.dispose?.();
		this.dye?.read?.dispose?.();
		this.dye?.write?.dispose?.();
		this.pressure?.read?.dispose?.();
		this.pressure?.write?.dispose?.();
		this.divergence?.dispose?.();
		this.curl?.dispose?.();

		this.seedMaterial?.dispose?.();
		this.forceMaterial?.dispose?.();
		this.advectMaterial?.dispose?.();
		this.advectDyeMaterial?.dispose?.();
		this.divergenceMaterial?.dispose?.();
		this.curlMaterial?.dispose?.();
		this.vorticityMaterial?.dispose?.();
		this.clearMaterial?.dispose?.();
		this.pressureMaterial?.dispose?.();
		this.gradientMaterial?.dispose?.();
		this.injectMaterial?.dispose?.();
		this.coverageMaterial?.dispose?.();
		this.mesh?.geometry?.dispose?.();
		this.mesh = null;
		this.scene = null;
		this.camera = null;
	}
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
		this.lastFrame = null;

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

		this.fluid = new FluidSim(this.renderer);

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
			u_textAlpha: { value: 0 },
			u_dye: { value: this.fluid.dyeTexture },
			u_velocity: { value: this.fluid.velocityTexture },
			u_texelSize: { value: this.fluid.texelSize.clone() }
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
		if (this.fluid) {
			this.fluid.resize(width, height);
			this.uniforms.u_dye.value = this.fluid.dyeTexture;
			this.uniforms.u_velocity.value = this.fluid.velocityTexture;
			this.uniforms.u_texelSize.value.copy(this.fluid.texelSize);
		}
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
		const last = this.lastFrame ?? now;
		const dt = Math.min(Math.max((now - last) / 1000, 0), FLUID_SIM.maxDelta);
		this.lastFrame = now;
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

		if (this.fluid) {
			const time = now / 1000;
			let centerStrength = 0;
			let fillStrength = 5.2;
			let holeStrength = 0;

			if (this.phase === 'enter-reveal') {
				centerStrength = FLUID_SIM.centerStrength;
				holeStrength = 8.5;
			} else if (this.phase === 'show-stat') {
				centerStrength = FLUID_SIM.centerStrength * 0.32;
				holeStrength = 5.4;
			} else if (this.phase === 'cycle-close') {
				centerStrength = -FLUID_SIM.centerStrength * 1.05;
				holeStrength = 0;
			} else if (this.phase === 'cycle-delay') {
				centerStrength = -FLUID_SIM.centerStrength * 0.45;
				holeStrength = 0;
			} else if (this.phase === 'exit') {
				centerStrength = -FLUID_SIM.centerStrength * 0.7;
				fillStrength = -6.8;
				holeStrength = 0;
			}

			const holeRadius = Math.max(0.0, this.hole);
			const centerRadius = Math.max(FLUID_SIM.centerRadiusBase, holeRadius * 1.05);
			const holeHardness = 0.06 + holeRadius * 0.28;

			this.fluid.step({
				dt,
				time,
				centerStrength,
				centerRadius,
				fillAmount: this.fill,
				fillStrength,
				holeRadius,
				holeStrength,
				holeHardness,
				textTexture: this.textTexture,
				textStrength: this.textAlpha
			});
			this.uniforms.u_dye.value = this.fluid.dyeTexture;
			this.uniforms.u_velocity.value = this.fluid.velocityTexture;
			this.uniforms.u_texelSize.value.copy(this.fluid.texelSize);
		}

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
		this.fluid?.dispose?.();
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
