/**
 * Leuchtturm Notebook Fix
 * Ensures only notebooks are visible, no cover images
 */

(function() {
    'use strict';
    
    function fixNotebooks() {
        // Find all portfolio featured items
        const portfolioItems = document.querySelectorAll('.portfolio-featured-grid .portfolio-item--featured');
        
        portfolioItems.forEach(item => {
            // Hide all direct children except notebooks
            const children = item.children;
            for (let child of children) {
                if (!child.classList.contains('notebook')) {
                    child.style.display = 'none';
                    child.style.visibility = 'hidden';
                    child.style.opacity = '0';
                }
            }
            
            // Ensure notebook is visible
            const notebook = item.querySelector('.notebook');
            if (notebook) {
                notebook.style.display = 'block';
                notebook.style.visibility = 'visible';
                notebook.style.opacity = '1';
            }
            
            // Remove any background images
            item.style.backgroundImage = 'none';
            item.parentElement.style.backgroundImage = 'none';
        });
        
        // Also hide any stray images
        const images = document.querySelectorAll('.portfolio-featured-grid img:not(.paperclip-photo img)');
        images.forEach(img => {
            img.style.display = 'none';
            img.style.visibility = 'hidden';
            img.style.opacity = '0';
        });
    }
    
    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixNotebooks);
    } else {
        fixNotebooks();
    }
    
    // Run again after a delay to catch any dynamically loaded content
    setTimeout(fixNotebooks, 100);
    setTimeout(fixNotebooks, 500);
    
    // Also run on hover to prevent any hover effects from showing images
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.portfolio-featured-grid')) {
            fixNotebooks();
        }
    });
})();