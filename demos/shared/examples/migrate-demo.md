# Migrating Existing Demos to Shared Components

## Example: Updating the Foreground Demo

### Before (Custom implementation):

```jsx
// App.jsx
function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <YourContent />
      </div>
    </div>
  );
}
```

### After (Using shared components):

```jsx
// App.jsx
import { DemoWrapper } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';

function App() {
  return (
    <DemoWrapper url="design.humaninterest.com/foreground">
      <YourContent />
    </DemoWrapper>
  );
}
```

## Steps to Migrate:

1. **Install shared components**:
   ```bash
   # In your demo directory
   cd demos/your-demo
   ```

2. **Update imports**:
   ```jsx
   import { DemoWrapper } from '@portfolio/demo-shared';
   import '@portfolio/demo-shared/styles';
   ```

3. **Wrap your content**:
   ```jsx
   <DemoWrapper url="your.demo.url">
     {/* Your existing demo content */}
   </DemoWrapper>
   ```

4. **Remove duplicate styles**:
   - Remove any custom browser chrome implementations
   - Remove background pattern styles
   - Keep demo-specific styles only

5. **Customize if needed**:
   ```jsx
   <DemoWrapper 
     url="your.demo.url"
     browserTheme="mac"  // or 'windows', 'minimal'
     showBackground={true}
     className="your-custom-class"
   >
     <YourContent />
   </DemoWrapper>
   ```

## Benefits:
- Consistent look across all demos
- Less code to maintain
- Easy to update all demos at once
- Better performance (shared CSS)
- Accessibility improvements built-in