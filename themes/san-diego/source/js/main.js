/**
 * Main JavaScript Entry Point
 * Import and initialize all modules
 */
import { initSectionAnimations, initColumnTitleScrollDetection } from './utils/animations.js';
import { initializeSoundEffects } from './utils/sound-effects.js';
import { initResponsiveTables } from './components/responsive-tables.js';

document.addEventListener('DOMContentLoaded', function () {
	// Initialize sound effects first
	initializeSoundEffects();

	// Initialize color scheme functionality
	// Theme system removed - using prefers-color-scheme only

	// Initialize mobile expandable header
	initMobileExpandableHeader();

	// Initialize animations for sections
	initSectionAnimations({
		sectionSelector: '.section',
		blogPostSelector: '.blog-post',
		portfolioItemSelector: '.portfolio-item'
	});

	// Initialize column title scroll detection
	initColumnTitleScrollDetection({
		postsContentId: 'postsContent',
		projectsContentId: 'projectsContent'
	});
	
	// Initialize responsive table enhancements
	initResponsiveTables();
});

/**
 * Theme system removed - now using prefers-color-scheme media queries only
 */

/**
 * Initialize mobile expandable header functionality
 */
function initMobileExpandableHeader() {
	const expandButton = document.querySelector('.mobile-expand-button');
	const profileHeader = document.querySelector('.profile-header');
	const expandableContent = document.querySelector('.mobile-expandable-content');
	const blogContent = document.querySelector('.blog-content');
	
	if (!expandButton || !profileHeader || !expandableContent) return;
	
	// Add click event listener to the expand button
	expandButton.addEventListener('click', function() {
		const isExpanded = profileHeader.getAttribute('data-expanded') === 'true';
		
		// Toggle expanded state
		profileHeader.setAttribute('data-expanded', !isExpanded);
		expandButton.setAttribute('aria-expanded', !isExpanded);
		
		// Add sliding animation to blog content
		if (!isExpanded && blogContent) {
			blogContent.style.transition = 'transform 0.3s ease';
			blogContent.style.transform = 'translateY(0)';
			// Reset after animation
			setTimeout(() => {
				blogContent.style.transition = '';
				blogContent.style.transform = '';
			}, 300);
		}
		
		// Trigger sound effect if available
		if (window.playButtonSound) {
			window.playButtonSound();
		}
	});
	
	// Close on outside click
	const handleOutsideClick = function(event) {
		const isExpanded = profileHeader.getAttribute('data-expanded') === 'true';
		if (isExpanded && !profileHeader.contains(event.target)) {
			profileHeader.setAttribute('data-expanded', 'false');
			expandButton.setAttribute('aria-expanded', 'false');
		}
	};
	document.addEventListener('click', handleOutsideClick);
	
	// Store handler for cleanup
	profileHeader._outsideClickHandler = handleOutsideClick;
}

// Impact Modal functionality
function openImpactModal(event) {
    if (event) {
        event.stopPropagation();
    }
    const modal = document.getElementById('impact-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add keyboard support
        document.addEventListener('keydown', handleImpactModalKeydown);
        
        // Trigger animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

function closeImpactModal() {
    const modal = document.getElementById('impact-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
        
        // Remove keyboard listener
        document.removeEventListener('keydown', handleImpactModalKeydown);
    }
}

function handleImpactModalKeydown(event) {
    if (event.key === 'Escape') {
        closeImpactModal();
    }
}

// Make functions globally accessible
window.openImpactModal = openImpactModal;
window.closeImpactModal = closeImpactModal;

// Contact Modal functionality
function openContactModal(event) {
    if (event) {
        event.stopPropagation();
    }
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add keyboard support
        document.addEventListener('keydown', handleContactModalKeydown);
        
        // Trigger animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
        
        // Remove keyboard listener
        document.removeEventListener('keydown', handleContactModalKeydown);
    }
}

function handleContactModalKeydown(event) {
    if (event.key === 'Escape') {
        closeContactModal();
    }
}

// Make contact modal functions globally accessible
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;

// Impact Grid Animations
function initImpactGridAnimations() {
    const tiles = document.querySelectorAll('.impact-tile');
    
    if (!tiles.length) return;
    
    // Intersection Observer for tile animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    animateTile(entry.target);
                }, index * 100); // Stagger animations
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    tiles.forEach(tile => observer.observe(tile));
}

