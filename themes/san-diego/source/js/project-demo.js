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
        
        // Create fullscreen modal
        const modal = document.createElement('div');
        modal.className = 'demo-modal';
        modal.innerHTML = `
            <div class="demo-modal-overlay"></div>
            <div class="demo-modal-content">
                <button class="demo-modal-close" aria-label="Close demo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
                <div class="demo-modal-body">
                    <div class="demo-loading">Loading demo...</div>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.appendChild(modal);
        document.body.classList.add('demo-modal-open');
        
        // Get the modal body for content
        const modalBody = modal.querySelector('.demo-modal-body');
        
        // Set up close button
        const closeBtn = modal.querySelector('.demo-modal-close');
        const overlay = modal.querySelector('.demo-modal-overlay');
        
        const closeModal = () => {
            // Play sound effect if available
            if (window.soundEffects && window.soundEffects.playSound) {
                window.soundEffects.playSound('small-click');
            }
            
            document.body.classList.remove('demo-modal-open');
            modal.classList.add('closing');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Handle escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Load the demo component
        switch(componentName) {
            case 'interactive-prototype':
                loadInteractivePrototype(modalBody);
                break;
            case 'code-sandbox':
                loadCodeSandbox(modalBody);
                break;
            case 'figma-embed':
                loadFigmaEmbed(modalBody);
                break;
            case 'live-component':
                loadLiveComponent(modalBody);
                break;
            default:
                // Try to load custom component
                loadCustomComponent(componentName, modalBody);
        }
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
        // Load custom demo as iframe
        container.innerHTML = `
            <div class="demo-custom">
                <iframe src="/demos/${name}/" 
                    frameborder="0" 
                    allowfullscreen
                    style="width: 100%; height: 100%;"
                    title="${name} Demo">
                </iframe>
            </div>
        `;
        
        // Also dispatch event for any additional handlers
        const event = new CustomEvent('loadDemoComponent', {
            detail: { name, container }
        });
        document.dispatchEvent(event);
    }


    // Export functions for global use
    window.projectDemo = {
        init: initProjectDemo,
        loadComponent: loadDemoComponent
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