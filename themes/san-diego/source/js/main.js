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
	
	// Check for 404 redirect and show toast
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.get('error') === '404' && !window._404ToastShown) {
		window._404ToastShown = true; // Prevent duplicate toasts
		const path = urlParams.get('path') || 'the requested page';
		
		// Function to show toast when SD namespace is ready
		const showToastWhenReady = () => {
			if (window.SD && window.SD.ui && window.SD.ui.showToast) {
				window.SD.ui.showToast(`<strong>404</strong><br>That page isn't found`, 'info', 5000);
				
				// Clean up URL after showing toast
				urlParams.delete('error');
				urlParams.delete('path');
				const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '') + window.location.hash;
				window.history.replaceState({}, '', newUrl);
			} else {
				// Try again in 100ms if SD namespace not ready
				setTimeout(showToastWhenReady, 100);
			}
		};
		
		// Start trying after a small initial delay
		setTimeout(showToastWhenReady, 300);
	}

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
	document.addEventListener('contentLoaded', initResponsiveTables);
	document.addEventListener('portfolio-loaded', initResponsiveTables);
	
	// Initialize notebook hover sounds
	initNotebookHoverSounds();
});

/**
 * Initialize sound effects for notebook hover on desktop
 */
function initNotebookHoverSounds() {
	let hoverTimeout = null;
	
	function addNotebookHoverSound() {
		const notebooks = document.querySelectorAll('.portfolio-featured-grid .portfolio-item-wrapper');
		notebooks.forEach(notebook => {
			// Remove any existing listeners to prevent duplicates
			notebook.removeEventListener('mouseenter', handleNotebookHover);
			notebook.removeEventListener('mouseleave', handleNotebookLeave);
			notebook.addEventListener('mouseenter', handleNotebookHover);
			notebook.addEventListener('mouseleave', handleNotebookLeave);
		});
	}
	
	function handleNotebookHover() {
		// Only play sound on desktop (not mobile)
		if (window.innerWidth > 768) {
			// Clear any existing timeout
			if (hoverTimeout) {
				clearTimeout(hoverTimeout);
			}
			
			// Animation takes 1.8s, play sound slightly after hover starts
			hoverTimeout = setTimeout(() => {
				// Check if sound system is ready
				if (window.playBookSound) {
					window.playBookSound();
				} else if (window.soundEffects && window.soundEffects.play) {
					// Fallback to direct sound effects call
					window.soundEffects.play('book');
				}
			}, 300); // 300ms delay for optimal timing with animation
		}
	}
	
	function handleNotebookLeave() {
		// Cancel sound if user leaves before it plays
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
			hoverTimeout = null;
		}
	}
	
	// Wait for sound system to be ready
	function initWhenReady() {
		if (window.soundEffects || window.playBookSound) {
			addNotebookHoverSound();
		} else {
			// Try again in a moment
			setTimeout(initWhenReady, 100);
		}
	}
	
	// Initial setup
	initWhenReady();
	
	// Re-add listeners when content is dynamically loaded
	document.addEventListener('contentLoaded', addNotebookHoverSound);
	document.addEventListener('portfolio-loaded', addNotebookHoverSound);
}

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

const mobileActionState = {
	active: false,
	currentType: null,
	isTransitioning: false,
	headerHost: null,
	contentHost: null,
	tabsWrapper: null,
	tabsElement: null,
	contentWrapper: null,
	cachedNodes: {},
	keydownHandler: null
};

function isMobileActionViewport() {
	return window.innerWidth <= 768;
}

function getMobileActionTimings() {
	const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	return {
		transition: reducedMotion ? 0 : 320,
		fade: reducedMotion ? 0 : 280
	};
}

