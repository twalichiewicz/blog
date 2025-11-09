// Project Demo System
// Handles both external demos and dynamic component loading

(function() {
    'use strict';

    // Initialize demo system
    function initProjectDemo() {
        // Check for inline demo container first
        const inlineContainer = document.querySelector('.demo-inline-container');
        if (inlineContainer) {
            const componentName = inlineContainer.getAttribute('data-demo-component');
            if (componentName) {
                loadInlineDemo(componentName, inlineContainer);
                setupInlineDemoControls(inlineContainer);
            }
        }
        
        // Original demo button logic
        const demoButton = document.getElementById('demoBtn');
        if (demoButton) {
            demoButton.style.display = 'inline-flex'; // Show button
            setupDemoButton(demoButton);
        }
    }

    // Demo button functionality
    function setupDemoButton(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Play button sound (same as View impact report)
            if (window.playButtonSound) {
                window.playButtonSound();
            }
            
            const demoUrl = button.getAttribute('data-demo-url');
            const demoComponent = button.getAttribute('data-demo-component');
            
            if (demoUrl) {
                // External demo - open in new window
                window.open(demoUrl, '_blank', 'noopener,noreferrer');
            } else if (demoComponent) {
                // For inline demos, trigger fullscreen and start onboarding
                const inlineContainer = document.querySelector('.demo-inline-container');
                if (inlineContainer) {
                    // Use the same fullscreen function as the fullscreen button
                    toggleFullscreenDemo(inlineContainer);
                    
                    // Trigger walkthrough toolbar when entering fullscreen via Demo button
                    // This shows the toolbar WITH auto-start capability
                    setTimeout(() => {
                        if (window.demoWalkthrough && window.demoWalkthrough.handleFullscreenEntry) {
                            // Show toolbar with auto-start flag since it's from Demo button
                            window.demoWalkthrough.showToolbar(true);
                        }
                    }, 500); // Wait for fullscreen animation to start
                }
            }
        });
    }

    // Removed old modal-based loadDemoComponent function - now using toggleFullscreenDemo instead


    // Load demo inline in the hero section
    function loadInlineDemo(componentName, container) {
        // Preserve the controls
        const controls = container.querySelector('.demo-inline-controls');
        const loading = container.querySelector('.demo-inline-loading');
        
        // Prevent duplicate initialization (e.g., when dynamic content re-runs scripts)
        if (container.dataset.demoInitialized === 'true' && container.querySelector('.demo-iframe-wrapper')) {
            return;
        }

        // Remove any stale wrappers from partial loads before reinitializing
        const existingWrapper = container.querySelector('.demo-iframe-wrapper');
        if (existingWrapper) {
            existingWrapper.remove();
        }

        // Create wrapper div for iframe
        const iframeWrapper = document.createElement('div');
        iframeWrapper.className = 'demo-iframe-wrapper';
        
        // Create iframe for inline demo
        const iframe = document.createElement('iframe');
        // Use relative path that works on all deployment environments
        // For a post at /2021/08/30/Custom-Install/, we need to go up 4 levels
        const pathSegments = window.location.pathname.split('/').filter(s => s);
        const levelsUp = pathSegments.length > 0 ? '../'.repeat(pathSegments.length) : '';
        iframe.src = `${levelsUp}demos/${componentName}/index.html`;
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.title = `${componentName} Demo`;
        iframe.className = 'demo-inline-iframe';
        iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals';
        
        // Add loading handler
        iframe.addEventListener('load', function() {
            container.classList.add('demo-loaded');
            if (loading) loading.style.display = 'none';
        });
        
        // Add error handler
        iframe.addEventListener('error', function() {
            if (loading) {
                loading.innerHTML = `
                    <div class="demo-error">
                        <p>Failed to load demo</p>
                    </div>
                `;
            }
        });
        
        // Add iframe to wrapper, then wrapper to container
        iframeWrapper.appendChild(iframe);
        container.appendChild(iframeWrapper);
        
        // Re-append controls to ensure they stay on top
        if (controls) {
            container.appendChild(controls);
        }
        container.dataset.demoInitialized = 'true';
        
        // Dispatch event for any additional handlers
        const event = new CustomEvent('loadInlineDemoComponent', {
            detail: { name: componentName, container, iframe }
        });
        document.dispatchEvent(event);
    }
    
    // Toggle fullscreen demo animation
    function toggleFullscreenDemo(container) {
        const trailerHero = container.closest('.project-trailer-hero');
        const controls = container.querySelector('.demo-inline-controls');
        
        if (!trailerHero) return;
        
        const isFullscreen = trailerHero.classList.contains('demo-fullscreen');
        
        if (!isFullscreen) {
            // Enter fullscreen
            
            // Check if we're in a dynamically loaded context
            const blogContent = trailerHero.closest('.blog-content.has-dynamic-content');
            if (blogContent) {
                // Store original parent and position for restoration
                trailerHero.dataset.originalParent = trailerHero.parentElement.id || 'original-parent-' + Date.now();
                if (!trailerHero.parentElement.id) {
                    trailerHero.parentElement.id = trailerHero.dataset.originalParent;
                }
                
                // Create placeholder to maintain layout
                const placeholder = document.createElement('div');
                placeholder.id = 'demo-fullscreen-placeholder';
                placeholder.style.height = trailerHero.offsetHeight + 'px';
                trailerHero.parentElement.insertBefore(placeholder, trailerHero);
                
                // Move element to body for true fullscreen
                document.body.appendChild(trailerHero);
            }
            
            trailerHero.classList.add('demo-fullscreen');
            document.body.classList.add('demo-fullscreen-active');
            
            // Re-initialize zoom controls to ensure zoom level persists
            const demoComponent = container.getAttribute('data-demo-component') || 'default';
            const currentZoom = demoZoomLevels.get(demoComponent) || 100;
            
            // Update all zoom displays in fullscreen mode
            setTimeout(() => {
                const trailerHero = container.closest('.project-trailer-hero');
                if (trailerHero) {
                    const zoomDisplays = trailerHero.querySelectorAll('.demo-zoom-level');
                    zoomDisplays.forEach(display => {
                        display.textContent = `${Math.round(currentZoom)}%`;
                    });
                }
                
                // Send current zoom to iframe
                const iframe = container.querySelector('.demo-inline-iframe');
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'setDemoZoom',
                        zoom: currentZoom / 100
                    }, '*');
                }
            }, 100);
            
            // Update controls for fullscreen mode
            if (controls) {
                // Update existing controls
                const controlsRight = controls.querySelector('.demo-controls-right');
                
                // Create left button group
                const leftButtonGroup = document.createElement('div');
                leftButtonGroup.className = 'demo-controls-left';
                leftButtonGroup.style.display = 'flex';
                leftButtonGroup.style.gap = '8px';
                
                // Add Projects button (goes to portfolio page)
                const projectsBtn = document.createElement('a');
                projectsBtn.href = '/?tab=portfolio';
                projectsBtn.className = 'demo-control-button demo-projects-button';
                projectsBtn.setAttribute('aria-label', 'Back to Projects');
                projectsBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
                    </svg>
                    <span>Projects</span>
                `;
                
                // Add Minimize button (exits fullscreen)
                const minimizeBtn = document.createElement('button');
                minimizeBtn.className = 'demo-control-button demo-minimize-button';
                minimizeBtn.setAttribute('aria-label', 'Minimize');
                minimizeBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    <span>Minimize</span>
                `;
                
                // Add buttons to left group
                leftButtonGroup.appendChild(projectsBtn);
                leftButtonGroup.appendChild(minimizeBtn);
                
                // Insert left button group as first child of controls
                controls.insertBefore(leftButtonGroup, controls.firstChild);
                
                // Add exit fullscreen button to the right side
                if (controlsRight) {
                    // Create exit fullscreen button
                    const exitFullscreenBtn = document.createElement('button');
                    exitFullscreenBtn.className = 'demo-control-button demo-exit-fullscreen-button';
                    exitFullscreenBtn.setAttribute('aria-label', 'Exit fullscreen');
                    exitFullscreenBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                        </svg>
                    `;
                    
                    // Add click handler
                    exitFullscreenBtn.addEventListener('click', function() {
                        // Play tiny button sound
                        if (window.playSmallClickSound) {
                            window.playSmallClickSound();
                        }
                        toggleFullscreenDemo(container);
                    });
                    
                    // Append to the right controls after zoom controls
                    controlsRight.appendChild(exitFullscreenBtn);
                }
                
                // Hide the regular fullscreen button in fullscreen mode
                const fullscreenBtn = container.querySelector('.demo-fullscreen-button');
                if (fullscreenBtn) {
                    fullscreenBtn.style.display = 'none';
                }
                
                // Update controls layout for fullscreen
                controls.style.justifyContent = 'space-between';
                
                // Handle minimize button click
                minimizeBtn.addEventListener('click', function() {
                    // Play tiny button sound
                    if (window.playSmallClickSound) {
                        window.playSmallClickSound();
                    }
                    toggleFullscreenDemo(container);
                });
            }
            
            // Play sound effect
            if (window.soundEffects && window.soundEffects.playSound) {
                window.soundEffects.playSound('button-press');
            }
            
        } else {
            // Exit fullscreen
            trailerHero.classList.remove('demo-fullscreen');
            document.body.classList.remove('demo-fullscreen-active');
            
            // Ensure zoom level persists when exiting fullscreen
            const demoComponent = container.getAttribute('data-demo-component') || 'default';
            const currentZoom = demoZoomLevels.get(demoComponent) || 100;
            const zoomLevelDisplay = container.querySelector('.demo-zoom-level');
            if (zoomLevelDisplay) {
                zoomLevelDisplay.textContent = `${Math.round(currentZoom)}%`;
            }
            
            // Send current zoom to iframe
            const iframe = container.querySelector('.demo-inline-iframe');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                    type: 'setDemoZoom',
                    zoom: currentZoom / 100
                }, '*');
            }
            
            // Restore original position if it was moved
            const originalParentId = trailerHero.dataset.originalParent;
            if (originalParentId) {
                const originalParent = document.getElementById(originalParentId);
                const placeholder = document.getElementById('demo-fullscreen-placeholder');
                
                if (originalParent && placeholder) {
                    // Move element back to original position
                    originalParent.insertBefore(trailerHero, placeholder);
                    placeholder.remove();
                }
                
                // Clean up data attribute
                delete trailerHero.dataset.originalParent;
            }
            
            // Remove left button group
            const leftButtonGroup = controls.querySelector('.demo-controls-left');
            if (leftButtonGroup) leftButtonGroup.remove();
            
            // Remove exit fullscreen button
            const exitFullscreenBtn = controls.querySelector('.demo-exit-fullscreen-button');
            if (exitFullscreenBtn) exitFullscreenBtn.remove();
            
            // Restore fullscreen button visibility
            const fullscreenBtn = container.querySelector('.demo-fullscreen-button');
            if (fullscreenBtn) {
                fullscreenBtn.style.display = '';
            }
            
            // Restore controls layout
            if (controls) {
                controls.style.justifyContent = 'flex-end';
            }
            
            // Hide walkthrough toolbar when exiting fullscreen
            if (window.demoWalkthrough && window.demoWalkthrough.handleFullscreenExit) {
                window.demoWalkthrough.handleFullscreenExit();
            }
            
            // Play sound effect
            if (window.soundEffects && window.soundEffects.playSound) {
                window.soundEffects.playSound('small-click');
            }
        }
        
        // Handle escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape' && trailerHero.classList.contains('demo-fullscreen')) {
                toggleFullscreenDemo(container);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        
        if (!isFullscreen) {
            document.addEventListener('keydown', handleEscape);
        }
    }
    
    // Store zoom level globally per demo
    const demoZoomLevels = new Map();
    
    // Global zoom handler that works across all demo instances
    window.demoZoomManager = {
        getZoom: function(demoComponent) {
            return demoZoomLevels.get(demoComponent) || 100;
        },
        setZoom: function(demoComponent, zoom) {
            demoZoomLevels.set(demoComponent, Math.round(zoom));
        }
    };
    
    // Setup inline demo controls
    function setupInlineDemoControls(container) {
        const fullscreenBtn = container.querySelector('.demo-fullscreen-button');
        const zoomInBtn = container.querySelector('.demo-zoom-in');
        const zoomOutBtn = container.querySelector('.demo-zoom-out');
        const zoomLevelDisplay = container.querySelector('.demo-zoom-level');
        
        // Get demo component name for zoom persistence
        const demoComponent = container.getAttribute('data-demo-component') || 'default';
        
        // Check if zoom controls already initialized (avoid re-init on fullscreen toggle)
        if (container.hasAttribute('data-zoom-initialized')) {
            return;
        }
        container.setAttribute('data-zoom-initialized', 'true');
        
        // Fullscreen button handler - animate existing demo instead of modal
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', function() {
                // Play tiny button sound
                if (window.playSmallClickSound) {
                    window.playSmallClickSound();
                }
                toggleFullscreenDemo(container);
                
                // Trigger walkthrough toolbar when entering fullscreen
                // This shows the toolbar without auto-starting the walkthrough
                setTimeout(() => {
                    if (window.demoWalkthrough && window.demoWalkthrough.handleFullscreenEntry) {
                        window.demoWalkthrough.handleFullscreenEntry();
                    }
                }, 500); // Wait for fullscreen animation to start
            });
        }
        
        // Zoom controls - retrieve persisted zoom or default to 100
        let currentZoom = window.demoZoomManager.getZoom(demoComponent);
        const zoomStep = 10;
        const minZoom = 50;
        const maxZoom = 200;
        
        // Initialize display with current zoom
        if (zoomLevelDisplay) {
            zoomLevelDisplay.textContent = `${Math.round(currentZoom)}%`;
        }
        
        const updateZoom = (newZoom) => {
            currentZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
            
            // Persist zoom level
            window.demoZoomManager.setZoom(demoComponent, currentZoom);
            
            // Update all zoom displays for this demo (including in fullscreen)
            const trailerHero = container.closest('.project-trailer-hero');
            const allContainers = trailerHero ? trailerHero.querySelectorAll('.demo-inline-container') : [container];
            allContainers.forEach(cont => {
                const displays = cont.querySelectorAll('.demo-zoom-level');
                displays.forEach(display => {
                    display.textContent = `${currentZoom}%`;
                });
                
                // Send zoom message to iframe in each container
                const iframe = cont.querySelector('.demo-inline-iframe');
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'setDemoZoom',
                        zoom: currentZoom / 100
                    }, '*');
                }
            });
            
            // Play tiny button sound
            if (window.playSmallClickSound) {
                window.playSmallClickSound();
            }
        };
        
        // Apply initial zoom if not 100%
        if (currentZoom !== 100) {
            setTimeout(() => updateZoom(currentZoom), 100);
        }
        
        // Use event delegation for zoom controls to work in fullscreen
        const trailerHero = container.closest('.project-trailer-hero') || container;
        
        if (!trailerHero.hasAttribute('data-zoom-handlers')) {
            trailerHero.setAttribute('data-zoom-handlers', 'true');
            
            trailerHero.addEventListener('click', function(e) {
                const target = e.target.closest('.demo-zoom-in, .demo-zoom-out');
                if (!target) return;
                
                // Get current zoom from persisted value
                const currentZoom = demoZoomLevels.get(demoComponent) || 100;
                
                if (target.classList.contains('demo-zoom-in')) {
                    updateZoom(currentZoom + zoomStep);
                } else if (target.classList.contains('demo-zoom-out')) {
                    updateZoom(currentZoom - zoomStep);
                }
            });
        }
        
        // Keyboard shortcuts for zoom when container is focused
        container.setAttribute('tabindex', '0');
        container.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === '=' || e.key === '+') {
                    e.preventDefault();
                    updateZoom(currentZoom + zoomStep);
                } else if (e.key === '-') {
                    e.preventDefault();
                    updateZoom(currentZoom - zoomStep);
                } else if (e.key === '0') {
                    e.preventDefault();
                    updateZoom(100);
                }
            }
        });
        
        // Return updateZoom function for external use
        container.updateZoom = updateZoom;
    }


    // Export functions for global use
    window.projectDemo = {
        init: initProjectDemo,
        toggleFullscreen: toggleFullscreenDemo
    };

    // Initialize on DOM ready and dynamic content load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initProjectDemo();
        });
    } else {
        initProjectDemo();
    }

    // Re-initialize on dynamic content load
    document.addEventListener('contentLoaded', function() {
        initProjectDemo();
    });

})();
