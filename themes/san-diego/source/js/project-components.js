class ProjectComponents {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
  }

  setupScrollAnimations() {
    const animatedElements = document.querySelectorAll([
      'section .content-wrap',
      '.hero-section *[class]',
      '.stats-grid',
      '.problem-visualization',
      '.research-insights',
      '.solution-features',
      '.impact-quote',
      '.vision-highlights'
    ].join(','));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '-10% 0px'
      }
    );

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ProjectComponents();
}); 