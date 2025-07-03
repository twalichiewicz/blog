# Quick Reference Guide

Essential commands and patterns for Thomas.design portfolio development.

## 🚀 Most Common Commands

```bash
# Development
npm run dev            # Start dev server with auto-rebuild & demos
npm run test:dev       # Quick validation (5s)
npm run server         # Legacy server (no demo building)
npm run dev:demos      # Start demo dev servers only

# Pre-commit
npm run test:quick      # Essential tests (20s)
npm run lint:scss:fix   # Fix SCSS issues

# Release
npm test               # Full test suite
npm run build:prod     # Production build
npm run deploy         # Deploy to GitHub Pages
```

## 🎮 Demo Development

### Creating a New Demo
```bash
npm run create:demo
# or manually:
cp -r demos/examples/react-demo-template demos/my-new-demo
cd demos/my-new-demo
npm install
```

### Demo Structure
```jsx
import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
import '@portfolio/demo-shared/onboarding-styles';

const onboardingSteps = [
  {
    title: "Step Title",
    description: "User description",
    developerNote: "Technical details",
    businessImpact: "Business value",
    metrics: [
      { value: "75%", label: "Improvement" }
    ]
  }
];

function App() {
  return (
    <DemoOnboarding steps={onboardingSteps} demoTitle="Demo Name">
      <DemoWrapper url="demo.local" customCursor="enterprise">
        <YourDemoContent />
      </DemoWrapper>
    </DemoOnboarding>
  );
}
```

### Portfolio Integration
Add to front matter:
```yaml
demo_component: "my-new-demo"
```

## 🧪 Testing Cheat Sheet

| Scenario | Command | Time |
|----------|---------|------|
| Quick check while coding | `npm run test:dev` | 5s |
| Before committing | `npm run test:quick` | 20s |
| Before pushing | `npm test` | 2-5min |
| Fix demo dependencies | `npm run install:demos` | varies |
| Check content only | `npm run validate:content` | 10s |

## 📁 Key File Locations

### Demos
- Templates: `demos/examples/react-demo-template/`
- Shared components: `demos/shared/components/`
- Build scripts: `demos/build-scripts/`
- Config: `demos/demo-config.json`

### Documentation
- Component API: `demos/shared/COMPONENT_API.md`
- Testing guide: `docs/TESTING.md`
- This file: `docs/QUICK-REFERENCE.md`

### Testing
- Comprehensive: `scripts/comprehensive-test.js`
- Quick: `scripts/quick-test.js`
- Dependency installer: `scripts/install-demo-deps.js`

## 🎨 Common Patterns

### Browser Themes
```jsx
// Enterprise
<DemoWrapper browserTheme="windows" customCursor="enterprise" />

// Design System
<DemoWrapper browserTheme="minimal" customCursor="design-system" />

// Consumer
<DemoWrapper browserTheme="mac" customCursor="consumer" />
```

### Cursor Types
- `default` - Standard pointer
- `enterprise` - Professional apps
- `design-system` - Design tools
- `consumer` - Consumer apps
- `interactive` - Highly interactive

### Background Options
```jsx
// Grid (default)
<DemoWrapper showBackground={true} />

// Custom
<DemoWrapper backgroundStyle={{ background: 'linear-gradient(...)' }} />

// None
<DemoWrapper showBackground={false} />
```

## 🔧 Troubleshooting

### Demo Won't Build
```bash
npm run install:demos
cd demos/problem-demo && npm install
```

### Test Failures
```bash
# See detailed errors
npm run test:comprehensive -- --verbose

# Skip slow tests
npm run test:comprehensive -- --quick --skip-build
```

### Content Warnings
```bash
# Content issues are warnings, not failures
npm run validate:content  # See details
```

## 📝 Creating Content

### New Blog Post
```bash
hexo new blog-post "Post Title"
```

### New Portfolio Project
```bash
hexo new portfolio-post "Project Name"
```

### Front Matter for Demos
```yaml
---
title: Project Name
demo_component: "demo-folder-name"
notebook_color: nordic-blue
notebook_texture: worn
---
```

## 🚨 Important Rules

1. **Always test before committing**: `npm run test:quick`
2. **Use shared components**: Don't create custom browser chrome
3. **Include onboarding**: All demos need business context
4. **Follow cursor types**: Match cursor to demo type
5. **Test both contexts**: Inline and fullscreen modes

## 🔗 Links

- [Full Testing Guide](./TESTING.md)
- [Component API](../demos/shared/COMPONENT_API.md)
- [Demo Standards](../demos/NEW_DEMO_STANDARDS.md)
- [Standardization Summary](./DEMO-STANDARDIZATION-SUMMARY.md)

---

*Last updated: June 26, 2025*