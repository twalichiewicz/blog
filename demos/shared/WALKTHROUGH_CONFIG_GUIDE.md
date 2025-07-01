# Standardized Walkthrough Configuration Guide

A flexible and easy-to-use system for creating demo walkthroughs with the DemoOnboarding component.

## Quick Start

```jsx
import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared';
import { createOnboardingConfig, HighlightAreas, MetricTemplates } from '@portfolio/demo-shared/utils/walkthrough-config';
import '@portfolio/demo-shared/styles';
import '@portfolio/demo-shared/onboarding-styles';

const onboardingSteps = createOnboardingConfig({
  demoName: 'My Awesome Demo',
  overview: {
    description: 'Welcome to our innovative solution.',
    metrics: MetricTemplates.EFFICIENCY(40, 85)
  },
  features: [
    {
      title: 'Feature One',
      description: 'This feature does amazing things.',
      businessImpact: 'Saves 2 hours per day.',
      highlightArea: HighlightAreas.CENTER
    }
  ]
});

function App() {
  return (
    <DemoOnboarding steps={onboardingSteps}>
      <DemoWrapper url="demo.example.com">
        <YourDemoContent />
      </DemoWrapper>
    </DemoOnboarding>
  );
}
```

## Configuration Structure

### Basic Configuration

```javascript
const config = {
  demoName: 'Project Name',  // Required
  
  // Overview section (optional, enabled by default)
  overview: {
    enabled: true,
    title: 'Custom Welcome Title',
    description: 'What users will see first',
    developerNote: 'Technical context',
    businessImpact: 'Why this matters',
    metrics: [
      { value: '99%', label: 'Uptime' },
      { value: '2M+', label: 'Users' }
    ],
    highlightStyle: HighlightAreas.FULL_WIDTH
  },
  
  // Feature showcases (array)
  features: [
    {
      title: 'Feature Name',
      description: 'What this feature does',
      developerNote: 'How it was built',
      businessImpact: 'ROI or business value',
      metrics: [...],
      highlightArea: HighlightAreas.MAIN,
      callouts: [...]
    }
  ],
  
  // Optional sections
  technicalInsights: {
    enabled: false,  // Disabled by default
    title: 'Architecture Deep Dive',
    description: 'Technical implementation details',
    metrics: MetricTemplates.QUALITY(99.9, 75)
  },
  
  businessMetrics: {
    enabled: false,  // Disabled by default
    title: 'Impact Summary',
    metrics: MetricTemplates.ADOPTION('500+', 94)
  },
  
  // Conclusion (optional, enabled by default)
  conclusion: {
    enabled: true,
    title: 'Ready to Explore',
    description: 'Feel free to interact with the demo'
  }
};
```

## Highlight Areas

Pre-defined highlight regions for common UI patterns:

### Available Presets

```javascript
import { HighlightAreas } from '@portfolio/demo-shared/utils/walkthrough-config';

// Full width content
HighlightAreas.FULL_WIDTH
// { top: '80px', left: '20px', right: '20px', bottom: '80px' }

// Centered content
HighlightAreas.CENTER  
// { top: '25%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px' }

// Header area
HighlightAreas.HEADER
// { top: '0', left: '0', right: '0', height: '200px' }

// Main content
HighlightAreas.MAIN
// { top: '100px', left: '50px', right: '50px', height: '500px' }

// Sidebars
HighlightAreas.SIDEBAR_LEFT   // Left sidebar
HighlightAreas.SIDEBAR_RIGHT  // Right sidebar

// Form area
HighlightAreas.FORM
// Centered form container

// Call-to-action
HighlightAreas.CTA
// Bottom centered button area
```

### Custom Highlight Areas

```javascript
{
  highlightStyle: {
    top: '150px',
    left: '10%',
    width: '80%',
    height: '400px',
    borderRadius: '12px'  // Custom styling
  }
}
```

## Metric Templates

Pre-built metric patterns for common business metrics:

### Performance Metrics
```javascript
MetricTemplates.PERFORMANCE(250)
// Returns: [
//   { value: '250%', label: 'Faster' },
//   { value: '< 100ms', label: 'Response Time' }
// ]
```

### Conversion Metrics
```javascript
MetricTemplates.CONVERSION(34, 15)
// Returns: [
//   { value: '34%', label: 'Conversion Rate' },
//   { value: '+15%', label: 'Improvement' }
// ]
```

### Efficiency Metrics
```javascript
MetricTemplates.EFFICIENCY(40, 85)
// Returns: [
//   { value: '40h', label: 'Time Saved' },
//   { value: '85%', label: 'Automated' }
// ]
```

### Scale Metrics
```javascript
MetricTemplates.SCALE('10M+', '500K')
// Returns: [
//   { value: '10M+', label: 'Active Users' },
//   { value: '500K', label: 'Daily Transactions' }
// ]
```

### Quality Metrics
```javascript
MetricTemplates.QUALITY(99.9, 75)
// Returns: [
//   { value: '99.9%', label: 'Accuracy' },
//   { value: '-75%', label: 'Error Rate' }
// ]
```

### Adoption Metrics
```javascript
MetricTemplates.ADOPTION('500+', 94)
// Returns: [
//   { value: '500+', label: 'Teams Using' },
//   { value: '94%', label: 'Satisfaction' }
// ]
```

## Callout Templates

Helper functions for creating feature callouts:

### Top Features Pattern
```javascript
CalloutTemplates.TOP_FEATURES([
  { title: 'Auto-save', description: 'Never lose work', left: '20%' },
  { title: 'Collaboration', description: 'Real-time editing', left: '60%' }
])
```

