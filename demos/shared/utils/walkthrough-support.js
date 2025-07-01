// Demo Walkthrough Support
// Utility for demos to communicate with parent page walkthrough system

export class WalkthroughSupport {
  constructor(steps = []) {
    this.steps = steps;
    this.currentStep = -1;
    this.callbacks = new Map();
    this.isActive = false;
    
    console.log('[WalkthroughSupport] Initialized with', steps.length, 'steps');
    
    // Listen for parent messages
    window.addEventListener('message', this.handleMessage.bind(this));
    
    // Don't notify immediately - wait for parent to ask
    // This avoids race conditions where parent isn't ready yet
  }
  
  handleMessage(event) {
    if (!event.data || typeof event.data !== 'object') return;
    
    console.log('[WalkthroughSupport] Received message:', event.data.type);
    
    switch (event.data.type) {
      case 'checkWalkthroughSupport':
        console.log('[WalkthroughSupport] Responding to checkWalkthroughSupport');
        if (this.steps.length > 0) {
          this.notifyParent('walkthroughSupported', { steps: this.steps });
        }
        break;
        
      case 'startDemoOnboarding':
        this.start();
        break;
        
      case 'walkthroughStep':
        this.goToStep(event.data.step);
        break;
        
      case 'endWalkthrough':
        this.end();
        break;
    }
  }
  
  notifyParent(type, data = {}) {
    console.log('[WalkthroughSupport] Notifying parent:', type, data);
    if (window.parent !== window) {
      window.parent.postMessage({ type, ...data }, '*');
    }
  }
  
  start() {
    this.isActive = true;
    this.goToStep(0);
  }
  
  end() {
    this.isActive = false;
    this.currentStep = -1;
    this.trigger('end');
    this.notifyParent('walkthroughEnded');
  }
  
  goToStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this.steps.length) return;
    
    // End previous step
    if (this.currentStep >= 0) {
      this.trigger('stepEnd', this.currentStep);
    }
    
    this.currentStep = stepIndex;
    const step = this.steps[stepIndex];
    
    // Trigger step start
    this.trigger('stepStart', stepIndex, step);
    
    // Auto-complete steps that don't require interaction
    if (step.autoComplete) {
      setTimeout(() => {
        this.completeStep();
      }, step.duration || 2000);
    }
  }
  
  completeStep() {
    this.notifyParent('walkthroughStepCompleted', { step: this.currentStep });
  }
  
  // Event handling
  on(event, callback) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event).push(callback);
  }
  
  off(event, callback) {
    if (!this.callbacks.has(event)) return;
    
    const callbacks = this.callbacks.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }
  
  trigger(event, ...args) {
    if (!this.callbacks.has(event)) return;
    
    this.callbacks.get(event).forEach(callback => {
      callback(...args);
    });
  }
}

// Helper function to create common step types
export function createWalkthroughSteps(config) {
  const steps = [];
  
  // Welcome step
  if (config.welcome) {
    steps.push({
      title: config.welcome.title || 'Welcome to the Demo',
      description: config.welcome.description || 'Let\'s explore the key features',
      autoComplete: true,
      duration: 3000
    });
  }
  
  // Feature steps
  if (config.features) {
    config.features.forEach((feature, index) => {
      steps.push({
        title: feature.title,
        description: feature.description,
        highlight: feature.highlight,
        interaction: feature.interaction,
        autoComplete: !feature.interaction,
        duration: feature.duration || 5000
      });
    });
  }
  
  // Conclusion step
  if (config.conclusion) {
    steps.push({
      title: config.conclusion.title || 'Tour Complete',
      description: config.conclusion.description || 'Feel free to explore on your own',
      autoComplete: true,
      duration: 2000
    });
  }
  
  return steps;
}

// Export for demos to use
export default WalkthroughSupport;