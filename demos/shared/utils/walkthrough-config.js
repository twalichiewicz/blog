/**
 * Standardized Walkthrough Configuration System
 * 
 * This module provides a flexible and easy-to-use configuration system
 * for creating demo walkthroughs with the DemoOnboarding component.
 */

/**
 * Creates a standardized onboarding configuration
 * @param {Object} config - Configuration object
 * @returns {Array} Array of onboarding steps
 */
export function createOnboardingConfig(config) {
  const {
    demoName = 'Demo',
    overview = {},
    features = [],
    technicalInsights = {},
    businessMetrics = {},
    conclusion = {}
  } = config;

  const steps = [];

  // Welcome/Overview Step
  if (overview.enabled !== false) {
    steps.push({
      title: overview.title || `Welcome to ${demoName}`,
      description: overview.description || `Let's explore the key features and capabilities of ${demoName}.`,
      developerNote: overview.developerNote,
      businessImpact: overview.businessImpact,
      metrics: overview.metrics,
      highlight: overview.highlight,
      highlightStyle: overview.highlightStyle
    });
  }

  // Feature Steps
  features.forEach(feature => {
    const step = {
      title: feature.title,
      description: feature.description,
      developerNote: feature.developerNote,
      businessImpact: feature.businessImpact,
      metrics: feature.metrics,
      highlight: feature.highlight !== false,
      highlightStyle: feature.highlightStyle || feature.highlightArea,
      callouts: feature.callouts
    };

    // Remove undefined properties
    Object.keys(step).forEach(key => 
      step[key] === undefined && delete step[key]
    );

    steps.push(step);
  });

  // Technical Architecture Step (optional)
  if (technicalInsights.enabled) {
    steps.push({
      title: technicalInsights.title || 'Technical Architecture',
      description: technicalInsights.description || 'A deeper look at the technical implementation.',
      developerNote: technicalInsights.developerNote || 'Key technical decisions and trade-offs made during development.',
      metrics: technicalInsights.metrics,
      highlight: technicalInsights.highlight !== false,
      highlightStyle: technicalInsights.highlightStyle
    });
  }

  // Business Impact Summary (optional)
  if (businessMetrics.enabled) {
    steps.push({
      title: businessMetrics.title || 'Business Impact',
      description: businessMetrics.description || 'The measurable impact this solution has delivered.',
      businessImpact: businessMetrics.impact || 'Significant improvements in key business metrics.',
      metrics: businessMetrics.metrics || [],
      highlight: false
    });
  }

  // Conclusion Step
  if (conclusion.enabled !== false) {
    steps.push({
      title: conclusion.title || 'Ready to Explore',
      description: conclusion.description || 'Feel free to interact with the demo and explore all features.',
      developerNote: conclusion.developerNote,
      callouts: conclusion.callouts
    });
  }

  return steps;
}

/**
 * Common highlight area presets
 */
export const HighlightAreas = {
  // Full width content area
  FULL_WIDTH: {
    top: '80px',
    left: '20px',
    right: '20px',
    bottom: '80px'
  },
  
  // Center content
  CENTER: {
    top: '25%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '400px'
  },
  
  // Top section
  HEADER: {
    top: '0',
    left: '0',
    right: '0',
    height: '200px'
  },
  
  // Main content area
  MAIN: {
    top: '100px',
    left: '50px',
    right: '50px',
    height: '500px'
  },
  
  // Sidebar
  SIDEBAR_LEFT: {
    top: '80px',
    left: '0',
    width: '300px',
    bottom: '0'
  },
  
  SIDEBAR_RIGHT: {
    top: '80px',
    right: '0',
    width: '300px',
    bottom: '0'
  },
  
  // Form area
  FORM: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '600px'
  },
  
  // Button/CTA area
  CTA: {
    bottom: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '300px',
    height: '60px'
  }
};

/**
 * Common metrics templates
 */