function ensureMobileActionElements() {
	if (!mobileActionState.headerHost || !document.contains(mobileActionState.headerHost)) {
		mobileActionState.headerHost = document.querySelector('.mobile-action-header');
	}
	if (!mobileActionState.contentHost || !document.contains(mobileActionState.contentHost)) {
		mobileActionState.contentHost = document.querySelector('.mobile-action-content');
	}
	if (!mobileActionState.tabsWrapper || !document.contains(mobileActionState.tabsWrapper)) {
		mobileActionState.tabsWrapper = document.querySelector('.tabs-wrapper');
	}
	if (!mobileActionState.tabsElement || !document.contains(mobileActionState.tabsElement)) {
		mobileActionState.tabsElement = document.querySelector('.mobile-tabs');
	}
	if (!mobileActionState.contentWrapper || !document.contains(mobileActionState.contentWrapper)) {
		mobileActionState.contentWrapper = document.querySelector('.content-wrapper');
	}
	return Boolean(
		mobileActionState.headerHost &&
		mobileActionState.contentHost &&
		mobileActionState.tabsWrapper &&
		mobileActionState.contentWrapper
	);
}

function getModalNodes(type) {
	if (mobileActionState.cachedNodes[type]) {
		return mobileActionState.cachedNodes[type];
	}

	const modal = document.getElementById(`${type}-modal`);
	if (!modal) return null;

	const sheet = modal.querySelector(`.${type}-modal-sheet`);
	const header = modal.querySelector(`.${type}-modal-header`);
	if (!sheet || !header) return null;

	const nodes = { modal, sheet, header };
	mobileActionState.cachedNodes[type] = nodes;
	return nodes;
}

function mountMobileActionNodes(type) {
	const nodes = getModalNodes(type);
	if (!nodes) return false;

	const { modal, sheet, header } = nodes;
	if (modal.classList.contains('active')) {
		modal.classList.remove('active');
		modal.style.display = 'none';
		document.body.style.overflow = '';
	}

	if (sheet.parentElement !== mobileActionState.contentHost) {
		mobileActionState.contentHost.appendChild(sheet);
	}
	if (header.parentElement !== mobileActionState.headerHost) {
		mobileActionState.headerHost.appendChild(header);
	}

	mobileActionState.headerHost.dataset.mode = type;
	mobileActionState.contentHost.dataset.mode = type;
	return true;
}

function restoreMobileActionNodes(type) {
	const nodes = getModalNodes(type);
	if (!nodes) return;

	const { modal, sheet, header } = nodes;
	if (sheet.parentElement !== modal) {
		modal.appendChild(sheet);
	}
	if (header.parentElement !== sheet) {
		sheet.insertBefore(header, sheet.firstChild);
	}
}

function showMobileActionHosts() {
	const { headerHost, contentHost } = mobileActionState;
	if (!headerHost || !contentHost) return;

	headerHost.style.display = 'block';
	contentHost.style.display = 'block';
	headerHost.setAttribute('aria-hidden', 'false');
	contentHost.setAttribute('aria-hidden', 'false');

	requestAnimationFrame(() => {
		headerHost.classList.add('is-visible');
		contentHost.classList.add('is-visible');
	});
}

function hideMobileActionHosts(onComplete) {
	const { headerHost, contentHost } = mobileActionState;
	if (!headerHost || !contentHost) {
		if (typeof onComplete === 'function') onComplete();
		return;
	}

	headerHost.classList.remove('is-visible');
	contentHost.classList.remove('is-visible');
	headerHost.setAttribute('aria-hidden', 'true');
	contentHost.setAttribute('aria-hidden', 'true');

	const { fade } = getMobileActionTimings();
	window.setTimeout(() => {
		headerHost.style.display = 'none';
		contentHost.style.display = 'none';
		if (typeof onComplete === 'function') onComplete();
	}, fade);
}

function runImpactInlineEnhancements() {
	const delay = getMobileActionTimings().fade;
	window.setTimeout(() => {
		initImpactGridAnimations();
		fitTextInTiles();
	}, delay);
}

function attachMobileActionKeydown() {
	if (mobileActionState.keydownHandler) return;
	mobileActionState.keydownHandler = (event) => {
		if (event.key === 'Escape') {
			closeMobileAction();
		}
	};
	document.addEventListener('keydown', mobileActionState.keydownHandler);
}