function animateTile(tile) {
    const animationType = tile.dataset.animate;
    
    switch (animationType) {
        case 'counter':
            animateCounter(tile);
            break;
        case 'scale':
            animateScale(tile);
            break;
        case 'wave':
            animateWave(tile);
            break;
        case 'stack':
            animateStack(tile);
            break;
        case 'pulse':
            animatePulse(tile);
            break;
        case 'grow':
            animateGrow(tile);
            break;
        case 'extend':
            animateExtend(tile);
            break;
        case 'race':
            animateRace(tile);
            break;
        case 'spark':
            animateSpark(tile);
            break;
        case 'shine':
            animateShine(tile);
            break;
        case 'rotate':
            animateRotate(tile);
            break;
    }
    
    tile.classList.add('animated');
}

function animateCounter(tile) {
    const counter = tile.querySelector('.counter');
    if (!counter) return;
    
    const target = parseFloat(counter.dataset.target);
    const duration = 2000;
    const start = performance.now();
    
    function updateCounter(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = progress * target;
        
        counter.textContent = current.toFixed(current < 10 ? 1 : 0);
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function animateScale(tile) {
    const progressBar = tile.querySelector('.progress-bar');
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = progressBar.dataset.percent + '%';
        }, 300);
    }
}

function animateWave(tile) {
    const donutSegment = tile.querySelector('.donut-segment');
    if (donutSegment) {
        setTimeout(() => {
            donutSegment.style.strokeDasharray = donutSegment.getAttribute('stroke-dasharray');
        }, 300);
    }
}

function animateStack(tile) {
    const stackItems = tile.querySelectorAll('.stack-item');
    stackItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 300 + index * 150);
    });
}

function animatePulse(tile) {
    const rings = tile.querySelectorAll('.ring');
    rings.forEach((ring, index) => {
        setTimeout(() => {
            ring.style.opacity = ring.classList.contains('ring-1') ? '1' : 
                                ring.classList.contains('ring-2') ? '0.7' : '0.4';
            ring.style.animation = 'pulse 2s ease-in-out infinite';
            ring.style.animationDelay = index * 0.2 + 's';
        }, 300 + index * 200);
    });
}

function animateGrow(tile) {
    const stages = tile.querySelectorAll('.growth-stage');
    stages.forEach((stage, index) => {
        setTimeout(() => {
            stage.style.transform = 'scaleY(1)';
        }, 300 + index * 200);
    });
}

function animateExtend(tile) {
    const calendarBar = tile.querySelector('.calendar-bar');
    if (calendarBar) {
        setTimeout(() => {
            calendarBar.style.width = '30%';
            setTimeout(() => {
                const afterElement = calendarBar.querySelector('::after');
                if (afterElement) {
                    afterElement.style.opacity = '1';
                }
            }, 500);
        }, 300);
    }
}

function animateRace(tile) {
    const velocityBars = tile.querySelectorAll('.velocity-bar');
    velocityBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.transform = 'scaleY(1)';
            setTimeout(() => {
                const afterElement = bar.querySelector('::after');
                if (afterElement) {
                    afterElement.style.opacity = '1';
                }
            }, 300);
        }, 300 + index * 300);
    });
}

function animateSpark(tile) {
    const items = tile.querySelectorAll('.innovation-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'scale(1)';
            setTimeout(() => {
                const afterElement = item.querySelector('::after');
                if (afterElement) {
                    afterElement.style.opacity = '1';
                }
            }, 200);
        }, 300 + index * 150);
    });
}

function animateShine(tile) {
    tile.style.animation = 'shine 3s ease-in-out infinite';
}

function animateRotate(tile) {
    const globe = tile.querySelector('.globe-dots');
    if (globe) {
        globe.style.animation = 'rotateGlobe 20s linear infinite';
    }
}

