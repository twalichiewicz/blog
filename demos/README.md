# Portfolio Demos

Interactive demonstrations for portfolio projects. Each demo is a self-contained web application that showcases specific features from the projects.

## Quick Start

```bash
# Build all demos (automatically done during site build)
npm run build:demos

# Start demo dev servers
npm run dev:demos

# Validate demo standards
npm run test:demos
```

## Structure

```
demos/
├── build-scripts/          # Build and automation scripts
│   ├── build-all-demos.js # Builds all demos
│   ├── watch-demos.js     # Dev server orchestration
│   ├── validate-demo-standards-v2.js # Standards validation
│   ├── auto-fix-with-claude.js # AI-powered fixes
│   └── create-demo.js     # Demo generator
├── shared/                # Shared components & utilities
│   ├── components/        # DemoWrapper, DemoOnboarding, etc.
│   ├── assets/           # Shared assets (cursors, etc.)
│   └── utils/            # Utility functions
├── examples/             # Demo templates
└── [project-demos]/      # Individual demo projects
```

## Creating a New Demo

### Option 1: Use the Generator (Recommended)

```bash
npm run create:demo

# Follow the interactive prompts:
# ✏️  Demo name: my-feature-demo
# 📁 Demo type: enterprise
# 🔌 Port: 3006
```

### Option 2: Manual Setup

1. **Copy template**:
   ```bash
   cp -r demos/examples/react-demo-template demos/my-demo
   cd demos/my-demo
   ```

2. **Update configuration**:
   ```javascript
   // vite.config.js
   export default defineConfig({
     base: './',  // CRITICAL for iframe loading
     server: {
       port: 3006  // Unique port
     }
   })
   ```

3. **Implement with shared components**:
   ```jsx
   import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared';
   import '@portfolio/demo-shared/styles/demo-cursors.css'; // Custom cursors
   
   function App() {
     return (
       <DemoOnboarding steps={onboardingSteps}>
         <DemoWrapper url="app.example.com">
           <YourDemo />
         </DemoWrapper>
       </DemoOnboarding>
     );
   }
   ```

## Demo Standards & Requirements

### ✅ Required Components

1. **DemoWrapper** - Provides browser chrome and background
2. **DemoOnboarding** - Interactive tour for fullscreen mode
3. **Proper build config** - `base: './'` in vite.config.js
4. **Unique port** - Configured in demo-config.json

### 📋 Validation Checks

The build system validates:
- ✓ Uses shared components (DemoWrapper, DemoOnboarding)
- ✓ Correct build configuration
- ✓ Proper file structure (dist/index.html)
- ✓ No missing dependencies
- ✓ Custom cursor implementation
- ✓ Iframe compatibility

### 🎨 Demo Types

| Type | Browser | Background | Cursor | Onboarding |
|------|---------|------------|---------|------------|
| enterprise | windows/mac | ❌ | crosshair | required |
| consumer | mac | ✅ | branded | optional |
| design-system | minimal | ✅ | help | required |
| interactive | mac | ✅ | grab | required |
| code-toy | mac | ✅ | default | not required |

## Integration with Blog

### Front Matter Configuration

Add demo configuration to your project's markdown file:

```yaml
---
title: "My Project"
demo_component: "my-project-demo"  # Directory name in demos/
demo_height: "500px"               # Optional: custom height
demo_fullscreen: true              # Optional: allow fullscreen
---
```

### Build Process

Demos are built automatically during the blog build:

```bash
# Development
npm run dev:demos    # Start all demo dev servers
npm run server       # Start blog dev server

# Production
npm run build        # Builds demos + blog
```

## Development Workflow

1. **Start demo development**:
   ```bash
   npm run dev:demos
   ```

2. **Start blog development** (separate terminal):
   ```bash
   npm run server
   ```

3. **Your demo will be available at**:
   - Development: `http://localhost:3001` (or next available port)
   - In blog: `http://localhost:4000/demos/my-project-demo/`

