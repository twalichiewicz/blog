/**
 * Anchor Links Simple - Now delegates to ScrollUtility
 * This file is kept for backward compatibility but uses the centralized scroll utility
 */
(function() {
    'use strict';
    
    // The ScrollUtility already handles anchor links, but we keep this file
    // for backward compatibility with any code that calls window.initializeAnchorLinks
    
    function init() {
        // ScrollUtility already handles anchor links in its init method
        // This function is kept empty for backward compatibility
        // Any code calling window.initializeAnchorLinks will still work
    }
    
    // Make init function globally available for re-initialization
    window.initializeAnchorLinks = init;
    
    // Note: The actual anchor link handling is now done by ScrollUtility
    // which is imported and initialized in scroll.js
})();