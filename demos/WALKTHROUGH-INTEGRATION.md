# Demo Walkthrough Integration Guide

This guide explains how to integrate the floating walkthrough toolbar into your portfolio demos.

## Overview

The walkthrough system consists of two parts:
1. **Parent Page Toolbar**: A floating Apple Music-style toolbar at the bottom of the project page
2. **Demo Integration**: Support within demos to communicate with the parent toolbar

## Parent Page Features

The walkthrough toolbar appears when:
- A demo supports walkthrough functionality
- The user clicks the demo button to enter fullscreen mode

### Toolbar Controls
- **Previous/Next**: Navigate through walkthrough steps
- **Play/Pause**: Auto-advance through steps (5 seconds default)
- **Progress Bar**: Visual indicator of walkthrough progress
- **Step Info**: Current step title and number
- **Close**: Exit the walkthrough

### Keyboard Shortcuts
- `←` / `→`: Previous/Next step
- `Space`: Play/Pause
- `Escape`: Close walkthrough

## Adding Walkthrough Support to Your Demo

### 1. Basic Integration

```jsx
import { WalkthroughSupport, createWalkthroughSteps } from '@portfolio/demo-shared';

// In your component
useEffect(() => {
  const steps = createWalkthroughSteps({
    welcome: {
      title: 'Welcome to My Demo',
      description: 'Overview of what users will see'
    },
    features: [
      {
        title: 'Feature 1',
        description: 'What this feature does',
        duration: 4000
      },
      {
        title: 'Feature 2', 
        description: 'Another cool feature',
        duration: 5000
      }
    ],
    conclusion: {
      title: 'Ready to Explore',
      description: 'Users can now try it themselves'
    }
  });
  
  const walkthrough = new WalkthroughSupport(steps);
  
  return () => walkthrough.end();
}, []);
```

### 2. Advanced Integration with Highlights

```jsx
const walkthrough = new WalkthroughSupport(steps);

// Listen for step changes
walkthrough.on('stepStart', (stepIndex, step) => {
  if (step.highlight) {
    const element = document.querySelector(step.highlight);
    element?.classList.add('walkthrough-highlight');
  }
});

walkthrough.on('stepEnd', (stepIndex) => {
  document.querySelectorAll('.walkthrough-highlight')
    .forEach(el => el.classList.remove('walkthrough-highlight'));
});
```

### 3. Interactive Steps

For steps that require user interaction:

```jsx
const steps = [
  {
    title: 'Click the Button',
    description: 'Try clicking the install button',
    highlight: '.install-button',
    interaction: 'click',
    autoComplete: false // Won't auto-advance
  }
];

// Handle interaction completion
document.querySelector('.install-button').addEventListener('click', () => {
  walkthrough.completeStep();
});
```

## Styling

The toolbar uses glass morphism effects similar to Apple Music:

```scss
// Already included in the system
.demo-walkthrough-toolbar {
  backdrop-filter: blur(40px) saturate(180%);
  background: rgba(255, 255, 255, 0.72);
  border-radius: 16px;
  // Auto-adapts to dark mode
}

// Highlight effect for demo elements
.walkthrough-highlight {
  box-shadow: 0 0 0 4px #0696d7, 0 0 20px rgba(6, 150, 215, 0.5);
  animation: pulse 2s infinite;
}
```

## Message Protocol

The system uses postMessage for communication:

### Parent → Demo Messages
- `checkWalkthroughSupport`: Check if demo supports walkthrough
- `startDemoOnboarding`: Start the walkthrough
- `walkthroughStep`: Go to specific step
- `endWalkthrough`: End the walkthrough

### Demo → Parent Messages
- `walkthroughSupported`: Notify parent of support (with steps)
- `walkthroughStepCompleted`: Step was completed
- `walkthroughEnded`: Walkthrough ended

## Example: Custom Install Demo

The Custom Install demo already includes walkthrough support:

```jsx
// Simplified steps for parent toolbar
const walkthroughSteps = onboardingSteps.map(step => ({
  title: step.title,
  description: step.description,
  autoComplete: true,
  duration: 5000
}));

// Initialize support
const walkthrough = new WalkthroughSupport(walkthroughSteps);
```

## Best Practices

1. **Keep Steps Concise**: Toolbar space is limited
2. **Auto-Complete Most Steps**: Unless interaction is required
3. **Reasonable Durations**: 4-6 seconds per step
4. **Clear Titles**: Users see these in the toolbar
5. **Progressive Disclosure**: Start simple, reveal complexity

## Testing

1. Open a project with demo support (e.g., Custom Install)
2. Click the demo button to enter fullscreen
3. The walkthrough toolbar should appear after ~600ms
4. Test navigation, auto-play, and keyboard shortcuts
5. Verify demo highlights and interactions work

## Troubleshooting

- **Toolbar not appearing**: Check demo has `WalkthroughSupport` with steps
- **Steps not advancing**: Verify `autoComplete: true` or manual completion
- **No communication**: Check iframe sandbox allows scripts
- **Styling issues**: Ensure demo wrapper styles are imported