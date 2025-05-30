'use strict';

hexo.extend.tag.register('carousel', function (args) {
	try {
		// Parse the JSON input
		const input = args.join(' ')
			.replace(/([{,])\s*(\w+):/g, '$1"$2":')
			.replace(/:([^",}\s][^,}]*)/g, ':"$1"')
			.replace(/:"([^"]*)\s+([^"}]*)"}/g, ':"$1 $2"}')
			.replace(/""+/g, '"');

		const images = JSON.parse(input);

		// Process each item to set video defaults
		const processedImages = images.map(item => {
			if (item.type === 'video') {
				// Set autoplay and loop to true by default for videos, unless explicitly set to false
				return {
					...item,
					autoplay: item.autoplay !== false, // defaults to true unless explicitly false
					loop: item.loop !== false, // defaults to true unless explicitly false
					muted: item.muted !== false // defaults to true for autoplay compatibility
				};
			}
			return item;
		});

		// Generate minimal HTML structure - let the frontend JS handle the rest
		return `<div class="carousel" aria-label="Media carousel">
      <div class="carousel-track">
        ${processedImages.map((item, index) => {
			let mediaContent = '';
			if (item.type === 'video') {
				mediaContent = `<video controls preload="metadata" playsinline${item.autoplay ? ' autoplay' : ''}${item.loop ? ' loop' : ''}${item.muted ? ' muted' : ''}>
              <source src="${item.url || item.src}" type="${item.videoType || 'video/mp4'}">
              Your browser does not support the video tag.
            </video>`;
			} else if (item.type === 'iframe') {
				mediaContent = `<iframe src="${item.url || item.src}" 
                                  frameborder="0" 
                                  allowfullscreen
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  loading="lazy"
                                  style="width: 100%; height: 100%; border: none;"
                                  title="${item.caption || 'Embedded content'}">
            </iframe>`;
			} else {
				mediaContent = `<img src="${item.url || item.src}" 
                               alt="${item.caption || item.alt || ''}"
                               loading="lazy"
                               decoding="async">`;
			}

			return `<div class="carousel-slide ${index === 0 ? 'active' : ''}" 
                      aria-hidden="${index === 0 ? 'false' : 'true'}">
            ${mediaContent}
            ${item.caption ? `<div class="carousel-caption">${item.caption}</div>` : ''}
          </div>`;
		}).join('')}
      </div>
      ${processedImages.length > 1 ? `
        <div class="carousel-indicators">
          <button class="carousel-button prev" aria-label="Previous slide"></button>
          ${processedImages.map((_, index) => `
            <button class="indicator ${index === 0 ? 'active' : ''}" 
                    aria-label="Go to slide ${index + 1}"></button>
          `).join('')}
          <button class="carousel-button next" aria-label="Next slide"></button>
        </div>
      ` : ''}
    </div>`;
	} catch (error) {
		console.error('Error rendering carousel:', error);
		return '<div class="carousel-error">Error loading carousel</div>';
	}
}, { ends: false }); 