### Workflow Steps Pattern
```javascript
CalloutTemplates.WORKFLOW_STEPS([
  { title: 'Upload', description: 'Drag and drop files' },
  { title: 'Process', description: 'Automatic optimization' },
  { title: 'Deploy', description: 'One-click publishing' }
])
```

### Key Elements Pattern
```javascript
CalloutTemplates.KEY_ELEMENTS([
  {
    title: 'Search Bar',
    description: 'Powerful filtering',
    position: { top: '100px', right: '50px' }
  }
])
```

## Complete Example

Here's a comprehensive example showing all features:

```javascript
import { 
  createOnboardingConfig, 
  HighlightAreas, 
  MetricTemplates,
  CalloutTemplates 
} from '@portfolio/demo-shared/utils/walkthrough-config';

const onboardingSteps = createOnboardingConfig({
  demoName: 'Enterprise Dashboard',
  
  overview: {
    title: 'Welcome to Enterprise Dashboard',
    description: 'A powerful analytics platform that transforms how teams make decisions.',
    developerNote: 'Built with React, D3.js, and real-time WebSocket connections.',
    businessImpact: 'Reduced decision-making time from days to minutes.',
    metrics: MetricTemplates.SCALE('50K+', '2M+'),
    highlightStyle: HighlightAreas.FULL_WIDTH
  },
  
  features: [
    {
      title: 'Real-time Analytics',
      description: 'Live data updates across all dashboards with sub-second latency.',
      developerNote: 'WebSocket implementation with fallback to SSE. Optimized rendering with React.memo and virtualization.',
      businessImpact: 'Enables instant decision-making, saving $2M annually in delayed responses.',
      metrics: MetricTemplates.PERFORMANCE(300),
      highlightArea: HighlightAreas.MAIN,
      callouts: CalloutTemplates.TOP_FEATURES([
        { title: 'Live Charts', description: 'Updates every 100ms', left: '25%' },
        { title: 'Smart Alerts', description: 'AI-powered anomaly detection', left: '75%' }
      ])
    },
    
    {
      title: 'Customizable Workflows',
      description: 'Drag-and-drop interface for creating custom data pipelines.',
      developerNote: 'Uses React DnD with custom constraints. State managed via Redux Toolkit.',
      businessImpact: 'Reduced workflow setup time by 85%, enabling non-technical users.',
      metrics: MetricTemplates.EFFICIENCY(35, 85),
      highlightArea: HighlightAreas.CENTER,
      callouts: CalloutTemplates.WORKFLOW_STEPS([
        { title: 'Data Source', description: 'Connect any API' },
        { title: 'Transform', description: 'Visual data mapping' },
        { title: 'Visualize', description: 'Auto-generated charts' }
      ])
    },
    
    {
      title: 'Enterprise Security',
      description: 'Bank-level security with SSO, MFA, and field-level encryption.',
      developerNote: 'OAuth 2.0 implementation with PKCE. All data encrypted at rest and in transit.',
      businessImpact: 'Zero security incidents since launch. Achieved SOC 2 compliance.',
      highlightArea: {
        top: '200px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '300px'
      }
    }
  ],
  
  technicalInsights: {
    enabled: true,
    title: 'Built for Scale',
    description: 'Microservices architecture handling millions of events per second.',
    developerNote: 'Kubernetes deployment with auto-scaling. GraphQL federation for efficient data fetching.',
    metrics: MetricTemplates.SCALE('10M+', '1B+')
  },
  
  businessMetrics: {
    enabled: true,
    title: 'Proven Impact',
    description: 'Measurable improvements across all key business metrics.',
    impact: 'Fortune 500 companies report 40% faster decision-making and 25% cost reduction.',
    metrics: [
      { value: '$10M+', label: 'Annual Savings' },
      { value: '98%', label: 'Customer Retention' },
      { value: '4.8/5', label: 'User Rating' },
      { value: '< 2h', label: 'Time to Value' }
    ]
  },
  
  conclusion: {
    title: 'Experience the Difference',
    description: 'Try out the features yourself. Click around, drag elements, and see the real-time updates in action.',
    developerNote: 'This demo uses mock data but demonstrates all production features.',
    callouts: CalloutTemplates.KEY_ELEMENTS([
      {
        title: 'Try the Search',
        description: 'Type to filter data instantly',
        position: { top: '80px', right: '100px' }
      }
    ])
  }
});
```

## Validation

Use the built-in validation to catch configuration errors:

```javascript
import { validateOnboardingConfig } from '@portfolio/demo-shared/utils/walkthrough-config';

const validation = validateOnboardingConfig(config);
if (!validation.valid) {
  console.error('Configuration errors:', validation.errors);
}
```

## Best Practices

1. **Start Simple**: Begin with just overview and 2-3 key features
2. **Focus on Impact**: Lead with business value, not technical details
3. **Use Metrics**: Concrete numbers are more compelling than descriptions
4. **Progressive Disclosure**: Don't overwhelm - reveal complexity gradually
5. **Interactive Elements**: Use callouts to guide interaction
6. **Test on Mobile**: Ensure highlights work on smaller screens

## Migration from Manual Configuration

If you have existing manual step configurations:

```javascript
// Old way
const steps = [
  {
    title: 'Welcome',
    description: 'Description here',
    // ... lots of manual configuration
  }
];

// New way
const steps = createOnboardingConfig({
  demoName: 'My Demo',
  overview: { description: 'Description here' },
  features: [
    // Your features here
  ]
});
```

## TypeScript Support

The configuration system is fully typed. Import types for better IDE support:

```typescript
import type { 
  OnboardingConfig, 
  OnboardingStep,
  Metric,
  Callout 
} from '@portfolio/demo-shared/types';
```