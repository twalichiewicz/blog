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
    // REDIRECT FIX: Clear any problematic navigation state immediately
    if (window.location.pathname === '/' && !window.location.search && !window.location.hash) {
        console.log('[BlogInit] On clean homepage, clearing navigation states');
        
        // Clear session storage
        sessionStorage.removeItem('previousUrl');
        sessionStorage.removeItem('previousTab');
        sessionStorage.removeItem('portfolio-back-navigation');
        
        // Reset history state if problematic
        if (history.state && history.state.path && 
            (history.state.path.includes('YouTube-Timecode-Commentary') || history.state.path.includes('/2025/06/25/'))) {
            history.replaceState({ path: '/', isInitial: true, isDynamic: false }, '', '/');
        }
    }
    
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
    
    // Initialize the default tab state
    if (typeof window.legacyTabSwitch === 'function') {
        // Check URL params first
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        
        if (tabParam === 'portfolio' || tabParam === 'works') {
            window.legacyTabSwitch('portfolio', false);
        } else {
            window.legacyTabSwitch('blog', false);
        }
    }
}