function detachMobileActionKeydown() {
	if (!mobileActionState.keydownHandler) return;
	document.removeEventListener('keydown', mobileActionState.keydownHandler);
	mobileActionState.keydownHandler = null;
}

function openMobileAction(type) {
	if (!isMobileActionViewport()) return false;
	if (!ensureMobileActionElements()) return false;

	if (mobileActionState.isTransitioning) {
		return true;
	}

	if (mobileActionState.active) {
		if (mobileActionState.currentType === type) {
			return true;
		}

		mobileActionState.isTransitioning = true;
		hideMobileActionHosts(() => {
			restoreMobileActionNodes(mobileActionState.currentType);
			const mounted = mountMobileActionNodes(type);
			if (!mounted) {
				mobileActionState.isTransitioning = false;
				return;
			}
			showMobileActionHosts();
			mobileActionState.currentType = type;
			mobileActionState.isTransitioning = false;
			if (type === 'impact') {
				runImpactInlineEnhancements();
			}
		});
		return true;
	}

	mobileActionState.isTransitioning = true;
	if (mobileActionState.tabsElement?.classList.contains('has-slider-element')) {
		mobileActionState.tabsElement.classList.add('is-rolling');
	}
	if (mobileActionState.contentWrapper) {
		mobileActionState.contentWrapper.classList.add('is-fading');
	}

	const { transition } = getMobileActionTimings();
	window.setTimeout(() => {
		if (mobileActionState.tabsElement) {
			mobileActionState.tabsElement.style.display = 'none';
		}
		if (mobileActionState.contentWrapper) {
			mobileActionState.contentWrapper.style.display = 'none';
		}

		const mounted = mountMobileActionNodes(type);
		if (!mounted) {
			if (mobileActionState.tabsElement) {
				mobileActionState.tabsElement.style.display = '';
			}
			mobileActionState.tabsElement?.classList.remove('is-rolling');
			if (mobileActionState.contentWrapper) {
				mobileActionState.contentWrapper.style.display = '';
				mobileActionState.contentWrapper.classList.remove('is-fading');
			}
			mobileActionState.isTransitioning = false;
			return;
		}

		showMobileActionHosts();
		mobileActionState.active = true;
		mobileActionState.currentType = type;
		mobileActionState.isTransitioning = false;
		attachMobileActionKeydown();
		if (type === 'impact') {
			runImpactInlineEnhancements();
		}
	}, transition);

	return true;
}

function closeMobileAction() {
	if (!mobileActionState.active || mobileActionState.isTransitioning) {
		return false;
	}

	mobileActionState.isTransitioning = true;
	hideMobileActionHosts(() => {
		restoreMobileActionNodes(mobileActionState.currentType);
		mobileActionState.currentType = null;
		mobileActionState.active = false;

		if (mobileActionState.tabsElement) {
			mobileActionState.tabsElement.style.display = '';
		}
		if (mobileActionState.contentWrapper) {
			mobileActionState.contentWrapper.style.display = '';
		}

		requestAnimationFrame(() => {
			mobileActionState.tabsElement?.classList.remove('is-rolling');
			if (mobileActionState.contentWrapper) {
				mobileActionState.contentWrapper.classList.remove('is-fading');
			}
			mobileActionState.isTransitioning = false;
		});

		detachMobileActionKeydown();
	});

	return true;
}

// Impact Modal functionality
function openImpactModal(event) {
    if (event) {
        event.stopPropagation();
    }
    
    // Play toggle sound when opening impact report
    if (window.playToggleSound) {
        window.playToggleSound();
    }
    
    if (openMobileAction('impact')) {
        return;
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

        setTimeout(() => {
            initImpactGridAnimations();
            fitTextInTiles();
        }, 300);
    }
}

