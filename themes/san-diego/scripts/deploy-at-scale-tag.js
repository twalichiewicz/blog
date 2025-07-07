/**
 * Deploy at Scale Demo Tag
 * Usage: {% deployAtScale %}
 */
'use strict';

hexo.extend.tag.register('deployAtScale', function(args) {
  const id = 'deploy-at-scale-' + Math.random().toString(36).substr(2, 9);
  
  return `
    <div class="deploy-at-scale-demo" id="${id}">
      <div class="demo-controls">
        <div class="zoom-controls">
          <button class="zoom-out" title="Zoom Out">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
              <path d="M5 8h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="zoom-reset" title="Reset Zoom">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" transform="rotate(45 8 8)"/>
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </button>
          <button class="zoom-in" title="Zoom In">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
              <path d="M8 5v6M5 8h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <button class="fullscreen-btn" title="Toggle Fullscreen">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div class="demo-container">
        <!-- Content will be rendered by JavaScript -->
      </div>
    </div>
    
    <script src="/js/deploy-at-scale-demo.js" defer></script>
  `;
});