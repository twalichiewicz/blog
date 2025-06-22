/**
 * Screen Wipe Transition
 * Handles smooth transitions when loading dynamic content
 */

(function() {
    'use strict';
    
    let transitionElement = null;
    let isTransitioning = false;
    
    // Create transition element
    function createTransitionElement() {
        if (transitionElement) return transitionElement;
        
        transitionElement = document.createElement('div');
        transitionElement.className = 'screen-wipe-transition';
        transitionElement.innerHTML = `
            <div class="loading-symbol">
                <div class="spinner"></div>
            </div>
        `;
        
        document.body.appendChild(transitionElement);
        return transitionElement;
    }
    
    // Start transition
    async function startTransition() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        const element = createTransitionElement();
        const blogContent = document.querySelector('.blog-content');
        
        // Get blog-content position and dimensions
        if (blogContent) {
            const rect = blogContent.getBoundingClientRect();
            
            // Use viewport-relative coordinates for fixed positioning
            element.style.setProperty('--blog-top', rect.top + 'px');
            element.style.setProperty('--blog-left', rect.left + 'px');
            element.style.setProperty('--blog-width', rect.width + 'px');
            element.style.setProperty('--blog-height', rect.height + 'px');
            blogContent.classList.add('transitioning');
        }
        
        // Force reflow
        element.offsetHeight;
        
        // Start wipe animation
        element.classList.add('active');
        element.classList.remove('reverse');
        
        // Wait for panels to close
        await new Promise(resolve => setTimeout(resolve, 600));
        
        return {
            element,
            blogContent
        };
    }
    
    // End transition
    async function endTransition(transitionData) {
        if (!transitionData || !isTransitioning) return;
        
        const { element, blogContent } = transitionData;
        
        // Hide loading symbol and start reverse wipe
        element.classList.remove('active');
        element.classList.add('reverse');
        
        // Mark content as ready
        if (blogContent) {
            blogContent.classList.add('content-ready');
        }
        
        // Wait for reverse animation
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Cleanup
        element.classList.remove('reverse');
        if (blogContent) {
            blogContent.classList.remove('transitioning', 'content-ready');
        }
        
        isTransitioning = false;
    }
    
    // Quick transition (for faster loads)
    async function quickTransition() {
        const element = createTransitionElement();
        const blogContent = document.querySelector('.blog-content');
        
        // Get blog-content position and dimensions
        if (blogContent) {
            const rect = blogContent.getBoundingClientRect();
            
            // Use viewport-relative coordinates for fixed positioning
            element.style.setProperty('--blog-top', rect.top + 'px');
            element.style.setProperty('--blog-left', rect.left + 'px');
            element.style.setProperty('--blog-width', rect.width + 'px');
            element.style.setProperty('--blog-height', rect.height + 'px');
        }
        
        // Quick flash effect
        element.classList.add('active');
        await new Promise(resolve => setTimeout(resolve, 200));
        element.classList.remove('active');
        element.classList.add('reverse');
        await new Promise(resolve => setTimeout(resolve, 300));
        element.classList.remove('reverse');
        
        return { element, blogContent };
    }
    
    // Expose API
    window.ScreenWipeTransition = {
        start: startTransition,
        end: endTransition,
        quick: quickTransition,
        isTransitioning: () => isTransitioning
    };
})();