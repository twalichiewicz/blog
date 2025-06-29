/**
 * Hexo tag plugin for prototype wrapper
 * Provides a consistent wrapper for inline blog prototypes with custom cursor support
 * 
 * Usage:
 * {% prototype_wrapper cursor="interactive" theme="youtube" %}
 *   <!-- Your prototype HTML here -->
 * {% endprototype_wrapper %}
 */

hexo.extend.tag.register('prototype_wrapper', function(args, content) {
  // Parse arguments
  const params = {};
  args.forEach(arg => {
    const [key, value] = arg.split('=');
    if (key && value) {
      params[key.trim()] = value.replace(/['"]/g, '').trim();
    }
  });

  // Default values
  const cursor = params.cursor || 'interactive';
  const theme = params.theme || 'default';
  const background = params.background !== 'false';
  
  // Define cursor styles
  const cursors = {
    'default': 'default',
    'pointer': 'pointer',
    'interactive': `url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4L20 12L12 14L10 20L4 4Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/><circle cx="18" cy="6" r="2.5" fill="%23007AFF" stroke="white" stroke-width="1"/><line x1="16" y1="8" x2="14" y2="10" stroke="%23007AFF" stroke-width="1.5" stroke-linecap="round"/></svg>') 4 4, pointer`,
    'design': `url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4L20 12L12 14L10 20L4 4Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/><rect x="16" y="4" width="4" height="4" fill="%23FF0080" stroke="white" stroke-width="1"/><path d="M15 9L13 11" stroke="%23FF0080" stroke-width="1.5" stroke-linecap="round"/></svg>') 4 4, crosshair`,
    'enterprise': `url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4L20 12L12 14L10 20L4 4Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 4L20 4L20 8" stroke="%234285F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>') 4 4, pointer`
  };
  
  const cursorStyle = cursors[cursor] || cursor;
  
  // Theme-specific styles
  const themeStyles = {
    'youtube': 'background: #0f0f0f;',
    'soundcloud': 'background: #f50;',
    'spotify': 'background: #1db954;',
    'default': 'background: #f5f5f5;'
  };
  
  const themeStyle = themeStyles[theme] || themeStyles.default;
  
  return `
    <div class="prototype-wrapper prototype-wrapper--${theme}" style="position: relative; margin: 32px 0; border-radius: 12px; overflow: hidden; ${themeStyle} cursor: ${cursorStyle};">
      ${background ? `
        <div class="prototype-background" style="position: absolute; inset: 0; pointer-events: none; z-index: 0;">
          <div style="position: absolute; inset: 0; background-image: repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0, 0, 0, 0.02) 50px, rgba(0, 0, 0, 0.02) 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0, 0, 0, 0.02) 50px, rgba(0, 0, 0, 0.02) 51px); background-size: 51px 51px;"></div>
        </div>
      ` : ''}
      <div class="prototype-content" style="position: relative; z-index: 1;">
        ${hexo.render.renderSync({text: content, engine: 'markdown'})}
      </div>
      <style>
        .prototype-wrapper--${theme} * {
          cursor: inherit !important;
        }
      </style>
    </div>
  `;
}, {ends: true});

/**
 * Simple prototype tag for quick inline prototypes
 * 
 * Usage:
 * {% prototype "interactive" %}
 *   <!-- Your prototype HTML here -->
 * {% endprototype %}
 */
hexo.extend.tag.register('prototype', function(args, content) {
  const cursor = args[0] || 'interactive';
  
  return this.prototype_wrapper([`cursor=${cursor}`], content);
}, {ends: true});