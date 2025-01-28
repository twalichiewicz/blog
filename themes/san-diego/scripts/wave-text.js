'use strict';

hexo.extend.tag.register('wave_text', function (args) {
	try {
		// Parse config if provided
		const config = args.length ? JSON.parse(args.join(' ')
			.replace(/([{,])\s*(\w+):/g, '$1"$2":')
			.replace(/:([^",}\s][^,}]*)/g, ':"$1"')
		) : {};

		// Merge with default config
		const defaultConfig = {
			baseString: "Design in Everything ",
			boldLetters: [],
			wave: {
				frequency: 0.009,
				amplitude: 30,
				speed: 0.0003,
				randomFactor: 1,
			},
			font: {
				size: 21,
				lineHeight: 30,
				charWidth: 14,
			}
		};

		const mergedConfig = { ...defaultConfig, ...config };

		return hexo.render.renderSync({
			path: 'themes/san-diego/layout/_partial/wave-text.ejs',
			data: { config: mergedConfig }
		});
	} catch (error) {
		console.error('Error rendering wave text:', error);
		return '<div class="wave-error">Error loading wave effect</div>';
	}
}, { ends: false }); 