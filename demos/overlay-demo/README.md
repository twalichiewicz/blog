# Universal Intelligence Layer (Overlay) Demo

An interactive demonstration of a cross-application AI overlay system that enhances all Autodesk desktop applications with unified cloud-connected intelligence.

## Overview

This demo showcases the concept of a Steam-like overlay that runs as a singleton across 60+ Autodesk desktop products, providing:
- Contextual AI assistance
- Shared project history
- Cross-application workflows
- Real-time collaboration tools

## Key Features

### 🖥️ Simulated macOS Environment
- Realistic desktop with menu bar and dock
- Three CAD applications: Fusion 360, AutoCAD, and Revit
- Click between apps to see context switching

### 🎮 Steam-Style Overlay
- Press `Shift + Space` to activate
- Slides in from the left with backdrop blur
- Maintains state across all applications

### 🤖 Intelligent Features
- **AI Assistant**: Context-aware suggestions for current app
- **Project History**: Recent files across all applications
- **Collaboration**: Screen share, comments, and live sync
- **Smart Shortcuts**: Keyboard shortcuts for productivity

### 📊 Live Widgets
- Performance monitor showing CPU, Memory, and GPU usage
- Demonstrates how overlay can surface system information

## Technical Implementation

- Built with React and Framer Motion
- Uses shared demo components (DemoWrapper, DemoOnboarding)
- Implements enterprise cursor style
- Responsive design with fullscreen support

## User Interactions

1. **Switch Applications**: Click on different CAD apps or use the dock
2. **Toggle Overlay**: Press `Shift + Space`
3. **Navigate Features**: Click tabs in the overlay panel
4. **Close Overlay**: Press `Escape` or click outside

## Business Impact

- **$10M+ Savings**: Eliminates duplicate feature development
- **60+ Applications**: Single codebase serves entire product suite
- **0ms Switch Time**: Instant context retention between apps
- **100% Coverage**: Universal features available everywhere

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture Highlights

- Singleton React application pattern
- Bidirectional communication with host apps
- Cloud state synchronization
- Adaptive UI that respects each product's design language

This demo reached production-ready POC stage with VP-level sponsorship before strategic reorganization led to alternative implementation approaches.