function closeImpactModal() {
    // Play the same sound as Posts only button (small click)
    if (window.playSmallClickSound) {
        window.playSmallClickSound();
    }
    
    // Stop the party if it's playing
    if (isPartyMode) {
        togglePartyMode();
    }
    
    if (closeMobileAction()) {
        return;
    }

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

// Party mode functionality
let isPartyMode = false;
let audioContext = null;
let audioAnalyser = null;
let audioSource = null;
let animationFrame = null;
let scrollInterval = null;

function togglePartyMode() {
    const audio = document.getElementById('impact-audio');
    const button = document.querySelector('.impact-modal-party-mode');
    const grid = document.querySelector('.impact-grid');
    
    if (!audio || !button) return;
    
    isPartyMode = !isPartyMode;
    
    if (isPartyMode) {
        // Start the party!
        // Set the audio to loop
        audio.loop = true;
        audio.play();
        button.classList.add('playing');
        
        // Initialize audio context for beat detection
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                // Resume context if suspended (required for some browsers)
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
                
                audioAnalyser = audioContext.createAnalyser();
                audioSource = audioContext.createMediaElementSource(audio);
                audioSource.connect(audioAnalyser);
                audioAnalyser.connect(audioContext.destination);
                
                // Configure analyser for better beat detection
                audioAnalyser.fftSize = 2048; // Higher resolution for better frequency analysis
                audioAnalyser.smoothingTimeConstant = 0.8; // Some smoothing to reduce noise
                
            } catch (error) {
            }
        }
        
        // Start beat-synced animations
        startBeatAnimations();
        
        // Add party class to grid for CSS animations
        if (grid) {
            grid.classList.add('party-mode');
        }
        
        // Start auto-scroll with a small delay to ensure DOM is ready
        setTimeout(() => {
            startAutoScroll();
        }, 100);
    } else {
        // Party's over
        audio.pause();
        audio.currentTime = 0;
        button.classList.remove('playing');
        
        // Stop animations
        stopBeatAnimations();
        
        // Stop auto-scroll
        stopAutoScroll();
        
        // Remove party class
        if (grid) {
            grid.classList.remove('party-mode');
        }
    }
}

function startBeatAnimations() {
    if (!audioAnalyser) {
        return;
    }
    
    const bufferLength = audioAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let beatCount = 0;
    const beatInterval = 469; // ~128 BPM (60000/128)
    
    
    // Simple interval-based beat trigger synced to BPM
    const beatTimer = setInterval(() => {
        const tiles = document.querySelectorAll('.impact-tile');
        if (tiles.length === 0) return;
        
        beatCount++;
        
        // Randomly select tiles to pulse
        const tileCount = tiles.length;
        const selectedIndices = new Set();
        
        // Choose pattern type randomly
        const patternType = Math.random();
        
        if (patternType < 0.33) {
            // Pattern 1: Random scattered tiles (20-40% of tiles)
            const pulseTileCount = Math.floor(tileCount * (0.2 + Math.random() * 0.2));
            while (selectedIndices.size < pulseTileCount) {
                selectedIndices.add(Math.floor(Math.random() * tileCount));
            }
        } else if (patternType < 0.66) {
            // Pattern 2: Clustered tiles (pick a center and nearby tiles)
            const centerTile = Math.floor(Math.random() * tileCount);
            const clusterSize = 3 + Math.floor(Math.random() * 5); // 3-7 tiles
            selectedIndices.add(centerTile);
            
            // Add nearby tiles
            for (let i = 0; i < clusterSize && selectedIndices.size < tileCount; i++) {
                const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
                const nearbyIndex = Math.max(0, Math.min(tileCount - 1, centerTile + offset));
                selectedIndices.add(nearbyIndex);
            }
        } else {
            // Pattern 3: Every nth tile for a rhythmic pattern
            const step = 2 + Math.floor(Math.random() * 3); // step by 2, 3, or 4
            const startOffset = Math.floor(Math.random() * step);
            for (let i = startOffset; i < tileCount; i += step) {
                selectedIndices.add(i);
            }
        }
        
        
        // Apply beat-hover to selected tiles with slight random delays
        selectedIndices.forEach(index => {
            const tile = tiles[index];
            const randomDelay = Math.random() * 50; // 0-50ms random delay
            
            setTimeout(() => {
                tile.classList.add('beat-hover');
                setTimeout(() => tile.classList.remove('beat-hover'), 200);
            }, randomDelay);
        });
    }, beatInterval);
    
    // Store timer reference for cleanup
    window.beatTimer = beatTimer;
    
    // Also do continuous volume-based animation
    function animate() {
        animationFrame = requestAnimationFrame(animate);
        
        audioAnalyser.getByteFrequencyData(dataArray);
        
        // Get overall volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength / 255; // Normalize to 0-1
        
        // Apply subtle scaling based on volume
        const tiles = document.querySelectorAll('.impact-tile');
        tiles.forEach((tile, index) => {
            if (!tile.classList.contains('beat-hover')) {
                const offset = index * 0.05;
                const scale = 1 + (average * 0.08 * Math.sin(Date.now() * 0.001 + offset));
                tile.style.transform = `scale(${scale})`;
            }
        });
    }
    
    animate();
}

