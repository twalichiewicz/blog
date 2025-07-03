/**
 * Blog functionality - Standalone version without ES6 imports
 * This version assumes dependencies are loaded separately
 */

// --- Dynamic Link Click Handler ---
// Define at top level so it's accessible everywhere
function handleDynamicLinkClick(event) {
	const link = event.currentTarget;
	console.log('[Blog] Dynamic link clicked:', link.href);
	
	// Check if it's an internal link that should load dynamically
	if (link.hostname === window.location.hostname &&
		!link.getAttribute('target') &&
		(link.protocol === "http:" || link.protocol === "https:") &&
		!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
	) {
		const isPostLink = link.classList.contains('post-link-wrapper');
		const isProjectLink = link.matches('a.portfolio-item-wrapper, a.portfolio-item.has-writeup');
		
		if (isPostLink || isProjectLink) {
			event.preventDefault();
			console.log('[Blog] Loading content dynamically');
			
			// Check if fetchAndDisplayContent is available
			if (window.fetchAndDisplayContent) {
				window.fetchAndDisplayContent(link.href, true, isProjectLink);
			} else {
				console.error('[Blog] fetchAndDisplayContent not available, trying delayed init');
				// Try to initialize dynamic navigation if not already done
				if (typeof setupDynamicBlogNavigation !== 'undefined') {
					setupDynamicBlogNavigation();
					// Try again
					if (window.fetchAndDisplayContent) {
						window.fetchAndDisplayContent(link.href, true, isProjectLink);
						return;
					}
				}
				window.location.href = link.href;
			}
		}
	}
}

// --- Refactored Initialization Function ---
// Define outside DOMContentLoaded so it can be called from anywhere
function initializeBlogFeatures(container) {
	console.log('[Blog] Initializing blog features');
	// Cache DOM elements within the container
	const elements = {
		searchInput: container.querySelector('#postSearch'),
		expandButtons: container.querySelectorAll('.expand-button'),
	};
	
	// SIMPLE: Only re-initialize tabs when we're showing the homepage (Words/Works lists)
	// Check if this is homepage content by looking for the posts/projects containers
	const isHomepageContent = container.querySelector('#postsContent') || container.querySelector('#projectsContent');
	const tabsWrapper = document.querySelector('.tabs-wrapper');
	
	// Only re-initialize tabs on homepage
	if (window.legacyTabSwitch && tabsWrapper && isHomepageContent) {
		console.log('[Blog] Re-initializing tab functionality on homepage');
		// Re-attach click handlers to tab buttons
		const tabButtons = document.querySelectorAll('.tab-button');
		tabButtons.forEach(button => {
			// Remove existing listeners first
			const newButton = button.cloneNode(true);
			button.parentNode.replaceChild(newButton, button);
			
			// Add fresh listener
			newButton.addEventListener('click', (e) => {
				e.preventDefault();
				const tab = e.currentTarget.dataset.type;
				console.log('[Blog] Tab button clicked (re-initialized):', tab);
				window.legacyTabSwitch(tab, true);
			});
		});
		
		// Get current active tab and ensure it's properly set
		const activeButton = document.querySelector('.tab-button.active');
		if (activeButton) {
			const activeTab = activeButton.dataset.type;
			console.log('[Blog] Re-applying active tab state:', activeTab);
			window.legacyTabSwitch(activeTab, false);
		}
	}
	
	// Initialize project demo if available
	setTimeout(() => {
		if (window.projectDemo && window.projectDemo.init) {
			window.projectDemo.init();
		}
	}, 100);
	
	// Also emit contentLoaded event which triggers project demo init
	setTimeout(() => {
		document.dispatchEvent(new Event('contentLoaded'));
		
		// For inline demos, also fire loadInlineDemoComponent for any existing demo containers
		const demoContainers = container.querySelectorAll('.demo-inline-container');
		demoContainers.forEach(demoContainer => {
			const iframe = demoContainer.querySelector('.demo-inline-iframe');
			if (iframe) {
				document.dispatchEvent(new CustomEvent('loadInlineDemoComponent', {
					detail: {
						name: demoContainer.dataset.demoName || 'unknown',
						container: demoContainer,
						iframe: iframe
					}
				}));
			}
		});
	}, 150);

	// --- Search Functionality ---
	if (elements.searchInput) {
		console.log('[Blog] Setting up search on element:', elements.searchInput);
		elements.searchInput.removeEventListener('input', handleSearch);
		elements.searchInput.addEventListener('input', handleSearch);
		
		// Add click sound effect for search input
		elements.searchInput.removeEventListener('click', handleSearchClick);
		elements.searchInput.addEventListener('click', handleSearchClick);
		
		// Initialize clear button
		initializeSearchClearButton(elements.searchInput);
	} else {
		// Try to find search input in the document if not in container
		const globalSearchInput = document.querySelector('#postSearch');
		if (globalSearchInput) {
			console.log('[Blog] Setting up search on global element:', globalSearchInput);
			globalSearchInput.removeEventListener('input', handleSearch);
			globalSearchInput.addEventListener('input', handleSearch);
			
			// Add click sound effect for global search input
			globalSearchInput.removeEventListener('click', handleSearchClick);
			globalSearchInput.addEventListener('click', handleSearchClick);
			
			// Initialize clear button
			initializeSearchClearButton(globalSearchInput);
		} else {
			console.log('[Blog] No search input found');
		}
	}

	// --- Expand Buttons ---
	if (elements.expandButtons.length) {
		elements.expandButtons.forEach(btn => {
			btn.removeEventListener('click', toggleExpand);
			btn.addEventListener('click', toggleExpand);
		});
	}

	// --- Carousels (Delegate to global carousel.js initializer) ---
	if (typeof window.initializeCarousels === 'function') {
		window.initializeCarousels(container);
	}
	
	// --- Code Sandboxes ---
	if (typeof window.initializeCodeSandboxes === 'function') {
		console.log('[Blog] Initializing code sandboxes');
		window.initializeCodeSandboxes(container);
	}
	
	// --- Initialize link listeners for dynamic loading ---
	// This needs to happen for homepage content to enable dynamic loading
	if (isHomepageContent) {
		const links = container.querySelectorAll(
			'a.post-link-wrapper, ' +
			'a.portfolio-item-wrapper, ' +
			'a.portfolio-item.has-writeup'
		);
		console.log('[Blog] Setting up dynamic link handlers, found:', links.length);
		
		links.forEach(link => {
			// Remove any existing listener
			link.removeEventListener('click', handleDynamicLinkClick);
			// Add new listener
			link.addEventListener('click', handleDynamicLinkClick);
		});
	}

	// --- Video Autoplay --- Only refresh if there are videos in the container
	const hasVideos = container.querySelector('video[data-autoplay="true"]');
	if (hasVideos && window.videoAutoplayManager && typeof window.videoAutoplayManager.refresh === 'function') {
		window.videoAutoplayManager.refresh();
	}
	
	// --- Anchor Links ---
	// Now handled by ScrollUtility which auto-initializes
	
	// --- Re-execute inline scripts ---
	// This is critical for YouTube-SoundCloud demo and other inline scripts
	executeInlineScripts(container);
}