// Text fitting functionality for impact tiles
function fitTextInTiles() {
    const tiles = document.querySelectorAll('.impact-tile');
    const isMobile = window.innerWidth <= 768;
    
    tiles.forEach(tile => {
        const tileInner = tile.querySelector('.tile-inner');
        const containerElement = isMobile && tile.querySelector('.tile-mobile-content') ? 
                               tile.querySelector('.tile-mobile-content') : tileInner;
        
        // Fit tile values
        const tileValue = tile.querySelector('.tile-value');
        if (tileValue && window.getComputedStyle(tileValue).display !== 'none') {
            const heightRatio = isMobile ? 0.5 : 0.6;
            fitTextToContainer(tileValue, containerElement || tile, heightRatio);
        }
        
        // Fit tile labels
        const tileLabel = tile.querySelector('.tile-label');
        if (tileLabel && window.getComputedStyle(tileLabel).display !== 'none') {
            const heightRatio = isMobile ? 0.4 : 0.25;
            fitTextToContainer(tileLabel, containerElement || tile, heightRatio);
        }
    
        // Special handling for chart numbers
        const chartNumber = tile.querySelector('.chart-number');
        if (chartNumber) {
            fitTextToContainer(chartNumber, tile.querySelector('.chart-container'), 0.5);
        }
    });
}

function fitTextToContainer(textElement, container, heightRatio = 0.8) {
    if (!textElement || !container) return;
    
    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const containerPadding = parseInt(window.getComputedStyle(container).paddingLeft) * 2;
    const availableWidth = containerRect.width - containerPadding;
    const availableHeight = containerRect.height * heightRatio;
    
    // Reset to measure natural size
    textElement.style.fontSize = '';
    
    // Get current font size
    let fontSize = parseFloat(window.getComputedStyle(textElement).fontSize);
    const minFontSize = 10; // Minimum readable size
    const maxFontSize = 72; // Maximum size for large tiles
    
    // Binary search for optimal font size
    let low = minFontSize;
    let high = Math.min(maxFontSize, fontSize * 3);
    let optimal = fontSize;
    
    while (high - low > 0.5) {
        const mid = (low + high) / 2;
        textElement.style.fontSize = mid + 'px';
        
        const textRect = textElement.getBoundingClientRect();
        const textWidth = textRect.width;
        const textHeight = textRect.height;
        
        if (textWidth <= availableWidth && textHeight <= availableHeight) {
            optimal = mid;
            low = mid;
        } else {
            high = mid;
        }
    }
    
    // Apply optimal size with slight reduction for safety
    textElement.style.fontSize = (optimal * 0.95) + 'px';
    
    // For mobile, ensure appropriate sizes
    if (window.innerWidth <= 768) {
        const currentSize = parseFloat(textElement.style.fontSize);
        if (textElement.classList.contains('tile-value')) {
            // Cap mobile value font size at 14px
            if (currentSize > 14) {
                textElement.style.fontSize = '14px';
            } else if (currentSize < 12) {
                textElement.style.fontSize = '12px';
            }
        } else if (textElement.classList.contains('tile-label')) {
            // Cap mobile label font size at 9px
            if (currentSize > 9) {
                textElement.style.fontSize = '9px';
            } else if (currentSize < 8) {
                textElement.style.fontSize = '8px';
            }
        }
    }
}

// Refit text on window resize
let resizeTimeout;
const handleWindowResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const modal = document.getElementById('impact-modal');
        if (modal && modal.style.display === 'flex') {
            fitTextInTiles();
        }
    }, 250);
};
window.addEventListener('resize', handleWindowResize);

// Store handler for cleanup
window._impactModalResizeHandler = handleWindowResize;

// Add animations and text fitting to existing modal open function
const originalOpenImpactModal = window.openImpactModal;
window.openImpactModal = function(event) {
    originalOpenImpactModal(event);
    setTimeout(() => {
        initImpactGridAnimations();
        fitTextInTiles();
    }, 300);
};