function stopBeatAnimations() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
    
    // Clear beat timer
    if (window.beatTimer) {
        clearInterval(window.beatTimer);
        window.beatTimer = null;
    }
    
    // Reset all tile transforms
    const tiles = document.querySelectorAll('.impact-tile');
    tiles.forEach(tile => {
        tile.style.transform = '';
        tile.classList.remove('beat-hover');
    });
}

function startAutoScroll() {
    // First try to find the impact-grid element
    const impactGrid = document.querySelector('.impact-grid');
    if (!impactGrid) {
        return;
    }
    
    // Check if it's actually scrollable
    const isScrollable = impactGrid.scrollHeight > impactGrid.clientHeight;
    if (!isScrollable) {
        return;
    }
    
    
    // Smooth scroll animation
    let scrollDirection = 1;
    let scrollSpeed = 1; // pixels per frame (increased from 0.5)
    
    function animateScroll() {
        if (!isPartyMode) {
            stopAutoScroll();
            return;
        }
        
        const currentScroll = impactGrid.scrollTop;
        const maxScroll = impactGrid.scrollHeight - impactGrid.clientHeight;
        
        // Change direction at top or bottom
        if (currentScroll >= maxScroll - 5 && scrollDirection === 1) {
            scrollDirection = -1;
        } else if (currentScroll <= 5 && scrollDirection === -1) {
            scrollDirection = 1;
        }
        
        // Apply scroll
        impactGrid.scrollTop += scrollSpeed * scrollDirection;
        
        // Continue animation
        animationFrame = requestAnimationFrame(animateScroll);
    }
    
    // Start the animation
    animateScroll();
}

function stopAutoScroll() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
}

// Make functions globally accessible
window.openImpactModal = openImpactModal;
window.closeImpactModal = closeImpactModal;
window.togglePartyMode = togglePartyMode;

// Contact Modal functionality
function openContactModal(event) {
    if (event) {
        event.stopPropagation();
    }
    
    // Play toggle sound when opening contact modal (mobile "Get in touch")
    if (window.playToggleSound) {
        window.playToggleSound();
    }
    
    if (openMobileAction('contact')) {
        return;
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
    // Play the same sound as impact modal close (small click)
    if (window.playSmallClickSound) {
        window.playSmallClickSound();
    }

    if (closeMobileAction()) {
        return;
    }

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
            calendarBar.classList.add('is-filled');
        }, 300);
    }
}

function animateRace(tile) {
    const velocityBars = tile.querySelectorAll('.velocity-bar');
    velocityBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.classList.add('is-active');
        }, 300 + index * 300);
    });
}

function animateSpark(tile) {
    const items = tile.querySelectorAll('.innovation-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('is-active');
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
        if (mobileActionState.active && !isMobileActionViewport()) {
            closeMobileAction();
            return;
        }

        const modal = document.getElementById('impact-modal');
        const isInlineImpact = mobileActionState.active && mobileActionState.currentType === 'impact';
        if (isInlineImpact || (modal && modal.style.display === 'flex')) {
            fitTextInTiles();
        }
    }, 250);
};
window.addEventListener('resize', handleWindowResize);

// Store handler for cleanup
window._impactModalResizeHandler = handleWindowResize;

// Impact modal inline view handles animations when opened.