// Function to re-execute inline scripts after dynamic content loading
function executeInlineScripts(container) {
	console.log('[Blog] Re-executing inline scripts');
	const scripts = container.querySelectorAll('script');
	
	scripts.forEach(script => {
		if (script.src) {
			// External script - reload it
			console.log('[Blog] Reloading external script:', script.src);
			const newScript = document.createElement('script');
			newScript.src = script.src;
			if (script.type) newScript.type = script.type;
			if (script.async) newScript.async = script.async;
			if (script.defer) newScript.defer = script.defer;
			script.parentNode.replaceChild(newScript, script);
		} else if (script.textContent || script.innerHTML) {
			// Inline script - execute it
			console.log('[Blog] Executing inline script');
			try {
				// Create a new script element to execute the code
				const newScript = document.createElement('script');
				if (script.type) newScript.type = script.type;
				newScript.textContent = script.textContent || script.innerHTML;
				
				// Replace the old script with the new one to trigger execution
				script.parentNode.replaceChild(newScript, script);
			} catch (error) {
				console.error('[Blog] Error executing inline script:', error);
			}
		}
	});
}
// --- End of Refactored Initialization Function ---

// === Dynamic Content Loader for Blog Posts/Projects ===
function setupDynamicBlogNavigation() {
	console.log('[Blog] DISABLED: Dynamic navigation temporarily disabled to fix redirect issue');
	return; // TEMPORARY: Disable dynamic navigation entirely
	
	console.log('[Blog] Setting up dynamic blog navigation');
	const blogContentElement = document.querySelector('.blog-content');
	if (!blogContentElement) {
		console.log('[Blog] No blog-content element found, skipping dynamic navigation setup');
		return;
	}

	let initialBlogContentHTML = blogContentElement.innerHTML;
	let initialBlogContentURL = window.location.pathname + window.location.search + window.location.hash;

	function addOrUpdateBackButton() {
		if (!blogContentElement) return null;

		// Check if we're loading a project-edge-wrapper which already has its own navigation
		const hasProjectEdgeWrapper = blogContentElement.querySelector('.project-edge-wrapper') ||
			blogContentElement.innerHTML.includes('project-edge-wrapper');
		if (hasProjectEdgeWrapper) {
			return null;
		}

		let backButton = blogContentElement.querySelector('.dynamic-back-button');
		if (!backButton) {
			backButton = document.createElement('button');
			backButton.textContent = '← Back';
			backButton.className = 'dynamic-back-button';

			// Consistent placement for all devices
			if (blogContentElement.firstChild) {
				blogContentElement.insertBefore(backButton, blogContentElement.firstChild);
			} else {
				blogContentElement.appendChild(backButton);
			}
		}

		const backButtonClickHandler = async function (event) {
			event.preventDefault();
			
			// Play button press sound effect
			if (window.soundEffects && window.soundEffects.playButtonPress) {
				window.soundEffects.playButtonPress();
			}
			
			// Determine what type of content we're returning from
			const currentHistoryState = history.state;
			const isReturningFromProject = currentHistoryState && currentHistoryState.isProject === true;
			
			// Clean up any existing carousel
			if (window._notebookCarouselDebug && window._notebookCarouselDebug.getInstance) {
				const existingCarousel = window._notebookCarouselDebug.getInstance();
				if (existingCarousel && existingCarousel.destroy) {
					existingCarousel.destroy();
				}
			}
			
			// Start screen wipe transition for back navigation
			let transitionData = null;
			if (window.ScreenWipeTransition) {
				transitionData = await window.ScreenWipeTransition.startBack(() => {
					// This callback fires when panels meet in the middle
					// Remove has-dynamic-content class to restore scroll behavior
					blogContentElement.classList.remove('has-dynamic-content');
					
					// IMPORTANT: Clean up current content before swapping back to homepage
					if (typeof window.cleanupCarouselInstances === 'function') {
						window.cleanupCarouselInstances(blogContentElement);
					}
					if (typeof window.cleanupCodeSandboxes === 'function') {
						console.log('[Blog] Cleaning up code sandboxes before returning to homepage');
						window.cleanupCodeSandboxes(blogContentElement);
					}
					
					// Swap content while panels are covering the screen
					blogContentElement.innerHTML = initialBlogContentHTML;
					initializeBlogFeatures(blogContentElement);
					initializeLinkListeners(blogContentElement);
					
					// Initialize mobile tabs
					if (window.initializeMobileTabs) {
						window.initializeMobileTabs();
					}
					
					// Re-initialize toggles
					initializeProjectToggle();
					initializePostsOnlyButton();
					
					// Ensure tabs are visible again on mobile
					if (window.innerWidth <= 768) {
						const tabsWrapper = blogContentElement.querySelector('.tabs-wrapper');
						if (tabsWrapper) {
							tabsWrapper.style.display = '';
						}
					}
					
					// Set the appropriate tab based on content type
					if (isReturningFromProject) {
						// Mark as back navigation for carousel
						sessionStorage.setItem('portfolio-back-navigation', 'true');
						
						// Coming from a project, show portfolio tab
						setTimeout(() => {
							if (window.mobileTabs && typeof window.mobileTabs.switchTab === 'function') {
								window.mobileTabs.switchTab('portfolio', false);
							}
							// Emit portfolio-loaded event
							window.dispatchEvent(new Event('portfolio-loaded'));
							document.dispatchEvent(new Event('contentLoaded'));
							
							// Initialize demo button if project has one
							setTimeout(() => {
								if (window.projectDemo && window.projectDemo.init) {
									window.projectDemo.init();
								}
							}, 100);
							
							// Give browser time to restore scroll, then check active notebook
							setTimeout(() => {
								if (window._notebookCarousel && window._notebookCarousel.reinitialize) {
									window._notebookCarousel.reinitialize();
								}
							}, 300);
						}, 50);
					} else {
						// Coming from a blog post, show blog tab and clean URL
						setTimeout(() => {
							if (window.mobileTabs && typeof window.mobileTabs.switchTab === 'function') {
								window.mobileTabs.switchTab('blog', false);
							}
							// Clean up URL parameter if coming from blog post
							if (window.location.search.includes('tab=portfolio')) {
								history.replaceState({ path: '/', isInitial: true, isDynamic: false }, '', '/');
							}
						}, 50);
					}
					
					// Re-initialize sound effects when returning to home page
					if (window.initializeSoundEffects) {
						window.initializeSoundEffects();
					}
					
					// Re-initialize project demos
					document.dispatchEvent(new Event('contentLoaded'));
					
					// Also reinitialize specific demo components (gentle approach)
					setTimeout(() => {
						// Look for inline demo containers and send reinit message instead of reload
						const demoContainers = document.querySelectorAll('.demo-inline-container');
						demoContainers.forEach(container => {
							const iframe = container.querySelector('iframe');
							if (iframe && iframe.contentWindow) {
								// Send a message to the demo to reinitialize itself
								try {
									iframe.contentWindow.postMessage({
										type: 'reinitialize',
										reason: 'navigationReturn'
									}, '*');
								} catch (e) {
									// If messaging fails, do a gentle reload as fallback
									console.log('[Blog] Demo message failed, using reload fallback');
									const currentSrc = iframe.src;
									iframe.src = '';
									setTimeout(() => {
										iframe.src = currentSrc;
									}, 100);
								}
							}
						});
					}, 200);
				});
			}
			
			// End screen wipe transition
			if (window.ScreenWipeTransition && transitionData) {
				await window.ScreenWipeTransition.end(transitionData);
			}
			
			history.pushState({ path: initialBlogContentURL, isInitial: true, isDynamic: false }, '', initialBlogContentURL);
		};

		const oldHandler = backButton._clickHandler;
		if (oldHandler) backButton.removeEventListener('click', oldHandler);

		backButton.addEventListener('click', backButtonClickHandler);
		backButton._clickHandler = backButtonClickHandler;
		return backButton;
	}

	async function fetchAndDisplayContent(url, isPushState = true, isProject = false) {
		if (!blogContentElement) return;

		console.log('[Blog] Fetching and displaying content:', url);

		// Before clearing content, cleanup any carousel instances
		if (typeof window.cleanupCarouselInstances === 'function') {
			window.cleanupCarouselInstances(blogContentElement);
		}
		
		// Also cleanup any code sandboxes
		if (typeof window.cleanupCodeSandboxes === 'function') {
			console.log('[Blog] Cleaning up code sandboxes');
			window.cleanupCodeSandboxes(blogContentElement);
		}

		// Add has-dynamic-content class to enable proper scrolling
		blogContentElement.classList.add('has-dynamic-content');
		
		// Ensure proper styles for desktop
		if (window.innerWidth > 768) {
			blogContentElement.style.overflowY = 'auto';
			blogContentElement.style.height = 'calc(100dvh - 12px)';
		}

		// Start the transition FIRST, then load content while panels are closing
		let transitionData = null;
		
		if (window.ScreenWipeTransition) {
			console.log('[Blog] Starting screen wipe transition');
			
			// Start the transition
			const transitionPromise = window.ScreenWipeTransition.start();
			
			// Load content while panels are closing (we have 300ms until panels meet)
			setTimeout(async () => {
				try {
					console.log('[Blog] Panels closing, fetching content');
					const response = await fetch(url);
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					const htmlText = await response.text();
					const parser = new DOMParser();
					const doc = parser.parseFromString(htmlText, 'text/html');

					// Updated selector to handle new Substack-style posts
					let contentToExtractSelector = isProject ? 'div.project-edge-wrapper' : 'div.post-wrapper';
					let newContentContainer = doc.querySelector(contentToExtractSelector);

					// Fallback for projects
					if (!newContentContainer && isProject) {
						contentToExtractSelector = 'div.project-wrapper';
						newContentContainer = doc.querySelector(contentToExtractSelector);
					}

					// Fallback: if loading a post and not found, try project-wrapper
					if (!newContentContainer && !isProject) {
						newContentContainer = doc.querySelector('div.project-wrapper');
					}

					if (newContentContainer) {
						console.log('[Blog] Content loaded, swapping at midpoint');
						console.log('[Blog] Content type:', newContentContainer.className);
						
						// Prepare content fragment
						const contentFragment = document.createDocumentFragment();
						
						// Special handling for project-edge-wrapper
						if (newContentContainer.classList.contains('project-edge-wrapper')) {
							const projectWrapperInstance = newContentContainer.querySelector('.project-wrapper');
							if (projectWrapperInstance) {
								projectWrapperInstance.classList.add('dynamic-loaded');
							}
							const clonedContent = newContentContainer.cloneNode(true);
							contentFragment.appendChild(clonedContent);
						} else {
							// Regular content handling
							const innerWrapper = document.createElement('div');
							innerWrapper.className = 'content-inner-wrapper';
							innerWrapper.style.opacity = '0';

							let projectWrapperInstance = null;
							if (newContentContainer.classList.contains('project-wrapper')) {
								projectWrapperInstance = newContentContainer;
							} else {
								projectWrapperInstance = newContentContainer.querySelector('.project-wrapper');
							}

							if (projectWrapperInstance && !projectWrapperInstance.classList.contains('dynamic-loaded')) {
								projectWrapperInstance.classList.add('dynamic-loaded');
							}

							innerWrapper.appendChild(newContentContainer.cloneNode(true));
							contentFragment.appendChild(innerWrapper);
						}
						
						// Clear content while panels are covering the screen
						blogContentElement.innerHTML = '';
						
						// Create back button AFTER clearing content
						const backButton = addOrUpdateBackButton();
						
						// Insert the new content
						if (backButton) {
							console.log('[Blog] Inserting content after back button');
							backButton.after(contentFragment);
						} else {
							console.log('[Blog] Appending content directly');
							blogContentElement.appendChild(contentFragment);
						}
						
						// Initialize features on new content
						initializeBlogFeatures(blogContentElement);
						initializeLinkListeners(blogContentElement);
						
						// Initialize other components
						if (window.initializeProjectTabs) {
							window.initializeProjectTabs(blogContentElement);
						}
						if (window.initializeProjectSummary) {
							window.initializeProjectSummary(blogContentElement);
						}
						if (window.initializeSoundEffects) {
							window.initializeSoundEffects();
						}
						
						// Emit events
						if (isProject) {
							window.dispatchEvent(new Event('portfolio-loaded'));
						}
						
						// Set up scroll button for dynamic content
						function setupDynamicScrollButton() {
							const scrollButton = blogContentElement.querySelector('.read-story-button') ||
								blogContentElement.querySelector('#scrollToFullStoryBtn');

							if (scrollButton) {
								scrollButton.onclick = null;
								scrollButton.onclick = function (e) {
									e.preventDefault();
									if (window.scrollToFullStory) {
										window.scrollToFullStory();
									}
								};
								return true;
							}
							return false;
						}

						// Try multiple times
						if (!setupDynamicScrollButton()) {
							setTimeout(setupDynamicScrollButton, 100);
							setTimeout(setupDynamicScrollButton, 300);
							setTimeout(setupDynamicScrollButton, 500);
						}
						
						// Handle history state
						if (isPushState) {
							// Store state for back navigation
							const activeTab = document.querySelector('.tab-button.active')?.dataset.type || 'blog';
							sessionStorage.setItem('previousUrl', window.location.href);
							if (isProject) {
								sessionStorage.setItem('previousTab', 'portfolio');
							} else {
								sessionStorage.setItem('previousTab', activeTab);
							}
							
							history.pushState({ path: url, isProject: isProject, isDynamic: true, previousTab: activeTab }, '', url);
						}
						
						// Fade in content (inside inner wrapper)
						const innerWrapper = blogContentElement.querySelector('.content-inner-wrapper');
						if (innerWrapper) {
							setTimeout(() => {
								innerWrapper.style.opacity = '1';
							}, 50);
						}
					} else {
						console.log('[Blog] ERROR: No content container found');
						// Show error
						blogContentElement.innerHTML = '';
						const backButton = addOrUpdateBackButton();
						const errorMsg = document.createElement('p');
						errorMsg.textContent = 'Sorry, the content could not be loaded.';
						if (backButton) {
							backButton.after(errorMsg);
						} else {
							blogContentElement.appendChild(errorMsg);
						}
					}
				} catch (error) {
					console.error('[Blog] Error loading content:', error);
					// Show error
					blogContentElement.innerHTML = '';
					const backButton = addOrUpdateBackButton();
					const errorMsg = document.createElement('p');
					errorMsg.textContent = 'There was an error loading the page.';
					if (backButton) {
						backButton.after(errorMsg);
					} else {
						blogContentElement.appendChild(errorMsg);
					}
				}
			}, 50); // Start loading shortly after transition begins
			
			// Wait for full transition to complete
			transitionData = await transitionPromise;
			
			// End screen wipe transition
			if (window.ScreenWipeTransition && transitionData) {
				await window.ScreenWipeTransition.end(transitionData);
			}
		} else {
			// No transition available, load content immediately
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const htmlText = await response.text();
				const parser = new DOMParser();
				const doc = parser.parseFromString(htmlText, 'text/html');

				let contentToExtractSelector = isProject ? 'div.project-edge-wrapper' : 'div.post-wrapper';
				let newContentContainer = doc.querySelector(contentToExtractSelector);

				if (!newContentContainer && isProject) {
					contentToExtractSelector = 'div.project-wrapper';
					newContentContainer = doc.querySelector(contentToExtractSelector);
				}

				if (!newContentContainer && !isProject) {
					newContentContainer = doc.querySelector('div.project-wrapper');
				}

				if (newContentContainer) {
					// Clear and insert content
					blogContentElement.innerHTML = '';
					const backButton = addOrUpdateBackButton();
					
					// Prepare content
					const contentFragment = document.createDocumentFragment();
					if (newContentContainer.classList.contains('project-edge-wrapper')) {
						const projectWrapperInstance = newContentContainer.querySelector('.project-wrapper');
						if (projectWrapperInstance) {
							projectWrapperInstance.classList.add('dynamic-loaded');
						}
						contentFragment.appendChild(newContentContainer.cloneNode(true));
					} else {
						const innerWrapper = document.createElement('div');
						innerWrapper.className = 'content-inner-wrapper';
						let projectWrapperInstance = newContentContainer.classList.contains('project-wrapper') ? 
							newContentContainer : newContentContainer.querySelector('.project-wrapper');
						if (projectWrapperInstance) {
							projectWrapperInstance.classList.add('dynamic-loaded');
						}
						innerWrapper.appendChild(newContentContainer.cloneNode(true));
						contentFragment.appendChild(innerWrapper);
					}
					
					if (backButton) {
						backButton.after(contentFragment);
					} else {
						blogContentElement.appendChild(contentFragment);
					}
					
					// Initialize features
					initializeBlogFeatures(blogContentElement);
					initializeLinkListeners(blogContentElement);
					
					if (window.initializeProjectTabs) {
						window.initializeProjectTabs(blogContentElement);
					}
					if (window.initializeProjectSummary) {
						window.initializeProjectSummary(blogContentElement);
					}
					if (window.initializeSoundEffects) {
						window.initializeSoundEffects();
					}
					
					if (isProject) {
						window.dispatchEvent(new Event('portfolio-loaded'));
					}
					
					if (isPushState) {
						const activeTab = document.querySelector('.tab-button.active')?.dataset.type || 'blog';
						sessionStorage.setItem('previousUrl', window.location.href);
						sessionStorage.setItem('previousTab', isProject ? 'portfolio' : activeTab);
						history.pushState({ path: url, isProject: isProject, isDynamic: true, previousTab: activeTab }, '', url);
					}
				}
			} catch (error) {
				console.error('[Blog] Error:', error);
				blogContentElement.innerHTML = '<p>Error loading content.</p>';
			}
		}
	}

	function initializeLinkListeners(parentElement) {
		if (!parentElement) return;
		const linksToProcess = parentElement.querySelectorAll(
			'a.post-link-wrapper, ' +
			'a.portfolio-item-wrapper, ' +
			'a.portfolio-item.has-writeup'
		);
		console.log('[Blog] Initializing link listeners, found links:', linksToProcess.length);

		linksToProcess.forEach(link => {
			link.removeEventListener('click', handleDynamicLinkClick);
			link.addEventListener('click', handleDynamicLinkClick);
			console.log('[Blog] Added click handler to:', link.href);
		});
	}

	console.log('[Blog] Setting up dynamic navigation, blogContentElement:', blogContentElement);
	initializeLinkListeners(blogContentElement);

	const handlePopstate = async function (event) {
		// Handle browser back/forward
		if (!event.state || event.state.isInitial) {
			// Returning to initial state
			document.body.style.opacity = '1';
			document.body.classList.add('loaded');
			
			if (blogContentElement) {
				blogContentElement.style.opacity = '1';
				const innerWrapper = blogContentElement.querySelector('.content-inner-wrapper');
				if (innerWrapper) {
					innerWrapper.style.opacity = '1';
				}
				
				// Re-initialize blog features
				initializeBlogFeatures(blogContentElement);
			}
			
			// Check previous state
			const previousUrl = document.referrer || sessionStorage.getItem('previousUrl') || '';
			const wasOnProject = previousUrl.includes('/20');
			const previousTab = sessionStorage.getItem('previousTab');
			
			if (wasOnProject) {
				sessionStorage.setItem('portfolio-back-navigation', 'true');
				if (window.legacyTabSwitch) {
					console.log('[Blog] Switching to portfolio tab after returning from project');
					window.legacyTabSwitch('portfolio', false);
				}
			} else if (previousTab) {
				if (window.legacyTabSwitch) {
					console.log('[Blog] Restoring previous tab state:', previousTab);
					window.legacyTabSwitch(previousTab, false);
				}
				sessionStorage.removeItem('previousTab');
			}
			
			// Emit events
			setTimeout(() => {
				document.dispatchEvent(new Event('contentLoaded'));
				window.dispatchEvent(new Event('portfolio-loaded'));
				
				setTimeout(() => {
					if (window._notebookCarousel && window._notebookCarousel.reinitialize) {
						window._notebookCarousel.reinitialize();
					}
				}, 300);
			}, 100);
		}
	};
	
	window.addEventListener('popstate', handlePopstate);
	window._blogPopstateHandler = handlePopstate;

	// Expose fetchAndDisplayContent globally
	window.fetchAndDisplayContent = fetchAndDisplayContent;

	if (!history.state || (!history.state.isDynamic && !history.state.isInitial)) {
		history.replaceState({ path: initialBlogContentURL, isInitial: true, isDynamic: false }, '', initialBlogContentURL);
	}
}

