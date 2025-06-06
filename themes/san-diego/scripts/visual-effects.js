'use strict';

// Wave Text Effect Tag
hexo.extend.tag.register('wave_text', function (args) {
	try {
		const config = args.length ? JSON.parse(args.join(' ')
			.replace(/([{,])\s*(\w+):/g, '$1"$2":')
			.replace(/:([^",}\s][^,}]*)/g, ':"$1"')
		) : {};

		return ''; // Disabled
	} catch (error) {
		console.error('Error rendering wave text (tag disabled):', error);
		return '<div class="wave-error">Wave effect disabled</div>';
	}
}, { ends: false });

// 3D Skull Effect Tag
hexo.extend.tag.register('skull_3d', function (args) {
	try {
		const config = args.length ? JSON.parse(args.join(' ')
			.replace(/([{,])\s*(\w+):/g, '$1"$2":')
			.replace(/:([^",}\s][^,}]*)/g, ':"$1"')
		) : {};

		return `<div class="skull-container">
            <canvas id="skullCanvas"></canvas>
            <script type="module">
                import { initHomeVisuals } from '/js/home.js';
                document.addEventListener('DOMContentLoaded', () => {
                    initHomeVisuals({ 
                        showWave: false, 
                        showSkull: true,
                        skullConfig: ${JSON.stringify(config)}
                    });
                });
            </script>
        </div>`;
	} catch (error) {
		console.error('Error rendering skull:', error);
		return '<div class="skull-error">Error loading skull effect</div>';
	}
}, { ends: false });

// Combined Effects Tag
hexo.extend.tag.register('visual_effects', function (args) {
	try {
		const config = args.length ? JSON.parse(args.join(' ')
			.replace(/([{,])\s*(\w+):/g, '$1"$2":')
			.replace(/:([^",}\s][^,}]*)/g, ':"$1"')
		) : {};

		return `<div class="visuals-container">
            <canvas id="skullCanvas"></canvas>
            <script type="module">
                import { initHomeVisuals } from '/js/home.js';
                document.addEventListener('DOMContentLoaded', () => {
                    initHomeVisuals({
                        showWave: false,
                        showSkull: true,
                        ...${JSON.stringify(config)}
                    });
                });
            </script>
        </div>`;
	} catch (error) {
		console.error('Error rendering visual effects:', error);
		return '<div class="visuals-error">Error loading visual effects</div>';
	}
}, { ends: false }); 