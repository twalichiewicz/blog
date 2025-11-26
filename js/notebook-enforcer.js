/**
 * Notebook Enforcer
 * Ensures ONLY notebooks are visible, prevents any dynamic content injection
 */

(function() {
    'use strict';
    
    // Configuration
    const ENFORCE_INTERVAL = 100; // Check every 100ms
    let enforceTimer = null;
    
    function enforceNotebookOnly() {
        const portfolioItems = document.querySelectorAll('.portfolio-featured-grid .portfolio-item--featured');
        
        portfolioItems.forEach(item => {
            // Get all direct children
            const children = Array.from(item.children);
            
            children.forEach(child => {
                if (!child.classList.contains('notebook')) {
                    // Force hide any non-notebook element
                    child.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: absolute !important; left: -9999px !important; pointer-events: none !important; z-index: -1 !important;';
                    child.setAttribute('data-hidden-by-enforcer', 'true');
                } else {
                    // Ensure notebook is visible
                    child.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; position: relative !important; z-index: 10 !important; left: auto !important; pointer-events: auto !important;';
                }
            });
            
            // Prevent any background images
            item.style.backgroundImage = 'none';
            if (item.parentElement) {
                item.parentElement.style.backgroundImage = 'none';
            }
        });
    }
    
    // Mutation observer to catch any DOM changes
    const observer = new MutationObserver((mutations) => {
        let needsEnforcement = false;
        
        mutations.forEach(mutation => {
            // Check if portfolio items were modified
            if (mutation.target.closest('.portfolio-featured-grid')) {
                needsEnforcement = true;
            }
            
            // Check for added nodes that aren't notebooks
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && // Element node
                    node.closest('.portfolio-item--featured') &&
                    !node.classList.contains('notebook') &&
                    !node.closest('.notebook')) {
                    needsEnforcement = true;
                }
            });
        });
        
        if (needsEnforcement) {
            // Debounce enforcement
            clearTimeout(enforceTimer);
            enforceTimer = setTimeout(enforceNotebookOnly, 10);
        }
    });
    
    // Start observing
    function startEnforcement() {
        // Initial enforcement
        enforceNotebookOnly();
        
        // Set up observer
        const grid = document.querySelector('.portfolio-featured-grid');
        if (grid) {
            observer.observe(grid, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
        
        // Periodic enforcement as fallback
        setInterval(enforceNotebookOnly, ENFORCE_INTERVAL);
    }
    
    // Override any functions that might add images
    if (window.MutationObserver) {
        const originalObserve = MutationObserver.prototype.observe;
        MutationObserver.prototype.observe = function(target, config) {
            // If observing portfolio grid, enforce our rules
            if (target && target.classList && target.classList.contains('portfolio-featured-grid')) {
                enforceNotebookOnly();
            }
            return originalObserve.call(this, target, config);
        };
    }
    
    // Start enforcement when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startEnforcement);
    } else {
        startEnforcement();
    }
    
    // Also run on window load and after delays
    window.addEventListener('load', enforceNotebookOnly);
    setTimeout(enforceNotebookOnly, 500);
    setTimeout(enforceNotebookOnly, 1000);
    
    // Make enforcement function globally available for debugging
    window.enforceNotebookOnly = enforceNotebookOnly;
})();