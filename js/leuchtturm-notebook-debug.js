/**
 * Leuchtturm Notebook Debug and Fix
 * Comprehensive solution to ensure only notebooks are visible
 */

(function() {
    'use strict';
    
    function debugPortfolioState() {
        console.log('=== Leuchtturm Notebook Debug ===');
        
        const portfolioItems = document.querySelectorAll('.portfolio-featured-grid .portfolio-item--featured');
        console.log(`Found ${portfolioItems.length} portfolio items`);
        
        portfolioItems.forEach((item, index) => {
            console.log(`\nItem ${index}:`);
            console.log('- Classes:', item.className);
            console.log('- Children count:', item.children.length);
            console.log('- Has notebook:', !!item.querySelector('.notebook'));
            
            // Log all children
            Array.from(item.children).forEach((child, childIndex) => {
                console.log(`  Child ${childIndex}: ${child.tagName}.${child.className}`);
                if (child.tagName === 'IMG') {
                    console.log(`    IMG src: ${child.src}`);
                }
            });
            
            // Check parent for any images
            const wrapper = item.closest('.portfolio-item-wrapper');
            if (wrapper) {
                const allImages = wrapper.querySelectorAll('img');
                console.log(`- Total images in wrapper: ${allImages.length}`);
                allImages.forEach((img, imgIndex) => {
                    console.log(`  Image ${imgIndex}: ${img.src}, parent: ${img.parentElement.className}`);
                });
            }
        });
    }
    
    function fixNotebooksComprehensive() {
        // Debug first
        debugPortfolioState();
        
        // Find all portfolio items
        const portfolioWrappers = document.querySelectorAll('.portfolio-featured-grid .portfolio-item-wrapper');
        
        portfolioWrappers.forEach(wrapper => {
            const portfolioItem = wrapper.querySelector('.portfolio-item--featured');
            if (!portfolioItem) return;
            
            // Find the notebook
            const notebook = portfolioItem.querySelector('.notebook');
            
            if (notebook) {
                // If notebook exists, hide everything else in the portfolio item
                Array.from(portfolioItem.children).forEach(child => {
                    if (child !== notebook) {
                        child.style.display = 'none';
                        child.style.visibility = 'hidden';
                        child.style.opacity = '0';
                        child.style.position = 'absolute';
                        child.style.left = '-9999px';
                    }
                });
                
                // Ensure notebook is visible
                notebook.style.display = 'block';
                notebook.style.visibility = 'visible';
                notebook.style.opacity = '1';
                notebook.style.position = 'relative';
                notebook.style.left = 'auto';
                
                // Clear any background images on the item and its parents
                portfolioItem.style.backgroundImage = 'none';
                wrapper.style.backgroundImage = 'none';
                
                // Hide all images except those inside paperclip-photo
                const allImages = wrapper.querySelectorAll('img');
                allImages.forEach(img => {
                    if (!img.closest('.paperclip-photo')) {
                        img.style.display = 'none';
                        img.style.visibility = 'hidden';
                        img.style.opacity = '0';
                    }
                });
            } else {
                console.warn('No notebook found in portfolio item:', portfolioItem);
            }
        });
        
        // Monitor for any changes that might show images
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                    const target = mutation.target;
                    
                    // If an image is being shown that shouldn't be
                    if (target.tagName === 'IMG' && !target.closest('.paperclip-photo')) {
                        target.style.display = 'none';
                        target.style.visibility = 'hidden';
                        target.style.opacity = '0';
                    }
                    
                    // If notebook is being hidden
                    if (target.classList.contains('notebook') && 
                        (target.style.display === 'none' || target.style.visibility === 'hidden')) {
                        target.style.display = 'block';
                        target.style.visibility = 'visible';
                        target.style.opacity = '1';
                    }
                }
            });
        });
        
        // Observe all portfolio items
        portfolioWrappers.forEach(wrapper => {
            observer.observe(wrapper, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeFilter: ['style', 'class']
            });
        });
    }
    
    // Run immediately
    fixNotebooksComprehensive();
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixNotebooksComprehensive);
    }
    
    // Run after delays to catch dynamic content
    setTimeout(fixNotebooksComprehensive, 100);
    setTimeout(fixNotebooksComprehensive, 500);
    setTimeout(fixNotebooksComprehensive, 1000);
    
    // Run on hover events
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.portfolio-featured-grid')) {
            requestAnimationFrame(fixNotebooksComprehensive);
        }
    });
    
    // Run on animation frames during hover
    let isHovering = false;
    document.addEventListener('mouseenter', function(e) {
        if (e.target.closest('.portfolio-featured-grid')) {
            isHovering = true;
            function continuousFix() {
                if (isHovering) {
                    fixNotebooksComprehensive();
                    requestAnimationFrame(continuousFix);
                }
            }
            continuousFix();
        }
    }, true);
    
    document.addEventListener('mouseleave', function(e) {
        if (e.target.closest('.portfolio-featured-grid')) {
            isHovering = false;
        }
    }, true);
})();