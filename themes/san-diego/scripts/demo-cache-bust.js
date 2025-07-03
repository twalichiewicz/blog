/**
 * Demo Cache Busting
 * 
 * Adds timestamp query parameters to demo iframes to prevent caching issues
 */

hexo.extend.helper.register('bustDemoCache', function(url) {
  // Only bust cache in development
  if (process.env.NODE_ENV === 'production') {
    return url;
  }
  
  // Add timestamp to force reload
  const timestamp = Date.now();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${timestamp}`;
});

// Also extend the tag to automatically bust cache
hexo.extend.filter.register('after_render:html', function(html) {
  // Only in development
  if (process.env.NODE_ENV === 'production' || !process.env.DEV_MODE) {
    return html;
  }
  
  // Add cache busting to demo iframes
  return html.replace(
    /(<iframe[^>]+class="project-demo-iframe"[^>]+src=")([^"]+)(")/g,
    function(match, prefix, url, suffix) {
      const timestamp = Date.now();
      const separator = url.includes('?') ? '&' : '?';
      return `${prefix}${url}${separator}_t=${timestamp}${suffix}`;
    }
  );
});