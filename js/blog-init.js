/**
 * Blog initialization - Non-module version
 * This file initializes blog functionality without ES modules
 */


// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBlog);
} else {
    initializeBlog();
}

function initializeBlog() {
    
    // Initialize anchor links if the function exists
    if (typeof window.initializeAnchorLinks === 'function') {
        window.initializeAnchorLinks();
    } else {
        // Try again in a moment
        setTimeout(function() {
            if (typeof window.initializeAnchorLinks === 'function') {
                window.initializeAnchorLinks();
            }
        }, 1000);
    }
}