# San Diego Theme Module System Migration Guide

This guide explains how to migrate from the old global variable system to the new SD namespace module system.

## Overview

The new module system organizes all JavaScript functionality under a single `SD` (San Diego) namespace to avoid global variable pollution and improve code organization.

## Namespace Structure

```javascript
window.SD = {
  core: {
    initialized: boolean,
    modules: Map
  },
  ui: {
    modals: ModalsModule,
    tabs: {
      mobile: MobileTabsModule,
      project: ProjectTabsModule
    },
    carousels: CarouselsModule,
    animations: AnimationsModule
  },
  utils: {
    sound: SoundEffectsModule,
    navigation: NavigationModule,
    device: DeviceDetectionModule,
    cookies: CookiesModule
  },
  content: {
    blog: BlogModule,
    portfolio: PortfolioModule,
    search: SearchModule
  },
  events: EventEmitter
}
```

## Migration Examples

### Sound Effects

**Old way:**
```javascript
window.soundEffects.play('toggle');
window.playButtonSound();
window.initializeSoundEffects();
```

**New way:**
```javascript
SD.utils.sound.play('toggle');
SD.utils.sound.playButton();
SD.utils.sound.init(); // Called automatically by SD.init()
```

### Modals

**Old way:**
```javascript
window.openImpactModal(event);
window.closeImpactModal();
window.openContactModal(event);
window.closeContactModal();
```

**New way:**
```javascript
SD.ui.modals.openImpact(event);
SD.ui.modals.closeImpact();
SD.ui.modals.openContact(event);
SD.ui.modals.closeContact();

// Or use generic modal methods:
SD.ui.modals.openModal('impact-modal');
SD.ui.modals.closeModal('impact-modal');
```

### Blog Functions

**Old way:**
```javascript
window.scrollToFullStory();
window.fetchAndDisplayContent(url);
window.initializeProjectToggle();
window.initializePostsOnlyButton();
```

**New way:**
```javascript
SD.content.blog.scrollToFullStory();
SD.content.blog.fetchAndDisplayContent(url);
SD.content.blog.initializeProjectToggle();
SD.content.blog.initializePostsOnlyButton();
```

### Mobile Tabs

**Old way:**
```javascript
window.mobileTabs.switchTab('portfolio');
window.mobileTabs.getActiveTab();
```

**New way:**
```javascript
SD.ui.tabs.mobile.switchTab('portfolio');
SD.ui.tabs.mobile.getActiveTab();
```

### Navigation

**Old way:**
```javascript
window.initializeAnchorLinks();
window.processExternalLinks();
```

**New way:**
```javascript
SD.utils.navigation.initAnchorLinks();
SD.utils.navigation.processExternalLinks();
```

## Using the Event System

The new module system includes an event emitter for inter-module communication:

```javascript
// Listen for events
SD.events.on('modal:opened', function(data) {
  console.log('Modal opened:', data.modalId);
});

// Emit events
SD.events.emit('custom:event', { data: 'value' });

// Remove listener
SD.events.off('modal:opened', listenerFunction);
```

## Legacy Compatibility

During the transition period, the legacy global functions are still available through `SD.legacy.mapGlobals()`. This is called automatically when the namespace initializes.

```javascript
// These will still work during migration:
window.soundEffects.play('toggle');
window.openImpactModal();
window.scrollToFullStory();
```

## Module Creation Template

To create a new module:

```javascript
(function(SD) {
  'use strict';

  class MyModule {
    constructor() {
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      
      // Module initialization code
      
      this.initialized = true;
      SD.events.emit('my-module:initialized');
    }

    // Module methods...
  }

  // Create and register the module
  const myModule = new MyModule();
  
  // Register with SD namespace
  SD.category.myModule = myModule;
  SD.registerModule('my-module', myModule);

})(window.SD || (window.SD = {}));
```

## HTML Integration

Replace individual script tags with the module loader:

**Old way:**
```html
<script src="/js/sound-effects.js"></script>
<script src="/js/main.js"></script>
<script src="/js/blog.js"></script>
<script src="/js/mobile-tabs.js"></script>
<!-- etc... -->
```

**New way:**
```html
<script src="/js/module-loader.js"></script>
```

## Initialization

The module system initializes automatically when the page loads. You can also manually initialize:

```javascript
// Wait for DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Modules are loaded and initialized automatically
  
  // Access modules after initialization
  if (SD.core.initialized) {
    SD.utils.sound.play('ready');
  }
});

// Or listen for the ready event
SD.events.on('namespace:ready', function() {
  // All modules are loaded and initialized
});
```

## Benefits

1. **No Global Pollution**: Only one global variable (`SD`)
2. **Better Organization**: Related functionality grouped together
3. **Dependency Management**: Clear module dependencies
4. **Event-Driven**: Modules can communicate without tight coupling
5. **Easier Testing**: Modules can be tested in isolation
6. **Better Performance**: Load modules in optimal order
7. **Future-Proof**: Easy to add new modules or refactor existing ones

## Debugging

```javascript
// Check if a module is loaded
SD.isModuleLoaded('sound-effects'); // returns true/false

// Get a registered module
const soundModule = SD.getModule('sound-effects');

// List all registered modules
console.log(SD.core.modules);

// Check namespace structure
console.log(SD);
```

## Common Issues

1. **Module not found**: Ensure the module is added to `module-loader.js`
2. **Function undefined**: Check if module is initialized before use
3. **Legacy function not working**: Ensure `SD.legacy.mapGlobals()` is called
4. **Events not firing**: Make sure listeners are registered before events are emitted

## Gradual Migration Strategy

1. Start using the module loader alongside existing scripts
2. Test that legacy functions still work
3. Gradually update code to use SD namespace
4. Remove individual script tags once migration is complete
5. Remove legacy compatibility layer when no longer needed