// Highlight search terms function
function highlightSearchTerms(element, searchTerm) {
	if (!element || !searchTerm) return;
	
	// Process only text nodes to preserve HTML structure
	const walker = document.createTreeWalker(
		element,
		NodeFilter.SHOW_TEXT,
		null,
		false
	);
	
	const textNodes = [];
	let node;
	while (node = walker.nextNode()) {
		if (node.nodeValue.trim()) {
			textNodes.push(node);
		}
	}
	
	// Process each text node
	textNodes.forEach(textNode => {
		const text = textNode.nodeValue;
		const regex = new RegExp(`(${searchTerm})`, 'gi');
		
		if (regex.test(text)) {
			const span = document.createElement('span');
			span.innerHTML = text.replace(regex, '<span class="search-highlight">$1</span>');
			textNode.parentNode.replaceChild(span, textNode);
		}
	});
}

// Remove all highlights function
function removeAllHighlights(container) {
	if (!container) return;
	
	const highlights = container.querySelectorAll('.search-highlight');
	highlights.forEach(highlight => {
		const parent = highlight.parentNode;
		parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
		parent.normalize();
	});
}

// Highlight search terms in text nodes with improved visibility
function highlightSearchTerms(element, searchTerm) {
	if (!searchTerm) return;
	
	// Create word boundary aware regex for better matching
	const escapedTerm = escapeRegExp(searchTerm);
	const regex = new RegExp(`(${escapedTerm})`, 'gi');
	
	const walker = document.createTreeWalker(
		element,
		NodeFilter.SHOW_TEXT,
		{
			acceptNode: function(node) {
				// Skip script and style elements
				const parent = node.parentNode;
				if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
					return NodeFilter.FILTER_REJECT;
				}
				// Skip if already highlighted
				if (parent.classList && parent.classList.contains('search-highlight')) {
					return NodeFilter.FILTER_REJECT;
				}
				// Skip empty text nodes
				if (!node.textContent.trim()) {
					return NodeFilter.FILTER_REJECT;
				}
				// Accept if contains search term
				if (regex.test(node.textContent)) {
					return NodeFilter.FILTER_ACCEPT;
				}
				return NodeFilter.FILTER_REJECT;
			}
		}
	);

	const nodesToReplace = [];
	let node;
	while (node = walker.nextNode()) {
		nodesToReplace.push(node);
	}

	nodesToReplace.forEach(textNode => {
		const parent = textNode.parentNode;
		const fragment = document.createDocumentFragment();
		let lastIndex = 0;
		let match;

		regex.lastIndex = 0; // Reset regex
		const text = textNode.textContent;

		while ((match = regex.exec(text)) !== null) {
			// Add text before match
			if (match.index > lastIndex) {
				fragment.appendChild(
					document.createTextNode(text.slice(lastIndex, match.index))
				);
			}

			// Add highlighted match with better styling
			const highlight = document.createElement('mark');
			highlight.className = 'search-highlight';
			highlight.textContent = match[0];
			fragment.appendChild(highlight);

			lastIndex = regex.lastIndex;
		}

		// Add remaining text
		if (lastIndex < text.length) {
			fragment.appendChild(
				document.createTextNode(text.slice(lastIndex))
			);
		}

		parent.replaceChild(fragment, textNode);
	});
	
	// Scroll to first highlight if exists
	setTimeout(() => {
		const firstHighlight = element.querySelector('.search-highlight');
		if (firstHighlight && element.contains(firstHighlight)) {
			const rect = firstHighlight.getBoundingClientRect();
			const containerRect = element.getBoundingClientRect();
			// Only scroll if highlight is not already visible
			if (rect.top < containerRect.top || rect.bottom > containerRect.bottom) {
				firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}
	}, 100);
}

