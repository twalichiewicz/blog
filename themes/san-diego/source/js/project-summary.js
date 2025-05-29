function initializeProjectSummary(container = document) {
	const projectSummary = container.querySelector('.project-summary');

	if (!projectSummary) return;

	// Remove any existing event listeners to prevent duplicates
	const existingButtons = projectSummary.querySelectorAll('.summary-tab-button');
	existingButtons.forEach(button => {
		// Clone the button to remove all event listeners
		const newButton = button.cloneNode(true);
		button.parentNode.replaceChild(newButton, button);
	});

	// Get fresh references after cloning
	const summaryButtons = projectSummary.querySelectorAll('.summary-tab-button');
	const summaryPanels = projectSummary.querySelectorAll('.summary-panel');

	function switchSummaryTab(targetTab) {
		// Remove active class from all buttons and panels using fresh queries
		const allButtons = projectSummary.querySelectorAll('.summary-tab-button');
		const allPanels = projectSummary.querySelectorAll('.summary-panel');

		allButtons.forEach(button => button.classList.remove('active'));
		allPanels.forEach(panel => panel.classList.remove('active'));

		// Add active class to clicked button
		const activeButton = projectSummary.querySelector(`[data-tab="${targetTab}"]`);
		if (activeButton) {
			activeButton.classList.add('active');
		}

		// Show corresponding panel
		const activePanel = projectSummary.querySelector(`#${targetTab}`);
		if (activePanel) {
			activePanel.classList.add('active');
		}
	}

	// Add click event listeners to summary buttons
	summaryButtons.forEach(button => {
		button.addEventListener('click', function () {
			const targetTab = this.getAttribute('data-tab');
			switchSummaryTab(targetTab);
		});
	});

	// Keyboard navigation
	projectSummary.addEventListener('keydown', function (e) {
		if (e.target.classList.contains('summary-tab-button')) {
			const currentButtons = projectSummary.querySelectorAll('.summary-tab-button');
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
	summaryButtons.forEach((button, index) => {
		button.setAttribute('role', 'tab');
		button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
		button.setAttribute('tabindex', index === 0 ? '0' : '-1');
		button.setAttribute('id', `summary-tab-${button.getAttribute('data-tab')}`);
		button.setAttribute('aria-controls', button.getAttribute('data-tab'));
	});

	summaryPanels.forEach((panel, index) => {
		panel.setAttribute('role', 'tabpanel');
		panel.setAttribute('aria-labelledby', `summary-tab-${panel.id}`);
		panel.setAttribute('tabindex', '0');
	});

	// Set up tab list container
	const summaryNavigation = projectSummary.querySelector('.summary-navigation');
	if (summaryNavigation) {
		summaryNavigation.setAttribute('role', 'tablist');
		summaryNavigation.setAttribute('aria-label', 'Project summary tabs');
	}
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function () {
	initializeProjectSummary();
});

// Make the function available globally for dynamic content loading
window.initializeProjectSummary = initializeProjectSummary; 