# React Demo Template

A comprehensive template for creating portfolio demos that showcases all shared components and best practices.

## 🚀 Quick Start

```bash
# Copy this template for a new demo
cp -r demos/examples/react-demo-template demos/my-new-demo

# Navigate to your new demo
cd demos/my-new-demo

# Update package.json name and port (use next available port: 3008, 3009, etc.)
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📦 What's Included

### Shared Components
- ✅ **DemoWrapper** - Browser chrome with grid background
- ✅ **DemoOnboarding** - Rich guided tour system  
- ✅ **Custom cursors** - Enterprise-style cursor behavior
- ✅ **Responsive design** - Mobile-optimized layouts
- ✅ **Dark mode support** - Automatic theme adaptation

### Demo Patterns
- ✅ **Dual-context UI** - Adapts for inline vs fullscreen
- ✅ **Progressive disclosure** - Advanced features revealed when needed
- ✅ **Loading states** - Async operation feedback
- ✅ **Interactive metrics** - Real-time data display
- ✅ **Tab navigation** - Organized content sections

### Configuration Examples
- ✅ **Browser themes** - Mac, Windows, minimal
- ✅ **Background patterns** - Grid, dots, diagonal, custom
- ✅ **Onboarding steps** - With highlights, callouts, metrics
- ✅ **Proper asset paths** - Relative paths for iframe compatibility

## 🎯 Key Features Demonstrated

### 1. Standard Grid Background
The signature grid pattern used across all portfolio demos:
```jsx
<DemoWrapper 
  showBackground={true}  // Enables the grid pattern
  backgroundStyle={{}}   // Custom overrides if needed
>
```

### 2. Comprehensive Onboarding
Rich guided tours with business metrics and developer commentary:
```jsx
const onboardingSteps = [
  {
    title: "Step Title",
    description: "User-facing description",
    developerNote: "Technical implementation details",
    businessImpact: "Business value and results",
    metrics: [
      { value: "75%", label: "Improvement" }
    ],
    highlight: true,  // Optional UI highlighting
    callouts: [...]   // Optional UI callouts
  }
];
```

### 3. Custom Cursor Integration
App-appropriate cursor styling:
```jsx
<DemoWrapper customCursor="enterprise">
  {/* All child elements inherit the cursor */}
</DemoWrapper>
```

Available cursor types:
- `enterprise` - Professional/B2B applications
- `design-system` - Design tools and systems
- `consumer` - Consumer-facing applications  
- `interactive` - Highly interactive demos
- `default` - Standard pointer

### 4. Browser Chrome Options
```jsx
<DemoWrapper 
  browserTheme="mac"        // or "windows", "minimal"
  url="your.demo.url"       // Displayed in address bar
>
```

## 🛠️ Customization Guide

### Replace Demo Content
1. Keep the `DemoOnboarding` and `DemoWrapper` structure
2. Replace the `DemoContent` component with your actual demo
3. Update `onboardingSteps` with your demo's story
4. Customize the `url` prop to match your demo's context

### Update Configuration
1. Change the port in `vite.config.js` (use next available: 3008, 3009, etc.)
2. Update `package.json` name and description
3. Configure demo type in root `demo-config.json` if needed

### Styling Approach
- Use inline styles for demo clarity (like this template)
- Or import CSS modules for complex styling
- Global styles go in `App.css`
- Shared component styles are automatically included

## 📋 Checklist for New Demos

### Development
- [ ] Copy template to new directory
- [ ] Update package.json name and port
- [ ] Install dependencies (`npm install`)
- [ ] Replace demo content
- [ ] Update onboarding steps
- [ ] Test in both inline and fullscreen modes

### Configuration  
- [ ] Set appropriate demo type in `demo-config.json`
- [ ] Configure custom cursor for your demo type
- [ ] Set browser theme (Mac/Windows/minimal)
- [ ] Choose background pattern
- [ ] Update URL to match your demo context

### Content Quality
- [ ] Rich onboarding with business metrics
- [ ] Developer commentary explaining decisions
- [ ] Interactive elements that tell a story
- [ ] Mobile-responsive design
- [ ] Error states and loading feedback

### Deployment
- [ ] Build successfully (`npm run build`)
- [ ] Test built version (`npm run preview`)
- [ ] Verify iframe compatibility
- [ ] Add to portfolio post front matter

## 🔧 Troubleshooting

### Common Issues

**Build Errors**
- Ensure `base: './'` in vite.config.js
- Check that all imports are correct
- Verify shared components are installed

**Demo Not Loading in Portfolio**
- Check front matter: `demo_component: "your-demo-name"`
- Ensure demo builds to `dist/index.html`
- Verify port isn't conflicting with other demos

**Styling Issues**
- Import shared styles: `@portfolio/demo-shared/styles`
- Check responsive breakpoints in `App.css`
- Verify custom cursor inheritance

**Onboarding Not Working**
- Import onboarding styles: `@portfolio/demo-shared/onboarding-styles`
- Check that steps array is properly formatted
- Verify DemoOnboarding wraps DemoWrapper

## 📚 Related Documentation

- [Demo System Overview](../../README.md)
- [Shared Components Guide](../../shared/README.md)
- [Build System Documentation](../../build-scripts/README-AUTOFIX.md)
- [Migration Guide](../../MIGRATION_GUIDE.md)

## ✨ Pro Tips

1. **Story-Driven Design** - Focus on user journey, not feature lists
2. **Progressive Disclosure** - Start simple, reveal complexity gradually  
3. **Responsive First** - Design for mobile, enhance for desktop
4. **Performance Matters** - Keep bundle size under 1MB for templates
5. **Accessibility** - Use semantic HTML and proper ARIA labels
6. **Loading States** - Always provide feedback for async operations

This template showcases all the shared components and patterns. Use it as a reference and starting point for your own portfolio demos!