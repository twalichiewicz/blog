# JavaScript Refactoring Implementation Guide

## Quick Start Implementation

This guide provides step-by-step instructions to refactor the JavaScript architecture while maintaining all existing functionality.

## Step 1: Set Up Modern Architecture (Day 1-2)

### 1.1 Create new directory structure
```bash
cd themes/san-diego/source/js
mkdir -p app/{core,services,components,modules,utils}
```

### 1.2 Create core files

#### App.js - Central application manager
```javascript
// app/core/App.js
export class App {
  constructor() {
    this.modules = new Map();
    this.initialized = false;
  }
  
  register(name, module) {
    if (this.initialized) {
      console.warn(`Cannot register module '${name}' after initialization`);
      return this;
    }
    this.modules.set(name, module);
    return this;
  }
  
  get(name) {
    return this.modules.get(name);
  }
  
  async init() {
    if (this.initialized) return;
    
    console.log('🚀 Initializing application...');
    const startTime = performance.now();
    
    try {
      // Initialize modules in order
      for (const [name, module] of this.modules) {
        if (module.init) {
          console.log(`  ✓ Initializing ${name}...`);
          await module.init();
        }
      }
      
      this.initialized = true;
      const elapsed = performance.now() - startTime;
      console.log(`✨ Application ready in ${elapsed.toFixed(2)}ms`);
      
    } catch (error) {
      console.error('❌ Initialization failed:', error);
      throw error;
    }
  }
}

export const app = new App();
```

### 1.3 Update build process
```json
// package.json - Add build scripts
{
  "scripts": {
    "build:js": "rollup -c",
    "build:js:watch": "rollup -c -w",
    "lint:js": "eslint themes/san-diego/source/js",
    "lint:js:fix": "eslint themes/san-diego/source/js --fix"
  }
}
```

## Step 2: Create Service Layer (Day 3-4)

### 2.1 Migrate Device Detection

#### Before (4 different implementations)
```javascript
// OLD: device-detection.js, blog.js, MobileTabs.js, main.js
// Each with different breakpoints and methods
```

#### After (Single service)
```javascript
// app/services/DeviceService.js
export class DeviceService {
  constructor(config) {
    this.breakpoints = config.get('breakpoints');
    this.state = this.detect();
  }
  
  init() {
    this.updateClasses();
    window.addEventListener('resize', debounce(() => {
      const oldType = this.state.type;
      this.state = this.detect();
      if (oldType !== this.state.type) {
        this.updateClasses();
        window.dispatchEvent(new CustomEvent('device:changed', { 
          detail: this.state 
        }));
      }
    }, 150));
  }
  
  detect() {
    const width = window.innerWidth;
    let type = 'desktop';
    
    if (width < this.breakpoints.mobile) {
      type = 'mobile';
    } else if (width < this.breakpoints.tablet) {
      type = 'tablet';
    }
    
    return { type, width, height: window.innerHeight };
  }
  
  updateClasses() {
    const { body } = document;
    body.className = body.className
      .replace(/device-\w+/g, '')
      .trim();
    body.classList.add(`device-${this.state.type}`);
  }
  
  is(type) {
    return this.state.type === type;
  }
}
```

### 2.2 Migrate Theme Management

#### Before (2 implementations)
```javascript
// OLD: main.js localStorage + utils/color-scheme.js cookies
```

#### After (Unified service)
```javascript
// app/services/ThemeService.js
export class ThemeService {
  constructor(storage) {
    this.storage = storage;
    this.current = 'auto';
  }
  
  init() {
    this.current = this.storage.get('theme') || 'auto';
    this.apply();
    
    // Listen for system changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.current === 'auto') this.apply();
    });
  }
  
  set(theme) {
    this.current = theme;
    this.storage.set('theme', theme);
    this.apply();
    
    window.dispatchEvent(new CustomEvent('theme:changed', {
      detail: { theme }
    }));
  }
  
  apply() {
    const effective = this.getEffective();
    document.documentElement.dataset.theme = effective;
  }
  
  getEffective() {
    if (this.current !== 'auto') return this.current;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
```

