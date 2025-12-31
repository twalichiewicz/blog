import * as THREE from 'three';

const DEFAULT_STATS = [
	{ value: '$40M+', label: 'ARR Impacted', detail: 'Cash‑sweep flows: +18–35% conversion' },
	{ value: '$3–5M/yr', label: 'Cost Savings Delivered', detail: 'Annual savings in development costs' },
	{ value: '85%', label: 'Support Tickets Reduced', detail: 'Universal overlay platform rollout' }
];

const HOLE_MAX = 0.42;
const HOLE_EXIT_MAX = 0.74;

const POINTER_INTERACTION = {
	radius: 0.07,
	strength: 6.2,
	holdMs: 220,
	decayMs: 900,
	maxVelocity: 2.4
};

const FLUID_SIM = {
	maxDelta: 1 / 30,
	targetScale: 0.62,
	minSize: 112,
	maxSize: 768,
	pressureIterations: 16,
	vorticityStrength: 14,
	velocityDissipation: 0.28,
	dyeDissipation: 0.09,
	noiseStrength: 42,
	centerStrength: 132,
	centerRadiusBase: 0.14
};

const PARTICLE_TEXT = {
	textureWidth: 512,
	textureHeight: 256,
	sampleLongEdge: 1400,
	alphaThreshold: 10,
	returnStrength: 20,
	damping: 0.88,
	noiseStrength: 0.18,
	basePointSize: 2.2,
	pointerStrengthMultiplier: 3.1,
	pointerRadiusMultiplier: 0.85
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
		float base = dye.r * 0.72 + dye.g * 0.28;
		float emboss = dye.b;
		return clamp(base + emboss * 0.34, 0.0, 1.0);
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
		vec2 shadeUv = clamp(uv + vel * u_texelSize * 0.35, 0.0, 1.0);
		float turbulence = heightField(shadeUv) - 0.5;
	float digitPresence = texture2D(u_dye, uv).b;
	float digitBoost = smoothstep(0.18, 0.85, digitPresence);

		float c0 = coverageField(uv);
		float cL = coverageField(uv - vec2(u_texelSize.x, 0.0));
		float cR = coverageField(uv + vec2(u_texelSize.x, 0.0));
		float cB = coverageField(uv - vec2(0.0, u_texelSize.y));
		float cT = coverageField(uv + vec2(0.0, u_texelSize.y));
		float cTL = coverageField(uv + vec2(-u_texelSize.x, u_texelSize.y));
		float cTR = coverageField(uv + vec2(u_texelSize.x, u_texelSize.y));
		float cBL = coverageField(uv + vec2(-u_texelSize.x, -u_texelSize.y));
		float cBR = coverageField(uv + vec2(u_texelSize.x, -u_texelSize.y));
		float cBlur = (c0 * 4.0 + (cL + cR + cB + cT) * 2.0 + (cTL + cTR + cBL + cBR)) / 16.0;
		float cMax = max(c0, max(max(cL, cR), max(cB, cT)));
		cMax = max(cMax, max(max(cTL, cTR), max(cBL, cBR)));
		float coverage = mix(cBlur, cMax, 0.26);
		float edge = abs(cR - cL) + abs(cT - cB);
		float edgeBlend = smoothstep(0.02, 0.2, edge);
		float smoothCoverage = mix(coverage, cBlur, edgeBlend * (0.3 + digitBoost * 0.5));
		float liquidAlpha = smoothstep(0.14, 0.84, smoothCoverage);
		liquidAlpha = pow(liquidAlpha, 0.92);
		float glow = smoothstep(0.04, 0.18, edge) * smoothstep(0.12, 0.72, liquidAlpha);

	float detailBoost = 1.0 + clamp(abs(turbulence) * 1.1, 0.0, 0.45);
	detailBoost += digitBoost * 0.32;
	vec3 outColor = metalShade(shadeUv, liquidAlpha, detailBoost);
	outColor = mix(outColor, outColor * 1.08 + vec3(0.04), digitBoost * liquidAlpha);
	outColor += glow * vec3(0.07, 0.08, 0.09);

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
		gl_FragColor = vec4(n1, n2, 0.0, 0.0);
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
	uniform vec2 u_pointer;
	uniform vec2 u_pointerVelocity;
	uniform float u_pointerRadius;
	uniform float u_pointerStrength;
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

		vec2 pointerForce = vec2(0.0);
		if (u_pointerStrength > 0.0001) {
			vec2 toPointer = uv - u_pointer;
			vec2 pointerScaled = vec2(toPointer.x * u_aspect, toPointer.y);
			float pointerDist = length(pointerScaled);
			float pointerFalloff = smoothstep(u_pointerRadius, 0.0, pointerDist);
			vec2 pv = u_pointerVelocity;
			vec2 pvTwist = vec2(-pv.y, pv.x);
			float speed = length(pv);
			float dragAmount = smoothstep(0.02, 0.24, speed);
			float tight = pointerFalloff * pointerFalloff;
			vec2 dirScaled = normalize(pointerScaled + vec2(0.0004));
			vec2 dir = dirScaled;
			dir.x /= max(u_aspect, 0.0001);
			dir = normalize(dir);
			vec2 swirl = vec2(-dir.y, dir.x);
			vec2 pushForce = dir * (u_pointerStrength * 0.48) * tight * dragAmount;
			vec2 swirlForce = swirl * (u_pointerStrength * 0.32) * tight * dragAmount;
			vec2 dragForce = (pv * 0.92 + pvTwist * 0.35) * (u_pointerStrength * pointerFalloff);
			pointerForce = dragForce + pushForce + swirlForce;
		}

		vel += (noiseForce + radial + tangential + pointerForce) * u_dt;
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
		vec2 coord = uv - vel * u_texelSize * (u_dt * 1.25);
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
		vec2 coord = uv - vel * u_texelSize * (u_dt * 1.25);
		coord = clamp(coord, 0.0, 1.0);
		vec4 result = texture2D(u_source, coord);
		result.rgb /= (1.0 + u_dissipation * u_dt);
		result.a /= (1.0 + u_dissipation * u_dt * 0.15);
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
		float coverage = dye.a;
		float digitField = dye.b;
		float n1 = fbm(uv * 6.0 + vec2(u_time * 0.05, -u_time * 0.03));
		float n2 = fbm(uv * 9.3 + vec2(-u_time * 0.04, u_time * 0.06));
		float n3 = fbm(uv * 14.8 + vec2(u_time * 0.02, u_time * 0.01));
		vec3 target = vec3(n1, n2, n3);
		dye.rg = mix(dye.rg, target.rg, u_strength);
		dye.b = digitField;
		dye.a = coverage;
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
		float digitField = dye.b;
		float textWeightL = 1.0;
		float textWeightR = 1.0;
		float textWeightB = 1.0;
		float textWeightT = 1.0;
		float textWeightTL = 1.0;
		float textWeightTR = 1.0;
		float textWeightBL = 1.0;
		float textWeightBR = 1.0;
		float counterCut = 0.0;

		vec2 vel = texture2D(u_velocity, uv).xy;
		vec2 uvFlow = clamp(uv + vel * u_texelSize * 1.35, 0.0, 1.0);

		float baseNoise = fbm(uvFlow * 6.3 + vec2(u_time * 0.06, -u_time * 0.04)) - 0.5;

		float holeMask = 0.0;
		float holeDist = 0.0;
		float holeRadius = clamp(u_holeRadius, 0.0, 0.85);
		if (holeRadius > 0.001) {
			vec2 centerWarp = curlNoise(uvFlow * 1.35 + 0.12, u_time * 0.6) * (u_texelSize * 22.0);
			vec2 centered = (uvFlow - 0.5 + centerWarp) * vec2(u_aspect, 1.0);
			float dist = length(centered);
			holeDist = dist;
			float angle = atan(centered.y, centered.x);
			float angleNorm = angle * 0.15915494309 + 0.5;
			float angularNoise = fbm(vec2(angleNorm * 4.6, u_time * 0.06)) - 0.5;
			angularNoise += (fbm(vec2(angleNorm * 9.2, u_time * 0.09)) - 0.5) * 0.28;

			float holeWobble = baseNoise * u_holeHardness * 1.05;
			holeWobble += (fbm(uvFlow * 4.2 + vec2(u_time * 0.06, u_time * 0.04)) - 0.5) * u_holeHardness * 0.85;
			holeWobble += angularNoise * u_holeHardness * 0.65;
			holeWobble = clamp(holeWobble, -holeRadius * 0.34, holeRadius * 0.18);
			float radius = max(0.0, holeRadius + holeWobble);
			float holeSoft = max(0.03, 0.07 + u_holeHardness * 0.22);
			holeMask = 1.0 - smoothstep(radius, radius + holeSoft, dist);
		}

		float holeProtect = 1.0 - holeMask;

		float fillFront = clamp(u_fillAmount, 0.0, 1.0) * 0.62;
		float edgeDist = edgeDistance(uvFlow);
		float edgeJitter = baseNoise * 0.036 + (fbm(uvFlow * 8.4 - u_time * 0.06) - 0.5) * 0.012;
		float edgeSoft = 0.04 + abs(edgeJitter) * 0.8;
		float edgeMask = 1.0 - smoothstep(fillFront, fillFront + edgeSoft, edgeDist + edgeJitter);
		float fillDelta = edgeMask * u_fillStrength * u_dt;
		fillDelta *= (1.0 - holeMask * 0.98);
		coverage = clamp(coverage + fillDelta, 0.0, 1.0);

		float textFill = clamp(u_textStrength, 0.0, 1.0);
		float digitMask = 0.0;

		if (textFill > 0.001 && holeRadius > 0.001) {
			vec2 textUv = uv;

			float rawText = clamp(texture2D(u_text, textUv).a, 0.0, 1.0);
			float rawBase = rawText;
			float tL = clamp(texture2D(u_text, textUv - vec2(u_texelSize.x, 0.0)).a, 0.0, 1.0);
			float tR = clamp(texture2D(u_text, textUv + vec2(u_texelSize.x, 0.0)).a, 0.0, 1.0);
			float tB = clamp(texture2D(u_text, textUv - vec2(0.0, u_texelSize.y)).a, 0.0, 1.0);
			float tT = clamp(texture2D(u_text, textUv + vec2(0.0, u_texelSize.y)).a, 0.0, 1.0);
			float tTL = clamp(texture2D(u_text, textUv + vec2(-u_texelSize.x, u_texelSize.y)).a, 0.0, 1.0);
			float tTR = clamp(texture2D(u_text, textUv + vec2(u_texelSize.x, u_texelSize.y)).a, 0.0, 1.0);
			float tBL = clamp(texture2D(u_text, textUv + vec2(-u_texelSize.x, -u_texelSize.y)).a, 0.0, 1.0);
			float tBR = clamp(texture2D(u_text, textUv + vec2(u_texelSize.x, -u_texelSize.y)).a, 0.0, 1.0);
			float blurText = (rawText * 4.0 + tL + tR + tB + tT + tTL + tTR + tBL + tBR) / 12.0;
			float neighborMax = max(max(tL, tR), max(tB, tT));
			neighborMax = max(neighborMax, max(max(tTL, tTR), max(tBL, tBR)));
			float bridge = smoothstep(0.58, 0.86, neighborMax) * (1.0 - smoothstep(0.08, 0.22, rawText));
			bridge *= smoothstep(0.18, 0.62, blurText);
			rawText = max(rawText, blurText * bridge);
			rawText = pow(rawText, 1.25);
			float threshold = 0.52;
			float softness = 0.035;
			float textMask = smoothstep(threshold - softness, threshold + softness, rawText);
			float textMaskSoft = smoothstep(threshold - softness * 2.2, threshold + softness * 2.2, rawText);
			float baseMask = smoothstep(threshold - softness, threshold + softness, rawBase);

			float inject = clamp(u_dt * (8.5 + holeRadius * 10.0), 0.0, 1.0);
			digitField = mix(digitField, textMask, inject);
			digitField = clamp(digitField, 0.0, 1.0) * holeMask;
			digitField *= textMask;

			float edgeBand = smoothstep(0.08, 0.32, textMaskSoft) * (1.0 - smoothstep(0.62, 0.92, textMaskSoft));
			vec2 rippleUv = uvFlow * 6.2 + vel * 0.1 + vec2(u_time * 0.22, -u_time * 0.19);
			float ripple = (fbm(rippleUv) - 0.5);
			ripple += (fbm(rippleUv * 1.65 + vec2(-u_time * 0.17, u_time * 0.14)) - 0.5) * 0.7;
			digitField = clamp(digitField + ripple * 0.055 * edgeBand, 0.0, 1.0);
			digitField = max(digitField, textMask * 0.35);
			digitField *= holeMask;

			float edgeNoise = (fbm(uvFlow * 2.35 + vec2(u_time * 0.16, -u_time * 0.12)) - 0.5) * 0.016;
			edgeNoise += (fbm(uvFlow * 4.4 + vec2(-u_time * 0.11, u_time * 0.09)) - 0.5) * 0.007;
			float edgeSoft = 0.048 + abs(edgeNoise) * 0.05;
			float outline = textMaskSoft;
			digitMask = smoothstep(0.5 - edgeSoft, 0.5 + edgeSoft, outline + edgeNoise) * textFill * holeMask;

			vec2 swirlUv = uvFlow * 9.2 + vel * 0.08 + vec2(u_time * 0.24, -u_time * 0.22);
			float s1 = fbm(swirlUv) - 0.5;
			float s2 = fbm(swirlUv * 1.8 + vec2(4.1, -3.7)) - 0.5;
			vec2 shimmer = vec2(0.52 + s1 * 0.22, 0.52 + s2 * 0.21);
			dye.rg = mix(dye.rg, shimmer, digitMask * 0.26);

			float detectThreshold = threshold - 0.09;
			float detectSoftness = softness * 1.25;

			float tMaskL = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tL);
			float tMaskR = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tR);
			float tMaskB = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tB);
			float tMaskT = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tT);
			float tMaskTL = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tTL);
			float tMaskTR = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tTR);
			float tMaskBL = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tBL);
			float tMaskBR = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tBR);

			float tL2 = clamp(texture2D(u_text, textUv - vec2(u_texelSize.x * 2.0, 0.0)).a, 0.0, 1.0);
			float tR2 = clamp(texture2D(u_text, textUv + vec2(u_texelSize.x * 2.0, 0.0)).a, 0.0, 1.0);
			float tB2 = clamp(texture2D(u_text, textUv - vec2(0.0, u_texelSize.y * 2.0)).a, 0.0, 1.0);
			float tT2 = clamp(texture2D(u_text, textUv + vec2(0.0, u_texelSize.y * 2.0)).a, 0.0, 1.0);
			float tL4 = clamp(texture2D(u_text, textUv - vec2(u_texelSize.x * 4.0, 0.0)).a, 0.0, 1.0);
			float tR4 = clamp(texture2D(u_text, textUv + vec2(u_texelSize.x * 4.0, 0.0)).a, 0.0, 1.0);
			float tB4 = clamp(texture2D(u_text, textUv - vec2(0.0, u_texelSize.y * 4.0)).a, 0.0, 1.0);
			float tT4 = clamp(texture2D(u_text, textUv + vec2(0.0, u_texelSize.y * 4.0)).a, 0.0, 1.0);
			float tL8 = clamp(texture2D(u_text, textUv - vec2(u_texelSize.x * 8.0, 0.0)).a, 0.0, 1.0);
			float tR8 = clamp(texture2D(u_text, textUv + vec2(u_texelSize.x * 8.0, 0.0)).a, 0.0, 1.0);
			float tB8 = clamp(texture2D(u_text, textUv - vec2(0.0, u_texelSize.y * 8.0)).a, 0.0, 1.0);
			float tT8 = clamp(texture2D(u_text, textUv + vec2(0.0, u_texelSize.y * 8.0)).a, 0.0, 1.0);

			float tMaskL2 = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tL2);
			float tMaskR2 = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tR2);
			float tMaskB2 = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tB2);
			float tMaskT2 = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tT2);
			float tMaskL4 = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tL4);
			float tMaskR4 = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tR4);
			float tMaskB4 = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tB4);
			float tMaskT4 = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tT4);
			float tMaskL8 = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tL8);
			float tMaskR8 = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tR8);
			float tMaskB8 = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tB8);
			float tMaskT8 = smoothstep(detectThreshold - detectSoftness, detectThreshold + detectSoftness, tT8);

			float leftHit = max(tMaskL, max(tMaskL2, max(tMaskL4, tMaskL8)));
			float rightHit = max(tMaskR, max(tMaskR2, max(tMaskR4, tMaskR8)));
			float upHit = max(tMaskT, max(tMaskT2, max(tMaskT4, tMaskT8)));
			float downHit = max(tMaskB, max(tMaskB2, max(tMaskB4, tMaskB8)));
			float enclosed = min(min(leftHit, rightHit), min(upHit, downHit));
			counterCut = (1.0 - baseMask) * smoothstep(0.48, 0.88, enclosed) * holeMask;
			textWeightL = 1.0 - smoothstep(0.15, 0.55, tMaskL);
			textWeightR = 1.0 - smoothstep(0.15, 0.55, tMaskR);
			textWeightB = 1.0 - smoothstep(0.15, 0.55, tMaskB);
			textWeightT = 1.0 - smoothstep(0.15, 0.55, tMaskT);
			textWeightTL = 1.0 - smoothstep(0.15, 0.55, tMaskTL);
			textWeightTR = 1.0 - smoothstep(0.15, 0.55, tMaskTR);
			textWeightBL = 1.0 - smoothstep(0.15, 0.55, tMaskBL);
			textWeightBR = 1.0 - smoothstep(0.15, 0.55, tMaskBR);
		}

		float digitDecay = clamp(u_dt * 3.0, 0.0, 1.0);
		digitField = mix(digitField, 0.0, digitDecay * (1.0 - textFill));
		digitField = clamp(digitField, 0.0, 1.0) * holeMask;
		dye.b = digitField;

		if (u_holeStrength > 0.0 && holeRadius > 0.001) {
			float drain = holeMask * u_holeStrength * u_dt;
			drain *= (1.0 - digitMask * 0.98);
			coverage = clamp(coverage - drain, 0.0, 1.0);
		}

		float background = coverage * holeProtect;

		float cL = texture2D(u_dye, uv - vec2(u_texelSize.x, 0.0)).a * textWeightL;
		float cR = texture2D(u_dye, uv + vec2(u_texelSize.x, 0.0)).a * textWeightR;
		float cB = texture2D(u_dye, uv - vec2(0.0, u_texelSize.y)).a * textWeightB;
		float cT = texture2D(u_dye, uv + vec2(0.0, u_texelSize.y)).a * textWeightT;
		float cTL = texture2D(u_dye, uv + vec2(-u_texelSize.x, u_texelSize.y)).a * textWeightTL;
		float cTR = texture2D(u_dye, uv + vec2(u_texelSize.x, u_texelSize.y)).a * textWeightTR;
		float cBL = texture2D(u_dye, uv + vec2(-u_texelSize.x, -u_texelSize.y)).a * textWeightBL;
		float cBR = texture2D(u_dye, uv + vec2(u_texelSize.x, -u_texelSize.y)).a * textWeightBR;
		float neighborMax = max(max(cL, cR), max(cB, cT));
		neighborMax = max(neighborMax, max(max(cTL, cTR), max(cBL, cBR)));
		float neighborAvg = (cL + cR + cB + cT + cTL + cTR + cBL + cBR) / 8.0;
		float closed = max(background, neighborMax * 0.985 * holeProtect);
		closed = max(closed, neighborAvg * 0.96 * holeProtect);

		float avg = (closed * 4.0 + cL + cR + cB + cT + cTL + cTR + cBL + cBR) / 12.0;
		float boundary = closed * (1.0 - closed);
		float smoothAmt = clamp((0.28 + boundary * 0.72) * holeProtect, 0.0, 0.78);
		smoothAmt *= (1.0 - digitMask * 0.9);
		float smoothed = mix(closed, avg, smoothAmt);

		float enforce = edgeMask * smoothstep(0.18, 1.0, clamp(u_fillAmount, 0.0, 1.0));
		smoothed = max(smoothed, enforce * 0.94 * holeProtect);

		coverage = max(smoothed, digitMask);
		coverage *= (1.0 - counterCut);

		dye.a = clamp(coverage, 0.0, 1.0);

		gl_FragColor = clamp(dye, 0.0, 1.0);
	}
	`;

const PARTICLE_SEED_FRAGMENT = `
	precision highp float;
	varying vec2 vUv;
	uniform sampler2D u_target;
	void main() {
		vec4 target = texture2D(u_target, vUv);
		gl_FragColor = vec4(target.xy, 0.0, 0.0);
	}
