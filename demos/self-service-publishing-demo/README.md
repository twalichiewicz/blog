# Self-Service Publishing Pipeline Demo

Interactive demo showcasing Autodesk's LINO (Content Authoring Tool) that transformed content publishing from 3-4 week engineering cycles to same-day self-service.

## Overview

This demo demonstrates the revolutionary interface that:
- Reduced publishing time by 95% (3-4 weeks → 2 hours)
- Enabled non-technical teams to publish content
- Unlocked $6-8M in revenue opportunities
- Saved $2M annually in engineering costs

## Key Features

### 1. Three-Column Workflow
- **When the user of...** - Behavioral targeting
- **Then send them...** - Content creation
- **And use these delivery instructions...** - Distribution rules

### 2. Visual Behavioral Targeting
- Product selection dropdown
- Wiki URL validation for documentation
- Natural language notes for complex logic

### 3. WYSIWYG Content Editor
- Live preview of in-product appearance
- Drag-and-drop media upload
- Button and CTA configuration

### 4. Smart Distribution Controls
- Version targeting (specific or ranges)
- Multi-platform distribution
- User segment targeting
- Immediate or scheduled circulation

## Interactive Elements

### Guided Walkthrough
The demo starts with an interactive walkthrough that highlights key features.

### Form Interactions
- Real-time URL validation
- Expandable advanced options
- Progressive disclosure pattern

### Success Animation
Submit a request to see the publishing success animation with key metrics.

## Technical Stack

- React 18
- Framer Motion for animations
- Lucide React for icons
- Custom CSS with responsive design
- Shared demo wrapper component

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture

```
src/
├── App.jsx              # Main app with demo wrapper
├── App.css              # Global styles
└── components/
    ├── ContentAuthoringTool.jsx  # Main interface
    ├── DemoWalkthrough.jsx       # Guided tour
    └── SuccessAnimation.jsx      # Success feedback
```

## Design Principles

1. **Clarity Over Complexity**: Simple three-column layout guides users
2. **Progressive Disclosure**: Advanced options hidden until needed
3. **Visual Feedback**: Real-time validation and clear success states
4. **Professional Polish**: Enterprise-grade UI that feels consumer-friendly

## Business Impact

This interface enabled:
- 250x faster publishing cycles
- Democratized content creation
- Rapid response to user feedback
- Focus shift from manual tasks to strategic improvements