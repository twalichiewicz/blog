// Project Demo Walkthrough System
// Floating toolbar for controlling demo onboarding/walkthroughs
// Styled similar to Apple Music's player bar

(function() {
    'use strict';

    class DemoWalkthrough {
        constructor() {
            this.currentStep = 0;
            this.steps = [];
            this.isPlaying = false;
            this.autoAdvanceTimer = null;
            this.autoAdvanceInterval = 5000; // 5 seconds default
            this.toolbar = null;
            this.demoIframe = null;
            this.isVisible = false;
            this.isMinimized = false;
            this.shouldAutoStart = false; // Track if we should auto-start
            this.isInitialized = false; // Track initialization state
            this.messageHandler = null; // Store bound message handler
        }

        init() {
            console.log('[DemoWalkthrough] Initializing walkthrough system');
            
            // REDIRECT FIX: Don't initialize on homepage to prevent interference
            if (window.location.pathname === '/' && !window.location.search && !window.location.hash) {
                console.log('[DemoWalkthrough] Skipping initialization on clean homepage');
                return;
            }
            
            // Clean up previous initialization if any
            this.cleanup();
            
            // Check if we're on a project page with demo
            const demoContainer = document.querySelector('.demo-inline-container');
            if (!demoContainer) {
                console.log('[DemoWalkthrough] No demo container found - waiting for dynamic content');
                return;
            }

            // Wait for demo to load
            const iframe = demoContainer.querySelector('.demo-inline-iframe');
            if (!iframe) {
                console.log('[DemoWalkthrough] No demo iframe found - waiting for iframe creation');
                // Set up observer to wait for iframe
                this.observeForIframe(demoContainer);
                return;
            }

            this.demoIframe = iframe;
            this.isInitialized = true;
            console.log('[DemoWalkthrough] Demo iframe found, setting up listeners');

            // Listen for demo ready messages
            this.messageHandler = this.handleMessage.bind(this);
            window.addEventListener('message', this.messageHandler);

            // Wait for iframe to load before setting up
            if (iframe.contentWindow && iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                this.setupWalkthrough();
            } else {
                iframe.addEventListener('load', () => {
                    this.setupWalkthrough();
                });
            }
        }

        cleanup() {
            console.log('[DemoWalkthrough] Cleaning up walkthrough system');
            
            // Remove existing message listener
            if (this.messageHandler) {
                window.removeEventListener('message', this.messageHandler);
                this.messageHandler = null;
            }
            
            // Clear any existing toolbar from DOM and instance
            const existingToolbar = document.querySelector('.demo-walkthrough-toolbar');
            if (existingToolbar) {
                existingToolbar.remove();
            }
            
            if (this.toolbar) {
                this.toolbar.remove();
                this.toolbar = null;
            }
            
            // Reset state
            this.isInitialized = false;
            this.isVisible = false;
            this.isMinimized = false;
            this.steps = [];
            this.currentStep = 0;
            this.shouldAutoStart = false;
            this.stopAutoAdvance();
        }
        
        observeForIframe(container) {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        const iframe = container.querySelector('.demo-inline-iframe');
                        if (iframe) {
                            console.log('[DemoWalkthrough] Iframe detected via observer');
                            observer.disconnect();
                            this.demoIframe = iframe;
                            this.isInitialized = true;
                            
                            // Set up message handler
                            this.messageHandler = this.handleMessage.bind(this);
                            window.addEventListener('message', this.messageHandler);
                            
                            // Wait for iframe to load
                            if (iframe.contentWindow && iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                                this.setupWalkthrough();
                            } else {
                                iframe.addEventListener('load', () => {
                                    this.setupWalkthrough();
                                });
                            }
                            break;
                        }
                    }
                }
            });
            
            observer.observe(container, { childList: true, subtree: true });
        }

        setupWalkthrough() {
            console.log('[DemoWalkthrough] Setting up walkthrough, sending checkWalkthroughSupport message');
            // Check if demo supports walkthrough
            setTimeout(() => {
                if (this.demoIframe && this.demoIframe.contentWindow) {
                    this.demoIframe.contentWindow.postMessage({
                        type: 'checkWalkthroughSupport'
                    }, '*');
                }
            }, 1000); // Give iframe time to fully load
        }

        handleMessage(event) {
            if (!event.data || typeof event.data !== 'object') return;

            console.log('[DemoWalkthrough] Received message:', event.data.type, event.data);

            switch (event.data.type) {
                case 'walkthroughSupported':
                    this.steps = event.data.steps || [];
                    console.log('[DemoWalkthrough] Steps received:', this.steps.length);
                    if (this.steps.length > 0) {
                        this.createToolbar();
                    }
                    break;

                case 'walkthroughStepCompleted':
                    this.handleNext();
                    break;

                case 'walkthroughEnded':
                    // Minimize toolbar instead of hiding
                    this.minimizeToolbar();
                    break;
            }
        }

        createToolbar() {
            // Check if toolbar already exists in DOM (singleton pattern)
            const existingToolbar = document.querySelector('.demo-walkthrough-toolbar');
            if (existingToolbar) {
                console.log('[DemoWalkthrough] Toolbar already exists, reusing it');
                this.toolbar = existingToolbar;
                // Update UI with current steps
                this.updateUI();
                return;
            }

            if (this.toolbar) return;

            console.log('[DemoWalkthrough] Creating toolbar with', this.steps.length, 'steps');

            // Create toolbar element
            this.toolbar = document.createElement('div');
            this.toolbar.className = 'demo-walkthrough-toolbar';
            this.toolbar.innerHTML = `
                <div class="walkthrough-toolbar-inner">
                    <div class="walkthrough-controls-left">
                        <button class="walkthrough-btn walkthrough-prev" aria-label="Previous step">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                            </svg>
                        </button>
                        <button class="walkthrough-btn walkthrough-play-pause" aria-label="Play/Pause">
                            <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            <svg class="pause-icon" style="display: none;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            </svg>
                        </button>
                        <button class="walkthrough-btn walkthrough-next" aria-label="Next step">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="walkthrough-info">
                        <div class="walkthrough-step-title">Welcome to the Demo</div>
                        <div class="walkthrough-step-indicator">Step 1 of ${this.steps.length}</div>
                    </div>
                    
                    <div class="walkthrough-controls-right">
                        <div class="walkthrough-cassette-deck" data-state="stopped">
                            <div class="cassette-well">
                                <div class="cassette-window"></div>
                                <div class="tape-reel left-reel"></div>
                                <div class="tape-reel right-reel"></div>
                                <div class="deck-label"></div>
                            </div>
                            <div class="cassette-well">
                                <div class="cassette-window"></div>
                                <div class="tape-reel left-reel"></div>
                                <div class="tape-reel right-reel"></div>
                                <div class="deck-label"></div>
                            </div>
                        </div>
                        <div class="walkthrough-progress">
                            <div class="walkthrough-progress-bar">
                                <div class="walkthrough-progress-fill"></div>
                            </div>
                        </div>
                        <button class="walkthrough-btn walkthrough-minimize" aria-label="Minimize toolbar">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 13H5v-2h14v2z"/>
                            </svg>
                        </button>
                        <!-- Close button removed - toolbar should always be present -->
                    </div>
                </div>
                <div class="walkthrough-toolbar-minimized">
                    <button class="walkthrough-btn walkthrough-maximize" aria-label="Show walkthrough">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </button>
                    <span class="walkthrough-minimized-text">Demo Walkthrough</span>
                    <!-- Close button removed - toolbar should always be present -->
                </div>
            `;

            // Add to page
            document.body.appendChild(this.toolbar);

            // Setup event listeners
            this.setupEventListeners();

            // Show toolbar when demo button is clicked (with auto-start)
            const demoBtn = document.getElementById('demoBtn');
            if (demoBtn) {
                console.log('[DemoWalkthrough] Found demo button, checking if handler needed');
                // Only add listener if not already added
                if (!demoBtn.hasAttribute('data-walkthrough-listener')) {
                    console.log('[DemoWalkthrough] Adding click listener to demo button');
                    demoBtn.setAttribute('data-walkthrough-listener', 'true');
                    demoBtn.addEventListener('click', () => {
                        console.log('[DemoWalkthrough] Demo button clicked, showing toolbar with auto-start after delay');
                        setTimeout(() => this.showToolbar(true), 600);
                    });
                }
            } else {
                console.log('[DemoWalkthrough] Demo button not found - may be added later');
            }
        }

        setupEventListeners() {
            const prevBtn = this.toolbar.querySelector('.walkthrough-prev');
            const nextBtn = this.toolbar.querySelector('.walkthrough-next');
            const playPauseBtn = this.toolbar.querySelector('.walkthrough-play-pause');
            const minimizeBtn = this.toolbar.querySelector('.walkthrough-minimize');
            const maximizeBtn = this.toolbar.querySelector('.walkthrough-maximize');

            prevBtn.addEventListener('click', () => this.handlePrevious());
            nextBtn.addEventListener('click', () => this.handleNext());
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
            minimizeBtn.addEventListener('click', () => this.minimizeToolbar());
            maximizeBtn.addEventListener('click', () => this.maximizeToolbar());

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (!this.isVisible) return;

                switch(e.key) {
                    case 'ArrowLeft':
                        this.handlePrevious();
                        break;
                    case 'ArrowRight':
                        this.handleNext();
                        break;
                    case ' ':
                        e.preventDefault();
                        this.togglePlayPause();
                        break;
                    case 'Escape':
                        // Minimize toolbar instead of hiding
                        if (!this.isMinimized) {
                            this.minimizeToolbar();
                        }
                        break;
                }
            });
        }

        showToolbar(autoStart = false) {
            console.log('[DemoWalkthrough] showToolbar called, toolbar:', !!this.toolbar, 'isVisible:', this.isVisible, 'autoStart:', autoStart);
            if (!this.toolbar) return;

            // Always ensure toolbar is visible when called
            this.isVisible = true;
            this.isMinimized = false; // Show in full state
            this.toolbar.classList.add('visible');
            this.toolbar.classList.remove('minimized');
            console.log('[DemoWalkthrough] Toolbar made visible');

            // Start walkthrough
            this.currentStep = 0;
            this.updateUI();
            
            // Only send step to demo and auto-start if requested
            if (autoStart) {
                this.sendStepToDemo();
                this.shouldAutoStart = true;
                // Optionally start playing automatically
                // this.togglePlayPause(); // Uncomment to auto-play
            }

            // Play sound effect
            if (window.soundEffects && window.soundEffects.playSound) {
                window.soundEffects.playSound('notification-subtle');
            }
        }

        // hideToolbar method removed - toolbar should always be visible in fullscreen
        // Only minimize/maximize states are allowed

        minimizeToolbar() {
            if (!this.toolbar || !this.isVisible || this.isMinimized) return;

            this.isMinimized = true;
            this.toolbar.classList.add('minimized');
            this.stopAutoAdvance(); // Pause when minimized

            // Play sound effect
            if (window.soundEffects && window.soundEffects.playSound) {
                window.soundEffects.playSound('small-click');
            }
        }

        maximizeToolbar() {
            if (!this.toolbar || !this.isVisible || !this.isMinimized) return;

            this.isMinimized = false;
            this.toolbar.classList.remove('minimized');

            // Resume auto-play if it was playing before
            if (this.isPlaying) {
                this.startAutoAdvance();
            }

            // Play sound effect
            if (window.soundEffects && window.soundEffects.playSound) {
                window.soundEffects.playSound('small-click');
            }
        }

        handlePrevious() {
            if (this.currentStep > 0) {
                // Temporarily show rewind animation
                const cassetteDeck = this.toolbar?.querySelector('.walkthrough-cassette-deck');
                if (cassetteDeck) {
                    cassetteDeck.setAttribute('data-state', 'rewinding');
                    setTimeout(() => {
                        if (this.isPlaying) {
                            cassetteDeck.setAttribute('data-state', 'playing');
                        } else {
                            cassetteDeck.setAttribute('data-state', 'paused');
                        }
                    }, 300);
                }
                
                this.currentStep--;
                this.updateUI();
                this.sendStepToDemo();
                this.restartAutoAdvance();
            }
        }

        handleNext() {
            if (this.currentStep < this.steps.length - 1) {
                // Temporarily show fast-forward animation
                const cassetteDeck = this.toolbar?.querySelector('.walkthrough-cassette-deck');
                if (cassetteDeck) {
                    cassetteDeck.setAttribute('data-state', 'fast-forward');
                    setTimeout(() => {
                        if (this.isPlaying) {
                            cassetteDeck.setAttribute('data-state', 'playing');
                        } else {
                            cassetteDeck.setAttribute('data-state', 'paused');
                        }
                    }, 300);
                }
                
                this.currentStep++;
                this.updateUI();
                this.sendStepToDemo();
                this.restartAutoAdvance();
            } else {
                // End of walkthrough - minimize instead of hide
                this.minimizeToolbar();
            }
        }

        togglePlayPause() {
            this.isPlaying = !this.isPlaying;
            
            const playIcon = this.toolbar.querySelector('.play-icon');
            const pauseIcon = this.toolbar.querySelector('.pause-icon');
            const cassetteDeck = this.toolbar.querySelector('.walkthrough-cassette-deck');
            
            if (this.isPlaying) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                this.startAutoAdvance();
                
                // Update cassette deck to playing state
                if (cassetteDeck) {
                    cassetteDeck.setAttribute('data-state', 'playing');
                }
            } else {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                this.stopAutoAdvance();
                
                // Update cassette deck to paused state
                if (cassetteDeck) {
                    cassetteDeck.setAttribute('data-state', 'paused');
                }
            }

            // Play sound effect
            if (window.soundEffects && window.soundEffects.playSound) {
                window.soundEffects.playSound('small-click');
            }
        }

        startAutoAdvance() {
            this.stopAutoAdvance();
            this.autoAdvanceTimer = setInterval(() => {
                this.handleNext();
            }, this.autoAdvanceInterval);
        }

        stopAutoAdvance() {
            if (this.autoAdvanceTimer) {
                clearInterval(this.autoAdvanceTimer);
                this.autoAdvanceTimer = null;
            }
        }

        restartAutoAdvance() {
            if (this.isPlaying) {
                this.startAutoAdvance();
            }
        }

        updateUI() {
            if (!this.toolbar) return;

            const step = this.steps[this.currentStep] || {};
            const titleEl = this.toolbar.querySelector('.walkthrough-step-title');
            const indicatorEl = this.toolbar.querySelector('.walkthrough-step-indicator');
            const progressFill = this.toolbar.querySelector('.walkthrough-progress-fill');
            const cassetteDeck = this.toolbar.querySelector('.walkthrough-cassette-deck');

            // Update text
            titleEl.textContent = step.title || `Step ${this.currentStep + 1}`;
            indicatorEl.textContent = `Step ${this.currentStep + 1} of ${this.steps.length}`;

            // Update progress
            const progress = ((this.currentStep + 1) / this.steps.length) * 100;
            progressFill.style.width = `${progress}%`;

            // Update cassette deck tape position
            if (cassetteDeck) {
                const cassetteWindows = cassetteDeck.querySelectorAll('.cassette-window');
                cassetteWindows.forEach(window => {
                    window.style.setProperty('--tape-position', `${progress}%`);
                });
            }

            // Update button states
            const prevBtn = this.toolbar.querySelector('.walkthrough-prev');
            const nextBtn = this.toolbar.querySelector('.walkthrough-next');
            
            prevBtn.disabled = this.currentStep === 0;
            nextBtn.disabled = this.currentStep === this.steps.length - 1;
        }

        sendStepToDemo() {
            if (!this.demoIframe || !this.demoIframe.contentWindow) return;

            const step = this.steps[this.currentStep];
            this.demoIframe.contentWindow.postMessage({
                type: 'walkthroughStep',
                step: this.currentStep,
                data: step
            }, '*');
        }

        // Method to trigger toolbar when entering fullscreen
        handleFullscreenEntry() {
            console.log('[DemoWalkthrough] Handling fullscreen entry');
            if (this.steps.length > 0) {
                // Always show toolbar when entering fullscreen, regardless of current state
                this.showToolbar(false);
            }
        }

        // Method to handle when exiting fullscreen
        handleFullscreenExit() {
            console.log('[DemoWalkthrough] Handling fullscreen exit');
            if (this.toolbar && this.isVisible) {
                // Hide the toolbar when exiting fullscreen
                this.hideToolbar();
            }
        }

        // Hide toolbar completely (only when exiting fullscreen)
        hideToolbar() {
            if (!this.toolbar) return;

            console.log('[DemoWalkthrough] Hiding toolbar');
            this.isVisible = false;
            this.isMinimized = false;
            this.toolbar.classList.remove('visible');
            this.toolbar.classList.remove('minimized');
            
            // Stop any auto-advance
            this.stopAutoAdvance();
            
            // Reset state
            this.currentStep = 0;
            this.isPlaying = false;
            
            // Update play/pause button
            const playIcon = this.toolbar.querySelector('.play-icon');
            const pauseIcon = this.toolbar.querySelector('.pause-icon');
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        }
    }

    // Create singleton instance
    let walkthroughInstance = null;
    
    // Initialize on DOM ready
    function initDemoWalkthrough() {
        console.log('[DemoWalkthrough] initDemoWalkthrough called');
        
        // Create singleton instance
        if (!walkthroughInstance) {
            walkthroughInstance = new DemoWalkthrough();
            
            // Store globally for debugging
            window.demoWalkthrough = walkthroughInstance;
            
            // Add manual trigger function for debugging
            window.triggerWalkthrough = function() {
                console.log('[DemoWalkthrough] Manual trigger called');
                if (walkthroughInstance.demoIframe) {
                    walkthroughInstance.setupWalkthrough();
                } else {
                    walkthroughInstance.init();
                }
            };
        }
        
        // Always try to initialize (it will clean up and re-init if needed)
        walkthroughInstance.init();
    }

    // Initialize on various load events
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDemoWalkthrough);
    } else {
        // Delay initial init to avoid running on portfolio page
        setTimeout(initDemoWalkthrough, 100);
    }

    // Re-initialize on dynamic content load
    document.addEventListener('contentLoaded', function() {
        console.log('[DemoWalkthrough] contentLoaded event received');
        // Give time for demo to be inserted into DOM
        setTimeout(initDemoWalkthrough, 500);
    });
    
    // Also listen for the custom demo load event
    document.addEventListener('loadInlineDemoComponent', function(event) {
        console.log('[DemoWalkthrough] loadInlineDemoComponent event received', event.detail);
        // Re-initialize after demo is loaded
        setTimeout(initDemoWalkthrough, 1000);
    });

})();