`;

const PARTICLE_SIM_FRAGMENT = `
	precision highp float;
	varying vec2 vUv;
	uniform sampler2D u_state;
	uniform sampler2D u_target;
	uniform float u_dt;
	uniform float u_time;
	uniform float u_aspect;
	uniform vec2 u_pointer;
	uniform vec2 u_pointerVelocity;
	uniform float u_pointerStrength;
	uniform float u_pointerRadius;
	uniform float u_returnStrength;
	uniform float u_reform;
	uniform float u_noiseStrength;
	${SIM_COMMON}
	void main() {
		vec2 uv = vUv;
		vec4 target = texture2D(u_target, uv);
		float alive = step(0.5, target.a);
		if (alive < 0.5) {
			gl_FragColor = vec4(0.0);
			return;
		}

		vec4 state = texture2D(u_state, uv);
		vec2 pos = state.xy;
		vec2 vel = state.zw;

		vec2 toTarget = target.xy - pos;
		float reform = clamp(u_reform, 0.0, 1.0);
		vel += toTarget * (u_returnStrength * reform) * u_dt;

		vec2 drift = curlNoise(pos * 0.55 + vec2(2.1, -1.7), u_time * 0.22);
		vel += drift * (u_noiseStrength * (0.25 + (1.0 - reform) * 0.75)) * u_dt;

		if (u_pointerStrength > 0.0001) {
			vec2 toPointer = pos - u_pointer;
			vec2 pointerScaled = vec2(toPointer.x * u_aspect, toPointer.y);
			float dist = length(pointerScaled);
			float falloff = smoothstep(u_pointerRadius, 0.0, dist);
			vec2 dir = normalize(pointerScaled + vec2(0.00001));
			dir.x /= max(u_aspect, 0.0001);
			dir = normalize(dir);
			vec2 swirl = vec2(-dir.y, dir.x);
			vec2 pv = u_pointerVelocity;
			float kick = u_pointerStrength * falloff;
			vel += (dir * kick + swirl * kick * 0.38 + pv * kick * 0.22) * u_dt;
		}

		vel *= pow(${PARTICLE_TEXT.damping.toFixed(2)}, u_dt * 60.0);
		vel = clamp(vel, vec2(-6.0), vec2(6.0));
		pos += vel * u_dt;
		pos = clamp(pos, vec2(-1.2), vec2(1.2));

		gl_FragColor = vec4(pos, vel);
	}
