// Fix carousel image paths at build time
hexo.extend.filter.register('after_post_render', function(data) {
  // Only process if the post has carousel markup
  if (!data.content.includes('carousel')) {
    return data;
  }

  // For posts with relative image paths in carousels, ensure they resolve correctly
  // This specifically fixes the Foreground project issue
  data.content = data.content.replace(
    /<img\s+src="\/([^"]+?)"\s+alt="([^"]*?)"/g,
    function(match, path, alt) {
      // If this is within a carousel and the path doesn't include a date structure
      // it's likely a relative image that needs the post's path prepended
      if (!path.includes('/20')) { // No year in path
        // Check if we're in a carousel context
        const beforeMatch = data.content.substring(Math.max(0, data.content.indexOf(match) - 200), data.content.indexOf(match));
        if (beforeMatch.includes('carousel')) {
          // Get the post's path
          const postPath = data.path.replace('index.html', '');
          const fixedPath = postPath + path;
          return `<img src="${fixedPath}" alt="${alt}"`;
        }
      }
      return match;
    }
  );

  return data;
});