## Demo Templates

See `examples/` directory for starter templates:

- `react-demo-template/` - React + Vite setup
- `vanilla-demo-template/` - Vanilla JavaScript setup
- `vue-demo-template/` - Vue + Vite setup

## Shared Components

### DemoWrapper
```jsx
<DemoWrapper 
  url="app.example.com"      // URL in browser chrome
  browserTheme="mac"         // mac, windows, minimal
  showBackground={true}       // Grid pattern background
  customCursor="enterprise"  // Custom cursor style
>
  <YourContent />
</DemoWrapper>
```

### DemoOnboarding
```jsx
const steps = [
  {
    title: "Welcome",
    description: "Introduction to the demo",
    developerNote: "Technical implementation details",
    businessImpact: "$2M annual savings",
    metrics: [
      { value: "250x", label: "Faster" },
      { value: "95%", label: "Less errors" }
    ]
  }
];

<DemoOnboarding steps={steps}>
  <YourDemo />
</DemoOnboarding>
```

### Custom Cursors

All demos automatically include custom cursors when you import the shared styles:

```css
/* In your demo's main CSS file */
@import '@portfolio/demo-shared/styles/demo-cursors.css';
```

This provides:
- **Default cursor**: White arrow for general navigation
- **Pointer cursor**: Arrow with blue dot for interactive elements  
- **Text cursor**: I-beam for text inputs
- **Disabled cursor**: Prohibition sign for disabled states
- **Loading cursor**: Circular spinner for loading states
- **Grab/Grabbing**: For draggable elements

The cursors are automatically applied to appropriate elements - no additional configuration needed!

For complete cursor documentation, see `/docs/PROTOTYPE-CURSORS.md`.

## Best Practices

### 🚀 Performance
- Keep bundles under 1MB
- Use code splitting and lazy loading
- Optimize all images with Sharp
- Monitor bundle size with `npm run analyze`

### ♿ Accessibility
- Full keyboard navigation
- Proper ARIA labels
- Color contrast compliance (WCAG AA)
- Screen reader announcements

### 📱 Responsive Design
- Test on all device sizes
- Touch-friendly interactions
- Adaptive layouts
- Performance on mobile networks

### 🧪 Testing
```bash
# Test individual demo
cd demos/my-demo && npm run dev

# Test in iframe context
npm run server  # Then navigate to project

# Validate standards
npm run validate:demos
```

## Claude Auto-Fix System

### What Gets Fixed Automatically

- ✅ Missing DemoWrapper import/usage
- ✅ Missing DemoOnboarding component  
- ✅ Incorrect props or configurations
- ✅ Missing dependencies in package.json
- ✅ Build configuration issues
- ✅ Import path problems

### CI/CD Integration

1. Push changes to feature branch
2. GitHub Actions runs validation
3. If failures detected, Claude attempts fixes
4. Creates PR with fixes automatically
5. Review and merge

### Cost Management

- ~$0.01-0.20 per fix depending on complexity
- Use `CLAUDE_MODEL=claude-3-sonnet-20240229` for cheaper fixes
- Monitor usage in Anthropic console

See [Claude Auto-Fix Documentation](../docs/CLAUDE-AUTOFIX-SYSTEM.md) for full details.

## Troubleshooting

### Common Issues

**❌ Validation fails**
```bash
# Auto-fix with Claude
npm run fix:demos

# Or fix manually and re-validate
npm run validate:demos
```

**❌ Port already in use**
```bash
# Find and kill process
lsof -ti:3004 | xargs kill -9
```

**❌ Assets not loading in iframe**
```javascript
// Ensure this in vite.config.js
export default defineConfig({
  base: './'  // MUST be relative
})
```

**❌ Custom cursor not showing**
1. Check cursor assets: `ls themes/san-diego/source/demos/shared/assets/cursors/`
2. Verify paths are relative in cursor-utils.js
3. Rebuild: `npm run build:demos`

**❌ Build out of memory**
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build:demos
```