`;

const PARTICLE_RENDER_VERTEX = `
	precision highp float;
	uniform sampler2D u_state;
	uniform sampler2D u_target;
	uniform vec2 u_resolution;
	uniform float u_opacity;
	uniform float u_pointSize;
	varying float vAlpha;
	varying float vSpeed;
	void main() {
		vec2 uv = position.xy;
		vec4 state = texture2D(u_state, uv);
		vec4 target = texture2D(u_target, uv);
		float alive = step(0.5, target.a);
		vec2 pos = state.xy;
		vec2 vel = state.zw;
		vAlpha = alive * u_opacity;
		vSpeed = length(vel);
		gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 0.0, 1.0);
		gl_PointSize = u_pointSize * alive;
	}
`;

const PARTICLE_MASK_VERTEX = `
	precision highp float;
	uniform sampler2D u_state;
	uniform sampler2D u_target;
	uniform float u_pointSize;
	varying float vAlive;
	void main() {
		vec2 uv = position.xy;
		vec4 state = texture2D(u_state, uv);
		vec4 target = texture2D(u_target, uv);
		float alive = step(0.5, target.a);
		vAlive = alive;
		vec2 pos = state.xy;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 0.0, 1.0);
		gl_PointSize = u_pointSize * alive;
	}
`;

const PARTICLE_MASK_FRAGMENT = `
	precision highp float;
	varying float vAlive;
	void main() {
		if (vAlive <= 0.001) discard;
		vec2 p = gl_PointCoord - 0.5;
		float r = length(p);
		if (r > 0.5) discard;
		float falloff = smoothstep(0.5, 0.0, r);
		falloff = pow(falloff, 1.75);
		gl_FragColor = vec4(0.0, 0.0, 0.0, falloff);
	}
