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
    
    // Start transition with sequenced animations
    async function startTransition() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        const element = createTransitionElement();
        const blogContent = document.querySelector('.blog-content');
        const blogHeader = document.querySelector('.blog-header');
        
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
        
        // SEQUENCE 1: Start wipe animation (slider effect)
        await new Promise(resolve => {
            requestAnimationFrame(() => {
                // Force reflow
                element.offsetHeight;
                
                // Start wipe animation
                element.classList.add('active');
                element.classList.remove('reverse');
                
                resolve();
            });
        });
        
        // Wait for slider panels to close
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // SEQUENCE 2: Header slide away animation (on mobile project pages)
        if (blogHeader && window.innerWidth <= 768) {
            // Check if this should be a project page (has project elements)
            const hasProjectContent = document.querySelector('.project-edge-wrapper') || 
                                    document.querySelector('.project-wrapper.dynamic-loaded') ||
                                    document.body.classList.contains('project-page');
            
            if (hasProjectContent) {
                blogHeader.classList.add('visible'); // Ensure it's visible first
                blogHeader.classList.remove('hidden');
                
                // Small delay, then animate out
                await new Promise(resolve => setTimeout(resolve, 100));
                
                blogHeader.classList.add('animate-out');
                
                // Wait for header animation
                await new Promise(resolve => setTimeout(resolve, 400));
                
                // Now hide completely
                blogHeader.classList.remove('animate-out', 'visible');
                blogHeader.classList.add('hidden');
            }
        }
        
        return {
            element,
            blogContent,
            blogHeader
        };
    }
    
    // End transition
    async function endTransition(transitionData) {
        if (!transitionData || !isTransitioning) return;
        
        const { element, blogContent, blogHeader } = transitionData;
        
        // SEQUENCE 3: Content fills space and reveals
        if (blogContent) {
            blogContent.classList.add('content-ready');
            blogContent.style.transition = 'height 0.3s ease-out, transform 0.3s ease-out';
            
            // If header was hidden, content should expand to fill the space
            if (blogHeader && blogHeader.classList.contains('hidden') && window.innerWidth <= 768) {
                // Content expands smoothly
                blogContent.style.transform = 'translateY(-64px)'; // Header height compensation
                
                // Wait for content expansion
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Reset transform for final state
                blogContent.style.transform = '';
            }
        }
        
        // Small delay before revealing content
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Start reverse wipe to reveal content
        element.classList.remove('active');
        element.classList.add('reverse');
        
        // Wait for reverse animation
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Cleanup
        element.classList.remove('reverse');
        if (blogContent) {
            blogContent.classList.remove('transitioning', 'content-ready');
            blogContent.style.transition = '';
            blogContent.style.transform = '';
        }
        
        // Remove the transition element from DOM
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
        transitionElement = null;
        
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
    
    // Start transition for back navigation (no loading spinner)
    async function startBackTransition(onPanelsClosed) {
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
        
        // Hide the loading spinner for back navigation
        const loadingSymbol = element.querySelector('.loading-symbol');
        if (loadingSymbol) {
            loadingSymbol.style.display = 'none';
        }
        
        // Force reflow
        element.offsetHeight;
        
        // Start wipe animation
        element.classList.add('active');
        element.classList.remove('reverse');
        
        // Call callback when panels are fully closed (300ms is half of 600ms transition)
        if (onPanelsClosed) {
            setTimeout(onPanelsClosed, 300);
        }
        
        // Wait for panels to fully close
        await new Promise(resolve => setTimeout(resolve, 600));
        
        return {
            element,
            blogContent
        };
    }
    
    // Expose API
    window.ScreenWipeTransition = {
        start: startTransition,
        startBack: startBackTransition,
        end: endTransition,
        quick: quickTransition,
        isTransitioning: () => isTransitioning
    };
})();