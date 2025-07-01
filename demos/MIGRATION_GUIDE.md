# Demo Standards Migration Guide

This guide helps you migrate existing demos to meet the new portfolio demo standards.

## Current Status (per validation)

### ❌ Needs Full Migration
1. **custom-install-demo** - Missing DemoWrapper integration
2. **foreground-demo** - Missing DemoWrapper integration
3. **example-demo** - Static HTML, needs React conversion

### ✅ Fully Compliant
- **self-service-publishing-demo** - Gold standard implementation

## Migration Steps

### Step 1: Add Shared Components Dependency

Add to your demo's `package.json`:

```json
{
  "dependencies": {
    "@portfolio/demo-shared": "file:../shared",
    // ... other dependencies
  }
}
```

Then run:
```bash
npm install
```

### Step 2: Update Your Main App Component

#### For custom-install-demo:

Current structure uses custom wrapper. Replace with:

```jsx
// src/App.jsx
import React, { useState } from 'react';
import { DemoWrapper } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
// ... rest of your imports

function App() {
  // ... your existing state and logic

  return (
    <DemoWrapper 
      url="manage.autodesk.com/custom-install"
      browserTheme="mac"
      showBackground={false}
    >
      {/* Your existing content here */}
      <div className="relative h-screen bg-gray-100">
        {/* Remove the custom header with browser chrome */}
        {/* Keep everything else */}
      </div>
    </DemoWrapper>
  );
}
```

#### For foreground-demo:

This demo has unique persona switching. Preserve it while adding wrapper:

```jsx
// src/App.jsx
import React, { useState } from 'react';
import { DemoWrapper } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
// ... rest of your imports

function App() {
  const [activePersona, setActivePersona] = useState('designer');
  // ... rest of your state

  return (
    <DemoWrapper 
      url="foreground.design/system"
      browserTheme="minimal"
      showBackground={true}
    >
      {/* Keep your persona switching header */}
      <div className="demo-header">
        {/* Persona switcher */}
      </div>
      
      {/* Rest of your content */}
    </DemoWrapper>
  );
}
```

### Step 3: Add Demo Onboarding (Recommended)

Create an onboarding flow to guide users through your demo:

```jsx
import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
import '@portfolio/demo-shared/onboarding-styles';

const onboardingSteps = [
  {
    title: "Welcome to [Your Demo]",
    description: "Brief overview of what this demo shows",
    developerNote: "Technical challenge or approach",
    businessImpact: "Value delivered to the business",
    highlight: true,
    highlightStyle: {
      top: "100px",
      left: "50px",
      right: "50px",
      height: "400px"
    }
  },
  // Add 3-7 steps highlighting key features
];

function App() {
  return (
    <DemoOnboarding
      steps={onboardingSteps}
      demoTitle="Your Demo Title"
      demoDescription="One-line description"
    >
      <DemoWrapper url="your.demo.url">
        {/* Your demo content */}
      </DemoWrapper>
    </DemoOnboarding>
  );
}
```

### Step 4: Ensure Vite Config is Correct

Your `vite.config.js` must have relative base path:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // CRITICAL for portfolio integration
  server: {
    port: 3002,  // Unique port for each demo
  }
})
```

### Step 5: Create README Documentation

Add `README.md` to your demo:

```markdown
# [Demo Name]

## Overview
Brief description of what this demo showcases.

## Key Features
- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## Technical Highlights
- Technology/approach used
- Challenges overcome
- Performance optimizations

## Business Impact
- Metrics or outcomes
- User feedback
- Value delivered

## Development
\`\`\`bash
npm install
npm run dev     # Development server
npm run build   # Production build
\`\`\`

## Notes
Any special considerations or future enhancements.
```

### Step 6: Test Your Migration

1. **Run validation**:
   ```bash
   npm run validate:demos
   ```

2. **Test locally**:
   ```bash
   cd demos/your-demo
   npm run dev
   ```

3. **Build test**:
   ```bash
   npm run build
   ```

4. **Test in portfolio context**:
   ```bash
   # From root
   npm run build:demos
   npm run server
   ```

## Migration-Specific Notes

### custom-install-demo
- Remove custom browser chrome header (lines with window controls)
- Keep the multi-view navigation (library/editor)
- Use `browserTheme="mac"` to match Autodesk style
- Add onboarding to explain the workflow

### foreground-demo
- Keep persona switching functionality
- Remove custom header/footer chrome
- Use `browserTheme="minimal"` for clean look
- Add onboarding to explain the design system

### example-demo
- Convert to React using react-demo-template
- Or update to showcase all shared components
- Make it a reference implementation

## Common Issues & Solutions

### Issue: Build fails after adding DemoWrapper
**Solution**: Ensure you've run `npm install` after adding the dependency

### Issue: Styles conflict with DemoWrapper
**Solution**: DemoWrapper uses CSS modules. Check for global style conflicts.

### Issue: Demo doesn't fill the wrapper
**Solution**: Your root element should use `height: 100%` or `min-height: 100vh`

### Issue: Onboarding highlights are misaligned
**Solution**: Use absolute positioning relative to viewport, not your content

## Validation Error Reference

### Critical Errors (must fix)
- **Missing DemoWrapper**: Demos must use the shared wrapper component
- **Wrong Vite base path**: Must be `base: './'` for relative assets

### Standard Errors (should fix)
- **Missing shared dependency**: Add `@portfolio/demo-shared`
- **Missing README**: Document your demo's purpose

### Warnings (nice to have)
- **No onboarding**: Consider adding for better UX
- **No build output**: Run build to test production readiness

## Getting Help

1. Check `self-service-publishing-demo` as reference
2. Review `demos/shared/README.md` for component docs
3. Run `npm run validate:demos` for specific guidance
4. Check build logs for detailed errors

## Timeline

All demos should be migrated to meet standards. The build process now enforces these standards, with an escape hatch (`npm run build:demos:force`) for emergencies only.