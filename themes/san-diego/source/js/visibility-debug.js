/**
 * Visibility Debug Helper
 * This script helps diagnose and fix visibility issues when navigating back
 */

(function() {
    'use strict';
    
    // Check visibility status periodically
    function checkVisibility() {
        const body = document.body;
        const blogContent = document.querySelector('.blog-content');
        const overlay = document.querySelector('.page-transition-overlay');
        
        // If body is invisible but should be visible
        if (body && (body.style.opacity === '0' || getComputedStyle(body).opacity === '0')) {
            console.warn('Body is invisible, fixing...');
            body.style.opacity = '1';
            body.classList.add('loaded');
        }
        
        // If blog content is invisible
        if (blogContent && (blogContent.style.opacity === '0' || getComputedStyle(blogContent).opacity === '0')) {
            console.warn('Blog content is invisible, fixing...');
            blogContent.style.opacity = '1';
            
            const innerWrapper = blogContent.querySelector('.content-inner-wrapper');
            if (innerWrapper) {
                innerWrapper.style.opacity = '1';
            }
        }
        
        // If overlay is blocking content
        if (overlay && overlay.style.display !== 'none' && getComputedStyle(overlay).display !== 'none') {
            const shouldHide = body.classList.contains('loaded') || 
                              (performance.now() > 5000); // Hide after 5 seconds regardless
            
            if (shouldHide) {
                console.warn('Overlay is blocking content, hiding...');
                overlay.style.display = 'none';
                overlay.style.opacity = '0';
            }
        }
    }
    
    // Run check on various events
    window.addEventListener('pageshow', function(event) {
        setTimeout(checkVisibility, 100);
        setTimeout(checkVisibility, 500);
    });
    
    window.addEventListener('popstate', function() {
        setTimeout(checkVisibility, 100);
        setTimeout(checkVisibility, 500);
    });
    
    // Also check after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkVisibility);
    } else {
        checkVisibility();
    }
    
    // Final check after everything should be loaded
    window.addEventListener('load', function() {
        setTimeout(checkVisibility, 1000);
    });
    
    // Export for manual debugging
    window.debugVisibility = checkVisibility;
})();