`;

const PARTICLE_RENDER_FRAGMENT = `
	precision highp float;
	varying float vAlpha;
	varying float vSpeed;
	void main() {
		if (vAlpha <= 0.001) discard;
		vec2 p = gl_PointCoord - 0.5;
		float r = length(p) * 2.0;
		if (r > 1.0) discard;
		float edge = smoothstep(1.0, 0.0, r);
		edge = pow(edge, 0.65);

		float z = sqrt(max(0.0, 1.0 - r * r));
		vec3 normal = normalize(vec3(p * 2.0, z));
		vec3 viewDir = vec3(0.0, 0.0, 1.0);
		vec3 lightDir = normalize(vec3(-0.25, 0.65, 1.0));

		float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);
		vec3 halfDir = normalize(lightDir + viewDir);
		float spec = pow(clamp(dot(normal, halfDir), 0.0, 1.0), 72.0);
		float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 3.0);

		vec3 envTop = vec3(0.98, 0.985, 1.0);
		vec3 envBot = vec3(0.22, 0.22, 0.245);
		vec3 env = mix(envBot, envTop, clamp(normal.y * 0.5 + 0.5, 0.0, 1.0));

		float speedBoost = clamp(vSpeed * 0.15, 0.0, 0.35);
		vec3 color = vec3(0.06) + env * (0.78 * diffuse + 0.28);
		color += vec3(1.0) * (spec * (1.15 + speedBoost));
		color += envTop * (fresnel * 0.55);
		color = color * 1.06 + vec3(0.02);

		float alpha = clamp(edge * vAlpha * 1.28, 0.0, 1.0);
		gl_FragColor = vec4(color, alpha);
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

function shortenStatValue(value) {
	let output = normalizeWhitespace(value);
	if (!output) return output;
	output = output
		.replace(/\s*\/\s*yr\b/gi, '')
		.replace(/\s*\/\s*year\b/gi, '')
		.replace(/\bper\s+year\b/gi, '')
		.replace(/\bMonths?\b/gi, 'Mo')
		.replace(/\bWeeks?\b/gi, 'Wk')
		.replace(/\bDays?\b/gi, 'd')
		.replace(/\bHours?\b/gi, 'hr')
		.replace(/\bMinutes?\b/gi, 'm')
		.replace(/Same[\-\u2010\u2011]day/gi, '1d');
	return normalizeWhitespace(output);
}

const FLOAT_TO_HALF_BUFFER = new ArrayBuffer(4);
const FLOAT_TO_HALF_FLOAT_VIEW = new Float32Array(FLOAT_TO_HALF_BUFFER);
const FLOAT_TO_HALF_INT_VIEW = new Uint32Array(FLOAT_TO_HALF_BUFFER);

function floatToHalf(value) {
	FLOAT_TO_HALF_FLOAT_VIEW[0] = value;
	const x = FLOAT_TO_HALF_INT_VIEW[0];
	let bits = (x >> 16) & 0x8000;
	let m = (x >> 12) & 0x07ff;
	let e = (x >> 23) & 0xff;

	if (e < 103) return bits;

	if (e > 142) {
		bits |= 0x7c00;
		if (e === 255 && (x & 0x007fffff)) bits |= 1;
		return bits;
	}

	if (e < 113) {
		m |= 0x0800;
		bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
		return bits;
	}

	bits |= ((e - 112) << 10) | (m >> 1);
	bits += m & 1;
	return bits;
}

