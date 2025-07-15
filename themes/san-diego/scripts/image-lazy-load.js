hexo.extend.filter.register('after_render:html', function(str) {
  return str.replace(/<img(.*?)>/gi, function(match, p1) {
    // Don't add lazy loading to loading screen images
    if (p1.includes('loading-skull') || p1.includes('skully.svg')) {
      return match;
    }
    
    if (!p1.includes('loading=')) {
      match = match.replace('>', ' loading="lazy">');
    }
    if (!p1.includes('decoding=')) {
      match = match.replace('>', ' decoding="async">');
    }
    return match;
  });
}); 