// Remove all highlights
function removeAllHighlights(container) {
	const highlights = container.querySelectorAll('.search-highlight');
	highlights.forEach(highlight => {
		const parent = highlight.parentNode;
		const textNode = document.createTextNode(highlight.textContent);
		parent.replaceChild(textNode, highlight);
		parent.normalize(); // Merge adjacent text nodes
	});
}

// Escape special regex characters
function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Search functionality
function handleSearch(e) {
	const searchInput = e.target || e;
	const searchTerm = searchInput.value.toLowerCase();
	
	// Check if Posts Only button is active
	const postsOnlyButton = document.querySelector('.posts-only-button');
	const filterPostsOnly = postsOnlyButton && postsOnlyButton.classList.contains('active');
	
	// Get posts container
	const postsContainer = document.querySelector('#postsContent') || document.querySelector('.blog-list');
	if (!postsContainer) return;
	
	// Remove all existing highlights first
	removeAllHighlights(postsContainer);
	
	const posts = postsContainer.querySelectorAll('.post-list-item');
	let visibleCount = 0;
	
	posts.forEach(post => {
		const bylineText = post.querySelector('.post-byline')?.textContent || '';
		const isMusing = bylineText.includes('Musing');
		const isLink = bylineText.includes('Link');
		const isRegularPost = !isMusing && !isLink;
		
		// Check if we should filter this post based on Posts Only button
		if (filterPostsOnly && !isRegularPost) {
			post.style.display = 'none';
			return;
		}
		
		// If no search term, show post (unless filtered by Posts Only)
		if (!searchTerm) {
			post.style.display = '';
			visibleCount++;
			return;
		}
		
		// Search in title, content, and byline
		const title = post.querySelector('h3, .preview-title')?.textContent.toLowerCase() || '';
		const content = post.querySelector('p, .preview-excerpt')?.textContent.toLowerCase() || '';
		const byline = post.querySelector('.post-byline')?.textContent.toLowerCase() || '';
		
		if (title.includes(searchTerm) || content.includes(searchTerm) || byline.includes(searchTerm)) {
			post.style.display = '';
			visibleCount++;
			
			// Highlight search terms
			const titleElement = post.querySelector('h3, .preview-title');
			if (titleElement) {
				highlightSearchTerms(titleElement, searchTerm);
			}
			
			const contentElement = post.querySelector('p, .preview-excerpt');
			if (contentElement) {
				highlightSearchTerms(contentElement, searchTerm);
			}
			
			const bylineElement = post.querySelector('.post-byline');
			if (bylineElement) {
				highlightSearchTerms(bylineElement, searchTerm);
			}
		} else {
			post.style.display = 'none';
		}
	});
	
	// Update separators visibility
	const postSeparators = postsContainer.querySelectorAll('.post-separator');
	postSeparators.forEach((sep, index) => {
		if (index < posts.length - 1) {
			const currentPost = posts[index];
			const nextPost = posts[index + 1];
			sep.style.display = (currentPost.style.display !== 'none' && nextPost.style.display !== 'none') ? '' : 'none';
		}
	});
}

