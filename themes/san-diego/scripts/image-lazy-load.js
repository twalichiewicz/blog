hexo.extend.filter.register('after_render:html', function(str) {
  return str.replace(/<img(.*?)>/gi, function(match, p1) {
    // Don't add lazy loading to loading screen images
    if (p1.includes('loading-skull') || p1.includes('skully.svg')) {
      return match;
    }

    const attributesToInject = [];

    if (!p1.includes('loading=')) {
      attributesToInject.push(' loading="lazy"');
    }
    if (!p1.includes('decoding=')) {
      attributesToInject.push(' decoding="async"');
    }

    if (attributesToInject.length === 0) {
      return match;
    }

    const endIndex = match.lastIndexOf('>');
    if (endIndex === -1) {
      return match;
    }

    const hasSelfClosingSlash = match[endIndex - 1] === '/';
    const insertionPoint = hasSelfClosingSlash ? endIndex - 1 : endIndex;
    const closing = hasSelfClosingSlash ? '/>' : '>';

    return match.slice(0, insertionPoint) + attributesToInject.join('') + closing;
  });
}); 
