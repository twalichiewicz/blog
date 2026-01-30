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
        tabSwitchDelay: 1000,
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

        const href = link.getAttribute('href');
        if (!href) {
            return;
        }

        if (href === '#') {
            e.preventDefault();
            return;
        }

        const targetId = href.substring(1);
        const target = document.getElementById(targetId);

        if (!target) {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        this.scrollToTarget(target);
    },

    /**
     * Scroll to a target element with tab switching support
     */
    scrollToTarget(target) {
        
        // Check if target is in blog or portfolio content
        const isInBlogContent = target.closest('#postsContent');
        const isInPortfolioContent = target.closest('#projectsContent');
        
        
        if (isInBlogContent || isInPortfolioContent) {
            // Switch to the appropriate tab if needed
            const targetTab = isInBlogContent ? 'blog' : 'portfolio';
            const activeTab = document.querySelector('.tab-button.active');
            
            
            if (activeTab && activeTab.getAttribute('data-type') !== targetTab) {
                // Need to switch tabs first
                this.switchTabAndScroll(targetTab, target);
            } else {
                // Already on correct tab, just scroll
                this.scrollToElement(target, { addGlow: true });
            }
        } else {
            // Target is not in tabbed content, scroll directly
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


        // Add visual feedback if requested - using search highlight style
        if (addGlow) {
            // Add the highlight class with active state
            target.classList.add('anchor-destination-highlight');
            
            // Use requestAnimationFrame to ensure class is applied before adding active
            requestAnimationFrame(() => {
                target.classList.add('active');
            });
            
            // Remove highlight after the glow duration
            setTimeout(() => {
                // Remove active class to trigger fade out
                target.classList.remove('active');
                
                // Remove highlight class after transition completes
                setTimeout(() => {
                    target.classList.remove('anchor-destination-highlight');
                }, 300); // Match CSS transition duration
            }, this.config.glowDuration);
        }

        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // On mobile, we need to account for the tabs wrapper and ensure they stay visible
            const tabsWrapper = document.querySelector('.tabs-wrapper');
            
            // Get tabs height to ensure they stay visible
            const tabsHeight = tabsWrapper ? tabsWrapper.offsetHeight : 0;
            
            // Calculate the target position accounting for tabs
            const targetRect = target.getBoundingClientRect();
            const absoluteTop = targetRect.top + window.pageYOffset;
            
            // Since tabs-wrapper is position: sticky with top: 0, we just need to account for its height
            // Add generous padding so the target isn't right against the tabs
            const padding = tabsHeight + 40;
            const scrollPosition = Math.max(0, absoluteTop - padding);
            
            window.scrollTo({
                top: scrollPosition,
                behavior
            });
        } else {
            // On desktop, first try the .blog-content container which should be scrollable
            let scrollContainer = container;
            
            if (!scrollContainer) {
                // First check if content-wrapper is scrollable (primary scroll container)
                const contentWrapper = document.querySelector('.content-wrapper');
                if (contentWrapper) {
                    const computedStyle = window.getComputedStyle(contentWrapper);
                    const hasScrollableContent = contentWrapper.scrollHeight > contentWrapper.clientHeight;
                    const hasOverflowScroll = computedStyle.overflowY === 'scroll' || computedStyle.overflowY === 'auto';
                    
                    if (hasScrollableContent && hasOverflowScroll) {
                        scrollContainer = contentWrapper;
                    }
                }
                
                // Fallback to blog-content only if content-wrapper isn't found or scrollable
                if (!scrollContainer) {
                    const blogContent = document.querySelector('.blog-content');
                    if (blogContent) {
                        const computedStyle = window.getComputedStyle(blogContent);
                        const hasScrollableContent = blogContent.scrollHeight > blogContent.clientHeight;
                        const hasOverflowScroll = computedStyle.overflowY === 'scroll' || computedStyle.overflowY === 'auto';
                        
                        if (hasScrollableContent && hasOverflowScroll) {
                            scrollContainer = blogContent;
                        }
                    }
                }
                
                // If blog-content isn't working, walk up from target to find any scrollable container
                if (!scrollContainer) {
                    let currentElement = target.parentElement;
                    
                    while (currentElement && currentElement !== document.body) {
                        const computedStyle = window.getComputedStyle(currentElement);
                        const hasScrollableContent = currentElement.scrollHeight > currentElement.clientHeight;
                        const hasOverflowScroll = computedStyle.overflowY === 'scroll' || computedStyle.overflowY === 'auto';
                        // Checking scrollable container
                        
                        if (hasScrollableContent && hasOverflowScroll) {
                            scrollContainer = currentElement;
                            break;
                        }
                        
                        currentElement = currentElement.parentElement;
                    }
                }
            }
            
            if (scrollContainer) {
                // Calculate the target position within the scrollable container
                const containerRect = scrollContainer.getBoundingClientRect();
                const targetRect = target.getBoundingClientRect();
                
                // Calculate how much to scroll within the container
                const relativeTop = targetRect.top - containerRect.top;
                const containerScrollTop = scrollContainer.scrollTop;
                
                // Get tabs height to ensure they stay visible
                const tabsWrapper = document.querySelector('.tabs-wrapper');
                const tabsHeight = tabsWrapper ? tabsWrapper.offsetHeight : 0;
                
                // Add generous padding to account for tabs
                const padding = tabsHeight + 40;
                const newScrollTop = containerScrollTop + relativeTop - padding;
                
                // Scroll the container instead of the whole page
                scrollContainer.scrollTo({
                    top: Math.max(0, newScrollTop),
                    behavior
                });
            } else {
                
                // Fallback to window scrolling
                const targetRect = target.getBoundingClientRect();
                const absoluteTop = targetRect.top + window.pageYOffset;
                
                
                // On desktop, we want to scroll to show the target below the tabs
                const tabsWrapper = document.querySelector('.tabs-wrapper');
                const tabsHeight = tabsWrapper ? tabsWrapper.offsetHeight : 0;
                
                
                // Use a reasonable offset that keeps tabs visible but doesn't scroll too far up
                const totalOffset = Math.max(tabsHeight + 60, offset); // 60px padding below tabs
                const scrollPosition = Math.max(0, absoluteTop - totalOffset);
                
                
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
