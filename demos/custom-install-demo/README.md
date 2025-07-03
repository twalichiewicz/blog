# Autodesk Custom Install Demo

A React demo showcasing the Autodesk Custom Install tool interface, built with shadcn/ui components and a strictly monochromatic design system.

## Purpose

This demo recreates the Autodesk Custom Install tool's user experience, demonstrating:
- Enterprise software package management
- Product selection and configuration
- High-density UI design patterns
- Monochromatic design system

## Features

### Interactive Demo Tour
- **Guided Onboarding**: Step-by-step tour highlighting key features
- **Commentary Panel**: Developer insights and business impact explanations
- **Feature Callouts**: Visual highlights of important UI elements
- **Keyboard Navigation**: Arrow keys for navigation, Escape to exit

### Library Management
- **Package Library**: View and manage software installation packages
- **Search & Filter**: Find packages quickly with real-time search
- **Tabbed Interface**: Switch between My Library and Team Library
- **Actions**: Create, edit, duplicate, and delete packages

### Package Editor
- **Product Selection**: Choose from Autodesk software products (3ds Max, Maya, AutoCAD, etc.)
- **Version Control**: Select latest or specific software versions
- **Language Options**: Multi-language installation support
- **Configuration**: Expandable sections for extensions and customizations

### Design System
- **Monochromatic**: Strictly grayscale color scheme (no blue/color accents)
- **High Density**: Compact spacing for enterprise efficiency
- **shadcn/ui**: Modern component library with Tailwind CSS
- **Responsive**: Works across desktop and mobile devices

## Technology Stack

- **React 18** - Modern React with hooks
- **shadcn/ui** - Component library with Radix UI primitives
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Vite** - Fast build tool
- **@portfolio/demo-shared** - Shared demo wrapper components

## Component Architecture

```
src/
├── App.jsx                 # Main app with Library and Editor views
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.jsx
│   │   ├── input.jsx
│   │   ├── checkbox.jsx
│   │   ├── select.jsx
│   │   ├── tabs.jsx
│   │   └── ...
│   ├── Toaster.jsx         # Toast notifications
│   └── use-toast.js        # Toast hook
├── index.css               # Global styles and CSS variables
└── main.jsx               # App entry point
```

## Demo Features

### Interactive Tour
- **Start Demo Tour**: Floating button to begin guided experience
- **4-Step Journey**: Overview → Library → Editor → Design System
- **Commentary Panel**: Collapsible panel with developer notes and business impact
- **Visual Highlights**: Feature callouts and interactive elements
- **Metrics Display**: Key performance indicators for each feature

### Library View
- Package listing with search functionality
- Sortable table with hover states
- Quick actions (edit, duplicate, delete)
- Empty states for team library

### Editor View
- Step-by-step package creation
- Product selection with checkboxes
- Version and language configuration
- Expandable sections for advanced options
- Breadcrumb navigation
- Save/cancel actions

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Design Principles

### Enterprise UX
- **Efficiency**: High information density
- **Clarity**: Clear hierarchy and labeling
- **Consistency**: Unified design patterns
- **Accessibility**: Proper contrast and keyboard navigation

### Monochromatic Aesthetic
- **Grayscale Only**: No color accents or brand colors
- **Subtle Contrast**: Minimal visual noise
- **Focus on Content**: Design doesn't distract from data
- **Professional**: Enterprise software appearance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Bundle size: ~280KB (gzipped: ~90KB)
- First contentful paint: <1s
- Interactive: <2s
- Lighthouse score: 95+

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support

---

Part of the [Thomas Walichiewicz Portfolio](https://thomas.design) demo collection.