export const MetricTemplates = {
  PERFORMANCE: (improvement) => [
    { value: `${improvement}%`, label: 'Faster' },
    { value: '< 100ms', label: 'Response Time' }
  ],
  
  CONVERSION: (rate, increase) => [
    { value: `${rate}%`, label: 'Conversion Rate' },
    { value: `+${increase}%`, label: 'Improvement' }
  ],
  
  EFFICIENCY: (timeSaved, automation) => [
    { value: `${timeSaved}h`, label: 'Time Saved' },
    { value: `${automation}%`, label: 'Automated' }
  ],
  
  SCALE: (users, transactions) => [
    { value: users, label: 'Active Users' },
    { value: transactions, label: 'Daily Transactions' }
  ],
  
  QUALITY: (accuracy, reduction) => [
    { value: `${accuracy}%`, label: 'Accuracy' },
    { value: `-${reduction}%`, label: 'Error Rate' }
  ],
  
  ADOPTION: (teams, satisfaction) => [
    { value: teams, label: 'Teams Using' },
    { value: `${satisfaction}%`, label: 'Satisfaction' }
  ]
};

/**
 * Common callout patterns
 */
export const CalloutTemplates = {
  TOP_FEATURES: (features) => features.map((feature, index) => ({
    title: feature.title,
    description: feature.description,
    position: {
      top: `${30 + (index * 15)}%`,
      left: feature.left || '20%'
    }
  })),
  
  WORKFLOW_STEPS: (steps) => steps.map((step, index) => ({
    title: `Step ${index + 1}: ${step.title}`,
    description: step.description,
    position: {
      top: step.top || `${20 + (index * 20)}%`,
      left: step.left || `${20 + (index * 15)}%`
    }
  })),
  
  KEY_ELEMENTS: (elements) => elements.map(element => ({
    title: element.title,
    description: element.description,
    position: element.position || { top: '50%', left: '50%' }
  }))
};

/**
 * Example configuration for quick setup
 */
export const exampleConfig = {
  demoName: 'Example Demo',
  overview: {
    description: 'This demo showcases our innovative solution for X.',
    metrics: MetricTemplates.EFFICIENCY(40, 85),
    highlightStyle: HighlightAreas.FULL_WIDTH
  },
  features: [
    {
      title: 'Smart Detection',
      description: 'Automatically detects and configures based on your setup.',
      developerNote: 'Uses machine learning to identify patterns.',
      businessImpact: 'Reduces setup time by 90%.',
      highlightArea: HighlightAreas.CENTER,
      callouts: CalloutTemplates.TOP_FEATURES([
        { title: 'Auto-config', description: 'Zero manual setup', left: '25%' },
        { title: 'ML-powered', description: 'Learns from usage', left: '75%' }
      ])
    },
    {
      title: 'Real-time Updates',
      description: 'See changes as they happen with live synchronization.',
      developerNote: 'WebSocket implementation for instant updates.',
      businessImpact: 'Improves collaboration efficiency by 60%.',
      metrics: MetricTemplates.PERFORMANCE(250),
      highlightArea: HighlightAreas.MAIN
    }
  ],
  technicalInsights: {
    enabled: true,
    description: 'Built with React, TypeScript, and modern web standards.',
    metrics: MetricTemplates.QUALITY(99.9, 75)
  },
  businessMetrics: {
    enabled: true,
    metrics: MetricTemplates.ADOPTION('500+', 94)
  }
};

/**
 * Helper function to validate configuration
 */
export function validateOnboardingConfig(config) {
  const errors = [];
  
  // Validate required fields
  if (!config.demoName) {
    errors.push('demoName is required');
  }
  
  // Validate features
  if (config.features && config.features.length > 0) {
    config.features.forEach((feature, index) => {
      if (!feature.title) {
        errors.push(`Feature ${index + 1} is missing a title`);
      }
      if (!feature.description) {
        errors.push(`Feature ${index + 1} is missing a description`);
      }
    });
  }
  
  // Validate metrics format
  const validateMetrics = (metrics, source) => {
    if (metrics && !Array.isArray(metrics)) {
      errors.push(`${source} metrics must be an array`);
    } else if (metrics) {
      metrics.forEach((metric, index) => {
        if (!metric.value || !metric.label) {
          errors.push(`${source} metric ${index + 1} must have value and label`);
        }
      });
    }
  };
  
  if (config.overview?.metrics) {
    validateMetrics(config.overview.metrics, 'Overview');
  }
  
  if (config.businessMetrics?.metrics) {
    validateMetrics(config.businessMetrics.metrics, 'Business metrics');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Export everything for easy use
export default {
  createOnboardingConfig,
  HighlightAreas,
  MetricTemplates,
  CalloutTemplates,
  validateOnboardingConfig,
  exampleConfig
};