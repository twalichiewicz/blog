# Demo Shared Components

Reusable components for creating consistent demo presentations across the portfolio.

## Installation

In your demo project:

```bash
# If using npm workspaces (recommended)
# The shared components will be automatically available

# Otherwise, link manually
cd demos/your-demo
npm link ../shared
```

## Usage

### Basic Example

```jsx
import React from 'react';
import { DemoWrapper } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';

function App() {
  return (
    <DemoWrapper url="app.example.com">
      <YourDemoContent />
    </DemoWrapper>
  );
}
```

### Custom Browser Chrome

```jsx
import { DemoWrapper } from '@portfolio/demo-shared';

// Mac style (default)
<DemoWrapper url="manage.autodesk.com/products">
  <Content />
</DemoWrapper>

// Windows style
<DemoWrapper 
  url="app.microsoft.com/dashboard"
  browserTheme="windows"
>
  <Content />
</DemoWrapper>

// Minimal style
<DemoWrapper 
  url="simple.app"
  browserTheme="minimal"
>
  <Content />
</DemoWrapper>
```

### Custom Background

```jsx
// No background
<DemoWrapper 
  url="example.com"
  showBackground={false}
>
  <Content />
</DemoWrapper>

// Custom background style
<DemoWrapper 
  url="example.com"
  backgroundStyle={{
    backgroundColor: '#f0f4f8',
    backgroundImage: 'linear-gradient(45deg, #f0f4f8 25%, transparent 25%)'
  }}
>
  <Content />
</DemoWrapper>
```

### Using BrowserChrome Directly

```jsx
import { BrowserChrome } from '@portfolio/demo-shared';

<div className="your-custom-wrapper">
  <BrowserChrome 
    url="custom.app"
    theme="mac"
    showAddressBar={true}
    showControls={true}
  >
    <YourContent />
  </BrowserChrome>
</div>
```

## Props

### DemoWrapper

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Demo content to display |
| `url` | string | - | URL to display in browser chrome |
| `browserTheme` | 'mac' \| 'windows' \| 'minimal' | 'mac' | Browser chrome style |
| `showBackground` | boolean | true | Show background pattern |
| `backgroundStyle` | object | {} | Custom CSS styles for background |
| `className` | string | '' | Additional CSS classes |

### BrowserChrome

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Content to display |
| `url` | string | 'example.com' | URL for address bar |
| `theme` | 'mac' \| 'windows' \| 'minimal' | 'mac' | Chrome style |
| `showAddressBar` | boolean | true | Show address bar |
| `showControls` | boolean | true | Show window controls |

## Customization

### CSS Variables

You can customize the appearance using CSS variables:

```css
:root {
  --demo-bg-color: #f5f5f5;
  --demo-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  --browser-header-bg: linear-gradient(to bottom, #e8e8e8, #d8d8d8);
  --browser-border-color: #b8b8b8;
}
```

### Background Patterns

Available background pattern classes:
- Default: Grid pattern
- `.demo-background--dots`: Dot pattern
- `.demo-background--diagonal`: Diagonal lines

## Examples

### Autodesk Style Demo

```jsx
<DemoWrapper 
  url="manage.autodesk.com/products/custom-install"
  browserTheme="mac"
>
  <AutodeskHeader />
  <YourAutodeskDemo />
</DemoWrapper>
```

### Simple Prototype Demo

```jsx
<DemoWrapper 
  url="prototype.local"
  browserTheme="minimal"
  showBackground={false}
>
  <SimplePrototype />
</DemoWrapper>
```

### Enterprise App Demo

```jsx
<DemoWrapper 
  url="enterprise.app/dashboard"
  browserTheme="windows"
>
  <EnterpriseApp />
</DemoWrapper>
```