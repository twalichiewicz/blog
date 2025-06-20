/**
 * Navigation Module for San Diego Theme
 * Handles anchor links, external links, and navigation utilities
 */
(function(SD) {
  'use strict';

  class NavigationModule {
    constructor() {
      this.initialized = false;
      this.anchorLinksInitialized = false;
      this.externalLinksInitialized = false;
    }

    init() {
      if (this.initialized) return;

      this.initAnchorLinks();
      this.processExternalLinks();
      
      this.initialized = true;
      SD.events.emit('navigation:initialized');
    }

    initAnchorLinks() {
      if (this.anchorLinksInitialized) return;

      // Handle all anchor links
      document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;

        const hash = link.getAttribute('href');
        if (hash === '#' || !hash) return;

        event.preventDefault();
        this.handleAnchorClick(hash);
      }, true); // Use capture phase to intercept before other handlers

      // Handle initial page load with hash
      if (window.location.hash) {
        setTimeout(() => {
          this.handleAnchorClick(window.location.hash);
        }, 100);
      }

      this.anchorLinksInitialized = true;
      SD.events.emit('navigation:anchor-links-initialized');
    }

    handleAnchorClick(hash) {
      const elementId = hash.substring(1);
      
      // Special handling for post/project anchors
      if (elementId.startsWith('post-') || elementId.startsWith('project-')) {
        this.handleContentAnchor(elementId);
        return;
      }

      // Regular anchor navigation
      const element = document.getElementById(elementId);
      if (element) {
        this.scrollToElement(element);
      }
    }

    handleContentAnchor(elementId) {
      const targetElement = document.getElementById(elementId);
      if (!targetElement) return;

      // Determine which tab contains the element
      const isInPortfolio = targetElement.closest('#projectsContent');
      const targetTab = isInPortfolio ? 'portfolio' : 'blog';

      // Switch tab if needed
      if (SD.ui.tabs.mobile && SD.ui.tabs.mobile.getActiveTab() !== targetTab) {
        SD.ui.tabs.mobile.switchTab(targetTab, false);
      }

      // Wait for tab switch animation
      setTimeout(() => {
        this.scrollToElement(targetElement);
      }, 300);
    }

    scrollToElement(element) {
      // Use native smooth scrolling
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });

      // Add visual feedback
      element.classList.add('highlight');
      setTimeout(() => {
        element.classList.remove('highlight');
      }, 2000);

      SD.events.emit('navigation:scrolled-to-anchor', { element });
    }

    processExternalLinks() {
      if (this.externalLinksInitialized) return;

      const links = document.querySelectorAll('a[href]');
      const currentHost = window.location.hostname;

      links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        try {
          const url = new URL(href, window.location.origin);
          
          // Check if external
          if (url.hostname && url.hostname !== currentHost) {
            // Add security attributes
            link.setAttribute('rel', 'noopener noreferrer');
            
            // Add visual indicator
            if (!link.classList.contains('no-external-icon')) {
              link.classList.add('external-link');
            }
            
            // Open in new tab (optional)
            if (!link.hasAttribute('target')) {
              link.setAttribute('target', '_blank');
            }
          }
        } catch (e) {
          // Invalid URL, skip
        }
      });

      this.externalLinksInitialized = true;
      SD.events.emit('navigation:external-links-processed');
    }

    // Utility navigation methods
    navigateTo(url, options = {}) {
      const { newTab = false, replace = false } = options;

      if (newTab) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else if (replace) {
        window.location.replace(url);
      } else {
        window.location.href = url;
      }
    }

    reload() {
      window.location.reload();
    }

    goBack() {
      window.history.back();
    }

    goForward() {
      window.history.forward();
    }

    // Get current page info
    getCurrentPage() {
      return {
        url: window.location.href,
        path: window.location.pathname,
        hash: window.location.hash,
        params: new URLSearchParams(window.location.search)
      };
    }

    // Update URL without reload
    updateURL(url, title = '') {
      window.history.pushState({}, title, url);
    }

    // Replace URL without adding to history
    replaceURL(url, title = '') {
      window.history.replaceState({}, title, url);
    }
  }

  // Create and register the module
  const navigationModule = new NavigationModule();
  
  // Register with SD namespace
  SD.utils.navigation = navigationModule;
  SD.registerModule('navigation', navigationModule);

  // Bind methods to maintain context
  SD.utils.navigation.initAnchorLinks = navigationModule.initAnchorLinks.bind(navigationModule);
  SD.utils.navigation.processExternalLinks = navigationModule.processExternalLinks.bind(navigationModule);

})(window.SD || (window.SD = {}));