// Search click sound effect
function handleSearchClick(e) {
	if (window.playBookSound) {
		window.playBookSound();
	}
}

// Initialize search clear button
function initializeSearchClearButton(searchInput) {
	if (!searchInput) return;
	
	const clearButton = searchInput.parentElement.querySelector('.search-clear');
	if (!clearButton) return;
	
	function updateClearVisibility() {
		clearButton.style.display = searchInput.value ? 'block' : 'none';
	}
	
	function handleClearClick(e) {
		e.preventDefault();
		
		if (window.playSmallClickSound) {
			window.playSmallClickSound();
		}
		
		searchInput.value = '';
		clearButton.style.display = 'none';
		handleSearch({ target: searchInput });
		searchInput.focus();
	}
	
	clearButton.removeEventListener('click', handleClearClick);
	searchInput.removeEventListener('input', updateClearVisibility);
	
	clearButton.addEventListener('click', handleClearClick);
	searchInput.addEventListener('input', updateClearVisibility);
	
	updateClearVisibility();
}

// Initialize posts only button
function initializePostsOnlyButton() {
	console.log('[Blog] Project toggle initialization placeholder');
	const postsOnlyButton = document.querySelector('.posts-only-button');
	if (!postsOnlyButton) return;
	
	postsOnlyButton.removeEventListener('click', handlePostsOnlyClick);
	postsOnlyButton.addEventListener('click', handlePostsOnlyClick);
	
	const searchInput = document.querySelector('#postSearch');
	if (searchInput) {
		initializeSearchClearButton(searchInput);
	}
}

