/**
 * Profile Header Compact Mode
 * Makes the profile header compact on mobile when viewing dynamic content
 */

(function() {
    'use strict';
    
    let profileHeader = null;
    let isCompact = false;
    let expandTimeout = null;
    
    // Initialize compact header functionality
    function initCompactHeader() {
        profileHeader = document.querySelector('.profile-header');
        if (!profileHeader) return;
        
        // Check if we're on mobile
        if (!isMobile()) return;
        
        // Set up observer for dynamic content
        observeDynamicContent();
        
        // Set up tap handler
        setupTapHandler();
        
        // Check initial state
        checkDynamicContentState();
    }
    
    // Check if we're on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Observe when dynamic content is added/removed
    function observeDynamicContent() {
        const blogContent = document.querySelector('.blog-content');
        if (!blogContent) return;
        
        // Watch for class changes on blog-content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    checkDynamicContentState();
                }
            });
        });
        
        observer.observe(blogContent, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        // Also listen for custom events
        document.addEventListener('dynamic-content-loaded', () => {
            makeCompact();
        });
        
        document.addEventListener('dynamic-content-unloaded', () => {
            makeNormal();
        });
    }
    
    // Check if dynamic content is active
    function checkDynamicContentState() {
        const blogContent = document.querySelector('.blog-content');
        if (!blogContent) return;
        
        const hasDynamicContent = blogContent.classList.contains('has-dynamic-content');
        const hasBackButton = blogContent.querySelector('.dynamic-back-button');
        
        if (hasDynamicContent || hasBackButton) {
            makeCompact();
        } else {
            makeNormal();
        }
    }
    
    // Make header compact
    function makeCompact() {
        if (!profileHeader || !isMobile() || isCompact) return;
        
        document.body.classList.add('has-dynamic-content-active');
        profileHeader.classList.add('compact');
        isCompact = true;
    }
    
    // Make header normal
    function makeNormal() {
        if (!profileHeader || !isCompact) return;
        
        document.body.classList.remove('has-dynamic-content-active');
        profileHeader.classList.remove('compact', 'expanded');
        isCompact = false;
        
        // Clear any pending timeout
        if (expandTimeout) {
            clearTimeout(expandTimeout);
            expandTimeout = null;
        }
    }
    
    // Set up tap handler for temporary expansion
    function setupTapHandler() {
        if (!profileHeader) return;
        
        profileHeader.addEventListener('click', (e) => {
            // Only handle clicks when compact and on mobile
            if (!isCompact || !isMobile()) return;
            
            // Don't handle clicks on buttons or links
            if (e.target.closest('button, a')) return;
            
            toggleExpanded();
        });
        
        // Also handle touch for better mobile experience
        profileHeader.addEventListener('touchend', (e) => {
            // Only handle touches when compact and on mobile
            if (!isCompact || !isMobile()) return;
            
            // Don't handle touches on buttons or links
            if (e.target.closest('button, a')) return;
            
            // Prevent click event from also firing
            e.preventDefault();
            toggleExpanded();
        });
    }
    
    // Toggle expanded state
    function toggleExpanded() {
        if (!profileHeader) return;
        
        const isExpanded = profileHeader.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse immediately
            profileHeader.classList.remove('expanded');
            
            // Clear timeout
            if (expandTimeout) {
                clearTimeout(expandTimeout);
                expandTimeout = null;
            }
        } else {
            // Expand
            profileHeader.classList.add('expanded');
            
            // Auto-collapse after 5 seconds
            expandTimeout = setTimeout(() => {
                profileHeader.classList.remove('expanded');
                expandTimeout = null;
            }, 5000);
        }
    }
    
    // Handle resize events
    function handleResize() {
        if (!isMobile()) {
            // If switched to desktop, ensure normal state
            makeNormal();
        } else if (isCompact) {
            // If still mobile and should be compact, ensure compact
            checkDynamicContentState();
        }
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCompactHeader);
    } else {
        initCompactHeader();
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // Expose functions for manual control if needed
    window.profileHeaderCompact = {
        makeCompact,
        makeNormal,
        toggleExpanded
    };
})();