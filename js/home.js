import { WaveAnimation, SkullAnimation } from './components/HomeVisuals.js';

export function initHomeVisuals(config = {}) {
	const {
		showWave = true,
		showSkull = true,
		waveConfig = {},
		skullConfig = {}
	} = config;

	// Initialize Wave if enabled
	if (showWave) {
		const waveCanvas = document.getElementById("waveCanvas");
		if (waveCanvas) {
			const waveAnimation = new WaveAnimation(waveCanvas, waveConfig);
			waveAnimation.init();
		}
	}

	// Initialize Skull if enabled
	if (showSkull) {
		const skullCanvas = document.getElementById("skullCanvas");
		if (skullCanvas) {
			const skullAnimation = new SkullAnimation(
				skullCanvas,
				'img/skully3d.glb',
				skullConfig
			);
		}
	}
} 