## Step 3: Component Migration (Day 5-7)

### 3.1 Create Base Component
```javascript
// app/components/Component.js
export class Component {
  constructor(element, options = {}) {
    this.element = typeof element === 'string'
      ? document.querySelector(element)
      : element;
      
    if (!this.element) {
      throw new Error(`Component element not found: ${element}`);
    }
    
    this.options = { ...this.constructor.defaults, ...options };
    this.listeners = new Map();
  }
  
  on(target, event, handler, options) {
    const element = typeof target === 'string'
      ? this.element.querySelector(target)
      : target;
      
    if (!element) return;
    
    const bound = handler.bind(this);
    element.addEventListener(event, bound, options);
    
    if (!this.listeners.has(element)) {
      this.listeners.set(element, []);
    }
    this.listeners.get(element).push({ event, handler: bound, options });
  }
  
  destroy() {
    this.listeners.forEach((list, element) => {
      list.forEach(({ event, handler, options }) => {
        element.removeEventListener(event, handler, options);
      });
    });
    this.listeners.clear();
  }
}
```

### 3.2 Migrate Search Component

#### Before (2 separate implementations)
```javascript
// OLD: search.js (standalone) + blog.js handleSearch()
```

#### After (Unified component)
```javascript
// app/components/SearchComponent.js
import { Component } from './Component.js';
import { debounce } from '../utils/helpers.js';

export class SearchComponent extends Component {
  static defaults = {
    minLength: 2,
    delay: 300
  };
  
  async init() {
    this.input = this.element.querySelector('input');
    this.results = this.element.querySelector('.results');
    
    this.search = debounce(
      this.performSearch.bind(this),
      this.options.delay
    );
    
    this.on(this.input, 'input', this.handleInput);
    this.on(document, 'click', this.handleOutside);
  }
  
  handleInput(e) {
    const query = e.target.value.trim();
    
    if (query.length < this.options.minLength) {
      this.hide();
      return;
    }
    
    this.search(query);
  }
  
  async performSearch(query) {
    // Implementation...
  }
}
```

## Step 4: Migration Strategy (Day 8-10)

### 4.1 Gradual Migration Approach

```javascript
// main-new.js - New entry point
import { app } from './app/core/App.js';
import { DeviceService } from './app/services/DeviceService.js';
import { ThemeService } from './app/services/ThemeService.js';

// Register new services
app.register('device', new DeviceService(config));
app.register('theme', new ThemeService(storage));

// Keep old functionality during migration
if (window.BlogAppLegacy) {
  window.BlogAppLegacy.init();
}

// Initialize new system
app.init();
```

### 4.2 Feature Flag System
```javascript
// Enable new components gradually
const features = {
  newSearch: true,
  newTheme: true,
  newDevice: true,
  newCarousel: false,  // Still using old
  newTabs: false       // Still using old
};

// Conditional loading
if (features.newSearch) {
  app.register('search', new SearchComponent('.search'));
} else {
  // Load legacy search.js
}
```

## Step 5: Testing & Validation (Day 11-12)

### 5.1 Create test harness
```javascript
// test/migration-test.js
class MigrationTest {
  constructor() {
    this.tests = [];
  }
  
  add(name, oldImpl, newImpl) {
    this.tests.push({ name, oldImpl, newImpl });
  }
  
  async run() {
    for (const test of this.tests) {
      console.log(`Testing: ${test.name}`);
      
      const oldResult = await test.oldImpl();
      const newResult = await test.newImpl();
      
      if (JSON.stringify(oldResult) !== JSON.stringify(newResult)) {
        console.error(`❌ ${test.name} failed`);
        console.log('Old:', oldResult);
        console.log('New:', newResult);
      } else {
        console.log(`✅ ${test.name} passed`);
      }
    }
  }
}

// Test device detection
tester.add('Device Detection', 
  () => window.DeviceDetection.getDevice(),
  () => app.get('device').state.type
);
```

