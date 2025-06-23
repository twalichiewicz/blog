// Project Demo System
// Handles both external demos and dynamic component loading

(function() {
    'use strict';

    // Initialize demo system
    function initProjectDemo() {
        const demoButton = document.getElementById('demoBtn');
        if (demoButton) {
            setupDemoButton(demoButton);
        }
    }

    // Demo button functionality
    function setupDemoButton(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Play sound effect if available
            if (window.soundEffects && window.soundEffects.playSound) {
                window.soundEffects.playSound('button-press');
            }
            
            const demoUrl = button.getAttribute('data-demo-url');
            const demoComponent = button.getAttribute('data-demo-component');
            
            if (demoUrl) {
                // External demo - open in new window
                window.open(demoUrl, '_blank', 'noopener,noreferrer');
            } else if (demoComponent) {
                // Dynamic component demo
                loadDemoComponent(demoComponent);
            }
        });
    }

    // Load demo component
    function loadDemoComponent(componentName) {
        const trailerHero = document.getElementById('trailerHero');
        const trailerContent = document.getElementById('trailerContent');
        const aboveFold = document.querySelector('.above-fold-content-wrapper');
        
        if (!trailerHero || !trailerContent) return;
        
        // Add demo-active class to trigger animations
        document.body.classList.add('demo-active');
        trailerHero.classList.add('demo-mode');
        
        // Clear existing content
        trailerContent.innerHTML = '<div class="demo-loading">Loading demo...</div>';
        
        // Load the demo component
        switch(componentName) {
            case 'interactive-prototype':
                loadInteractivePrototype(trailerContent);
                break;
            case 'code-sandbox':
                loadCodeSandbox(trailerContent);
                break;
            case 'figma-embed':
                loadFigmaEmbed(trailerContent);
                break;
            case 'live-component':
                loadLiveComponent(trailerContent);
                break;
            default:
                // Try to load custom component
                loadCustomComponent(componentName, trailerContent);
        }
        
        // Add close button
        addDemoCloseButton(trailerHero);
    }

    // Example demo loaders
    function loadInteractivePrototype(container) {
        container.innerHTML = `
            <div class="demo-prototype">
                <iframe src="/demos/prototype.html" 
                    frameborder="0" 
                    allowfullscreen
                    title="Interactive Prototype">
                </iframe>
            </div>
        `;
    }

    function loadCodeSandbox(container) {
        container.innerHTML = `
            <div class="demo-codesandbox">
                <iframe src="https://codesandbox.io/embed/" 
                    frameborder="0" 
                    allowfullscreen
                    sandbox="allow-scripts allow-same-origin"
                    title="Code Sandbox Demo">
                </iframe>
            </div>
        `;
    }

    function loadFigmaEmbed(container) {
        container.innerHTML = `
            <div class="demo-figma">
                <iframe src="https://www.figma.com/embed" 
                    frameborder="0" 
                    allowfullscreen
                    title="Figma Prototype">
                </iframe>
            </div>
        `;
    }

    function loadLiveComponent(container) {
        // Example of loading a live React/Vue component
        container.innerHTML = `
            <div class="demo-live-component" id="demo-mount-point">
                <!-- Component will be mounted here -->
            </div>
        `;
        
        // Dispatch event for component mounting
        const event = new CustomEvent('mountDemoComponent', {
            detail: { mountPoint: document.getElementById('demo-mount-point') }
        });
        document.dispatchEvent(event);
    }

    function loadCustomComponent(name, container) {
        // Dispatch event for custom handlers
        const event = new CustomEvent('loadDemoComponent', {
            detail: { name, container }
        });
        document.dispatchEvent(event);
    }

    function addDemoCloseButton(trailerHero) {
        // Check if button already exists
        if (trailerHero.querySelector('.demo-close-button')) return;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'demo-close-button';
        closeBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        `;
        closeBtn.onclick = closeDemoMode;
        trailerHero.appendChild(closeBtn);
    }

    function closeDemoMode() {
        // Play sound effect if available
        if (window.soundEffects && window.soundEffects.playSound) {
            window.soundEffects.playSound('small-click');
        }
        
        document.body.classList.remove('demo-active');
        const trailerHero = document.getElementById('trailerHero');
        const trailerContent = document.getElementById('trailerContent');
        const closeBtn = trailerHero.querySelector('.demo-close-button');
        
        if (closeBtn) closeBtn.remove();
        trailerHero.classList.remove('demo-mode');
        
        // Restore original content
        const originalContent = trailerHero.getAttribute('data-original-content');
        if (originalContent && trailerContent) {
            trailerContent.innerHTML = originalContent;
        } else {
            // If no original content saved, reload the page
            location.reload();
        }
    }

    // Save original content before demo mode
    function saveOriginalContent() {
        const trailerHero = document.getElementById('trailerHero');
        const trailerContent = document.getElementById('trailerContent');
        
        if (trailerHero && trailerContent && !trailerHero.hasAttribute('data-original-content')) {
            trailerHero.setAttribute('data-original-content', trailerContent.innerHTML);
        }
    }

    // Export functions for global use
    window.projectDemo = {
        init: initProjectDemo,
        loadComponent: loadDemoComponent,
        close: closeDemoMode
    };

    // Initialize on DOM ready and dynamic content load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            saveOriginalContent();
            initProjectDemo();
        });
    } else {
        saveOriginalContent();
        initProjectDemo();
    }

    // Re-initialize on dynamic content load
    document.addEventListener('contentLoaded', function() {
        saveOriginalContent();
        initProjectDemo();
    });

    // Handle escape key to close demo
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('demo-active')) {
            closeDemoMode();
        }
    });

})();