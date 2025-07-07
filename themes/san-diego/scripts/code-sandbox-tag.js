/**
 * Hexo tag plugin for Code Sandbox component
 * Usage: {% code_sandbox [options] %}...content...{% endcode_sandbox %}
 * 
 * Options:
 * - label: Custom label (default: "Code sandbox")
 * - collapsed: Start in collapsed state (default: false)
 * - auto_toggle: Auto-toggle on scroll (default: true)
 * - suspend: Suspend JS when hidden (default: true)
 * - reset: Reset content when shown (default: false)
 */

hexo.extend.tag.register('code_sandbox', function(args, content) {
  // Parse arguments
  const options = {};
  args.forEach(arg => {
    const [key, value] = arg.split('=');
    if (value !== undefined) {
      // Handle quoted values
      options[key] = value.replace(/^["']|["']$/g, '');
    } else {
      // Handle boolean flags
      options[key] = true;
    }
  });

  // Default values
  const label = options.label || 'Code sandbox';
  const collapsed = options.collapsed === 'true' || options.collapsed === true;
  const autoToggle = options.auto_toggle !== 'false';
  const suspend = options.suspend !== 'false';
  const reset = options.reset === 'true' || options.reset === true;

  // Generate unique ID for this sandbox
  const sandboxId = 'sandbox-' + Math.random().toString(36).substr(2, 9);

  // Build the HTML
  const html = `
<div class="code-sandbox-wrapper${collapsed ? ' collapsed' : ''}" 
     data-auto-init="true"
     data-sandbox-id="${sandboxId}"
     data-auto-toggle="${autoToggle}"
     data-suspend="${suspend}"
     data-reset="${reset}">
  <div class="code-sandbox-content">
${content}
  </div>
  
  <div class="code-sandbox-chin">
    <div class="code-sandbox-brand">
      <!-- Light mode logo -->
      <svg class="code-sandbox-logo code-sandbox-logo-light" width="242" height="249" viewBox="0 0 242 249" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M124.64 0C167.003 0 188.185 0.000318576 204.189 8.63574C216.552 15.3064 226.694 25.4477 233.364 37.8105C242 53.8148 242 74.9968 242 117.36V131.64C242 174.003 242 195.185 233.364 211.189C226.694 223.552 216.552 233.694 204.189 240.364C188.185 249 167.003 249 124.64 249H117.36C74.9968 249 53.8148 249 37.8105 240.364C25.4477 233.694 15.3064 223.552 8.63574 211.189C0.000317729 195.185 0 174.003 0 131.64V117.36C0 74.9968 0.000318576 53.8148 8.63574 37.8105C15.3064 25.4477 25.4477 15.3064 37.8105 8.63574C53.8148 0.000318576 74.9968 0 117.36 0H124.64ZM30 136C25.0294 136 21 140.029 21 145V183.357C21.0001 208.013 40.9872 228 65.6426 228C68.6012 228 71 225.601 71 222.643V166C71 149.431 57.5685 136 41 136H30ZM128.791 199.651C124.303 195.82 117.697 195.82 113.209 199.651L98.5615 212.155C92.1999 217.586 96.04 228 104.404 228H137.596C145.96 228 149.8 217.586 143.438 212.155L128.791 199.651ZM201 136C184.431 136 171 149.431 171 166V222.643C171 225.601 173.399 228 176.357 228C201.013 228 221 208.013 221 183.357V145C221 140.029 216.971 136 212 136H201ZM67.4287 21C41.7869 21 21 41.7869 21 67.4287C21.0001 70.5056 23.4944 72.9999 26.5713 73H52C76.8528 73 97 93.1472 97 118V177.506C97 179.533 99.4511 180.549 100.885 179.115C111.994 168.006 130.006 168.006 141.115 179.115C142.549 180.549 145 179.533 145 177.506V118C145 93.1472 165.147 73 190 73H215.429C218.506 72.9999 221 70.5056 221 67.4287C221 41.7869 200.213 21 174.571 21H67.4287Z" fill="currentColor"/>
      </svg>
      <!-- Dark mode logo -->
      <svg class="code-sandbox-logo code-sandbox-logo-dark" width="200" height="207" viewBox="0 0 200 207" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 115C36.5685 115 50 128.431 50 145V201.643C50 204.601 47.6012 207 44.6426 207C19.9872 207 0.000146651 187.013 0 162.357V124C2.96367e-06 119.029 4.02944 115 9 115H20ZM92.209 178.651C96.6967 174.82 103.303 174.82 107.791 178.651L122.438 191.155C128.8 196.586 124.96 207 116.596 207H83.4043C75.04 207 71.1999 196.586 77.5615 191.155L92.209 178.651ZM191 115C195.971 115 200 119.029 200 124V162.357C200 187.013 180.013 207 155.357 207C152.399 207 150 204.601 150 201.643V145C150 128.431 163.431 115 180 115H191ZM153.571 0C179.213 1.12084e-06 200 20.7869 200 46.4287C200 49.5056 197.506 51.9999 194.429 52H169C144.147 52 124 72.1472 124 97V156.506C124 158.533 121.549 159.549 120.115 158.115C109.006 147.006 90.994 147.006 79.8848 158.115C78.4511 159.549 76 158.533 76 156.506V97C76 72.1472 55.8528 52 31 52H5.57129C2.49438 51.9999 7.13985e-05 49.5056 0 46.4287C1.12084e-06 20.7869 20.7869 -1.12084e-06 46.4287 0H153.571Z" fill="currentColor"/>
      </svg>
      <span>${label}</span>
    </div>
    <div class="code-sandbox-toggle${collapsed ? '' : ' active'}" 
         tabindex="0" 
         role="switch" 
         aria-checked="${!collapsed}"></div>
  </div>
</div>

<script data-sandbox-init="${sandboxId}">
// Initialize this specific sandbox with options
(function() {
  // Store initialization function globally for reuse
  window.sandboxInitializers = window.sandboxInitializers || {};
  
  window.sandboxInitializers['${sandboxId}'] = function() {
    const wrapper = document.querySelector('[data-sandbox-id="${sandboxId}"]');
    if (!wrapper || wrapper.codeSandbox) return false;
    
    const options = {
      autoToggleOnScroll: ${autoToggle},
      suspendOnHide: ${suspend},
      resetOnShow: ${reset}
    };
    
    // Allow content to define custom handlers
    if (window.sandboxHandlers && window.sandboxHandlers['${sandboxId}']) {
      Object.assign(options, window.sandboxHandlers['${sandboxId}']);
    }
    
    new CodeSandbox(wrapper, options);
    return true;
  };
  
  // Try to initialize immediately
  function tryInit() {
    if (typeof CodeSandbox !== 'undefined') {
      window.sandboxInitializers['${sandboxId}']();
      return true;
    }
    return false;
  }
  
  if (!tryInit()) {
    // Wait for CodeSandbox to be available
    const checkInterval = setInterval(() => {
      if (tryInit()) {
        clearInterval(checkInterval);
      }
    }, 100);
    
    // Give up after 5 seconds
    setTimeout(() => clearInterval(checkInterval), 5000);
  }
})();
</script>`;

  return html;
}, {ends: true});

// Register a simpler version without end tag for empty sandboxes
hexo.extend.tag.register('code_sandbox_empty', function(args) {
  // Parse arguments
  const options = {};
  args.forEach(arg => {
    const [key, value] = arg.split('=');
    if (value !== undefined) {
      options[key] = value.replace(/^["']|["']$/g, '');
    } else {
      options[key] = true;
    }
  });

  const label = options.label || 'Code sandbox';
  const collapsed = options.collapsed === 'true' || options.collapsed === true;

  return `
<div class="code-sandbox-wrapper${collapsed ? ' collapsed' : ''}" data-auto-init="true">
  <div class="code-sandbox-content">
    <!-- Empty sandbox -->
  </div>
  
  <div class="code-sandbox-chin">
    <div class="code-sandbox-brand">
      <!-- Light mode logo -->
      <svg class="code-sandbox-logo code-sandbox-logo-light" width="242" height="249" viewBox="0 0 242 249" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M124.64 0C167.003 0 188.185 0.000318576 204.189 8.63574C216.552 15.3064 226.694 25.4477 233.364 37.8105C242 53.8148 242 74.9968 242 117.36V131.64C242 174.003 242 195.185 233.364 211.189C226.694 223.552 216.552 233.694 204.189 240.364C188.185 249 167.003 249 124.64 249H117.36C74.9968 249 53.8148 249 37.8105 240.364C25.4477 233.694 15.3064 223.552 8.63574 211.189C0.000317729 195.185 0 174.003 0 131.64V117.36C0 74.9968 0.000318576 53.8148 8.63574 37.8105C15.3064 25.4477 25.4477 15.3064 37.8105 8.63574C53.8148 0.000318576 74.9968 0 117.36 0H124.64ZM30 136C25.0294 136 21 140.029 21 145V183.357C21.0001 208.013 40.9872 228 65.6426 228C68.6012 228 71 225.601 71 222.643V166C71 149.431 57.5685 136 41 136H30ZM128.791 199.651C124.303 195.82 117.697 195.82 113.209 199.651L98.5615 212.155C92.1999 217.586 96.04 228 104.404 228H137.596C145.96 228 149.8 217.586 143.438 212.155L128.791 199.651ZM201 136C184.431 136 171 149.431 171 166V222.643C171 225.601 173.399 228 176.357 228C201.013 228 221 208.013 221 183.357V145C221 140.029 216.971 136 212 136H201ZM67.4287 21C41.7869 21 21 41.7869 21 67.4287C21.0001 70.5056 23.4944 72.9999 26.5713 73H52C76.8528 73 97 93.1472 97 118V177.506C97 179.533 99.4511 180.549 100.885 179.115C111.994 168.006 130.006 168.006 141.115 179.115C142.549 180.549 145 179.533 145 177.506V118C145 93.1472 165.147 73 190 73H215.429C218.506 72.9999 221 70.5056 221 67.4287C221 41.7869 200.213 21 174.571 21H67.4287Z" fill="currentColor"/>
      </svg>
      <!-- Dark mode logo -->
      <svg class="code-sandbox-logo code-sandbox-logo-dark" width="200" height="207" viewBox="0 0 200 207" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 115C36.5685 115 50 128.431 50 145V201.643C50 204.601 47.6012 207 44.6426 207C19.9872 207 0.000146651 187.013 0 162.357V124C2.96367e-06 119.029 4.02944 115 9 115H20ZM92.209 178.651C96.6967 174.82 103.303 174.82 107.791 178.651L122.438 191.155C128.8 196.586 124.96 207 116.596 207H83.4043C75.04 207 71.1999 196.586 77.5615 191.155L92.209 178.651ZM191 115C195.971 115 200 119.029 200 124V162.357C200 187.013 180.013 207 155.357 207C152.399 207 150 204.601 150 201.643V145C150 128.431 163.431 115 180 115H191ZM153.571 0C179.213 1.12084e-06 200 20.7869 200 46.4287C200 49.5056 197.506 51.9999 194.429 52H169C144.147 52 124 72.1472 124 97V156.506C124 158.533 121.549 159.549 120.115 158.115C109.006 147.006 90.994 147.006 79.8848 158.115C78.4511 159.549 76 158.533 76 156.506V97C76 72.1472 55.8528 52 31 52H5.57129C2.49438 51.9999 7.13985e-05 49.5056 0 46.4287C1.12084e-06 20.7869 20.7869 -1.12084e-06 46.4287 0H153.571Z" fill="currentColor"/>
      </svg>
      <span>${label}</span>
    </div>
    <div class="code-sandbox-toggle${collapsed ? '' : ' active'}" 
         tabindex="0" 
         role="switch" 
         aria-checked="${!collapsed}"></div>
  </div>
</div>`;
});