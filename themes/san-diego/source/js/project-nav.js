document.addEventListener('DOMContentLoaded', () => {
	const nav = document.querySelector('.project-sticky-nav');
	let lastScrollY = window.scrollY;

	// Enhanced scroll handling for smooth transitions
	window.addEventListener('scroll', () => {
		requestAnimationFrame(() => {
			// Only handle nav visibility
			if (window.scrollY > lastScrollY && window.scrollY > 100) {
				nav.classList.add('project-nav-hidden');
			} else {
				nav.classList.remove('project-nav-hidden');
			}
			lastScrollY = window.scrollY;
		});
	});

	// Enhanced section highlighting
	const observerOptions = {
		root: null,
		rootMargin: '-20% 0px -70% 0px',
		threshold: 0
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				// Remove active class from all links
				document.querySelectorAll('.project-section-links a').forEach(link => {
					link.classList.remove('active');
				});

				// Add active class to corresponding link
				const activeLink = document.querySelector(`.project-section-links a[href="#${entry.target.id}"]`);
				if (activeLink) {
					activeLink.classList.add('active');
				}
			}
		});
	}, observerOptions);

	// Observe all section headers
	document.querySelectorAll('h2').forEach(section => {
		if (!section.id) {
			section.id = section.textContent.toLowerCase()
				.replace(/[^\w\s-]/g, '')
				.replace(/\s+/g, '-');
		}
		observer.observe(section);
	});

	// Smooth scroll with dynamic offset
	document.querySelectorAll('.project-section-links a').forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			const targetId = link.getAttribute('href').slice(1);
			const targetElement = document.getElementById(targetId);

			if (targetElement) {
				const offset = nav.offsetHeight + 20; // Added padding
				const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

				window.scrollTo({
					top: targetPosition,
					behavior: 'smooth'
				});
			}
		});
	});

	// Add scroll-based animations
	const animateOnScroll = () => {
		const elements = document.querySelectorAll('.animate-on-scroll');
		elements.forEach(element => {
			const elementTop = element.getBoundingClientRect().top;
			const elementBottom = element.getBoundingClientRect().bottom;

			if (elementTop < window.innerHeight * 0.8 && elementBottom > 0) {
				element.classList.add('visible');
			}
		});
	};

	window.addEventListener('scroll', () => {
		requestAnimationFrame(animateOnScroll);
	});
}); 