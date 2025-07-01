# 📋 NEW Demo Standards (2025)

## 🎯 Core Principle
**Demos provide two experiences: inline preview + fullscreen guided tour**

## 🔧 Implementation Requirements

### 1. **Iframe Detection (Automatic)**
All demos automatically detect their context using the new iframe detection utilities:

```jsx
import { useDemoContext } from '@portfolio/demo-shared';

function MyDemo() {
  const { isIframe, isFullscreen, shouldShowOnboarding } = useDemoContext();
  
  // Demo automatically adapts to context
  return (
    <DemoWrapper url="myapp.com">
      {shouldShowOnboarding ? <DetailedUI /> : <CleanUI />}
    </DemoWrapper>
  );
}
```

### 2. **Onboarding Visibility**
- **In iframe (inline)**: No onboarding content visible - pure demo only
- **In fullscreen (modal)**: Full onboarding with commentary and guidance
- **Automatic**: DemoOnboarding component handles this automatically

### 3. **Portfolio Post Configuration**
```yaml
---
title: My Project
demo_component: "my-project-demo"  # Required
# demo_inline: true                # ❌ DEPRECATED - Don't use
---
```

### 4. **Template Behavior**
- **Hero section**: Always shows demo inline (iframe) when `demo_component` exists
- **Demo button**: Always appears next to "Read the full story" when `demo_component` exists
- **Button function**: Opens fullscreen modal with onboarding

## 📏 New Validation Rules

### ✅ Required Standards
1. **Must use DemoWrapper** for consistent browser chrome
2. **Must have demo button** (not inline-only)
3. **Must handle iframe context** (onboarding hidden in iframe)
4. **Must build to dist/** with relative paths

### ⚠️ Deprecated Patterns
1. **`demo_inline: true`** - No longer needed/used
2. **Manual iframe handling** - Use shared utilities instead
3. **Always-visible onboarding** - Must respect iframe context

## 🚀 Migration Guide

### For Existing Demos

#### 1. Update Component Imports
```jsx
// Add iframe detection
import { DemoWrapper, DemoOnboarding, useDemoContext } from '@portfolio/demo-shared';
```

#### 2. Remove demo_inline from Posts
```yaml
# Before ❌
demo_component: "my-demo"
demo_inline: true

# After ✅
demo_component: "my-demo"
```

#### 3. Auto-Iframe Detection
DemoOnboarding already handles this automatically as of this update. No changes needed to existing demos with DemoOnboarding.

### For New Demos

#### 1. Use Demo Creation Tool
```bash
npm run create:demo my-new-demo \
  --name "My New Demo" \
  --url "mynewdemo.com" \
  --type consumer \
  --onboarding
```

#### 2. Standard Structure
```jsx
import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared';

const steps = [/* Your onboarding steps */];

function App() {
  return (
    <DemoOnboarding steps={steps} demoTitle="My Demo">
      <DemoWrapper url="mynewdemo.com">
        <MyDemoContent />
      </DemoWrapper>
    </DemoOnboarding>
  );
}
```

## 🎨 User Experience Flow

### 1. **Portfolio Browse**
- User sees project cards
- Demos appear inline in hero sections (pure demo, no onboarding)
- Clean, product-focused preview

### 2. **Demo Button Click**
- White "DEMO |>" button next to "Read the full story"
- Opens fullscreen modal
- Shows complete onboarding experience with:
  - Developer commentary
  - Business impact metrics
  - Guided walkthrough
  - Feature callouts

### 3. **Context Switching**
- Same demo code
- Different experience based on context
- Automatic, no configuration needed

## 🔍 Validation Commands

```bash
# Check all demos meet new standards
npm run validate:demos

# Build with new standards enforced
npm run build:demos

# Create new demo with standards
npm run create:demo <name> [options]
```

## ✨ Benefits

### For Users
- Quick inline previews without overwhelming UI
- Full guided experience when desired
- Consistent interface patterns

### For Developers
- Single codebase for both contexts
- Automatic context detection
- Shared component system
- Clear validation feedback

### For Portfolio
- Every demo has inline preview
- Every demo has guided experience
- Consistent UX patterns
- Better engagement metrics

## 📊 Current Status

**All demos updated to new standards:**
- ✅ Self-Service Publishing Pipeline
- ✅ Autodesk Custom Install  
- ✅ Foreground Design System
- ✅ Human Interest Brand Demo
- ✅ Example Demo

**Validation passing:** All demos meet minimum standards
**Template updated:** Auto-inline + demo button for all demos
**Shared components:** Iframe detection built-in