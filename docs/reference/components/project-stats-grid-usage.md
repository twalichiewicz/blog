# Project Stats Grid Usage Guide

## Overview
The project stats grid is a reusable component for displaying project metadata in a high-density, bordered grid layout.

## Basic Usage

In your project markdown frontmatter:

```yaml
---
title: Project Name
project_stats:
  - label: Role
    value: Lead Product Designer
  - label: Timeline
    value: Jan - June 2023
  - label: Team
    value: 
      - 1 Designer (me)
      - 3 Engineers
      - 1 Product Manager
    type: list
  - label: Platform
    value: iOS, Android, Web
  - label: Impact
    value: 90% faster onboarding
    type: highlight
  - label: Skills
    value:
      - Design Systems
      - Prototyping
      - User Research
      - A/B Testing
    type: tags
---
```

In your project template:

```ejs
<!-- After the impact stats tabs and before the gallery -->
<% if (page.project_stats) { %>
  <%- partial('_partial/project-stats-grid', {
    stats: page.project_stats
  }) %>
<% } %>
```

## Stat Types

### Basic (default)
Simple text value display:
```yaml
- label: Role
  value: Lead Designer
```

### List
For multi-line values:
```yaml
- label: Team
  value:
    - 1 Designer
    - 3 Engineers
    - 1 PM
  type: list
```

### Highlight
For emphasizing key metrics:
```yaml
- label: Impact
  value: 90% reduction
  type: highlight
```

### Tags
For skills or categories:
```yaml
- label: Skills
  value:
    - Design Systems
    - Prototyping
    - Research
  type: tags
```

## Grid Variants

### Auto Layout (default)
Grid automatically adjusts based on number of items:
- 2 items → 2 columns
- 3 or 6 items → 3 columns
- 4, 5, 7+ items → auto-fit

### Two Column
Force two-column layout:
```ejs
<%- partial('_partial/project-stats-grid', {
  stats: page.project_stats,
  variant: 'two-col'
}) %>
```

### Three Column
Force three-column layout:
```ejs
<%- partial('_partial/project-stats-grid', {
  stats: page.project_stats,
  variant: 'three-col'
}) %>
```

### Compact
Smaller padding and font sizes:
```ejs
<%- partial('_partial/project-stats-grid', {
  stats: page.project_stats,
  variant: 'compact'
}) %>
```

## Example Configurations

### For a Design System Project
```yaml
project_stats:
  - label: Role
    value: Design Systems Lead
  - label: Timeline
    value: 6 months
  - label: Users
    value: 50+ designers & engineers
  - label: Components
    value: 120+ components
    type: highlight
  - label: Adoption
    value: 100% of products
  - label: Tools
    value:
      - Figma
      - Storybook
      - TypeScript
    type: tags
```

### For a Research Project
```yaml
project_stats:
  - label: Role
    value: UX Researcher
  - label: Duration
    value: 3 weeks
  - label: Methods
    value:
      - User Interviews (12)
      - Usability Testing (8)
      - Survey (n=500)
    type: list
  - label: Key Insight
    value: 73% task failure rate
    type: highlight
```

### For a Growth Experiment
```yaml
project_stats:
  - label: Hypothesis
    value: Simplifying onboarding will increase conversion
  - label: Duration
    value: 2-week sprint
  - label: Sample Size
    value: 50,000 users
  - label: Result
    value: +23% conversion
    type: highlight
```

## Styling Customization

Add custom class for specific styling:
```ejs
<%- partial('_partial/project-stats-grid', {
  stats: page.project_stats,
  className: 'my-custom-stats'
}) %>
```

## Responsive Behavior
- Desktop: Multi-column grid based on variant
- Tablet: Reduces columns (3→2)
- Mobile: Single column stack

## Dark Mode
Component automatically adapts to dark mode with appropriate colors and borders.