function handlePostsOnlyClick(event) {
	if (window.playSmallClickSound) {
		window.playSmallClickSound();
	}
	
	const button = event.currentTarget;
	button.classList.toggle('active');
	const searchInput = document.querySelector('#postSearch');
	if (searchInput) {
		handleSearch({ target: searchInput });
	}
}

// Initialize project filter functionality
let activeProjectFilters = new Set(['professional', 'personal']);

function initializeProjectToggle() {
	console.log('[Blog] Project toggle initialization placeholder');
}

// Toggle expand functionality
function toggleExpand() {
	const overflow = this.nextElementSibling;
	const detailsParent = this.closest('details');
	if (detailsParent) {
		this.textContent = detailsParent.open ? 'Show less' : 'Read more';
		return;
	}

	const isExpanded = this.getAttribute('aria-expanded') === 'true';
	this.setAttribute('aria-expanded', !isExpanded);
	if (overflow) {
		overflow.style.maxHeight = isExpanded ? null : `${overflow.scrollHeight}px`;
	}
	this.textContent = isExpanded ? 'Read more' : 'Show less';
}

// Legacy tab switch function
window.legacyTabSwitch = function(tabType, updateUrl = true) {
	console.log('[Blog] Tab switch to:', tabType);
	
	// Update button states
	const tabButtons = document.querySelectorAll('.tab-button');
	tabButtons.forEach(button => {
		if (button.dataset.type === tabType) {
			button.classList.add('active');
			button.setAttribute('aria-selected', 'true');
		} else {
			button.classList.remove('active');
			button.setAttribute('aria-selected', 'false');
		}
	});
	
	// Show/hide content
	const postsContent = document.getElementById('postsContent');
	const projectsContent = document.getElementById('projectsContent');
	
	if (tabType === 'blog') {
		if (postsContent) postsContent.style.display = '';
		if (projectsContent) projectsContent.style.display = 'none';
	} else if (tabType === 'portfolio') {
		if (postsContent) postsContent.style.display = 'none';
		if (projectsContent) projectsContent.style.display = '';
	}
	
	// Update URL if requested
	if (updateUrl) {
		const url = new URL(window.location);
		url.searchParams.set('tab', tabType);
		history.replaceState({}, '', url);
	}
};

