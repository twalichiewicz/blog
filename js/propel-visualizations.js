class PropelVisualizations {
	constructor() {
		this.init();
		this.setupCounters();
		this.setupImageParallax();
		this.setupMoneyPattern();
		this.setupModalAnimations();
	}

	init() {
		this.setupVideo();
		this.setupSpendingGraph();
		this.setupTransactionData();
		this.setupComparisonChart();
		this.setupScrollAnimations();
	}

	setupCounters() {
		const counters = document.querySelectorAll('.counter');

		counters.forEach(counter => {
			const parent = counter.closest('.stat-item');
			const targetValue = parseFloat(parent.dataset.value);

			this.animateOnScroll(parent, () => {
				this.animateValue(counter, 0, targetValue, 2000);
			});
		});
	}

	animateValue(element, start, end, duration) {
		let startTimestamp = null;
		const step = (timestamp) => {
			if (!startTimestamp) startTimestamp = timestamp;
			const progress = Math.min((timestamp - startTimestamp) / duration, 1);
			const value = start + (end - start) * this.easeOutCubic(progress);

			if (element.textContent.includes('in')) {
				element.textContent = `1 in ${Math.floor(value)}`;
			} else {
				element.textContent = Math.floor(value);
			}

			if (progress < 1) {
				window.requestAnimationFrame(step);
			}
		};
		window.requestAnimationFrame(step);
	}

	easeOutCubic(x) {
		return 1 - Math.pow(1 - x, 3);
	}

	setupImageParallax() {
		const images = document.querySelectorAll('.solution-image, .analysis-image');
		let ticking = false;

		const updateParallax = () => {
			images.forEach(img => {
				const rect = img.getBoundingClientRect();
				const windowHeight = window.innerHeight;

				if (rect.top < windowHeight && rect.bottom > 0) {
					const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
					const translateY = scrollPercent * 30;
					// Use transform3d for better performance
					img.style.transform = `translate3d(0, ${translateY}px, 0)`;
				}
			});
			ticking = false;
		};

		const requestTick = () => {
			if (!ticking) {
				requestAnimationFrame(updateParallax);
				ticking = true;
			}
		};

		window.addEventListener('scroll', requestTick, { passive: true });
	}

	setupSpendingGraph() {
		const ctx = document.querySelector('.problem-visualization');
		if (!ctx) return;

		const canvas = document.createElement('canvas');
		ctx.appendChild(canvas);

		// Get the RGB values from CSS variables
		const computedStyle = getComputedStyle(document.documentElement);
		const propelGreenRGB = computedStyle.getPropertyValue('--propel-green-rgb').trim() || '0, 168, 98';
		const textColorRGB = computedStyle.getPropertyValue('--propel-text').trim() === '#FFFFFF' ? '255, 255, 255' : '29, 29, 31';
		const borderColorRGB = computedStyle.getPropertyValue('--propel-border').trim();

		const gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, 400);
		gradient.addColorStop(0, `rgba(${propelGreenRGB}, 0.15)`);
		gradient.addColorStop(1, `rgba(${propelGreenRGB}, 0)`);

		const data = {
			labels: Array.from({ length: 31 }, (_, i) => i + 1),
			datasets: [{
				label: 'Actual, 2016',
				data: Array.from({ length: 31 }, (_, i) => {
					if (i === 0) return 100;
					if (i === 2) return 70;
					if (i === 6) return 40;
					if (i >= 9 && i <= 10) return 20;
					if (i === 11) return 18;
					if (i === 12) return 10;
					if (i >= 13 && i <= 15) return 9;
					if (i === 18) return 5;
					if (i >= 21 && i <= 30) return 0;
					return null;  // return null for all other points to create gaps
				}),
				borderColor: 'rgb(255, 105, 105)',
				backgroundColor: gradient,
				fill: true,
				tension: 0.4,
				borderWidth: 3,
				spanGaps: true,
				pointRadius: 0
			},
			{
				label: 'Ideal',
				data: Array.from({ length: 31 }, (_, i) => 100 * (1 - i / 30)),
				borderColor: `rgb(${propelGreenRGB})`,
				borderDash: [5, 5],
				fill: false,
				tension: 0,
				borderWidth: 1.5,
				pointRadius: 0
			},
			{
				label: 'USDA, 2009',
				data: Array.from({ length: 31 }, (_, i) => {
					if (i === 0) return 100;
					if (i === 1) return 80;  // at 1.5 days
					if (i === 6) return 40;
					if (i === 15) return 20;
					if (i === 21) return 10;
					if (i === 30) return 0;
					return null;  // return null for all other points to create gaps
				}),
				borderColor: 'rgb(172, 142, 255)',
				borderDash: [2, 2],
				fill: false,
				stepped: false,
				tension: 0,
				borderWidth: 1.5,
				spanGaps: true,
				pointRadius: 0
			}]
		};

		const chart = new Chart(canvas, {
			type: 'line',
			data: data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: {
					duration: 2000,
					easing: 'easeInOutQuart'
				},
				interaction: {
					intersect: false,
					mode: 'index'
				},
				plugins: {
					tooltip: {
						backgroundColor: 'rgba(0, 0, 0, 0.85)',
						titleColor: '#FFFFFF',
						bodyColor: 'rgba(255, 255, 255, 0.8)',
						borderColor: 'rgba(255, 255, 255, 0.1)',
						borderWidth: 1,
						padding: 12,
						displayColors: true,
						titleFont: {
							family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
							weight: 600,
							size: 13
						},
						bodyFont: {
							family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
							size: 12
						},
						callbacks: {
							label: (context) => `${context.dataset.label}: ${Math.round(context.raw)}%`
						}
					},
					legend: {
						display: true,
						position: 'top',
						align: 'end',
						labels: {
							color: 'var(--propel-text)',
							font: {
								family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
								size: 12
							},
							boxWidth: 12,
							padding: 15,
							usePointStyle: false
						},
						maxHeight: 40
					},
					annotation: {
						annotations: {
							line1: {
								type: 'line',
								xMin: 9,
								xMax: 9,
								borderColor: `rgba(${textColorRGB}, 0.3)`,
								borderWidth: 1,
								shadowOffsetX: 4,
								shadowBlur: 8,
								shadowColor: `rgba(${textColorRGB}, 0.1)`,
								label: {
									content: '9',
									enabled: true,
									position: 'top',
									backgroundColor: 'transparent',
									color: `rgba(${textColorRGB}, 1)`,
									font: {
										weight: 'bold',
										size: 14,
										family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
									},
									yAdjust: -10
								}
							}
						}
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						max: 100,
						grid: {
							color: `rgba(${textColorRGB}, 0.1)`,
							drawBorder: false,
							drawTicks: false
						},
						ticks: {
							font: {
								family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
								size: 12
							},
							color: 'var(--propel-text-secondary)',
							padding: 8,
							callback: (value) => value % 20 === 0 ? `${value}%` : '',
							stepSize: 20
						},
						border: {
							display: false
						},
						title: {
							display: true,
							text: 'Percentage of balance',
							color: 'var(--propel-text)',
							font: {
								family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
								size: 14,
								weight: 500
							},
							padding: { bottom: 10 }
						}
					},
					x: {
						grid: {
							display: false,
							drawBorder: false,
							drawTicks: false
						},
						ticks: {
							font: {
								family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
								size: 12
							},
							color: 'var(--propel-text-secondary)',
							padding: 8,
							maxRotation: 0,
							callback: (value) => value % 3 === 0 ? `${value}` : ''
						},
						border: {
							display: false
						},
						title: {
							display: true,
							text: 'Days after benefit deposit',
							color: 'var(--propel-text)',
							font: {
								family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
								size: 14,
								weight: 500
							},
							padding: { top: 10 }
						}
					}
				}
			}
		});

		// Add resize handler to update gradient
		const updateGradient = () => {
			const newGradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, canvas.height);
			const currentPropelGreenRGB = getComputedStyle(document.documentElement).getPropertyValue('--propel-green-rgb').trim() || '0, 168, 98';
			const currentTextColorRGB = getComputedStyle(document.documentElement).getPropertyValue('--propel-text').trim() === '#FFFFFF' ? '255, 255, 255' : '29, 29, 31';

			newGradient.addColorStop(0, `rgba(${currentPropelGreenRGB}, 0.15)`);
			newGradient.addColorStop(1, `rgba(${currentPropelGreenRGB}, 0)`);

			chart.data.datasets[0].backgroundColor = newGradient;
			chart.data.datasets[0].borderColor = `rgb(${currentPropelGreenRGB})`;

			chart.options.scales.y.grid.color = `rgba(${currentTextColorRGB}, 0.1)`;

			chart.update('none');
		};

		window.addEventListener('resize', updateGradient);

		// Handle dark mode changes
		const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		darkModeMediaQuery.addEventListener('change', updateGradient);

		// Animate chart on scroll
		this.animateOnScroll(ctx, () => {
			chart.show(0);
		});
	}

	setupScrollAnimations() {
		// Handle each section independently
		const sections = document.querySelectorAll('.propel-case-study section');

		sections.forEach(section => {
			const contentWrap = section.querySelector('.content-wrap');
			if (!contentWrap) return;

			// Create observer for the content wrap
			this.animateOnScroll(contentWrap, () => {
				// First make the content-wrap itself visible
				contentWrap.classList.add('visible');

				// Then handle all direct children with staggered delays
				const children = contentWrap.children;
				Array.from(children).forEach((child, index) => {
					setTimeout(() => {
						// Make the child visible
						child.classList.add('visible');

						// Handle nested elements within this child
						const nestedElements = child.querySelectorAll('h1, h2, h3, p, .button-group, .app-store-button, blockquote, cite, .feature-card');
						nestedElements.forEach((nested, nestedIndex) => {
							setTimeout(() => {
								nested.classList.add('visible');
							}, nestedIndex * 100); // 100ms delay between nested elements
						});

						// Special handling for specific components
						if (child.classList.contains('features-grid')) {
							const featureCards = child.querySelectorAll('.feature-card');
							featureCards.forEach((card, cardIndex) => {
								setTimeout(() => {
									card.classList.add('visible');
									card.querySelectorAll('h3, p').forEach(el => el.classList.add('visible'));
								}, cardIndex * 150); // 150ms delay between features
							});
						}

						if (child.classList.contains('stats-grid')) {
							const statItems = child.querySelectorAll('.stat-item');
							statItems.forEach((item, statIndex) => {
								setTimeout(() => {
									item.classList.add('visible');
								}, statIndex * 150); // 150ms delay between stats
							});
						}

						if (child.classList.contains('solution-showcase')) {
							const image = child.querySelector('.solution-image');
							const details = child.querySelector('.solution-details');
							if (image) image.classList.add('visible');
							if (details) {
								details.classList.add('visible');
								details.querySelectorAll('h3, p').forEach(el => el.classList.add('visible'));
							}
						}

						if (child.classList.contains('impact-showcase')) {
							const stats = child.querySelectorAll('.impact-stat');
							const quote = child.querySelector('.impact-quote');
							stats.forEach((stat, statIndex) => {
								setTimeout(() => {
									stat.classList.add('visible');
									stat.querySelectorAll('h3, p').forEach(el => el.classList.add('visible'));
								}, statIndex * 150);
							});
							if (quote) {
								setTimeout(() => {
									quote.classList.add('visible');
									quote.querySelectorAll('blockquote, cite').forEach(el => el.classList.add('visible'));
								}, stats.length * 150);
							}
						}
					}, index * 200); // 200ms delay between main children
				});
			});
		});
	}

	// Transaction data visualization
	setupTransactionData() {
		const container = document.querySelector('.transaction-visualization');
		if (!container) return;

		const width = container.offsetWidth;
		const height = container.offsetHeight;

		const two = new Two({
			width: width,
			height: height,
			autostart: true
		}).appendTo(container);

		// Create dots representing transactions
		const transactions = this.generateTransactionData();
		transactions.forEach(t => {
			const circle = two.makeCircle(t.x * width, t.y * height, 4);
			circle.fill = '#ffffff';
			circle.opacity = 0.6;

			// Animate on scroll
			circle.translation.set(t.x * width, t.y * height + 50);
			circle.opacity = 0;

			this.animateOnScroll(container, () => {
				circle.opacity = 0.6;
				circle.translation.set(t.x * width, t.y * height);
			});
		});
	}

	// Before/After comparison chart
	setupComparisonChart() {
		const container = document.querySelector('.solution-comparison');
		if (!container) return;

		const beforeData = this.generateSpendingData(true);
		const afterData = this.generateSpendingData(false);

		const canvas = document.createElement('canvas');
		container.appendChild(canvas);

		new Chart(canvas, {
			type: 'line',
			data: {
				labels: Array.from({ length: 31 }, (_, i) => i + 1),
				datasets: [{
					label: 'Before Fresh EBT',
					data: beforeData,
					borderColor: '#ff6b6b',
					backgroundColor: 'rgba(255, 107, 107, 0.1)',
					fill: true
				}, {
					label: 'With Fresh EBT',
					data: afterData,
					borderColor: '#4ecdc4',
					backgroundColor: 'rgba(78, 205, 196, 0.1)',
					fill: true
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: {
					duration: 2000,
					easing: 'easeInOutQuart'
				}
			}
		});
	}

	// Helper methods
	generateSpendingData(rapid = true) {
		const data = [];
		let balance = 250;

		for (let i = 0; i < 31; i++) {
			if (rapid) {
				balance -= balance * (0.2 - (i * 0.005));
			} else {
				balance -= balance * (0.1 - (i * 0.002));
			}
			data.push(Math.max(0, balance));
		}

		return data;
	}

	generateTransactionData() {
		const transactions = [];
		for (let i = 0; i < 100; i++) {
			transactions.push({
				x: Math.random(),
				y: Math.random(),
				amount: Math.random() * 100
			});
		}
		return transactions;
	}

	// Scroll animation helper with improved threshold handling
	animateOnScroll(element, callback) {
		if (!element) return;

		let ticking = false;

		const checkElement = () => {
			const rect = element.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			const threshold = 0.1; // 10% of element height

			if (rect.top < windowHeight - (rect.height * threshold) &&
				rect.bottom > (rect.height * threshold)) {
				callback();
				// Remove listener after animation to prevent unnecessary calls
				window.removeEventListener('scroll', requestTick);
			}
			ticking = false;
		};

		const requestTick = () => {
			if (!ticking) {
				requestAnimationFrame(checkElement);
				ticking = true;
			}
		};

		// Initial check
		checkElement();

		// Add scroll listener with passive flag for better performance
		window.addEventListener('scroll', requestTick, { passive: true });
	}

	setupVideo() {
		const video = document.querySelector('.hero-video');
		if (!video) return;

		// Handle video loading
		video.addEventListener('loadeddata', () => {
			video.style.opacity = '1';
		});

		// Handle video error
		video.addEventListener('error', () => {
			console.warn('Video failed to load, falling back to poster image');
			// The fallback image will automatically show
		});

		// Force video reload if it fails to play
		setTimeout(() => {
			if (video.readyState === 0) {
				video.load();
			}
		}, 1000);
	}

	setupMoneyPattern() {
		const pattern = document.querySelector('.money-pattern');
		if (!pattern) return;

		// Create 20 money emojis
		for (let i = 0; i < 20; i++) {
			const money = document.createElement('span');
			money.textContent = '💸';
			money.style.position = 'absolute';
			money.style.fontSize = '32px';
			money.style.left = `${Math.random() * 100}vw`;
			money.style.top = `${Math.random() * 100}vh`;
			money.style.animation = `flyMoney ${10 + Math.random() * 20}s linear ${Math.random() * 10}s infinite`;
			money.style.opacity = '0';
			pattern.appendChild(money);
		}
	}

	setupModalAnimations() {
		const modal = document.getElementById('tldrModal');
		const modalContent = modal.querySelector('.modal-content');
		const openButtons = document.querySelectorAll('[data-open-modal]');
		const closeButtons = document.querySelectorAll('[data-close-modal]');

		const openModal = () => {
			document.body.classList.add('modal-open');
			modal.classList.add('active');
			// Start content animation after modal is visible
			requestAnimationFrame(() => {
				modalContent.classList.add('animate-in');
			});
		};

		const closeModal = () => {
			modalContent.classList.remove('animate-in');
			modalContent.classList.add('animate-out');

			// Wait for content animation to finish before closing modal
			setTimeout(() => {
				document.body.classList.remove('modal-open');
				modal.classList.remove('active');
				modalContent.classList.remove('animate-out');
			}, 300);
		};

		openButtons.forEach(button => {
			button.addEventListener('click', openModal);
		});

		closeButtons.forEach(button => {
			button.addEventListener('click', closeModal);
		});

		// Close on background click
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				closeModal();
			}
		});

		// Close on escape key
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && modal.classList.contains('active')) {
				closeModal();
			}
		});
	}
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	// Initialize visualizations
	new PropelVisualizations();

	// Add data attributes to modal buttons
	document.querySelectorAll('.tldr-button, .floating-tldr button').forEach(button => {
		button.setAttribute('data-open-modal', 'tldr');
	});
	document.querySelectorAll('.close-button').forEach(button => {
		button.setAttribute('data-close-modal', 'tldr');
	});

	// Update Propel logo colors for dark mode compatibility
	const propelLogo = document.querySelector('.hero-section svg[astro-icon="logo"]');
	if (propelLogo) {
		// Text paths (previously black)
		const textPaths = propelLogo.querySelectorAll('path[fill="black"]:not([stroke])');
		textPaths.forEach(path => {
			path.setAttribute('fill', 'var(--propel-text)');
		});

		// Logo icon paths (with both fill and stroke)
		const iconPaths = propelLogo.querySelectorAll('path[stroke="black"]');
		iconPaths.forEach(path => {
			path.setAttribute('stroke', 'var(--propel-text)');
			if (path.getAttribute('fill') === 'black') {
				path.setAttribute('fill', 'var(--propel-text)');
			}
		});

		// Special colored paths
		const greenPath = propelLogo.querySelector('path[fill="#8BC95A"]');
		if (greenPath) {
			greenPath.setAttribute('fill', 'var(--propel-green)');
			greenPath.setAttribute('stroke', 'var(--propel-text)');
		}
	}
}); 