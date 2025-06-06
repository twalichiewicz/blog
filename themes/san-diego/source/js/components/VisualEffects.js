import { SkullAnimation } from './HomeVisuals.js';

export class VisualEffects {
	constructor(config = {}) {
		this.config = {
			showSkull: false,
			skullConfig: {},
			...config
		};
		this.animations = [];
	}

	static createContainer(type = 'skull') {
		const container = document.createElement('div');
		container.className = `${type}-container`;

		const canvas = document.createElement('canvas');
		canvas.id = `${type}Canvas`;
		container.appendChild(canvas);

		return container;
	}

	init(targetElement) {
		if (!targetElement) return;

		// Clear existing content
		targetElement.innerHTML = '';

		if (this.config.showSkull) {
			const skullContainer = VisualEffects.createContainer('skull');
			targetElement.appendChild(skullContainer);

			const skullCanvas = skullContainer.querySelector('#skullCanvas');
			if (skullCanvas) {
				const skullAnimation = new SkullAnimation(
					skullCanvas,
					'img/skully3d.glb',
					this.config.skullConfig
				);
				this.animations.push(skullAnimation);
			}
		}
	}

	destroy() {
		this.animations.forEach(animation => {
			if (animation.destroy) animation.destroy();
		});
		this.animations = [];
	}
} 