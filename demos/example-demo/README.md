# Example Demo

A comprehensive demonstration showcasing all shared components and standardized patterns in the portfolio demo system.

## 🎯 Purpose

This demo serves dual purposes:
1. **Functional Example** - An interactive counter demo for testing the demo system
2. **Component Showcase** - Comprehensive demonstration of all shared components and patterns

## ✨ Features Demonstrated

### Shared Components Integration
- ✅ **DemoWrapper** - Browser chrome with grid background
- ✅ **DemoOnboarding** - Rich guided tour with business metrics
- ✅ **Custom Cursors** - Default cursor appropriate for template demos
- ✅ **Responsive Design** - Mobile-optimized layouts
- ✅ **Dual-Context UI** - Works inline and fullscreen

### Interaction Patterns
- ✅ **State Management** - React hooks for counter functionality
- ✅ **Keyboard Controls** - Arrow keys and 'R' for reset
- ✅ **Visual Feedback** - Status messages and animations
- ✅ **Accessibility** - Focus states and semantic HTML
- ✅ **Progressive Enhancement** - Works without JavaScript

### Content Standards
- ✅ **Business Metrics** - Quantified impact in onboarding
- ✅ **Developer Commentary** - Technical implementation notes
- ✅ **Professional Presentation** - Consistent with enterprise standards
- ✅ **Comprehensive Documentation** - Clear setup and usage instructions

## 🚀 Quick Start

```bash
# Navigate to demo directory
cd demos/example-demo

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎮 How to Use

### Button Controls
- **+1** - Increment counter
- **-1** - Decrement counter  
- **Reset** - Reset to zero

### Keyboard Controls
- **↑ Arrow** - Increment counter
- **↓ Arrow** - Decrement counter
- **R** - Reset counter

### Demo Features
- **Real-time Updates** - Counter updates immediately
- **Visual Feedback** - Status messages show current action
- **Responsive Design** - Adapts to all screen sizes
- **Guided Tour** - Click "?" to start onboarding

## 🏗️ Technical Implementation

### Architecture
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool with HMR
- **Shared Components** - Full integration of portfolio demo system
- **CSS-in-JS** - Inline styles for demo clarity
- **Event Handling** - Keyboard and mouse interactions

### Key Patterns Demonstrated

#### 1. Proper Component Integration
```jsx
import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
import '@portfolio/demo-shared/onboarding-styles';
```

#### 2. Comprehensive Onboarding Structure
```jsx
const onboardingSteps = [
  {
    title: "Step Title",
    description: "User-facing description",
    developerNote: "Technical implementation details", 
    businessImpact: "Business value with metrics",
    metrics: [
      { value: "75%", label: "Improvement" }
    ]
  }
];
```

#### 3. Dual-Context Architecture
```jsx
<DemoOnboarding steps={onboardingSteps}>
  <DemoWrapper showBackground={true} customCursor="default">
    <DemoContent />
  </DemoWrapper>
</DemoOnboarding>
```

### Configuration
- **Port**: 3001 (as configured in demo-config.json)
- **Demo Type**: Template (appropriate for examples)
- **Browser Theme**: Mac (default professional appearance)
- **Background**: Grid pattern (signature portfolio style)

## 📋 Quality Checklist

This demo demonstrates compliance with all portfolio standards:

### Development Standards
- [x] Uses shared component library
- [x] Follows React best practices
- [x] Implements proper error handling
- [x] Includes keyboard accessibility
- [x] Responsive across all devices

### Content Standards  
- [x] Rich onboarding with business metrics
- [x] Developer commentary explaining decisions
- [x] Professional visual presentation
- [x] Clear user interaction feedback

### Technical Standards
- [x] Builds to dist/index.html
- [x] Uses relative asset paths
- [x] Works in iframe context
- [x] Proper package.json configuration
- [x] Vite configuration optimized

## 🔧 Troubleshooting

### Common Issues

**Demo Not Loading**
- Ensure dependencies installed: `npm install`
- Check port 3001 isn't in use: `lsof -i :3001`
- Verify build completes: `npm run build`

**Onboarding Not Working**
- Check shared component imports
- Verify onboarding styles imported
- Ensure steps array properly formatted

**Keyboard Controls Not Responding**
- Click inside demo area to focus
- Check browser console for errors
- Verify event listeners attached

### Development Tips
- Use `npm run dev` for hot reloading
- Test both inline and fullscreen modes
- Verify responsive breakpoints
- Check accessibility with screen readers

## 📚 Related Documentation

- [Demo System Overview](../README.md)
- [Shared Components Guide](../shared/README.md)
- [React Template](../examples/react-demo-template/README.md)
- [Build System Documentation](../build-scripts/README-AUTOFIX.md)

## 🎯 Use Cases

### For Developers
- **Reference Implementation** - See proper shared component usage
- **Testing Platform** - Validate demo system functionality
- **Template Starting Point** - Copy and modify for new demos

### For Users
- **Interactive Experience** - Hands-on demo interaction
- **Guided Learning** - Rich onboarding with business context
- **Portfolio Showcase** - Professional presentation quality

This example demo represents the gold standard for portfolio demo implementation, showcasing all shared components and established patterns in a cohesive, professional presentation.