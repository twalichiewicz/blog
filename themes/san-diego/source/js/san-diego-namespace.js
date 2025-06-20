/**
 * San Diego Theme Namespace
 * Central namespace for all theme functionality to avoid global variable pollution
 */
(function(window) {
  'use strict';

  // Create the main namespace
  window.SD = window.SD || {};

  // Core modules namespace
  SD.core = {
    initialized: false,
    modules: new Map()
  };

  // UI components namespace
  SD.ui = {
    modals: {},
    tabs: {},
    carousels: {},
    animations: {}
  };

  // Utilities namespace
  SD.utils = {
    sound: null,
    navigation: {},
    device: {},
    cookies: {}
  };

  // Content management namespace
  SD.content = {
    blog: {},
    portfolio: {},
    search: {}
  };

  // Event system for module communication
  SD.events = {
    _listeners: new Map(),
    
    on: function(event, callback) {
      if (!this._listeners.has(event)) {
        this._listeners.set(event, []);
      }
      this._listeners.get(event).push(callback);
    },
    
    off: function(event, callback) {
      if (!this._listeners.has(event)) return;
      const listeners = this._listeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    },
    
    emit: function(event, data) {
      if (!this._listeners.has(event)) return;
      this._listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          // Error in event listener - silently continue
        }
      });
    }
  };

  // Module registration system
  SD.registerModule = function(name, module) {
    SD.core.modules.set(name, module);
    SD.events.emit('module:registered', { name, module });
  };

  // Get registered module
  SD.getModule = function(name) {
    return SD.core.modules.get(name);
  };

  // Initialize all registered modules
  SD.init = function() {
    if (SD.core.initialized) {
      return;
    }
    
    // Initialize modules in order
    const initOrder = [
      'device-detection',
      'sound-effects',
      'mobile-tabs',
      'modals',
      'blog',
      'portfolio',
      'navigation',
      'carousels',
      'visual-effects'
    ];

    initOrder.forEach(moduleName => {
      const module = SD.core.modules.get(moduleName);
      if (module && typeof module.init === 'function') {
        try {
          module.init();
          SD.events.emit('module:initialized', { name: moduleName });
        } catch (error) {
          // Failed to initialize module - silently continue
        }
      }
    });

    SD.core.initialized = true;
    SD.events.emit('core:initialized');
  };

  // Legacy compatibility layer
  SD.legacy = {
    // Map old global functions to new namespace
    mapGlobals: function() {
      // Sound effects
      if (SD.utils.sound) {
        window.soundEffects = SD.utils.sound;
        window.initializeSoundEffects = () => SD.utils.sound.init();
        window.playButtonSound = () => SD.utils.sound.playButton();
        window.playSmallClickSound = () => SD.utils.sound.playSmallClick();
        window.playToggleSound = () => SD.utils.sound.playToggle();
        window.playSliderSound = () => SD.utils.sound.playSlider();
      }

      // Modal functions
      if (SD.ui.modals) {
        window.openImpactModal = SD.ui.modals.openImpact;
        window.closeImpactModal = SD.ui.modals.closeImpact;
        window.openContactModal = SD.ui.modals.openContact;
        window.closeContactModal = SD.ui.modals.closeContact;
      }

      // Blog functions
      if (SD.content.blog) {
        window.scrollToFullStory = SD.content.blog.scrollToFullStory;
        window.fetchAndDisplayContent = SD.content.blog.fetchAndDisplayContent;
        window.initializeProjectToggle = SD.content.blog.initializeProjectToggle;
        window.initializePostsOnlyButton = SD.content.blog.initializePostsOnlyButton;
      }

      // Tab functions
      if (SD.ui.tabs) {
        window.mobileTabs = SD.ui.tabs.mobile;
        window.initializeProjectTabs = () => SD.ui.tabs.project && SD.ui.tabs.project.init();
      }

      // Carousel functions
      if (SD.ui.carousels) {
        window.initializeCarousels = SD.ui.carousels.initialize;
        window.cleanupCarouselInstances = SD.ui.carousels.cleanup;
      }

      // Navigation functions
      if (SD.utils.navigation) {
        window.initializeAnchorLinks = () => SD.utils.navigation.initAnchorLinks();
        window.processExternalLinks = () => SD.utils.navigation.processExternalLinks();
      }

      // Project functions
      if (SD.content.portfolio) {
        window.initializeProjectSummary = () => SD.content.portfolio.initSummary();
      }
    }
  };

  // Utility function to check if a module is loaded
  SD.isModuleLoaded = function(name) {
    return SD.core.modules.has(name);
  };

  // Expose SD to global scope
  window.SD = SD;

})(window);