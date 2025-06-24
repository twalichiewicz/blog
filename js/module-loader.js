/**
 * Module Loader for San Diego Theme
 * Loads all modules and initializes the SD namespace
 */
(function() {
  'use strict';

  // List of modules to load in order
  const modules = [
    '/js/san-diego-namespace.js',
    '/js/modules/sound-effects-module.js',
    '/js/modules/modals-module.js',
    '/js/modules/mobile-tabs-module.js',
    '/js/modules/navigation-module.js',
    '/js/modules/portfolio-module.js',
    '/js/modules/blog-module.js',
    // Add more modules as we create them
    // '/js/modules/carousels-module.js',
    // '/js/modules/device-detection-module.js',
    // '/js/modules/visual-effects-module.js'
  ];

  let loadedCount = 0;

  function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    
    script.onload = function() {
      callback();
    };
    
    script.onerror = function() {
      callback(); // Continue loading other modules
    };
    
    document.head.appendChild(script);
  }

  function loadNextModule() {
    if (loadedCount >= modules.length) {
      // All modules loaded, initialize SD namespace
      initializeSDNamespace();
      return;
    }

    loadScript(modules[loadedCount], function() {
      loadedCount++;
      loadNextModule();
    });
  }

  function initializeSDNamespace() {
    if (window.SD && typeof window.SD.init === 'function') {
      
      // Set up legacy compatibility first
      if (window.SD.legacy && typeof window.SD.legacy.mapGlobals === 'function') {
        window.SD.legacy.mapGlobals();
      }
      
      // Initialize the namespace
      window.SD.init();
      
      // Emit ready event
      if (window.SD.events) {
        window.SD.events.emit('namespace:ready');
      }
    }
  }

  // Start loading modules when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNextModule);
  } else {
    loadNextModule();
  }

})();