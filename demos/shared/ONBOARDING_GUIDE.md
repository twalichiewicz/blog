# Demo Onboarding System Guide

A powerful, reusable onboarding system for portfolio demos that provides guided tours with developer commentary.

## Overview

The DemoOnboarding component creates an immersive, fullscreen experience that guides users through your demo with:
- Interactive highlights
- Developer commentary
- Business impact metrics
- Feature callouts
- Smooth animations

## Basic Usage

```jsx
import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
import '@portfolio/demo-shared/onboarding-styles';

const onboardingSteps = [
  {
    title: "Welcome",
    description: "Main description of what users are seeing",
    developerNote: "Technical insights or design decisions",
    businessImpact: "How this affected the business",
    metrics: [
      { value: "250x", label: "Improvement" },
      { value: "$2M", label: "Saved" }
    ]
  }
];

function App() {
  return (
    <DemoOnboarding
      steps={onboardingSteps}
      demoTitle="Your Demo Title"
      demoDescription="Brief description shown before starting"
    >
      <DemoWrapper url="demo.example.com">
        <YourDemoContent />
      </DemoWrapper>
    </DemoOnboarding>
  );
}
```

## Step Configuration

Each step in the onboarding can include:

### Basic Properties
- `title` (required) - Step heading
- `description` (required) - What the user is seeing

### Commentary Sections
- `developerNote` - Technical insights, design decisions, challenges overcome
- `businessImpact` - ROI, metrics, business value created

### Visual Elements
- `highlight` - Boolean to show highlight area
- `highlightStyle` - CSS properties for highlight positioning
- `metrics` - Array of metric cards to display
- `callouts` - Feature annotations with connecting lines

## Highlight Examples

### Full Width Highlight
```javascript
{
  highlight: true,
  highlightStyle: {
    top: "180px",
    left: "80px",
    right: "24px",
    height: "500px"
  }
}
```

### Specific Element Highlight
```javascript
{
  highlight: true,
  highlightStyle: {
    top: "200px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "400px",
    height: "300px"
  }
}
```

## Feature Callouts

Add interactive annotations to highlight specific features:

```javascript
{
  callouts: [
    {
      title: "Smart Defaults",
      description: "Pre-configured for common use cases",
      position: { 
        top: "200px", 
        left: "100px" 
      }
    },
    {
      title: "Real-time Preview",
      description: "See changes instantly",
      position: { 
        top: "300px", 
        right: "150px" 
      }
    }
  ]
}
```

## User Experience Flow

1. **Initial State**: Demo loads with a "Start Demo Tour" overlay
2. **Fullscreen Mode**: Clicking expands blog-content to 100vw/100vh
3. **Guided Tour**: Users navigate through steps with keyboard or buttons
4. **Commentary Panel**: Collapsible side panel with rich information
5. **Exit**: Returns to normal view, demo remains interactive

## Keyboard Navigation

- `→` Arrow Right: Next step
- `←` Arrow Left: Previous step
- `Escape`: Exit fullscreen mode
- Number keys: Jump to specific step

## Best Practices

### 1. Step Structure
- Start with a welcome/overview step
- Progress from simple to complex features
- End with impact/results summary

### 2. Developer Commentary
- Share design decisions and trade-offs
- Explain technical challenges overcome
- Include "aha moments" from development

### 3. Business Impact
- Use concrete metrics when possible
- Connect features to business outcomes
- Include before/after comparisons

### 4. Visual Design
- Highlight one major area per step
- Use callouts sparingly (2-3 max per step)
- Ensure highlights don't obscure important content

## Example: Complete Step

```javascript
{
  title: "Smart Form Validation",
  description: "Real-time validation provides immediate feedback, reducing form errors by 73%.",
  
  developerNote: "We implemented debounced validation to avoid overwhelming users. The 300ms delay balanced responsiveness with performance.",
  
  businessImpact: "Form completion rates increased 34%, directly impacting conversion. Support tickets about form errors dropped to near zero.",
  
  highlight: true,
  highlightStyle: {
    top: "250px",
    left: "100px",
    width: "500px",
    height: "400px"
  },
  
  callouts: [
    {
      title: "Inline Errors",
      description: "Clear, contextual error messages",
      position: { top: "300px", left: "150px" }
    },
    {
      title: "Success States",
      description: "Positive reinforcement for correct input",
      position: { top: "400px", left: "150px" }
    }
  ],
  
  metrics: [
    { value: "73%", label: "Fewer Errors" },
    { value: "34%", label: "Higher Completion" }
  ]
}
```

## Responsive Behavior

- **Desktop**: Full commentary panel, all features enabled
- **Tablet**: Condensed panel, touch-friendly navigation
- **Mobile**: Bottom sheet pattern, simplified highlights

## Performance Notes

- Steps are lazy-loaded for performance
- Animations use GPU acceleration
- Commentary panel virtualized for long content

## Customization

The onboarding system respects your app's theme automatically. For custom styling, target these classes:

```css
/* Custom button colors */
.demo-start-button {
  background: var(--brand-color);
}

/* Custom highlight color */
.onboarding-highlight {
  border-color: var(--accent-color);
}

/* Custom panel width */
.commentary-panel {
  width: 450px;
}
```

## Migration Guide

To add onboarding to an existing demo:

1. Wrap your app with `DemoOnboarding`
2. Define your steps array
3. Import the onboarding styles
4. Test the fullscreen expansion
5. Refine highlights and callouts

## Troubleshooting

### Fullscreen not working
- Ensure `.blog-content` exists in the DOM
- Check for CSS conflicts with position/z-index

### Highlights misaligned
- Use absolute positioning relative to viewport
- Account for browser chrome in calculations

### Commentary panel overlapping
- Adjust highlight positions to leave space
- Consider responsive breakpoints