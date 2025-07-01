# Shared Components API Documentation

Complete reference for all shared demo components with props, usage examples, and best practices.

## Table of Contents

1. [DemoWrapper](#demowrapper)
2. [DemoOnboarding](#demoonboarding)
3. [BrowserChrome](#browserchrome)
4. [Utilities](#utilities)
5. [Best Practices](#best-practices)

---

## DemoWrapper

The main wrapper component that provides browser chrome, background patterns, and custom cursor support for all demos.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | *required* | Demo content to wrap |
| `url` | `string` | `undefined` | URL to display in browser address bar |
| `browserTheme` | `'mac' \| 'windows' \| 'minimal'` | `'mac'` | Browser chrome styling theme |
| `showBackground` | `boolean` | `true` | Show grid background pattern |
| `backgroundStyle` | `CSSProperties` | `{}` | Custom background style overrides |
| `className` | `string` | `''` | Additional CSS classes |
| `customCursor` | [CursorType](#cursortypes) | `'default'` | Custom cursor for demo interactions |

### Usage Examples

#### Basic Usage
```jsx
import { DemoWrapper } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';

function MyDemo() {
  return (
    <DemoWrapper url="myapp.example.com">
      <div>My demo content</div>
    </DemoWrapper>
  );
}
```

#### Enterprise Configuration
```jsx
<DemoWrapper 
  url="manage.autodesk.com/products"
  browserTheme="windows"
  customCursor="enterprise"
  showBackground={false}
>
  <EnterpriseInterface />
</DemoWrapper>
```

#### Design System Configuration
```jsx
<DemoWrapper 
  url="designsystem.local" 
  browserTheme="minimal"
  customCursor="design-system"
  backgroundStyle={{ background: '#f5f5f5' }}
>
  <DesignSystemDemo />
</DemoWrapper>
```

### Browser Themes

#### Mac Theme (Default)
- macOS-style window controls (red, yellow, green circles)
- Safari-inspired address bar styling
- Clean, modern appearance

#### Windows Theme
- Windows-style controls (minimize, maximize, close)
- Microsoft Edge-inspired styling
- Right-aligned window controls

#### Minimal Theme
- Clean header without window controls
- Simplified address bar
- Focus on content over chrome

---

## DemoOnboarding

Rich guided tour system with step-by-step navigation, highlights, callouts, and business metrics display.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | *required* | Demo content to wrap with onboarding |
| `steps` | [OnboardingStep[]](#onboardingstep) | *required* | Array of onboarding steps |
| `demoTitle` | `string` | *required* | Title for the demo |
| `demoDescription` | `string` | `undefined` | Optional description |

### OnboardingStep Interface

```typescript
interface OnboardingStep {
  title: string;                    // Step title
  description: string;              // User-facing description
  developerNote?: string;           // Technical implementation details
  businessImpact?: string;          // Business value explanation
  metrics?: Metric[];               // Business metrics array
  highlight?: boolean;              // Enable UI highlighting
  highlightStyle?: CSSProperties;   // Highlight positioning and styling
  callouts?: Callout[];            // UI callouts array
}

interface Metric {
  value: string;                    // Metric value (e.g., "75%", "$2M")
  label: string;                    // Metric description
}

interface Callout {
  title: string;                    // Callout title
  description: string;              // Callout description
  position: CSSProperties;          // Positioning styles
}
```

### Usage Examples

#### Basic Onboarding
```jsx
import { DemoOnboarding } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/onboarding-styles';

const steps = [
  {
    title: "Welcome",
    description: "This is your demo introduction",
    developerNote: "Built with React and modern practices",
    businessImpact: "Reduces user onboarding time by 50%"
  }
];

function MyDemo() {
  return (
    <DemoOnboarding 
      steps={steps}
      demoTitle="My Amazing Demo"
      demoDescription="Interactive demonstration of key features"
    >
      <DemoWrapper>
        <DemoContent />
      </DemoWrapper>
    </DemoOnboarding>
  );
}
```

#### Advanced Onboarding with Highlights
```jsx
const advancedSteps = [
  {
    title: "Interactive Features",
    description: "Click on the highlighted area to see the main functionality",
    developerNote: "Uses React state management for real-time updates",
    businessImpact: "Interactive demos increase engagement by 60%",
    highlight: true,
    highlightStyle: {
      top: "200px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "400px",
      height: "300px"
    },
    callouts: [
      {
        title: "Action Button",
        description: "Primary interaction point",
        position: { top: "250px", left: "60%" }
      }
    ],
    metrics: [
      { value: "60%", label: "Higher Engagement" },
      { value: "2.5x", label: "Click-Through Rate" }
    ]
  }
];
```

### Onboarding Best Practices

#### Content Structure
1. **Title**: Action-oriented, clear and concise
2. **Description**: User-focused explanation of what they'll experience  
3. **Developer Note**: Technical insights, architecture decisions
4. **Business Impact**: Quantified business value when possible
5. **Metrics**: Structured data with value/label pairs

#### Effective Metrics
```jsx
// Good examples
{ value: "75%", label: "Time Saved" }
{ value: "$2M/yr", label: "Cost Reduction" }
{ value: "Before→After", label: "Improvement" }
{ value: "3→1", label: "Steps Reduced" }

// Avoid vague metrics
{ value: "Better", label: "User Experience" }  // Too vague
{ value: "More", label: "Efficiency" }         // Not quantified
```

---

## BrowserChrome

Realistic browser window chrome component (typically used internally by DemoWrapper).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | *required* | Content to display in browser |
| `url` | `string` | `undefined` | URL for address bar |
| `theme` | `'mac' \| 'windows' \| 'minimal'` | `'mac'` | Browser styling theme |

### Usage Examples

#### Direct Usage (Advanced)
```jsx
import { BrowserChrome } from '@portfolio/demo-shared';

function CustomDemo() {
  return (
    <BrowserChrome url="myapp.com" theme="windows">
      <div>Direct browser chrome usage</div>
    </BrowserChrome>
  );
}
```

*Note: Most demos should use DemoWrapper instead of BrowserChrome directly.*

---

## Utilities

### Cursor Types {#cursortypes}

Available cursor types for `customCursor` prop:

| Type | Description | Use Case |
|------|-------------|----------|
| `'default'` | Standard pointer | General demos, code toys |
| `'enterprise'` | Professional cursor | B2B applications, admin tools |
| `'design-system'` | Creative cursor | Design tools, component libraries |
| `'consumer'` | Friendly cursor | Consumer applications |
| `'interactive'` | Engagement cursor | Highly interactive demos |

### Cursor Usage Examples
```jsx
// Enterprise application
<DemoWrapper customCursor="enterprise">
  <AdminPanel />
</DemoWrapper>

// Design system
<DemoWrapper customCursor="design-system">
  <ComponentLibrary />
</DemoWrapper>

// Consumer app
<DemoWrapper customCursor="consumer">
  <ConsumerApp />
</DemoWrapper>
```

### Background Patterns

Available through CSS classes:

| Class | Description |
|-------|-------------|
| `demo-background` | Default grid pattern |
| `demo-background--dots` | Dot pattern |
| `demo-background--diagonal` | Diagonal lines |

### Custom Background
```jsx
<DemoWrapper 
  backgroundStyle={{
    background: 'linear-gradient(45deg, #f0f0f0, #ffffff)'
  }}
>
  <CustomDemo />
</DemoWrapper>
```

---

## Best Practices

### Component Integration

#### ✅ Correct Integration Pattern
```jsx
import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
import '@portfolio/demo-shared/onboarding-styles';

function App() {
  return (
    <DemoOnboarding steps={steps} demoTitle="Demo Title">
      <DemoWrapper url="demo.local" customCursor="enterprise">
        <DemoContent />
      </DemoWrapper>
    </DemoOnboarding>
  );
}
```

#### ❌ Incorrect Patterns
```jsx
// Wrong: Missing required styles
import { DemoWrapper } from '@portfolio/demo-shared';
// Missing: import '@portfolio/demo-shared/styles';

// Wrong: DemoWrapper outside DemoOnboarding
<DemoWrapper>
  <DemoOnboarding steps={steps}>  // Should be outer component
    <DemoContent />
  </DemoOnboarding>
</DemoWrapper>

// Wrong: Not using shared components
<div className="custom-browser-chrome">  // Use DemoWrapper instead
  <DemoContent />
</div>
```

### Configuration Guidelines

#### Demo Type Alignment
Match your cursor to your demo type:

```jsx
// Enterprise demos
<DemoWrapper customCursor="enterprise" browserTheme="windows" />

// Design systems  
<DemoWrapper customCursor="design-system" browserTheme="minimal" />

// Consumer apps
<DemoWrapper customCursor="consumer" browserTheme="mac" />
```

#### URL Guidelines
- Use realistic, contextual URLs
- Match the domain to your demo's purpose
- Examples:
  - `manage.autodesk.com/products` (Enterprise)
  - `designsystem.company.com` (Design System)
  - `app.startup.io/dashboard` (Consumer)

### Performance Considerations

#### Bundle Size
- Shared components are optimized for minimal bundle impact
- Import only what you need:

```jsx
// Good: Import specific components
import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared';

// Avoid: Importing entire library (if it were available)
import * as DemoShared from '@portfolio/demo-shared';  // Don't do this
```

#### CSS Loading
```jsx
// Required: Load component styles
import '@portfolio/demo-shared/styles';

// Conditional: Only if using onboarding
import '@portfolio/demo-shared/onboarding-styles';
```

### Accessibility

#### Keyboard Navigation
- Onboarding system supports keyboard navigation
- Escape key closes onboarding
- Arrow keys navigate steps

#### Focus Management
- DemoWrapper maintains proper focus flow
- Custom cursors don't interfere with accessibility

#### Screen Readers
- All components include proper ARIA labels
- Onboarding content is screen reader accessible

### Responsive Design

#### Mobile Optimization
Components automatically adapt for mobile:
- Smaller browser chrome on mobile
- Touch-friendly onboarding controls
- Responsive background patterns

#### Breakpoint Considerations
```jsx
// Components handle responsive breakpoints automatically
// Custom content should follow responsive patterns
<div style={{
  padding: '2rem',
  '@media (max-width: 768px)': {
    padding: '1rem'  // Note: Use CSS modules or styled-components for media queries
  }
}}>
  Content
</div>
```

### Error Handling

#### Common Issues and Solutions

**Onboarding Not Appearing**
- Verify `@portfolio/demo-shared/onboarding-styles` import
- Check console for JavaScript errors
- Ensure steps array is properly formatted

**Cursor Not Working**
- Verify valid cursor type
- Check CSS inheritance issues
- Ensure DemoWrapper is properly wrapping content

**Background Pattern Missing**
- Verify `@portfolio/demo-shared/styles` import  
- Check `showBackground={true}` prop
- Verify no conflicting CSS

### Testing

#### Manual Testing Checklist
- [ ] Demo loads in both inline and fullscreen modes
- [ ] Onboarding navigation works (next/previous/escape)
- [ ] Custom cursor displays correctly
- [ ] Background pattern renders properly
- [ ] Mobile responsive breakpoints work
- [ ] Keyboard accessibility functions

#### Browser Testing
- Chrome (primary)
- Firefox
- Safari (macOS/iOS)
- Edge (Windows)

---

## TypeScript Support

All components include TypeScript definitions:

```tsx
import { DemoWrapper, DemoOnboarding, OnboardingStep } from '@portfolio/demo-shared';

const steps: OnboardingStep[] = [
  {
    title: "Step 1",
    description: "Description",
    // TypeScript will validate all properties
  }
];

function TypedDemo(): JSX.Element {
  return (
    <DemoOnboarding steps={steps} demoTitle="Typed Demo">
      <DemoWrapper url="typed.demo.local">
        <div>TypeScript-validated demo</div>
      </DemoWrapper>
    </DemoOnboarding>
  );
}
```

---

## Migration Guide

### From Static HTML
```jsx
// Before (static HTML)
<div class="demo-container">
  <div class="browser-chrome">
    <div class="demo-content">...</div>
  </div>
</div>

// After (React + shared components)
<DemoWrapper url="demo.local">
  <div>...</div>
</DemoWrapper>
```

### From Custom Components
```jsx
// Before (custom implementation)
<CustomBrowserChrome url="demo.local">
  <CustomOnboarding steps={steps}>
    <DemoContent />
  </CustomOnboarding>
</CustomBrowserChrome>

// After (shared components)
<DemoOnboarding steps={steps} demoTitle="Demo">
  <DemoWrapper url="demo.local">
    <DemoContent />
  </DemoWrapper>
</DemoOnboarding>
```

---

## Changelog

### v2.0.0 (Current)
- Added DemoOnboarding component
- Enhanced DemoWrapper with custom cursors
- Improved responsive design
- Added TypeScript support

### v1.0.0
- Initial DemoWrapper component
- Basic browser chrome themes
- Grid background pattern

---

For additional help, see the [Demo System Overview](../README.md) or check the [troubleshooting guide](../build-scripts/README-AUTOFIX.md).