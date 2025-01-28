class PropelVisualizations {
  constructor() {
    this.init();
  }

  init() {
    this.setupVideo();
    this.setupSpendingGraph();
    this.setupTransactionData();
    this.setupComparisonChart();
  }

  // Spending pattern visualization using Chart.js
  setupSpendingGraph() {
    const ctx = document.querySelector('.problem-visualization');
    if (!ctx) return;

    // Create canvas element
    const canvas = document.createElement('canvas');
    ctx.appendChild(canvas);

    const data = {
      labels: Array.from({length: 31}, (_, i) => i + 1), // Days 1-31
      datasets: [{
        label: 'Benefit Balance',
        data: this.generateSpendingData(),
        borderColor: '#86868b',
        backgroundColor: 'rgba(134, 134, 139, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };

    new Chart(canvas, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 250,
            title: {
              display: true,
              text: 'Balance ($)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Days in Month'
            }
          }
        }
      }
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
        labels: Array.from({length: 31}, (_, i) => i + 1),
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

  // Scroll animation helper
  animateOnScroll(element, callback) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2
      }
    );

    observer.observe(element);
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PropelVisualizations();
}); 