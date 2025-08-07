/**
 * External Links Security Enhancement
 * Automatically adds rel="noopener noreferrer" to external links
 * and ensures they open in new tabs for security
 */

(function() {
  'use strict';

  function processExternalLinks() {
    // Get all anchor tags
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // Check if link is external
      if (isExternalLink(href)) {
        // Add target="_blank" if not present
        if (!link.hasAttribute('target')) {
          link.setAttribute('target', '_blank');
        }
        
        // Get current rel attribute values
        const currentRel = link.getAttribute('rel') || '';
        const relValues = currentRel.split(' ').filter(Boolean);
        
        // Add noopener if not present
        if (!relValues.includes('noopener')) {
          relValues.push('noopener');
        }
        
        // Add noreferrer for extra privacy
        if (!relValues.includes('noreferrer')) {
          relValues.push('noreferrer');
        }
        
        // Set the updated rel attribute
        link.setAttribute('rel', relValues.join(' '));
        
        // Add visual indicator for external links (optional)
        if (!link.querySelector('.external-link-icon')) {
          link.classList.add('external-link');
        }
      }
    });
  }

  function isExternalLink(href) {
    if (!href) return false;
    
    // Skip anchors, javascript:, mailto:, tel:, etc.
    if (href.startsWith('#') || 
        href.startsWith('javascript:') || 
        href.startsWith('mailto:') || 
        href.startsWith('tel:') ||
        href.startsWith('data:')) {
      return false;
    }
    
    // Check if absolute URL
    try {
      const url = new URL(href, window.location.href);
      return url.hostname !== window.location.hostname;
    } catch (e) {
      // If URL parsing fails, assume it's internal
      return false;
    }
  }

  // Process links on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processExternalLinks);
  } else {
    processExternalLinks();
  }

  // Process links added dynamically
  const observer = new MutationObserver((mutations) => {
    let shouldProcess = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'A' || node.querySelector?.('a')) {
              shouldProcess = true;
            }
          }
        });
      }
    });
    
    if (shouldProcess) {
      processExternalLinks();
    }
  });

  // Start observing when DOM is ready
  function startObserving() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }
  
  // Check if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserving);
  } else {
    startObserving();
  }

  // Expose function globally for manual processing if needed
  window.processExternalLinks = processExternalLinks;
})();