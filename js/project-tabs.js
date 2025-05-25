function initializeProjectTabs(container = document) {
	const projectTabs = container.querySelector('.project-tabs');

	if (!projectTabs) return;

	// Remove any existing event listeners to prevent duplicates
	const existingButtons = projectTabs.querySelectorAll('.tab-button');
	existingButtons.forEach(button => {
		// Clone the button to remove all event listeners
		const newButton = button.cloneNode(true);
		button.parentNode.replaceChild(newButton, button);
	});

	// Get fresh references after cloning
	const tabButtons = projectTabs.querySelectorAll('.tab-button');
	const tabPanels = projectTabs.querySelectorAll('.tab-panel');

	function switchTab(targetTab) {
		// Remove active class from all buttons and panels using fresh queries
		const allButtons = projectTabs.querySelectorAll('.tab-button');
		const allPanels = projectTabs.querySelectorAll('.tab-panel');

		allButtons.forEach(button => button.classList.remove('active'));
		allPanels.forEach(panel => panel.classList.remove('active'));

		// Add active class to clicked button
		const activeButton = projectTabs.querySelector(`[data-tab="${targetTab}"]`);
		if (activeButton) {
			activeButton.classList.add('active');
		}

		// Show corresponding panel
		const activePanel = projectTabs.querySelector(`#${targetTab}`);
		if (activePanel) {
			activePanel.classList.add('active');
		}
	}

	// Add click event listeners to tab buttons
	tabButtons.forEach(button => {
		button.addEventListener('click', function () {
			const targetTab = this.getAttribute('data-tab');
			switchTab(targetTab);
		});
	});

	// Keyboard navigation
	projectTabs.addEventListener('keydown', function (e) {
		if (e.target.classList.contains('tab-button')) {
			const currentButtons = projectTabs.querySelectorAll('.tab-button');
			const currentIndex = Array.from(currentButtons).indexOf(e.target);
			let newIndex;

			switch (e.key) {
				case 'ArrowLeft':
					e.preventDefault();
					newIndex = currentIndex > 0 ? currentIndex - 1 : currentButtons.length - 1;
					currentButtons[newIndex].focus();
					currentButtons[newIndex].click();
					break;
				case 'ArrowRight':
					e.preventDefault();
					newIndex = currentIndex < currentButtons.length - 1 ? currentIndex + 1 : 0;
					currentButtons[newIndex].focus();
					currentButtons[newIndex].click();
					break;
				case 'Home':
					e.preventDefault();
					currentButtons[0].focus();
					currentButtons[0].click();
					break;
				case 'End':
					e.preventDefault();
					currentButtons[currentButtons.length - 1].focus();
					currentButtons[currentButtons.length - 1].click();
					break;
			}
		}
	});

	// Add ARIA attributes for accessibility
	tabButtons.forEach((button, index) => {
		button.setAttribute('role', 'tab');
		button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
		button.setAttribute('tabindex', index === 0 ? '0' : '-1');
		button.setAttribute('id', `tab-${button.getAttribute('data-tab')}`);
		button.setAttribute('aria-controls', button.getAttribute('data-tab'));
	});

	tabPanels.forEach((panel, index) => {
		panel.setAttribute('role', 'tabpanel');
		panel.setAttribute('aria-labelledby', `tab-${panel.id}`);
		panel.setAttribute('tabindex', '0');
	});

	// Set up tab list container
	const tabNavigation = projectTabs.querySelector('.tab-navigation');
	if (tabNavigation) {
		tabNavigation.setAttribute('role', 'tablist');
		tabNavigation.setAttribute('aria-label', 'Project information tabs');
	}
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function () {
	initializeProjectTabs();
});

// Make the function available globally for dynamic content loading
window.initializeProjectTabs = initializeProjectTabs; 