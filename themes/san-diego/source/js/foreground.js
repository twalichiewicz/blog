// Content data
const foregroundContent = {
	home: {
		icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
			<path d="M2 6V5H7V6H2Z" /><path d="M2 8V7H7V8H2Z" /><path d="M2 9V10H7V9H2Z" />
			<path d="M2 12V11H7V12H2Z" /><path d="M2 13V14H7V13H2Z" /><path d="M11 10V9H16V10H11Z" />
			<path d="M11 11V12H16V11H11Z" /><path d="M11 14V13H16V14H11Z" />
		</svg>`,
		title: "Introduction",
		content: `
			<p>At Human Interest—a mission-driven fintech empowering small and medium-sized businesses to offer 401(k) plans—I led the creation of a comprehensive design system that would unify all of our product interfaces. My goal was to craft a framework that balances brand identity and scalable functionality, enabling rapid product development while preserving a cohesive user experience.</p>
			<p>Working closely with cross-functional teams, I established a visual and interaction language robust enough to handle everything from complex forms to mobile dashboards. The result is a single source of truth for designers and developers, ensuring our products remain intuitively familiar and unmistakably Human Interest.</p>
			<img src="/2018/04/05/foreground/foreground-preview.jpg" alt="Design system preview">
			<div class='alert alert-yellow'>
				<div class='alert-inner'>
					<div class='alert-gutter'></div>
					<div class='alert-copy'>
						<span class='alert-copy-title'>Post in-progress</span>
						<span class='alert-copy-body'>This re-upload mostly contains the original content from the first write-up I did of this project for a Behance page several years ago, though I plan to go through and do a more complete write-up on what my process was for each aspect. If you want to view that version, <a href='foreground.jpg'>here you go!</a></span>
					</div>
				</div>
			</div>
		`
	},
	color: {
		icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 18">
			<path d="M0 17H16L8 1L0 17Z"/>
		</svg>`,
		title: "Color",
		content: `
			<p>Color is foundational to a product's personality and usability. Our palette was built not only to express brand essence but also to guide user focus and communicate status at a glance. I introduced a systematic approach to naming and usage—mapping a suite of hues and tints to specific roles, such as primary calls-to-action, success indicators, and subtle backgrounds.</p>
			<p>These guidelines guarantee consistency across the platform and make color application nearly foolproof in production. Furthermore, contrast ratios were rigorously tested to ensure full accessibility compliance, enabling all users to interact confidently with our tools.</p>
			<div class="color-tower">
				<div class="red-0"></div><div class="red-1"></div><div class="red-2"></div><div class="red-3"></div>
				<div class="red-4"></div><div class="red-5"></div><div class="red-6"></div><div class="red-7"></div>
				<div class="red-8"></div><div class="orange-0"></div><div class="orange-1"></div><div class="orange-2"></div>
				<div class="orange-3"></div><div class="orange-4"></div><div class="orange-5"></div><div class="orange-6"></div>
				<div class="orange-7"></div><div class="orange-8"></div><div class="green-0"></div><div class="green-1"></div>
				<div class="green-2"></div><div class="green-3"></div><div class="green-4"></div><div class="green-5"></div>
				<div class="green-6"></div><div class="green-7"></div><div class="green-8"></div><div class="blue-0"></div>
				<div class="blue-1"></div><div class="blue-2"></div><div class="blue-3"></div><div class="blue-4"></div>
				<div class="blue-5"></div><div class="blue-6"></div><div class="blue-7"></div><div class="blue-8"></div>
			</div>
		`
	},
	typography: {
		icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 18">
			<path fill-rule="evenodd" clip-rule="evenodd" d="M10 2.14364C11 1.15322 15 0.162795 15 2.14364C15 5.61013 13 7.09576 13 7.09576L5 13.0383C5 13.0383 1.88651 15.2851 1 16.0096C0.639373 16.3043 0.414048 16.5523 0.227306 16.7579C0.146968 16.8464 0.0737587 16.9269 0 17C2 12.0479 9 3.13407 10 2.14364ZM2 14.0287L10.5 3.13407C12 2.14364 13 2.14364 14 3.13407H12L13 4.12449H11L12 5.11491H10C9.50556 5.63131 2 14.0287 2 14.0287Z" />
			<path d="M0 17C0 17 13.6773 16.0309 14 16.0096C14.3227 15.9883 15 16.0096 15 16.5048C15 17 14 17 14 17H0Z" />
		</svg>`,
		title: "Typography",
		content: `
			<p>A well-defined typographic system lays the groundwork for visual hierarchy and readability. We selected a modern, highly legible typeface and standardized a responsive scale to cover every scenario—from in-depth data tables in analytics dashboards to user-friendly onboarding wizards.</p>
			<p>By defining spacing, weight, and size guidelines, I created a flexible system that prevents disjointed layouts and ensures fluid transitions between breakpoints. This consistent typography not only strengthens brand identity but also reduces design and engineering churn, as teams can quickly reference pre-approved styles without reinventing the wheel.</p>
			<img src="/2018/04/05/foreground/typography.jpg" alt="Typography system">
		`
	},
	iconography: {
		icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
			<path d="M4.99999 9.00001C5.73637 9.00001 6.33332 8.40306 6.33332 7.66668C6.33332 6.9303 5.73637 6.33334 4.99999 6.33334C4.26361 6.33334 3.66666 6.9303 3.66666 7.66668C3.66666 8.40306 4.26361 9.00001 4.99999 9.00001Z" />
			<path d="M11 9L12 10C12 10 11.5 12 9 12C6.5 12 6 10 6 10L7 9C7 9 7 11 9 11C11 11 11 9 11 9Z" />
			<path d="M14.3333 7.66668C14.3333 8.40306 13.7364 9.00001 13 9.00001C12.2636 9.00001 11.6667 8.40306 11.6667 7.66668C11.6667 6.9303 12.2636 6.33334 13 6.33334C13.7364 6.33334 14.3333 6.9303 14.3333 7.66668Z" />
			<path fill-rule="evenodd" clip-rule="evenodd" d="M18 9C18 13.9706 14 17 9 17C4 17 0 13.9706 0 9C0 4.02944 4 1 9 1C14 1 18 4.02944 18 9ZM17 9C17 13.4183 13.4444 16.1111 9 16.1111C4.55556 16.1111 1 13.4183 1 9C1 4.58172 4.55556 1.88889 9 1.88889C13.4444 1.88889 17 4.58172 17 9Z" />
		</svg>`,
		title: "Iconography",
		content: `
			<p>Our icon set is deliberately minimalistic yet expressive, designed to communicate core concepts instantly. By adhering to a shared geometry and stroke style, we produced a library where icons feel cohesive and easily recognizable.</p>
			<p>It's more than just aesthetics; strong iconography enhances navigation, reduces cognitive load, and provides universal cues for user actions. The collaborative documentation process I led allowed designers and developers to quickly locate, size, and color icons appropriately, speeding up implementation while preserving visual harmony throughout the platform.</p>
			<img src="/2018/04/05/foreground/hicons.jpg" alt="Icon system">
		`
	},
	components: {
		icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 18">
			<path d="M9 2V7C9 7.5 9.5 8 10 8H15C15.5 8 16 7.5 16 7V2C16 1.5 15.5 1 15 1H10C9.5 1 9 1.5 9 2Z" />
			<path d="M0 2V7C0 7.5 0.5 8 1 8H6C6.5 8 7 7.5 7 7V2C7 1.5 6.5 1 6 1H1C0.5 1 0 1.5 0 2Z" />
			<path d="M9 11V16C9 16.5 9.5 17 10 17H15C15.5 17 16 16.5 16 16V11C16 10.5 15.5 10 15 10H10C9.5 10 9 10.5 9 11Z" />
			<path d="M0 11V16C0 16.5 0.5 17 1 17H6C6.5 17 7 16.5 7 16V11C7 10.5 6.5 10 6 10H1C0.5 10 0 10.5 0 11Z" />
		</svg>`,
		title: "Components",
		content: `
			<p>The real engine of this system is our component library—modular, reusable building blocks that form the backbone of every product flow. Each component was meticulously documented, from interaction states to edge-case behaviors. This unwavering clarity means designers and engineers can confidently integrate components, knowing they'll look and behave consistently.</p>
			<p>I also focused on scalability: components are designed to adapt seamlessly to varied contexts or device types, cutting down on repetitive custom solutions. In effect, we've established an ecosystem that drives rapid prototyping, consistent brand storytelling, and future-proof design patterns.</p>
			<img src="/2018/04/05/foreground/componentsPreview.png" alt="Component system">
		`
	},
	application: {
		icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
			<path fill-rule="evenodd" clip-rule="evenodd" d="M1.2 14H7V16H5C5 16 4 16 4 16.5C4 17 5 17 5 17H13C13 17 14 17 14 16.5C14 16 13 16 13 16H11V14H16.8C17.4 14 18 13.4 18 12.8V3.2C18 2.6 17.4 2 16.8 2H1.2C0.6 2 0 2.6 0 3.2V12.8C0 13.4 0.6 14 1.2 14ZM1 3H17V11H1V3ZM17 12H1V13H17V12Z" />
		</svg>`,
		title: "Application",
		content: `
			<p>When these components and guidelines converge in production, the impact is immediate. Page construction becomes as simple as assembling a puzzle: color, typography, iconography, and interactivity fit together flawlessly. This orchestrated approach not only accelerates time to market but also enforces a top-tier user experience across the entire product suite.</p>
			<p>Engineers benefit from streamlined code and reduced QA cycles, while product managers appreciate the predictability and reliability of new feature rollouts. Ultimately, this design system liberates teams to concentrate on strategic challenges—like refining user flows or exploring new functionality—rather than rehashing design fundamentals.</p>
			<img src="/2018/04/05/foreground/redesigned-admin.jpg" alt="Dashboard example">
			<img src="/2018/04/05/foreground/onboarding-fauxdal.jpg" alt="Modal example">
		`
	}
};

