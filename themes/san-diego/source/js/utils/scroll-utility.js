/**
 * Unified Scroll Utility Module
 * Consolidates all scroll-related functionality from scroll.js, blog.js, and anchor-links-simple.js
 */

export const ScrollUtility = {
    // Configuration
    config: {
        smoothBehavior: 'smooth',
        defaultBlock: 'center',
        defaultInline: 'nearest',
        glowDuration: 2000,
        tabSwitchDelay: 300,
        headerOffset: 0
    },

    /**
     * Initialize the scroll utility
     */
    init() {
        // Prevent scroll chaining/bouncing on iOS
        document.body.style.overscrollBehavior = 'none';
        
        // Cache header offset
        this.updateHeaderOffset();
        
        // Initialize anchor link handlers
        this.initAnchorLinks();
        
        // Handle initial page load with hash
        if (window.location.hash) {
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                this.handleInitialHash();
            });
        }
    },

    /**
     * Update cached header offset
     */
    updateHeaderOffset() {
        const header = document.querySelector('nav');
        this.config.headerOffset = header ? header.offsetHeight : 0;
    },

    /**
     * Handle initial page load with hash
     */
    handleInitialHash() {
        const hash = window.location.hash;
        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                this.scrollToElement(target, {
                    behavior: 'smooth',
                    offset: this.config.headerOffset
                });
            }
        }
    },

    /**
     * Initialize anchor link click handlers
     */
    initAnchorLinks() {
        // Store bound function to properly remove it later
        if (this._boundAnchorHandler) {
            document.removeEventListener('click', this._boundAnchorHandler, true);
        }
        this._boundAnchorHandler = this.handleAnchorClick.bind(this);
        document.addEventListener('click', this._boundAnchorHandler, true);
    },

    /**
     * Handle anchor link clicks
     */
    handleAnchorClick(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        
        console.log('[ScrollUtility] Anchor link clicked:', link.getAttribute('href'));
        
        e.preventDefault();
        e.stopPropagation();
        
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (!target) {
            console.warn('[ScrollUtility] Anchor target not found:', targetId);
            return;
        }
        
        console.log('[ScrollUtility] Target found:', target);
        this.scrollToTarget(target);
    },

    /**
     * Scroll to a target element with tab switching support
     */
    scrollToTarget(target) {
        console.log('[ScrollUtility] scrollToTarget called with:', target);
        
        // Check if target is in blog or portfolio content
        const isInBlogContent = target.closest('#postsContent');
        const isInPortfolioContent = target.closest('#projectsContent');
        
        console.log('[ScrollUtility] isInBlogContent:', !!isInBlogContent, 'isInPortfolioContent:', !!isInPortfolioContent);
        
        if (isInBlogContent || isInPortfolioContent) {
            // Switch to the appropriate tab if needed
            const targetTab = isInBlogContent ? 'blog' : 'portfolio';
            const activeTab = document.querySelector('.tab-button.active');
            
            console.log('[ScrollUtility] targetTab:', targetTab, 'activeTab:', activeTab?.getAttribute('data-type'));
            
            if (activeTab && activeTab.getAttribute('data-type') !== targetTab) {
                // Need to switch tabs first
                console.log('[ScrollUtility] Switching tabs first');
                this.switchTabAndScroll(targetTab, target);
            } else {
                // Already on correct tab, just scroll
                console.log('[ScrollUtility] Already on correct tab, scrolling');
                this.scrollToElement(target, { addGlow: true });
            }
        } else {
            // Target is not in tabbed content, scroll directly
            console.log('[ScrollUtility] Target not in tabbed content, scrolling directly');
            this.scrollToElement(target, { addGlow: true });
        }
    },

    /**
     * Switch tab and then scroll to target
     */
    switchTabAndScroll(targetTab, target) {
        if (window.mobileTabs && typeof window.mobileTabs.switchTab === 'function') {
            window.mobileTabs.switchTab(targetTab, true);
            // Wait for tab switch animation, then scroll
            setTimeout(() => {
                this.scrollToElement(target, { addGlow: true });
            }, this.config.tabSwitchDelay);
        } else {
            // Fallback: manually click tab button
            const tabButton = document.querySelector(`.tab-button[data-type="${targetTab}"]`);
            if (tabButton) {
                tabButton.click();
                setTimeout(() => {
                    this.scrollToElement(target, { addGlow: true });
                }, this.config.tabSwitchDelay);
            }
        }
    },

    /**
     * Core scroll function with various options
     * @param {Element} target - The element to scroll to
     * @param {Object} options - Scroll options
     * @param {string} options.behavior - Scroll behavior ('smooth' or 'auto')
     * @param {string} options.block - Vertical alignment ('start', 'center', 'end', 'nearest')
     * @param {string} options.inline - Horizontal alignment ('start', 'center', 'end', 'nearest')
     * @param {number} options.offset - Additional offset from top
     * @param {boolean} options.addGlow - Whether to add glow effect
     * @param {Element} options.container - Specific container to scroll within
     */
    scrollToElement(target, options = {}) {
        if (!target) return;

        const {
            behavior = this.config.smoothBehavior,
            block = this.config.defaultBlock,
            inline = this.config.defaultInline,
            offset = 0,
            addGlow = false,
            container = null
        } = options;

        console.log('[ScrollUtility] scrollToElement called with target:', target, 'options:', options);

        // Add visual feedback if requested
        if (addGlow) {
            target.classList.add('anchor-glow');
            setTimeout(() => {
                target.classList.remove('anchor-glow');
            }, this.config.glowDuration);
        }

        const isMobile = window.innerWidth <= 768;
        console.log('[ScrollUtility] isMobile:', isMobile);
        
        if (isMobile) {
            // On mobile, we need to account for the tabs wrapper and ensure they stay visible
            const tabsWrapper = document.querySelector('.tabs-wrapper');
            const blogHeader = document.querySelector('.blog-header');
            
            // Calculate heights of elements that should remain visible
            const tabsHeight = tabsWrapper ? tabsWrapper.offsetHeight : 0;
            const headerHeight = blogHeader ? blogHeader.offsetHeight : 0;
            
            // Calculate the target position accounting for tabs and header
            const targetRect = target.getBoundingClientRect();
            const absoluteTop = targetRect.top + window.pageYOffset;
            
            // Scroll to position that keeps tabs visible
            // We want the target to appear just below the tabs, accounting for header
            const totalOffset = headerHeight + tabsHeight + 30; // 30px extra padding
            const scrollPosition = Math.max(0, absoluteTop - totalOffset);
            
            window.scrollTo({
                top: scrollPosition,
                behavior
            });
        } else {
            // On desktop, first try the .blog-content container which should be scrollable
            let scrollContainer = container;
            
            if (!scrollContainer) {
                // First check if blog-content should be scrollable
                const blogContent = document.querySelector('.blog-content');
                if (blogContent) {
                    const computedStyle = window.getComputedStyle(blogContent);
                    const hasScrollableContent = blogContent.scrollHeight > blogContent.clientHeight;
                    const hasOverflowScroll = computedStyle.overflowY === 'scroll' || computedStyle.overflowY === 'auto';
                    
                    console.log('[ScrollUtility] blog-content analysis:', {
                        scrollHeight: blogContent.scrollHeight,
                        clientHeight: blogContent.clientHeight,
                        overflowY: computedStyle.overflowY,
                        hasScrollableContent,
                        hasOverflowScroll,
                        windowWidth: window.innerWidth
                    });
                    
                    // Force blog-content to be scrollable if it should be based on screen size
                    if (window.innerWidth > 768 && !hasOverflowScroll) {
                        console.log('[ScrollUtility] Desktop detected but blog-content not scrollable, forcing scroll properties');
                        blogContent.style.overflowY = 'auto';
                        blogContent.style.height = 'calc(100dvh - 12px)';
                        // Recheck after forcing
                        const newHasScrollableContent = blogContent.scrollHeight > blogContent.clientHeight;
                        if (newHasScrollableContent) {
                            scrollContainer = blogContent;
                            console.log('[ScrollUtility] Fixed blog-content to be scrollable');
                        }
                    } else if (hasScrollableContent && hasOverflowScroll) {
                        scrollContainer = blogContent;
                        console.log('[ScrollUtility] Using blog-content as scrollable container');
                    }
                }
                
                // If blog-content isn't working, walk up from target to find any scrollable container
                if (!scrollContainer) {
                    let currentElement = target.parentElement;
                    
                    while (currentElement && currentElement !== document.body) {
                        const computedStyle = window.getComputedStyle(currentElement);
                        const hasScrollableContent = currentElement.scrollHeight > currentElement.clientHeight;
                        const hasOverflowScroll = computedStyle.overflowY === 'scroll' || computedStyle.overflowY === 'auto';
                        
                        console.log('[ScrollUtility] Checking container:', currentElement.className || currentElement.tagName, {
                            scrollHeight: currentElement.scrollHeight,
                            clientHeight: currentElement.clientHeight,
                            overflowY: computedStyle.overflowY,
                            hasScrollableContent,
                            hasOverflowScroll
                        });
                        
                        if (hasScrollableContent && hasOverflowScroll) {
                            scrollContainer = currentElement;
                            console.log('[ScrollUtility] Found scrollable container:', currentElement.className || currentElement.tagName);
                            break;
                        }
                        
                        currentElement = currentElement.parentElement;
                    }
                }
            }
            
            if (scrollContainer) {
                console.log('[ScrollUtility] Using container scroll on:', scrollContainer.className || scrollContainer.tagName);
                
                // Calculate the target position within the scrollable container
                const containerRect = scrollContainer.getBoundingClientRect();
                const targetRect = target.getBoundingClientRect();
                
                console.log('[ScrollUtility] Container rect:', containerRect);
                console.log('[ScrollUtility] Target rect:', targetRect);
                
                // Calculate how much to scroll within the container
                const relativeTop = targetRect.top - containerRect.top;
                const containerScrollTop = scrollContainer.scrollTop;
                
                console.log('[ScrollUtility] relativeTop:', relativeTop, 'containerScrollTop:', containerScrollTop);
                
                // Add some padding so target isn't right at the edge
                const padding = 60; // Increased padding to account for tabs
                const newScrollTop = containerScrollTop + relativeTop - padding;
                
                console.log('[ScrollUtility] Scrolling container to:', newScrollTop);
                
                // Scroll the container instead of the whole page
                scrollContainer.scrollTo({
                    top: Math.max(0, newScrollTop),
                    behavior
                });
            } else {
                console.log('[ScrollUtility] No scrollable container found, using window scroll');
                
                // Fallback to window scrolling
                const targetRect = target.getBoundingClientRect();
                const absoluteTop = targetRect.top + window.pageYOffset;
                
                console.log('[ScrollUtility] Target rect:', targetRect);
                console.log('[ScrollUtility] absoluteTop:', absoluteTop);
                
                // On desktop, we want to scroll to show the target below the tabs
                const tabsWrapper = document.querySelector('.tabs-wrapper');
                const tabsHeight = tabsWrapper ? tabsWrapper.offsetHeight : 0;
                
                console.log('[ScrollUtility] tabsHeight:', tabsHeight);
                
                // Use a reasonable offset that keeps tabs visible but doesn't scroll too far up
                const totalOffset = Math.max(tabsHeight + 60, offset); // 60px padding below tabs
                const scrollPosition = Math.max(0, absoluteTop - totalOffset);
                
                console.log('[ScrollUtility] Scrolling window to:', scrollPosition);
                
                window.scrollTo({
                    top: scrollPosition,
                    behavior
                });
            }
        }
    },

    /**
     * Scroll to a specific ID
     * @param {string} targetId - The ID of the element to scroll to
     * @param {Object} options - Scroll options (same as scrollToElement)
     */
    scrollToId(targetId, options = {}) {
        const target = document.getElementById(targetId);
        if (target) {
            this.scrollToElement(target, options);
        } else {
            console.warn('[ScrollUtility] Element not found with ID:', targetId);
        }
    },

    /**
     * Smooth scroll to top of page
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: this.config.smoothBehavior
        });
    },

    /**
     * Get current scroll position
     */
    getScrollPosition() {
        return {
            x: window.pageXOffset || document.documentElement.scrollLeft,
            y: window.pageYOffset || document.documentElement.scrollTop
        };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
        );
    }
};

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ScrollUtility.init());
} else {
    ScrollUtility.init();
}

// Export for use in other modules
export default ScrollUtility;