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
      <svg width="254" height="262" viewBox="0 0 254 262" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M164 0C213.706 1.35296e-06 254 40.2944 254 90V172C254 221.706 213.706 262 164 262H90C40.2944 262 1.67529e-06 221.706 0 172V90C1.67529e-06 40.2944 40.2944 1.35296e-06 90 0H164ZM36 142C31.0294 142 27 146.029 27 151V189.357C27.0001 214.013 46.9872 234 71.6426 234C74.6012 234 77 231.601 77 228.643V172C77 155.431 63.5685 142 47 142H36ZM134.791 205.651C130.303 201.82 123.697 201.82 119.209 205.651L104.562 218.155C98.1999 223.586 102.04 234 110.404 234H143.596C151.96 234 155.8 223.586 149.438 218.155L134.791 205.651ZM207 142C190.431 142 177 155.431 177 172V228.643C177 231.601 179.399 234 182.357 234C207.013 234 227 214.013 227 189.357V151C227 146.029 222.971 142 218 142H207ZM73.4287 27C47.7869 27 27 47.7869 27 73.4287C27.0001 76.5056 29.4944 78.9999 32.5713 79H58C82.8528 79 103 99.1472 103 124V180.506C103 182.533 105.451 183.549 106.885 182.115C117.994 171.006 136.006 171.006 147.115 182.115C148.549 183.549 151 182.533 151 180.506V124C151 99.1472 171.147 79 196 79H221.429C224.506 78.9999 227 76.5056 227 73.4287C227 47.7869 206.213 27 180.571 27H73.4287Z" fill="currentColor"/>
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
      <svg width="254" height="262" viewBox="0 0 254 262" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M164 0C213.706 1.35296e-06 254 40.2944 254 90V172C254 221.706 213.706 262 164 262H90C40.2944 262 1.67529e-06 221.706 0 172V90C1.67529e-06 40.2944 40.2944 1.35296e-06 90 0H164ZM36 142C31.0294 142 27 146.029 27 151V189.357C27.0001 214.013 46.9872 234 71.6426 234C74.6012 234 77 231.601 77 228.643V172C77 155.431 63.5685 142 47 142H36ZM134.791 205.651C130.303 201.82 123.697 201.82 119.209 205.651L104.562 218.155C98.1999 223.586 102.04 234 110.404 234H143.596C151.96 234 155.8 223.586 149.438 218.155L134.791 205.651ZM207 142C190.431 142 177 155.431 177 172V228.643C177 231.601 179.399 234 182.357 234C207.013 234 227 214.013 227 189.357V151C227 146.029 222.971 142 218 142H207ZM73.4287 27C47.7869 27 27 47.7869 27 73.4287C27.0001 76.5056 29.4944 78.9999 32.5713 79H58C82.8528 79 103 99.1472 103 124V180.506C103 182.533 105.451 183.549 106.885 182.115C117.994 171.006 136.006 171.006 147.115 182.115C148.549 183.549 151 182.533 151 180.506V124C151 99.1472 171.147 79 196 79H221.429C224.506 78.9999 227 76.5056 227 73.4287C227 47.7869 206.213 27 180.571 27H73.4287Z" fill="currentColor"/>
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