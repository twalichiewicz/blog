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
      <svg width="288" height="273" viewBox="0 0 288 273" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M192 0C245.019 0 288 42.9807 288 96V177C288 230.019 245.019 273 192 273H96C42.9807 273 1.3048e-06 230.019 0 177V96C0 42.9807 42.9807 1.54624e-06 96 0H192ZM75 45C58.4315 45 45 58.4315 45 75V198C45 214.569 58.4315 228 75 228C91.5685 228 105 214.569 105 198V75C105 58.4315 91.5685 45 75 45ZM144 105C127.431 105 114 118.431 114 135V198C114 214.569 127.431 228 144 228C160.569 228 174 214.569 174 198V135C174 118.431 160.569 105 144 105ZM213 45C196.431 45 183 58.4315 183 75V198C183 214.569 196.431 228 213 228C229.569 228 243 214.569 243 198V75C243 58.4315 229.569 45 213 45Z" fill="currentColor"/>
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
      <svg width="288" height="273" viewBox="0 0 288 273" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M192 0C245.019 0 288 42.9807 288 96V177C288 230.019 245.019 273 192 273H96C42.9807 273 1.3048e-06 230.019 0 177V96C0 42.9807 42.9807 1.54624e-06 96 0H192ZM75 45C58.4315 45 45 58.4315 45 75V198C45 214.569 58.4315 228 75 228C91.5685 228 105 214.569 105 198V75C105 58.4315 91.5685 45 75 45ZM144 105C127.431 105 114 118.431 114 135V198C114 214.569 127.431 228 144 228C160.569 228 174 214.569 174 198V135C174 118.431 160.569 105 144 105ZM213 45C196.431 45 183 58.4315 183 75V198C183 214.569 196.431 228 213 228C229.569 228 243 214.569 243 198V75C243 58.4315 229.569 45 213 45Z" fill="currentColor"/>
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