// Global scroll function
function scrollToFullStory() {
	const fullStoryElement = document.getElementById('full-story');
	if (!fullStoryElement) return;

	if (window.ScrollUtility) {
		window.ScrollUtility.scrollToElement(fullStoryElement, {
			behavior: 'smooth',
			block: 'start'
		});
	} else {
		fullStoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
}

// Make functions globally available
window.initializeProjectToggle = initializeProjectToggle;
window.initializePostsOnlyButton = initializePostsOnlyButton;
window.initializeBlogFeatures = initializeBlogFeatures;
window.setupDynamicBlogNavigation = setupDynamicBlogNavigation;
window.highlightSearchTerms = highlightSearchTerms;
window.removeAllHighlights = removeAllHighlights;
window.handleSearch = handleSearch;
window.initializeSearchClearButton = initializeSearchClearButton;
window.scrollToFullStory = scrollToFullStory;
window.handleDynamicLinkClick = handleDynamicLinkClick;
window.legacyTabSwitch = function(tab, updateURL = false) {
	console.log('[LegacyIntegration] Using legacy tab switch for:', tab);
	
	const tabButtons = document.querySelectorAll('.tab-button');
	const postsContent = document.getElementById('postsContent');
	const projectsContent = document.getElementById('projectsContent');
	const tabsWrapper = document.querySelector('.tabs-wrapper');
	
	console.log('[LegacyIntegration] Found elements:', {
		tabButtons: tabButtons.length,
		postsContent: !!postsContent,
		projectsContent: !!projectsContent,
		tabsWrapper: !!tabsWrapper
	});
	
	if (!postsContent || !projectsContent) {
		console.error('[LegacyIntegration] Missing content elements');
		return;
	}
	
	// Determine device type
	const isMobile = window.innerWidth <= 768;
	const deviceType = isMobile ? 'mobile' : 'desktop';
	console.log('[LegacyIntegration] Device type:', deviceType);
	
	// Handle showing/hiding content
	if (tab === 'blog' || tab === 'words') {
		postsContent.style.display = 'block';
		projectsContent.style.display = 'none';
	} else if (tab === 'portfolio' || tab === 'works') {
		postsContent.style.display = 'none';
		projectsContent.style.display = 'block';
	}
	
	// Update button states
	tabButtons.forEach(button => {
		if ((button.dataset.type === 'blog' && (tab === 'blog' || tab === 'words')) ||
			(button.dataset.type === 'portfolio' && (tab === 'portfolio' || tab === 'works'))) {
			button.classList.add('active');
		} else {
			button.classList.remove('active');
		}
	});
	
	// Ensure tabs wrapper has js-initialized class
	if (tabsWrapper && !tabsWrapper.classList.contains('js-initialized')) {
		tabsWrapper.classList.add('js-initialized');
		console.log('[LegacyIntegration] Added js-initialized to tabs-wrapper');
	}
	
	// Update slider position
	const activeButton = document.querySelector('.tab-button.active');
	if (activeButton && tabsWrapper) {
		const slider = tabsWrapper.querySelector('.tab-slider') || document.createElement('div');
		if (!slider.classList.contains('tab-slider')) {
			slider.className = 'tab-slider';
			tabsWrapper.querySelector('.mobile-tabs').appendChild(slider);
		}
		
		const rect = activeButton.getBoundingClientRect();
		const containerRect = tabsWrapper.getBoundingClientRect();
		const relativeLeft = rect.left - containerRect.left;
		
		slider.style.left = `${relativeLeft}px`;
		slider.style.width = `${rect.width}px`;
		
		console.log('[LegacyIntegration] Updated slider position:', {
			left: relativeLeft,
			width: rect.width
		});
	}
	
	console.log('[LegacyIntegration] Tab switch complete for:', tab);
	
	// Update URL if requested
	if (updateURL) {
		const newTab = tab === 'portfolio' || tab === 'works' ? 'portfolio' : 'blog';
		const url = new URL(window.location);
		if (newTab === 'portfolio') {
			url.searchParams.set('tab', 'portfolio');
		} else {
			url.searchParams.delete('tab');
		}
		history.pushState({}, '', url.toString());
	}
};

// DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', function () {
	console.log('[Blog] DOMContentLoaded - Running initial setup');
	console.log('[Blog] Initializing blog features');
	initializeBlogFeatures(document);
	
	if (window.initializeMobileTabs) {
		window.initializeMobileTabs();
	}
	
	initializeProjectToggle();
	initializePostsOnlyButton();
	
	const initialSearchInput = document.querySelector('#postSearch');
	if (initialSearchInput) {
		initializeSearchClearButton(initialSearchInput);
	}
	
	if (document.querySelector('.blog-content')) {
		console.log('[Blog] Found .blog-content, setting up dynamic navigation');
		setupDynamicBlogNavigation();
	}
});