function drawTrackedText(ctx, text, trackingPx, method) {
	const chars = Array.from(text || '');
	if (!chars.length) return;
	const widths = chars.map((ch) => ctx.measureText(ch).width);
	const total = widths.reduce((sum, w) => sum + w, 0) + trackingPx * (widths.length - 1);
	let cursor = -total / 2;
	const drawMethod = typeof method === 'string' && ctx[method] ? method : 'fillText';
	for (let i = 0; i < chars.length; i += 1) {
		ctx[drawMethod](chars[i], cursor, 0);
		cursor += widths[i] + trackingPx;
	}
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
				u_pointer: { value: new THREE.Vector2(0.5, 0.5) },
				u_pointerVelocity: { value: new THREE.Vector2(0, 0) },
				u_pointerRadius: { value: POINTER_INTERACTION.radius },
				u_pointerStrength: { value: 0 },
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
		textStrength = 0,
		pointer = null,
		pointerVelocity = null,
		pointerRadius = POINTER_INTERACTION.radius,
		pointerStrength = 0
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
		this.forceMaterial.uniforms.u_pointerRadius.value = pointerRadius;
		this.forceMaterial.uniforms.u_pointerStrength.value = pointerStrength;
		this.forceMaterial.uniforms.u_pointer.value.set(pointer?.x ?? 0.5, pointer?.y ?? 0.5);
		this.forceMaterial.uniforms.u_pointerVelocity.value.set(
			pointerVelocity?.vx ?? pointerVelocity?.x ?? 0,
			pointerVelocity?.vy ?? pointerVelocity?.y ?? 0
		);
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

class ParticleTextSim {
	constructor(renderer) {
		this.renderer = renderer;
		this.simWidth = PARTICLE_TEXT.textureWidth;
		this.simHeight = PARTICLE_TEXT.textureHeight;
		this.count = this.simWidth * this.simHeight;
		this.supportsLinearFiltering =
			renderer.capabilities.isWebGL2 ||
			Boolean(renderer.extensions?.get?.('OES_texture_half_float_linear')) ||
			Boolean(renderer.extensions?.get?.('OES_texture_float_linear'));

		this.scene = new THREE.Scene();
		this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
		this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial());
		this.scene.add(this.mesh);

		const options = {
			type: THREE.HalfFloatType,
			format: THREE.RGBAFormat,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			depthBuffer: false,
			stencilBuffer: false,
			wrapS: THREE.ClampToEdgeWrapping,
			wrapT: THREE.ClampToEdgeWrapping
		};

		const buildTarget = () => new THREE.WebGLRenderTarget(this.simWidth, this.simHeight, options);
		this.state = { read: buildTarget(), write: buildTarget() };

		this.targetData = new Uint16Array(this.count * 4);
		this.targetTexture = new THREE.DataTexture(
			this.targetData,
			this.simWidth,
			this.simHeight,
			THREE.RGBAFormat,
			THREE.HalfFloatType
		);
		this.targetTexture.needsUpdate = true;
		this.targetTexture.minFilter = THREE.NearestFilter;
		this.targetTexture.magFilter = THREE.NearestFilter;
		this.targetTexture.wrapS = THREE.ClampToEdgeWrapping;
		this.targetTexture.wrapT = THREE.ClampToEdgeWrapping;

		this.maskScene = new THREE.Scene();
		this.maskCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
		this.maskTarget = null;

		this.seedMaterial = new THREE.ShaderMaterial({
			vertexShader: SIM_VERTEX,
			fragmentShader: PARTICLE_SEED_FRAGMENT,
			uniforms: { u_target: { value: this.targetTexture } }
		});

		this.simMaterial = new THREE.ShaderMaterial({
			vertexShader: SIM_VERTEX,
			fragmentShader: PARTICLE_SIM_FRAGMENT,
			uniforms: {
				u_state: { value: this.state.read.texture },
				u_target: { value: this.targetTexture },
				u_dt: { value: 0.016 },
				u_time: { value: 0 },
				u_aspect: { value: 1 },
				u_pointer: { value: new THREE.Vector2(0, 0) },
				u_pointerVelocity: { value: new THREE.Vector2(0, 0) },
				u_pointerStrength: { value: 0 },
				u_pointerRadius: { value: 0.3 },
				u_returnStrength: { value: PARTICLE_TEXT.returnStrength },
				u_reform: { value: 1 },
				u_noiseStrength: { value: PARTICLE_TEXT.noiseStrength }
			}
		});

		this.sampleCanvas = document.createElement('canvas');
		this.sampleContext = this.sampleCanvas.getContext('2d', { willReadFrequently: true });

		this.points = this.buildPoints();
		this.maskPoints = this.buildMaskPoints(this.points.geometry);
	}

	get maskTexture() {
		return this.maskTarget?.texture || null;
	}

	buildPoints() {
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(this.count * 3);
		for (let i = 0; i < this.count; i += 1) {
			const x = (i % this.simWidth) + 0.5;
			const y = Math.floor(i / this.simWidth) + 0.5;
			const idx = i * 3;
			positions[idx] = x / this.simWidth;
			positions[idx + 1] = y / this.simHeight;
			positions[idx + 2] = 0;
		}
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		this.pointsMaterial = new THREE.ShaderMaterial({
			vertexShader: PARTICLE_RENDER_VERTEX,
			fragmentShader: PARTICLE_RENDER_FRAGMENT,
			transparent: true,
			depthTest: false,
			depthWrite: false,
			uniforms: {
				u_state: { value: this.state.read.texture },
				u_target: { value: this.targetTexture },
				u_resolution: { value: new THREE.Vector2(1, 1) },
				u_opacity: { value: 0 },
				u_pointSize: { value: 2 }
			}
		});
		this.pointsMaterial.blending = THREE.NormalBlending;

		const points = new THREE.Points(geometry, this.pointsMaterial);
		points.frustumCulled = false;
		points.renderOrder = 5;
		return points;
	}

	buildMaskPoints(sharedGeometry) {
		this.maskPointsMaterial = new THREE.ShaderMaterial({
			vertexShader: PARTICLE_MASK_VERTEX,
			fragmentShader: PARTICLE_MASK_FRAGMENT,
			transparent: true,
			depthTest: false,
			depthWrite: false,
			uniforms: {
				u_state: { value: this.state.read.texture },
				u_target: { value: this.targetTexture },
				u_pointSize: { value: 4 }
			}
		});
		this.maskPointsMaterial.blending = THREE.AdditiveBlending;

		const points = new THREE.Points(sharedGeometry, this.maskPointsMaterial);
		points.frustumCulled = false;
		this.maskScene.add(points);
		return points;
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

	swap(pair) {
		const temp = pair.read;
		pair.read = pair.write;
		pair.write = temp;
	}

	seed() {
		this.seedMaterial.uniforms.u_target.value = this.targetTexture;
		this.renderPass(this.seedMaterial, this.state.read);
		this.renderPass(this.seedMaterial, this.state.write);
		this.pointsMaterial.uniforms.u_state.value = this.state.read.texture;
		this.maskPointsMaterial.uniforms.u_state.value = this.state.read.texture;
	}

	renderMask() {
		if (!this.maskTarget) return;
		const prevTarget = this.renderer.getRenderTarget();
		this.renderer.setRenderTarget(this.maskTarget);
		this.renderer.clearColor();
		this.renderer.clear(true, true, true);
		this.renderer.render(this.maskScene, this.maskCamera);
		this.renderer.setRenderTarget(prevTarget);
	}

	resize(viewWidth, viewHeight, pixelRatio = 1) {
		const width = Math.max(1, Math.floor(viewWidth));
		const height = Math.max(1, Math.floor(viewHeight));
		const aspect = width / Math.max(height, 1);
		this.simMaterial.uniforms.u_aspect.value = aspect;
		this.pointsMaterial.uniforms.u_resolution.value.set(width, height);
		const safePixelRatio = clamp(pixelRatio || 1, 1, 2);
		const viewportScale = clamp(Math.min(width, height) / 360, 0.95, 1.4);
		this.pointsMaterial.uniforms.u_pointSize.value = PARTICLE_TEXT.basePointSize * viewportScale * safePixelRatio;

		const scaledW = Math.floor(width * FLUID_SIM.targetScale);
		const scaledH = Math.floor(height * FLUID_SIM.targetScale);
		let maskW = Math.max(FLUID_SIM.minSize, Math.min(FLUID_SIM.maxSize, scaledW));
		let maskH = Math.max(FLUID_SIM.minSize, Math.min(FLUID_SIM.maxSize, scaledH));

		if (aspect > 1.05) {
			maskH = Math.max(FLUID_SIM.minSize, Math.round(maskW / aspect));
		} else if (aspect < 0.95) {
			maskW = Math.max(FLUID_SIM.minSize, Math.round(maskH * aspect));
		}

		maskW = Math.max(FLUID_SIM.minSize, Math.min(FLUID_SIM.maxSize, maskW));
		maskH = Math.max(FLUID_SIM.minSize, Math.min(FLUID_SIM.maxSize, maskH));

		if (!this.maskTarget || this.maskTarget.width !== maskW || this.maskTarget.height !== maskH) {
			this.maskTarget?.dispose?.();
			const filter = this.supportsLinearFiltering ? THREE.LinearFilter : THREE.NearestFilter;
			this.maskTarget = new THREE.WebGLRenderTarget(maskW, maskH, {
				type: THREE.HalfFloatType,
				format: THREE.RGBAFormat,
				minFilter: filter,
				magFilter: filter,
				depthBuffer: false,
				stencilBuffer: false,
				wrapS: THREE.ClampToEdgeWrapping,
				wrapT: THREE.ClampToEdgeWrapping
			});
		}

		const maskPointSize = clamp((Math.min(maskW, maskH) / 175) * safePixelRatio, 1.55, 5.6);
		this.maskPointsMaterial.uniforms.u_pointSize.value = maskPointSize;
		this.renderMask();
	}

	setTargetsFromCanvas(sourceCanvas) {
		if (!this.sampleContext || !sourceCanvas) return;
		const srcW = Math.max(1, sourceCanvas.width);
		const srcH = Math.max(1, sourceCanvas.height);
		const srcAspect = srcW / srcH;
		const longEdge = PARTICLE_TEXT.sampleLongEdge;
		const sampleW = srcAspect >= 1 ? longEdge : Math.max(1, Math.round(longEdge * srcAspect));
		const sampleH = srcAspect >= 1 ? Math.max(1, Math.round(longEdge / srcAspect)) : longEdge;

		if (this.sampleCanvas.width !== sampleW || this.sampleCanvas.height !== sampleH) {
			this.sampleCanvas.width = sampleW;
			this.sampleCanvas.height = sampleH;
		}

		this.sampleContext.clearRect(0, 0, sampleW, sampleH);
		this.sampleContext.drawImage(sourceCanvas, 0, 0, srcW, srcH, 0, 0, sampleW, sampleH);

		const image = this.sampleContext.getImageData(0, 0, sampleW, sampleH);
		const data = image.data;
		const threshold = PARTICLE_TEXT.alphaThreshold;

		this.targetData.fill(0);

		let filled = 0;
		let seen = 0;
		for (let y = 0; y < sampleH; y += 1) {
			for (let x = 0; x < sampleW; x += 1) {
				const alpha = data[(y * sampleW + x) * 4 + 3];
				if (alpha < threshold) continue;
				seen += 1;
				let slot = -1;
				if (filled < this.count) {
					slot = filled;
					filled += 1;
				} else {
					const r = Math.floor(Math.random() * seen);
					if (r >= this.count) continue;
					slot = r;
				}

				const jitter = 0.75;
				const sx = clamp(x + 0.5 + (Math.random() - 0.5) * jitter, 0.5, sampleW - 0.5);
				const sy = clamp(y + 0.5 + (Math.random() - 0.5) * jitter, 0.5, sampleH - 0.5);
				const nx = (sx / sampleW) * 2 - 1;
				const ny = -((sy / sampleH) * 2 - 1);
				const idx = slot * 4;
				this.targetData[idx] = floatToHalf(nx);
				this.targetData[idx + 1] = floatToHalf(ny);
				this.targetData[idx + 2] = floatToHalf(0);
				this.targetData[idx + 3] = floatToHalf(1);
			}
		}

		if (filled === 0) {
			this.targetData[3] = floatToHalf(1);
		}

		this.targetTexture.needsUpdate = true;
		this.seed();
		this.renderMask();
	}

	step({
		dt,
		time,
		pointer = null,
		pointerVelocity = null,
		pointerRadius = 0.3,
		pointerStrength = 0,
		opacity = 0,
		reform = 1
	} = {}) {
		const delta = Math.min(Math.max(dt || 0, 0), FLUID_SIM.maxDelta);
		this.pointsMaterial.uniforms.u_opacity.value = clamp(opacity, 0, 1);
		if (!delta) return;

		this.simMaterial.uniforms.u_state.value = this.state.read.texture;
		this.simMaterial.uniforms.u_target.value = this.targetTexture;
		this.simMaterial.uniforms.u_dt.value = delta;
		this.simMaterial.uniforms.u_time.value = time;
		const px = pointer?.x ?? 0.5;
		const py = pointer?.y ?? 0.5;
		this.simMaterial.uniforms.u_pointer.value.set(px * 2 - 1, py * 2 - 1);

		const vx = pointerVelocity?.vx ?? pointerVelocity?.x ?? 0;
		const vy = pointerVelocity?.vy ?? pointerVelocity?.y ?? 0;
		this.simMaterial.uniforms.u_pointerVelocity.value.set(vx * 2, vy * 2);
		this.simMaterial.uniforms.u_pointerStrength.value = pointerStrength;
		this.simMaterial.uniforms.u_pointerRadius.value = pointerRadius * 2;
		this.simMaterial.uniforms.u_reform.value = clamp(reform, 0, 1);

		this.renderPass(this.simMaterial, this.state.write);
		this.swap(this.state);
		this.pointsMaterial.uniforms.u_state.value = this.state.read.texture;
		this.maskPointsMaterial.uniforms.u_state.value = this.state.read.texture;
		this.renderMask();
	}

	dispose() {
		this.state?.read?.dispose?.();
		this.state?.write?.dispose?.();
		this.maskTarget?.dispose?.();
		this.targetTexture?.dispose?.();
		this.seedMaterial?.dispose?.();
		this.simMaterial?.dispose?.();
		this.maskPointsMaterial?.dispose?.();
		this.pointsMaterial?.dispose?.();
		this.maskScene = null;
		this.maskCamera = null;
		this.maskTarget = null;
		this.points?.geometry?.dispose?.();
		this.mesh?.geometry?.dispose?.();
		this.mesh = null;
		this.scene = null;
		this.camera = null;
		this.points = null;
	}
}

class ImpactLiquidOverlay {
	constructor({ stats, closeAnchor, onRequestClose } = {}) {
		this.stats = resolveStats(stats);
		this.closeAnchor = closeAnchor || null;
		this.onRequestClose = typeof onRequestClose === 'function' ? onRequestClose : null;
		this.activeIndex = 0;
		this.captionVisible = false;
		this.phase = 'enter-fill';
		this.phaseStart = performance.now();
		this.fill = 0;
		this.hole = 0;
		this.textAlpha = 0;
		this.isExiting = false;
		this.isCovered = false;
		this.exitHoleStart = null;
		this.pointer = {
			isDown: false,
			x: 0.5,
			y: 0.5,
			vx: 0,
			vy: 0,
			lastX: 0.5,
			lastY: 0.5,
			lastTime: null,
			lastMoveTime: null,
			pointerId: null
		};
			this.pointerDown = null;
			this.lastFrame = null;
			this.particlePointerVelocity = { vx: 0, vy: 0 };

			this.handleResize = this.handleResize.bind(this);
			this.handlePointerDown = this.handlePointerDown.bind(this);
			this.handlePointerMove = this.handlePointerMove.bind(this);
		this.handlePointerUp = this.handlePointerUp.bind(this);
		this.handlePointerCancel = this.handlePointerCancel.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.animate = this.animate.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);
	}

	setCoveredState(nextCovered) {
		const isCovered = Boolean(nextCovered);
		if (this.isCovered === isCovered) return;
		this.isCovered = isCovered;
		if (this.root) {
			this.root.classList.toggle('is-covered', isCovered);
		}
		if (typeof document !== 'undefined' && document.body) {
			document.body.classList.toggle('impact-liquid-covered', isCovered);
		}
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
			<span class="impact-liquid-close-icon" aria-hidden="true">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false">
					<path fill="currentColor" d="M6.4 5.3L5.3 6.4 10.9 12 5.3 17.6l1.1 1.1L12 13.1l5.6 5.6 1.1-1.1L13.1 12l5.6-5.6-1.1-1.1L12 10.9 6.4 5.3z"/>
				</svg>
			</span>
			<span class="impact-liquid-close-text" aria-hidden="true">Close</span>
		`;
		this.closeButton.addEventListener('pointerdown', (event) => event.stopPropagation());
		this.closeButton.addEventListener('pointerup', (event) => event.stopPropagation());
		this.closeButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.requestClose();
		});
		this.root.appendChild(this.closeButton);

		if (this.closeAnchor) {
			const { top, left, collapsedWidth, expandedWidth, height } = this.closeAnchor;
			if (Number.isFinite(top)) this.closeButton.style.top = `${top}px`;
			if (Number.isFinite(left)) {
				this.closeButton.style.left = `${left}px`;
				this.closeButton.style.right = 'auto';
			}
			if (Number.isFinite(collapsedWidth)) {
				this.closeButton.style.setProperty('--impact-liquid-close-collapsed-width', `${collapsedWidth}px`);
			}
			if (Number.isFinite(expandedWidth)) {
				this.closeButton.style.setProperty('--impact-liquid-close-expanded-width', `${expandedWidth}px`);
			}
			if (Number.isFinite(height)) this.closeButton.style.height = `${height}px`;
		}

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
		this.setCaptionVisible(false);

		document.body.appendChild(this.root);
		this.setCoveredState(false);

		this.root.addEventListener('pointerdown', this.handlePointerDown);
		this.root.addEventListener('pointermove', this.handlePointerMove);
		this.root.addEventListener('pointerup', this.handlePointerUp);
		this.root.addEventListener('pointercancel', this.handlePointerCancel);
		this.root.addEventListener('touchmove', this.handleTouchMove, { passive: false });
		window.addEventListener('resize', this.handleResize);
		window.addEventListener('orientationchange', this.handleResize);
		window.addEventListener('keydown', this.handleKeydown);

		this.initThree();
		this.setStat(0);
		this.handleResize();

		requestAnimationFrame(() => {
			if (!this.closeButton) return;
			this.closeButton.classList.add('is-expanded');
		});

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

				this.particleText = new ParticleTextSim(this.renderer);
		}

		handleResize() {
			if (!this.renderer || !this.uniforms) return;
			const width = Math.max(1, Math.floor(window.innerWidth));
			const height = Math.max(1, Math.floor(window.innerHeight));
			this.renderer.setSize(width, height, false);
			this.uniforms.u_resolution.value.set(width, height);
			this.particleText?.resize(width, height, this.renderer.getPixelRatio());
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
		const longEdge = Math.max(width, height);
		const targetLongEdge = clamp(Math.floor(longEdge * dpr), 900, 1400);
		const scale = targetLongEdge / Math.max(1, longEdge);
		const nextW = Math.max(1, Math.round(width * scale));
		const nextH = Math.max(1, Math.round(height * scale));
		if (this.textCanvas.width === nextW && this.textCanvas.height === nextH) return;
		this.textCanvas.width = nextW;
		this.textCanvas.height = nextH;
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
		this.currentValue = shortenStatValue(stat.value) || stat.value;
		this.currentLabel = stat.label;
		this.redrawText();
	}

	setCaptionVisible(visible) {
		const nextVisible = Boolean(visible);
		if (this.captionVisible === nextVisible) return;
		this.captionVisible = nextVisible;
		if (!this.caption) return;
		this.caption.classList.toggle('is-fading', !nextVisible);
	}

	redrawText() {
		if (!this.textContext || !this.textCanvas) return;
		const ctx = this.textContext;
		const { width, height } = this.textCanvas;
		ctx.clearRect(0, 0, width, height);
		ctx.save();
		ctx.translate(width / 2, height / 2);
		ctx.textAlign = 'left';
		ctx.textBaseline = 'alphabetic';

		const value = this.currentValue || '';
		const label = '';
		const charCount = Array.from(value).length;
		const maxWidth = width * 0.9;
		let fontSize = Math.floor(Math.min(width, height) * 0.42);
		fontSize = clamp(fontSize, 72, 320);
		const valueFont = (size) =>
			`900 ${size}px Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Narrow", "SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
		ctx.font = valueFont(fontSize);
		while (fontSize > 42) {
			if (ctx.measureText(value).width <= maxWidth) break;
			fontSize -= 6;
			ctx.font = valueFont(fontSize);
		}
		const resolvedValueFont = ctx.font;

		let trackingPx = clamp(fontSize * 0.035, 0, 18);
		if (charCount > 2) {
			const totalWidth = ctx.measureText(value).width + trackingPx * Math.max(0, charCount - 1);
			if (totalWidth > maxWidth) {
				trackingPx = clamp(trackingPx * (maxWidth / totalWidth), 0, 18);
			}
		}

		const valueMetrics = ctx.measureText(value);
		const valueAscent = valueMetrics.actualBoundingBoxAscent ?? fontSize * 0.78;
		const valueDescent = valueMetrics.actualBoundingBoxDescent ?? fontSize * 0.22;

		let resolvedLabelFont = null;
		let labelMetrics = null;
		let resolvedLabelFontSize = 0;
		if (label) {
			let labelFontSize = clamp(Math.round(fontSize * 0.19), 14, 72);
			const labelFont = (size) =>
				`600 ${size}px "SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
			ctx.font = labelFont(labelFontSize);
			while (labelFontSize > 12) {
				if (ctx.measureText(label).width <= maxWidth) break;
				labelFontSize -= 2;
				ctx.font = labelFont(labelFontSize);
			}
			resolvedLabelFont = ctx.font;
			resolvedLabelFontSize = labelFontSize;
			labelMetrics = ctx.measureText(label);
		}

		const labelAscent = labelMetrics?.actualBoundingBoxAscent ?? resolvedLabelFontSize * 0.74;
		const labelDescent = labelMetrics?.actualBoundingBoxDescent ?? resolvedLabelFontSize * 0.26;
		const labelGap = label ? clamp(Math.round((labelAscent + labelDescent) * 0.55), 8, 18) : 0;
		const totalHeight = valueAscent + valueDescent + (label ? labelGap + labelAscent + labelDescent : 0);
		const blockTop = -totalHeight / 2;
		const valueBaseline = blockTop + valueAscent;
		const labelBaseline = valueBaseline + valueDescent + labelGap + labelAscent;

		ctx.fillStyle = '#ffffff';
		ctx.lineJoin = 'round';
		ctx.miterLimit = 2;

		ctx.save();
		ctx.translate(0, valueBaseline);
		ctx.font = resolvedValueFont;
		drawTrackedText(ctx, value, trackingPx, 'fillText');
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
		ctx.lineWidth = clamp(fontSize * 0.032, 1.5, 7);
		drawTrackedText(ctx, value, trackingPx, 'strokeText');
		ctx.restore();

		if (label && resolvedLabelFont) {
			ctx.save();
			ctx.translate(0, labelBaseline);
			ctx.font = resolvedLabelFont;
			ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
			drawTrackedText(ctx, label, 0, 'fillText');
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
			ctx.lineWidth = clamp((labelAscent + labelDescent) * 0.11, 1, 3);
			drawTrackedText(ctx, label, 0, 'strokeText');
			ctx.restore();
		}

		ctx.restore();
		this.textTexture.needsUpdate = true;
		this.particleText?.setTargetsFromCanvas(this.textCanvas);
	}

	handlePointerDown(event) {
		if (this.pointer && this.pointer.isDown && this.pointer.pointerId !== event.pointerId) return;
		const width = Math.max(1, window.innerWidth || 1);
		const height = Math.max(1, window.innerHeight || 1);
		const x = clamp(event.clientX / width, 0, 1);
		const y = clamp(1 - event.clientY / height, 0, 1);

		this.pointer.isDown = true;
		this.pointer.pointerId = event.pointerId;
		this.pointer.x = x;
		this.pointer.y = y;
		this.pointer.lastX = x;
		this.pointer.lastY = y;
		this.pointer.vx = 0;
		this.pointer.vy = 0;
		this.pointer.lastTime = performance.now();
		this.pointer.lastMoveTime = performance.now();

		try {
			this.root?.setPointerCapture?.(event.pointerId);
		} catch (err) {
			// Ignore pointer capture failures
		}

		this.pointerDown = {
			x: event.clientX,
			y: event.clientY,
			time: performance.now()
		};
	}

	handlePointerMove(event) {
		if (!this.pointer?.isDown) return;
		if (this.pointer.pointerId != null && event.pointerId !== this.pointer.pointerId) return;

		const width = Math.max(1, window.innerWidth || 1);
		const height = Math.max(1, window.innerHeight || 1);
		const now = performance.now();
		const x = clamp(event.clientX / width, 0, 1);
		const y = clamp(1 - event.clientY / height, 0, 1);
		const lastTime = this.pointer.lastTime ?? now;
		const dt = Math.max((now - lastTime) / 1000, 0.001);

		const vx = clamp((x - this.pointer.lastX) / dt, -POINTER_INTERACTION.maxVelocity, POINTER_INTERACTION.maxVelocity);
		const vy = clamp((y - this.pointer.lastY) / dt, -POINTER_INTERACTION.maxVelocity, POINTER_INTERACTION.maxVelocity);

		this.pointer.x = x;
		this.pointer.y = y;
		this.pointer.vx = vx;
		this.pointer.vy = vy;
		this.pointer.lastX = x;
		this.pointer.lastY = y;
		this.pointer.lastTime = now;
		this.pointer.lastMoveTime = now;
	}

	handlePointerUp(event) {
		if (this.pointer?.isDown) {
			if (this.pointer.pointerId == null || event.pointerId === this.pointer.pointerId) {
				this.pointer.isDown = false;
				this.pointer.pointerId = null;
				this.pointer.lastTime = performance.now();
				this.pointer.lastMoveTime = performance.now();
				try {
					this.root?.releasePointerCapture?.(event.pointerId);
				} catch (err) {
					// Ignore pointer capture failures
				}
			}
		}

		if (!this.pointerDown) return;
		const dx = event.clientX - this.pointerDown.x;
		const dy = event.clientY - this.pointerDown.y;
		const dist = Math.hypot(dx, dy);
		const elapsed = performance.now() - this.pointerDown.time;
		this.pointerDown = null;

		if (dist > 14 || elapsed > 800) return;
		this.advance();
	}

	handlePointerCancel(event) {
		if (this.pointer?.isDown) {
			if (this.pointer.pointerId == null || event.pointerId === this.pointer.pointerId) {
				this.pointer.isDown = false;
				this.pointer.pointerId = null;
				this.pointer.vx = 0;
				this.pointer.vy = 0;
				this.pointer.lastTime = performance.now();
				this.pointer.lastMoveTime = performance.now();
			}
		}
		this.pointerDown = null;
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
		this.setCoveredState(false);
		this.isExiting = true;
		this.exitHoleStart = this.hole;
		if (this.closeButton) {
			this.closeButton.classList.remove('is-expanded');
		}
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
			const t = easeInOutCubic(clamp(elapsed / 760, 0, 1));
			this.fill = 1;
			this.hole = (1 - t) * HOLE_MAX;
			this.textAlpha = 0;
			if (t >= 1) {
				this.setCoveredState(true);
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
			this.hole = t * HOLE_MAX;
			this.textAlpha = clamp((t - 0.22) / 0.78, 0, 1);
			if (t >= 1) {
				this.phase = 'show-stat';
				this.phaseStart = now;
			}
		} else if (this.phase === 'cycle-close') {
			const t = easeInOutCubic(clamp(elapsed / 520, 0, 1));
			this.fill = 1;
			this.hole = (1 - t) * HOLE_MAX;
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
			const startHole = Number.isFinite(this.exitHoleStart) ? this.exitHoleStart : this.hole;
			this.hole = startHole + (HOLE_EXIT_MAX - startHole) * t;
			this.fill = 1;
			if (t >= 1) {
				this.dispose();
				return;
			}
		}

		const captionVisible =
			this.phase === 'show-stat' || (this.phase === 'enter-reveal' && this.textAlpha > 0.18);
		this.setCaptionVisible(captionVisible);

		this.uniforms.u_time.value = now / 1000;
		this.uniforms.u_fill.value = this.fill;
		this.uniforms.u_hole.value = this.hole;
		this.uniforms.u_textAlpha.value = this.textAlpha;

			if (this.fluid) {
				const time = now / 1000;
				let centerStrength = 0;
				let fillStrength = 5.2;
				let holeStrength = 0;

			if (this.phase === 'enter-fill') {
				centerStrength = -FLUID_SIM.centerStrength * 1.05;
				fillStrength = 7.4;
				holeStrength = 0;
			} else if (this.phase === 'enter-reveal') {
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
				centerStrength = FLUID_SIM.centerStrength;
				holeStrength = 9.2;
			}

					const holeRadius = Math.max(0.0, this.hole);
					const centerRadius = Math.max(FLUID_SIM.centerRadiusBase, holeRadius * 1.05);
					const holeHardness = 0.06 + holeRadius * 0.28;

					let pointerInfluence = 0;
					let pointerStrength = 0;
					let pointerRadius = POINTER_INTERACTION.radius;
					if (this.pointer?.lastMoveTime != null) {
						const msSinceMove = now - this.pointer.lastMoveTime;
						let influence = 0;
						if (msSinceMove <= POINTER_INTERACTION.holdMs) {
							influence = 1;
						} else {
							influence = clamp(
								1 - (msSinceMove - POINTER_INTERACTION.holdMs) / POINTER_INTERACTION.decayMs,
								0,
								1
							);
						}

						pointerInfluence = influence;
						pointerStrength = POINTER_INTERACTION.strength * influence;
						pointerRadius = POINTER_INTERACTION.radius * (0.92 + influence * 0.18);
					}

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
						textTexture: this.particleText?.maskTexture || this.textTexture,
						textStrength: this.textAlpha,
						pointer: this.pointer,
						pointerVelocity: this.pointer,
						pointerRadius: pointerRadius * 1.05,
						pointerStrength: pointerStrength * 1.55
					});
					this.uniforms.u_dye.value = this.fluid.dyeTexture;
					this.uniforms.u_velocity.value = this.fluid.velocityTexture;
					this.uniforms.u_texelSize.value.copy(this.fluid.texelSize);

					const particleMsSinceMove = this.pointer?.lastMoveTime != null ? now - this.pointer.lastMoveTime : Infinity;
					const particleVelocityScale = clamp(1 - particleMsSinceMove / 180, 0, 1);
					const particleSpeed = Math.hypot(this.pointer?.vx ?? 0, this.pointer?.vy ?? 0);
					const particleSpeedInfluence = clamp(
						particleSpeed / (POINTER_INTERACTION.maxVelocity * 0.7),
						0,
						1
					);
					const particleDisturbance = particleVelocityScale * particleSpeedInfluence;
					const particleReform = clamp(1 - particleDisturbance * 0.75, 0.25, 1);
					const particlePointerVelocity = this.particlePointerVelocity;
					particlePointerVelocity.vx = (this.pointer?.vx ?? 0) * particleVelocityScale;
					particlePointerVelocity.vy = (this.pointer?.vy ?? 0) * particleVelocityScale;

					this.particleText?.step({
						dt,
						time,
						pointer: this.pointer,
						pointerVelocity: particlePointerVelocity,
						pointerRadius: pointerRadius * PARTICLE_TEXT.pointerRadiusMultiplier,
						pointerStrength: pointerStrength * PARTICLE_TEXT.pointerStrengthMultiplier,
						opacity: this.textAlpha,
						reform: particleReform
					});
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
		this.root?.removeEventListener('pointermove', this.handlePointerMove);
		this.root?.removeEventListener('pointerup', this.handlePointerUp);
		this.root?.removeEventListener('pointercancel', this.handlePointerCancel);
		this.root?.removeEventListener('touchmove', this.handleTouchMove);
		window.removeEventListener('resize', this.handleResize);
		window.removeEventListener('orientationchange', this.handleResize);
		window.removeEventListener('keydown', this.handleKeydown);

			if (this.mesh) {
				this.mesh.geometry?.dispose();
				this.material?.dispose();
			}

			this.textTexture?.dispose();
			this.particleText?.dispose?.();
			this.fluid?.dispose?.();
			this.renderer?.dispose();
			this.scene = null;
			this.camera = null;
			this.mesh = null;
			this.material = null;
			this.particleText = null;
			this.renderer = null;
			this.uniforms = null;
			this.setCoveredState(false);

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
	if (overlay.closeButton) {
		overlay.closeButton.classList.remove('is-expanded');
	}
	overlay.setCoveredState(false);
	overlay.isExiting = true;
	overlay.exitHoleStart = overlay.hole;
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
