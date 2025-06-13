/**
 * Anchor Links functionality - Standalone module
 * Handles smooth scrolling to anchored posts with glow effect
 */

console.log('=== ANCHOR-LINKS.JS LOADED ===');

// Initialize anchor links when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnchorLinks);
} else {
    initializeAnchorLinks();
}

function initializeAnchorLinks() {
    console.log('=== INITIALIZING ANCHOR LINKS (anchor-links.js) ===');
    
    // Function to scroll to an element with glow effect
    function scrollToElementWithGlow(targetId, clickedElement) {
        console.log('=== SCROLL TO ELEMENT (anchor-links.js) ===');
        console.log('Looking for element with ID:', targetId);
        
        const targetElement = document.getElementById(targetId);
        const blogContent = document.querySelector('.blog-content');
        
        if (!targetElement || !blogContent) {
            console.log('Missing element or container');
            console.log('Target element:', targetElement);
            console.log('Blog content:', blogContent);
            return;
        }
        
        // Add glow immediately
        targetElement.classList.add('anchor-glow');
        
        // First check what element is actually scrollable
        const contentWrapper = document.querySelector('.content-wrapper');
        const scrollableElement = contentWrapper || blogContent;
        
        console.log('Scrollable element:', scrollableElement);
        console.log('BlogContent scrollHeight:', blogContent.scrollHeight);
        console.log('BlogContent clientHeight:', blogContent.clientHeight);
        console.log('ContentWrapper scrollHeight:', contentWrapper ? contentWrapper.scrollHeight : 'N/A');
        console.log('ContentWrapper clientHeight:', contentWrapper ? contentWrapper.clientHeight : 'N/A');
        
        // Get positions using getBoundingClientRect
        const targetRect = targetElement.getBoundingClientRect();
        const containerRect = scrollableElement.getBoundingClientRect();
        
        // Calculate relative position
        const relativePosition = targetRect.top - containerRect.top;
        const currentScroll = scrollableElement.scrollTop;
        const itemAbsoluteTop = currentScroll + relativePosition;
        
        // Calculate center position
        const itemHeight = targetElement.offsetHeight;
        const containerHeight = scrollableElement.clientHeight;
        const targetScroll = itemAbsoluteTop - (containerHeight / 2) + (itemHeight / 2);
        
        console.log('Debug info:');
        console.log('- Current scroll:', currentScroll);
        console.log('- Relative position:', relativePosition);
        console.log('- Item absolute top:', itemAbsoluteTop);
        console.log('- Target scroll:', targetScroll);
        console.log('- Distance to scroll:', Math.abs(targetScroll - currentScroll));
        
        // VERY SLOW ANIMATION - 4 seconds fixed
        const startScroll = scrollableElement.scrollTop;
        const distance = targetScroll - startScroll;
        const duration = 1500; // 1.5 seconds for better UX
        const startTime = Date.now();
        
        function doScroll() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Linear scroll - no easing
            const newScroll = startScroll + (distance * progress);
            scrollableElement.scrollTop = newScroll;
            
            // Also log the actual scroll position
            if (elapsed % 500 < 20) { // Log every 500ms
                console.log('Scrolling progress:', progress.toFixed(2), 'Position:', scrollableElement.scrollTop);
            }
            
            if (progress < 1) {
                requestAnimationFrame(doScroll);
            } else {
                console.log('Scroll complete. Final position:', scrollableElement.scrollTop);
            }
        }
        
        requestAnimationFrame(doScroll);
        
        // Remove glow after scroll completes plus a small delay
        setTimeout(() => {
            targetElement.classList.remove('anchor-glow');
        }, duration + 500); // Remove 500ms after scroll completes
    }
    
    // Use event delegation for better handling of dynamic content
    // Use capture phase to ensure we get the event first
    document.addEventListener('click', function(event) {
        console.log('Click detected on:', event.target);
        
        // Find the closest anchor tag
        const link = event.target.closest('a[href^="#"]');
        if (link) {
            console.log('Anchor link found:', link.href);
            event.preventDefault();
            event.stopPropagation(); // Stop other handlers
            const href = link.getAttribute('href');
            const targetId = href.substring(1);
            console.log('Anchor link clicked:', href, 'Target ID:', targetId);
            scrollToElementWithGlow(targetId, link);
            return false; // Extra prevention
        }
    }, true); // Use capture phase
    
    // Make the function globally available
    window.scrollToElementWithGlow = scrollToElementWithGlow;
    
    // Handle anchor on page load
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        // Wait for page to fully load and render
        setTimeout(() => {
            scrollToElementWithGlow(targetId);
        }, 500);
    }
    
    console.log('=== ANCHOR LINKS INITIALIZED ===');
}

// Also make initialization function available globally
window.initializeAnchorLinks = initializeAnchorLinks;