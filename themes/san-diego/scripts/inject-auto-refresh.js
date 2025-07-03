/**
 * Inject Browser Auto-Refresh Script
 * 
 * This script injects the WebSocket client code into all HTML pages
 * during development to enable automatic browser refresh.
 */

hexo.extend.filter.register('after_render:html', function(html, data) {
  // Only inject in development mode
  if (process.env.NODE_ENV === 'production' || hexo.env.cmd === 'generate') {
    return html;
  }
  
  // Check if we're in dev mode by looking for the dev server
  const isDevMode = process.argv.some(arg => 
    arg.includes('server') || 
    arg.includes('dev') ||
    process.env.DEV_MODE === 'true'
  );
  
  if (!isDevMode) {
    return html;
  }
  
  // Auto-refresh script
  const autoRefreshScript = `
<!-- Browser Auto-Refresh (Development Only) -->
<script>
(function() {
  // Skip if already initialized
  if (window.__autoRefreshInitialized) return;
  window.__autoRefreshInitialized = true;
  
  const ws = new WebSocket('ws://localhost:4001');
  let reconnectInterval = null;
  
  ws.onopen = function() {
    console.log('🔄 Connected to auto-refresh server');
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
    }
  };
  
  ws.onmessage = function(event) {
    try {
      const data = JSON.parse(event.data);
      
      if (data.type === 'refresh') {
        console.log('🔄 Refreshing page:', data.message);
        // Small delay to ensure files are fully written
        setTimeout(() => location.reload(), 100);
      } else if (data.type === 'connected') {
        console.log('✅', data.message);
      }
    } catch (e) {
      console.error('Auto-refresh message parse error:', e);
    }
  };
  
  ws.onclose = function() {
    console.log('🔌 Disconnected from auto-refresh server');
    // Try to reconnect every 2 seconds
    if (!reconnectInterval) {
      reconnectInterval = setInterval(() => {
        console.log('🔄 Attempting to reconnect...');
        window.location.reload();
      }, 2000);
    }
  };
  
  ws.onerror = function(error) {
    // Silently fail if server not available
    console.debug('Auto-refresh not available');
  };
})();
</script>
`;
  
  // Inject before closing body tag
  return html.replace('</body>', autoRefreshScript + '\n</body>');
});