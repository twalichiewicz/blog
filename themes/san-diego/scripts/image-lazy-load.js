hexo.extend.filter.register('after_render:html', function(str) {
  return str.replace(/<img(.*?)>/gi, function(match, p1) {
    if (!p1.includes('loading=')) {
      match = match.replace('>', ' loading="lazy">');
    }
    if (!p1.includes('decoding=')) {
      match = match.replace('>', ' decoding="async">');
    }
    return match;
  });
}); 