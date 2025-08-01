// Byline Modal System
// Handles truncation and modal display for long project bylines

(function() {
    'use strict';

    // Initialize byline modal system
    function initBylineModal() {
        checkBylineTruncation();
        setupModalEventListeners();
    }

    // Check if byline needs truncation
    function checkBylineTruncation() {
        const bylines = document.querySelectorAll('.project-byline');
        
        bylines.forEach(byline => {
            if (byline.querySelector('.byline-more-button')) return; // Already processed
            
            // Create a temporary element to measure the full height
            const tempElement = byline.cloneNode(true);
            tempElement.style.cssText = `
                position: absolute;
                top: -9999px;
                left: -9999px;
                width: ${byline.offsetWidth}px;
                max-width: 450px;
                visibility: hidden;
                display: block;
                -webkit-line-clamp: unset;
                -webkit-box-orient: unset;
                overflow: visible;
                text-overflow: unset;
            `;
            document.body.appendChild(tempElement);
            
            const fullHeight = tempElement.offsetHeight;
            document.body.removeChild(tempElement);
            
            // Apply truncation and measure truncated height
            byline.classList.add('truncated');
            const truncatedHeight = byline.offsetHeight;
            
            // If the full content is taller than truncated, add more button
            if (fullHeight > truncatedHeight + 10) { // 10px tolerance
                addMoreButton(byline);
            } else {
                byline.classList.remove('truncated');
            }
        });
    }

    // Add "more" button to truncated byline
    function addMoreButton(byline) {
        // Store the full text
        const fullText = byline.textContent || byline.innerText;
        byline.setAttribute('data-full-text', fullText);
        
        // Create a temporary element to find the truncation point
        const tempElement = byline.cloneNode(true);
        tempElement.style.cssText = byline.style.cssText;
        tempElement.style.position = 'absolute';
        tempElement.style.visibility = 'hidden';
        tempElement.style.width = byline.offsetWidth + 'px';
        tempElement.classList.add('truncated');
        byline.parentNode.appendChild(tempElement);
        
        // Binary search to find the last visible character
        let low = 0;
        let high = fullText.length;
        let bestFit = 0;
        
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            tempElement.textContent = fullText.substring(0, mid) + '...';
            
            if (tempElement.scrollHeight <= byline.offsetHeight) {
                bestFit = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        
        // Find the last complete word before truncation
        let truncateAt = bestFit;
        while (truncateAt > 0 && fullText[truncateAt] !== ' ') {
            truncateAt--;
        }
        
        // Account for the space needed by the "more" button
        const moreButtonText = ' more';
        truncateAt = Math.max(0, truncateAt - moreButtonText.length - 5); // Extra space for ellipsis
        
        // Find the previous word boundary
        while (truncateAt > 0 && fullText[truncateAt] !== ' ') {
            truncateAt--;
        }
        
        // Remove temp element
        tempElement.remove();
        
        // Create the truncated content with ellipsis
        const truncatedText = fullText.substring(0, truncateAt).trim();
        
        // Create the more button
        const moreButton = document.createElement('button');
        moreButton.className = 'byline-more-button';
        moreButton.textContent = 'more';
        moreButton.setAttribute('aria-label', 'Show full project description');
        
        moreButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Play sound effect if available
            if (window.soundEffects && window.soundEffects.playSound) {
                window.soundEffects.playSound('small-click');
            }
            
            showBylineModal(byline);
        });
        
        // Update the byline content
        byline.innerHTML = '';
        byline.appendChild(document.createTextNode(truncatedText + '... '));
        byline.appendChild(moreButton);
    }

    // Show byline modal
    function showBylineModal(byline) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.byline-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Get the full byline text from data attribute
        const fullText = byline.getAttribute('data-full-text') || byline.textContent || byline.innerText;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'byline-modal';
        modal.innerHTML = `
            <div class="byline-modal-content">
                <button class="modal-close-button" aria-label="Close modal">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
                <p class="modal-byline-text">${fullText}</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Trigger animation
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
        
        // Setup close functionality
        setupModalClose(modal);
    }

    // Setup modal close functionality
    function setupModalClose(modal) {
        const closeButton = modal.querySelector('.modal-close-button');
        
        function closeModal() {
            // Play sound effect if available
            if (window.soundEffects && window.soundEffects.playSound) {
                window.soundEffects.playSound('small-click');
            }
            
            modal.classList.remove('active');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
        
        // Close button click
        closeButton.addEventListener('click', closeModal);
        
        // Click outside modal
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Escape key
        function handleKeydown(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        }
        document.addEventListener('keydown', handleKeydown);
    }

    // Setup global modal event listeners
    function setupModalEventListeners() {
        // Re-check truncation on window resize
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Remove existing more buttons
                const moreButtons = document.querySelectorAll('.byline-more-button');
                moreButtons.forEach(button => button.remove());
                
                // Remove truncation class and re-check
                const bylines = document.querySelectorAll('.project-byline');
                bylines.forEach(byline => byline.classList.remove('truncated'));
                
                checkBylineTruncation();
            }, 250);
        });
    }

    // Export for global use
    window.bylineModal = {
        init: initBylineModal,
        checkTruncation: checkBylineTruncation
    };

    // Initialize on DOM ready and dynamic content load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBylineModal);
    } else {
        initBylineModal();
    }

    // Re-initialize on dynamic content load
    document.addEventListener('contentLoaded', initBylineModal);

})();