// Also run if DOM is already loaded
if (document.readyState !== 'loading') {
	if (document.querySelector('.blog-content')) {
		setupDynamicBlogNavigation();
	}
	initializeBlogFeatures(document);
}

// Debug logging
(function() {
	console.log('[BlogDebug] Script loaded');
	
	// Check what functions are available
	setTimeout(() => {
		console.log('[BlogDebug] Checking available functions after 100ms:');
		console.log(' - window.handleDynamicLinkClick:', typeof window.handleDynamicLinkClick);
		console.log(' - window.fetchAndDisplayContent:', typeof window.fetchAndDisplayContent);
		console.log(' - window.setupDynamicBlogNavigation:', typeof window.setupDynamicBlogNavigation);
		console.log(' - window.initializeBlogFeatures:', typeof window.initializeBlogFeatures);
		console.log(' - window.handleSearch:', typeof window.handleSearch);
		console.log(' - window.initializePostsOnlyButton:', typeof window.initializePostsOnlyButton);
		console.log(' - window.legacyTabSwitch:', typeof window.legacyTabSwitch);
		
		// Check DOM elements
		console.log('[BlogDebug] .blog-content element:', document.querySelector('.blog-content'));
		
		// Check for links
		const postLinks = document.querySelectorAll('a.post-link-wrapper');
		const projectLinks = document.querySelectorAll('a.portfolio-item-wrapper, a.portfolio-item.has-writeup');
		console.log('[BlogDebug] Post links found:', postLinks.length);
		console.log('[BlogDebug] Project links found:', projectLinks.length);
		
		if (postLinks.length > 0) {
			console.log('[BlogDebug] First post link:', postLinks[0].href);
		}
	}, 100);
	
	// Also log when DOMContentLoaded fires
	document.addEventListener('DOMContentLoaded', () => {
		console.log('[BlogDebug] DOMContentLoaded fired');
		console.log('[BlogDebug] Functions at DOMContentLoaded:');
		console.log(' - window.handleDynamicLinkClick:', typeof window.handleDynamicLinkClick);
		console.log(' - window.fetchAndDisplayContent:', typeof window.fetchAndDisplayContent);
		console.log(' - window.setupDynamicBlogNavigation:', typeof window.setupDynamicBlogNavigation);
	});
})();

console.log('[Blog-Standalone] Script loaded successfully');