class ForegroundProject {
	constructor() {
		this.container = document.querySelector('.center-container');
		this.init();
	}

	init() {
		this.renderSections();
		this.setupEventListeners();
	}

	renderSections() {
		const sections = Object.entries(foregroundContent).map(([id, content]) => `
			<div class="foreground-project-section" data-section="${id}">
				<div class="foreground-project-section-header">
					<h2>
						${content.icon}
						${content.title}
					</h2>
					<svg class="expand-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
					</svg>
				</div>
				<div class="foreground-project-section-content">
					${content.content}
				</div>
			</div>
		`).join('');

		this.container.innerHTML = sections;
	}

	setupEventListeners() {
		const sections = document.querySelectorAll('.foreground-project-section');

		sections.forEach(section => {
			const header = section.querySelector('.foreground-project-section-header');
			const content = section.querySelector('.foreground-project-section-content');
			const expandIcon = header.querySelector('.expand-icon');

			header.addEventListener('click', () => {
				const isExpanded = content.classList.contains('expanded');

				// Close all sections first
				sections.forEach(s => {
					s.querySelector('.foreground-project-section-content').classList.remove('expanded');
					s.querySelector('.expand-icon').classList.remove('expanded');
				});

				// Toggle clicked section
				if (!isExpanded) {
					content.classList.add('expanded');
					expandIcon.classList.add('expanded');

					// Scroll section into view if needed
					setTimeout(() => {
						const headerRect = header.getBoundingClientRect();
						if (headerRect.top < 0) {
							header.scrollIntoView({ behavior: 'smooth' });
						}
					}, 300);
				}
			});
		});

		// Open first section by default
		const firstSection = sections[0];
		if (firstSection) {
			firstSection.querySelector('.foreground-project-section-content').classList.add('expanded');
			firstSection.querySelector('.expand-icon').classList.add('expanded');
		}
	}
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	new ForegroundProject();
}); 