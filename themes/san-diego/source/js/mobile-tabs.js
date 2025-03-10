document.addEventListener('DOMContentLoaded', function () {
	// Skip initialization on desktop devices
	if (document.body.classList.contains('device-desktop')) {
		return;
	}

	const tabContainer = document.querySelector('.mobile-tabs');

	// Only initialize if we have a tab container
	if (!tabContainer) return;

	const tabButtons = document.querySelectorAll('.tab-button');
	const postsContent = document.getElementById('postsContent');
	const projectsContent = document.getElementById('projectsContent');
	const searchBar = document.querySelector('.search-bar');

	// Set initial state
	const initialTab = tabContainer.getAttribute('data-active-tab') || 'blog';
	tabContainer.setAttribute('data-active-tab', initialTab);
	showContent(initialTab);

	// Add click handlers for tab buttons
	tabButtons.forEach(button => {
		button.addEventListener('click', () => {
			const type = button.dataset.type;
			switchTab(type);
		});
	});

	function switchTab(type) {
		const currentTab = tabContainer.getAttribute('data-active-tab');
		if (currentTab === type) return;

		tabButtons.forEach(b => {
			b.classList.remove('active');
			if (b.getAttribute('data-type') === type) {
				b.classList.add('active');
			}
		});

		tabContainer.setAttribute('data-active-tab', type);
		showContent(type);
	}

	function showContent(type) {
		if (!postsContent || !projectsContent) return;

		if (type === 'blog') {
			postsContent.style.display = 'block';
			projectsContent.style.display = 'none';
			if (searchBar) searchBar.style.display = 'block';
		} else if (type === 'portfolio') {
			postsContent.style.display = 'none';
			projectsContent.style.display = 'block';
			if (searchBar) searchBar.style.display = 'none';
		}

		// Update post dividers visibility
		const visiblePosts = document.querySelectorAll('.post-list-item[style*="display: block"]');
		const dividers = document.querySelectorAll('.post-divider');

		dividers.forEach((divider, index) => {
			const shouldShow = index < visiblePosts.length - 1;
			divider.style.display = shouldShow ? 'block' : 'none';
		});
	}

	// Handle device orientation changes
	window.addEventListener('orientationchange', () => {
		setTimeout(() => {
			// Re-apply current tab state
			const currentTab = tabContainer.getAttribute('data-active-tab') || 'blog';
			showContent(currentTab);
		}, 100);
	});
});