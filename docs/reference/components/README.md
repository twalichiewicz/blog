# Component Reference

Complete reference for all components in the Thomas.design portfolio system.

## Component Categories

### 1. [Demo Components](./demo-components.md)
Interactive components for portfolio demonstrations
- DemoWrapper
- DemoOnboarding  
- BrowserChrome
- Custom Cursors

### 2. [UI Components](./ui-components.md)
User interface elements
- Buttons
- Alerts
- Navigation
- Forms

### 3. [Media Components](./media-components.md)
Media handling and display
- Adaptive Videos
- Image Galleries
- Carousels
- Lightboxes

### 4. Layout Components
Page structure and layout
- Headers
- Footers
- Grids
- Containers

### 5. Content Components  
Content display and formatting
- Article Cards
- Project Summaries
- Code Blocks
- Quotes

## Component Architecture

### Base Structure
```
component-name/
├── component-name.js    # Component logic
├── component-name.scss  # Component styles  
├── component-name.ejs   # Component template
└── README.md           # Component docs
```

### Component Class
```javascript
import BaseComponent from '../../utilities/base-component.js';

export default class ComponentName extends BaseComponent {
  constructor(element) {
    super(element);
    this.init();
  }
  
  init() {
    // Component initialization
  }
}
```

### Style Encapsulation
```scss
.component-name {
  // Component styles
  
  &__element {
    // BEM element styles
  }
  
  &--modifier {
    // BEM modifier styles
  }
}
```

## Using Components

### In Templates (EJS)
```ejs
<%- include('/components/core/button/button', {
  text: 'Click Me',
  variant: 'primary',
  size: 'large'
}) %>
```

### In JavaScript
```javascript
import { Button } from '/components';

const button = new Button(document.querySelector('.button'));
```

### In Demos
```jsx
import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared';

function App() {
  return (
    <DemoOnboarding steps={steps}>
      <DemoWrapper url="demo.com">
        <YourContent />
      </DemoWrapper>
    </DemoOnboarding>
  );
}
```

## Component Guidelines

### Design Principles
1. **Modular**: Self-contained and reusable
2. **Accessible**: WCAG AA compliant
3. **Performant**: Optimized and lazy-loaded
4. **Responsive**: Mobile-first design
5. **Themeable**: Support light/dark modes

### Development Standards
- Use semantic HTML
- Follow BEM naming
- Document all props
- Include usage examples
- Test across browsers

### Performance Considerations
- Lazy load when possible
- Minimize dependencies
- Use CSS containment
- Optimize animations
- Bundle efficiently

## Creating New Components

### 1. Setup Structure
```bash
mkdir -p themes/san-diego/source/components/core/new-component
cd themes/san-diego/source/components/core/new-component
```

### 2. Create Files
```bash
touch new-component.js
touch new-component.scss
touch new-component.ejs
touch README.md
```

### 3. Implement Component
Follow the patterns in existing components

### 4. Register Component
Add to `components/index.js`:
```javascript
export { default as NewComponent } from './core/new-component/new-component.js';
```

### 5. Import Styles
Add to `components/index.scss`:
```scss
@import './core/new-component/new-component';
```

## Component API Reference

### Props System
Components accept props through:
- EJS: Template variables
- JS: Constructor options
- React: Component props

### Events
Components emit custom events:
```javascript
this.emit('component:action', { detail: data });
```

### Methods
Public methods for component control:
```javascript
component.show();
component.hide();
component.destroy();
```

## Testing Components

### Visual Testing
1. Create test page
2. Include all variants
3. Test responsive behavior
4. Verify theme support

### Functional Testing
1. Test interactions
2. Verify accessibility
3. Check edge cases
4. Monitor performance

### Cross-browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Maintenance

### Deprecation Process
1. Mark as deprecated in docs
2. Add console warning
3. Maintain for 2 versions
4. Remove in major update

### Version Control
- Semantic versioning
- Changelog updates
- Migration guides
- Breaking change notes

## Resources

### Internal Documentation
- [Creating Demos](../../guides/development/creating-demos.md)
- [Theme System](../architecture/theme-system.md)
- [Style Guide](../../guides/development/style-guide.md)

### External Resources
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [BEM Methodology](http://getbem.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)