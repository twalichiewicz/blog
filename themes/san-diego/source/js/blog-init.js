/**
 * Blog initialization - Non-module version
 * This file initializes blog functionality without ES modules
 */

console.log('=== BLOG-INIT.JS LOADED (non-module) ===');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBlog);
} else {
    initializeBlog();
}

function initializeBlog() {
    console.log('=== BLOG INITIALIZED (non-module) ===');
    
    // Initialize anchor links if the function exists
    if (typeof window.initializeAnchorLinks === 'function') {
        console.log('Calling initializeAnchorLinks from blog-init.js');
        window.initializeAnchorLinks();
    } else {
        console.log('initializeAnchorLinks not found, waiting...');
        // Try again in a moment
        setTimeout(function() {
            if (typeof window.initializeAnchorLinks === 'function') {
                console.log('Calling initializeAnchorLinks from blog-init.js (delayed)');
                window.initializeAnchorLinks();
            }
        }, 1000);
    }
}