### 5.2 Visual regression testing
```bash
# Before migration
npm run build
cp -r public public-before

# After each component
npm run build
diff -r public-before public

# Visual comparison
puppeteer-test.js  # Screenshot comparison
```

## Migration Checklist

### Week 1: Foundation
- [ ] Set up new directory structure
- [ ] Create App, Config, EventBus classes
- [ ] Set up build pipeline (Rollup/Webpack)
- [ ] Create base Component class
- [ ] Add ESLint configuration

### Week 2: Core Services
- [ ] Migrate DeviceService (replace 4 implementations)
- [ ] Migrate ThemeService (replace 2 implementations)
- [ ] Create StorageService abstraction
- [ ] Add utility functions module
- [ ] Create test harness

### Week 3: Components
- [ ] Migrate SearchComponent
- [ ] Migrate CarouselComponent  
- [ ] Migrate TabsComponent
- [ ] Migrate NavigationComponent
- [ ] Update event handling patterns

### Week 4: Features & Cleanup
- [ ] Refactor blog.js to BlogModule
- [ ] Refactor project files to modules
- [ ] Remove duplicate implementations
- [ ] Update initialization flow
- [ ] Remove legacy files

## Common Migration Patterns

### Pattern 1: Global to Module
```javascript
// Before
window.initColorScheme = function() { /* ... */ }
window.DeviceDetection = { /* ... */ }

// After
export class ThemeService { /* ... */ }
export class DeviceService { /* ... */ }
```

### Pattern 2: Multiple DOMContentLoaded to Single Init
```javascript
// Before - in 13 different files
document.addEventListener('DOMContentLoaded', init);

// After - single entry point
app.init(); // Handles DOM ready internally
```

### Pattern 3: Direct DOM to Component Events
```javascript
// Before
element.addEventListener('click', handler);
// No cleanup!

// After
this.on(element, 'click', this.handler);
// Automatic cleanup on destroy()
```

### Pattern 4: Scattered Utils to Centralized
```javascript
// Before - defined in multiple files
function fadeIn() { /* in blog.js */ }
function fadeOut() { /* in project.js */ }

// After - single location
import { fadeIn, fadeOut } from './utils/animations.js';
```

## Debugging & Troubleshooting

### Enable debug mode
```javascript
// Add to App.js
if (window.location.search.includes('debug')) {
  window.BlogApp = app;  // Expose for debugging
  app.debug = true;
}

// Log all events
if (app.debug) {
  eventBus.on('*', (event, data) => {
    console.log(`Event: ${event}`, data);
  });
}
```

### Common issues

1. **Component not initializing**
   - Check element selector
   - Verify DOM is ready
   - Check console for errors

2. **Events not firing**
   - Verify event listener is bound
   - Check event bubbling
   - Use debug mode

3. **Memory leaks**
   - Ensure destroy() is called
   - Check for circular references
   - Use Chrome DevTools heap snapshots

## Performance Monitoring

```javascript
// Add performance marks
app.init = async function() {
  performance.mark('app-init-start');
  
  // ... initialization ...
  
  performance.mark('app-init-end');
  performance.measure('app-init', 'app-init-start', 'app-init-end');
  
  const measure = performance.getEntriesByName('app-init')[0];
  console.log(`App initialized in ${measure.duration}ms`);
};
```

## Final Steps

1. **Update documentation**
2. **Train team on new patterns**
3. **Set up monitoring**
4. **Plan for future enhancements**

## Success Metrics

- ✅ Zero duplicate implementations
- ✅ Single initialization flow  
- ✅ Consistent module pattern
- ✅ Automatic memory cleanup
- ✅ 35% smaller bundle size
- ✅ Better performance metrics
- ✅ Improved developer experience