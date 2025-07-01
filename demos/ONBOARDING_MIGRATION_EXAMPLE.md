# Onboarding Migration Example: Custom Install Demo

This example shows how to migrate from manual onboarding configuration to the new standardized system.

## Before (Manual Configuration)

```javascript
const onboardingSteps = [
  {
    title: "Custom Install Overview",
    description: "Welcome to Autodesk's Custom Install tool. This enterprise-grade interface allows IT administrators to create and manage software deployment packages across their organization.",
    developerNote: "Built with React and shadcn/ui components for a high-density, monochromatic design that matches Autodesk's enterprise aesthetic.",
    businessImpact: "Reduces deployment time by 60% and ensures consistent software configurations across teams.",
    metrics: [
      { value: "300+", label: "Products" },
      { value: "60%", label: "Time Saved" },
      { value: "99.9%", label: "Reliability" }
    ]
  },
  // ... more manual steps
];
```

## After (Standardized Configuration)

```javascript
import { 
  createOnboardingConfig, 
  HighlightAreas, 
  MetricTemplates,
  CalloutTemplates 
} from '@portfolio/demo-shared';

const onboardingSteps = createOnboardingConfig({
  demoName: 'Autodesk Custom Install',
  
  overview: {
    description: "Welcome to Autodesk's Custom Install tool. This enterprise-grade interface allows IT administrators to create and manage software deployment packages across their organization.",
    developerNote: "Built with React and shadcn/ui components for a high-density, monochromatic design that matches Autodesk's enterprise aesthetic.",
    businessImpact: "Reduces deployment time by 60% and ensures consistent software configurations across teams.",
    metrics: [
      { value: "300+", label: "Products" },
      { value: "60%", label: "Time Saved" },
      { value: "99.9%", label: "Reliability" }
    ]
  },
  
  features: [
    {
      title: "Package Library Management",
      description: "View and organize your installation packages. The tabbed interface separates personal packages from team-shared ones, with powerful search and filtering capabilities.",
      developerNote: "Implemented responsive tables with hover states and inline actions. Uses React state management for real-time search filtering.",
      businessImpact: "Centralized package management improves compliance and reduces software sprawl by 70% while increasing deployment success rates.",
      metrics: MetricTemplates.QUALITY(95, 70),
      highlightArea: HighlightAreas.MAIN,
      callouts: CalloutTemplates.TOP_FEATURES([
        { title: "Search & Filter", description: "Real-time package search", left: '25%' },
        { title: "Quick Actions", description: "Edit, duplicate, delete packages", left: '75%' }
      ])
    },
    
    {
      title: "Package Creation Workflow",
      description: "Step-by-step package creation with product selection, version control, and language configuration. The interface guides users through complex enterprise requirements.",
      developerNote: "Uses compound component patterns with controlled inputs and validation. Expandable sections reduce cognitive load while maintaining all functionality.",
      businessImpact: "Standardized deployment packages reduce installation errors by 85% and support compliance requirements.",
      metrics: [
        { value: "85%", label: "Fewer Errors" },
        { value: "100%", label: "Compliance Ready" }
      ],
      highlightArea: {
        top: '30%',
        left: '10%',
        right: '10%',
        height: '400px'
      },
      callouts: CalloutTemplates.WORKFLOW_STEPS([
        { title: "Product Selection", description: "Choose from 300+ Autodesk products", top: '40%', left: '20%' },
        { title: "Version Control", description: "Latest or specific version targeting", top: '55%', left: '35%' }
      ])
    },
    
    {
      title: "Enterprise Design System",
      description: "Notice the strictly monochromatic design - no color accents, consistent typography, and high information density. This matches Autodesk's enterprise software aesthetic.",
      developerNote: "CSS custom properties enable consistent theming. All components use grayscale values only, with careful attention to contrast ratios for accessibility.",
      businessImpact: "Consistent UI patterns reduce training time by 50% and increase user productivity in enterprise environments by 25%.",
      metrics: MetricTemplates.EFFICIENCY(50, 25),
      highlightArea: HighlightAreas.FULL_WIDTH
    }
  ],
  
  businessMetrics: {
    enabled: true,
    title: "Enterprise Impact",
    description: "Trusted by Fortune 500 companies worldwide.",
    metrics: MetricTemplates.ADOPTION('10K+', 97)
  }
});
```

## Key Benefits of Migration

1. **Cleaner Code**: Less boilerplate, more focus on content
2. **Consistency**: All demos follow the same pattern
3. **Type Safety**: Full TypeScript support (if using TS)
4. **Validation**: Built-in configuration validation
5. **Reusable Patterns**: Metric templates and highlight areas
6. **Easier Maintenance**: Update the system once, all demos benefit

## Using in the Demo

```jsx
import { DemoWrapper, DemoOnboarding, createOnboardingConfig } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
import '@portfolio/demo-shared/onboarding-styles';

function App() {
  const onboardingSteps = createOnboardingConfig(config);
  
  return (
    <DemoOnboarding 
      steps={onboardingSteps}
      demoTitle="Autodesk Custom Install"
      demoDescription="Enterprise software deployment made simple"
    >
      <DemoWrapper url="install.autodesk.com">
        {/* Your demo content */}
      </DemoWrapper>
    </DemoOnboarding>
  );
}
```