// Simple anchor link handler using scrollIntoView
(function() {
    'use strict';
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Handle clicks on anchor links - use capture phase to get event first
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (!target) {
                return;
            }
            
            // Check if target is in blog or portfolio content
            const isInBlogContent = target.closest('#postsContent');
            const isInPortfolioContent = target.closest('#projectsContent');
            
            if (isInBlogContent || isInPortfolioContent) {
                // Switch to the appropriate tab if needed
                const targetTab = isInBlogContent ? 'blog' : 'portfolio';
                const activeTab = document.querySelector('.tab-button.active');
                
                if (activeTab && activeTab.getAttribute('data-type') !== targetTab) {
                    // Need to switch tabs first
                    if (window.mobileTabs && typeof window.mobileTabs.switchTab === 'function') {
                        window.mobileTabs.switchTab(targetTab, true);
                        // Wait for tab switch animation, then scroll
                        setTimeout(() => scrollToTarget(target), 300);
                    } else {
                        // Fallback: manually click tab button
                        const tabButton = document.querySelector(`.tab-button[data-type="${targetTab}"]`);
                        if (tabButton) {
                            tabButton.click();
                            setTimeout(() => scrollToTarget(target), 300);
                        }
                    }
                } else {
                    // Already on correct tab, just scroll
                    scrollToTarget(target);
                }
            } else {
                // Target is not in tabbed content, scroll directly
                scrollToTarget(target);
            }
        }, true); // Use capture phase
    }
    
    function scrollToTarget(target) {
        // Add visual feedback
        target.classList.add('anchor-glow');
        
        // Use scrollIntoView with appropriate options
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // On mobile, scroll the entire page
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        } else {
            // On desktop, check if we're in a scrollable container
            const blogContent = target.closest('.blog-content');
            
            if (blogContent) {
                // First scroll the container into view if needed
                blogContent.scrollIntoView({
                    behavior: 'auto',
                    block: 'nearest',
                    inline: 'nearest'
                });
                
                // Then scroll the target within the container
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            } else {
                // No special container, use standard scrollIntoView
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }
        }
        
        // Remove visual feedback after animation
        setTimeout(() => {
            target.classList.remove('anchor-glow');
        }, 2000);
    }
    
    // Make init function globally available for re-initialization
    window.initializeAnchorLinks = init;
})();