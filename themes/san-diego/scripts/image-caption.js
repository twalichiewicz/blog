'use strict';

/**
 * Transform markdown image syntax with captions to use the accordion-caption style
 * 
 * Standard markdown image: ![alt text](image.jpg)
 * 
 * With caption syntax: ![alt text](image.jpg "This is a caption")
 * The text in quotes after the URL will be used as the caption
 */
hexo.extend.filter.register('after_post_render', function (data) {
	// Only process posts and pages
	if (!data.content) return data;

	// Replace markdown image syntax with caption in quotes
	data.content = data.content.replace(/!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g, function (match, alt, src, caption) {
		// If no caption is provided, just return the original match
		if (!caption) {
			return match;
		}

		// Create a container with the image and custom caption style
		return `<div class="md-image-container">
      <img src="${src}" alt="${alt || ''}" loading="lazy" decoding="async">
      <div class="accordion-caption">${caption}</div>
    </div>`;
	});

	return data;
}); 