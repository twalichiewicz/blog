# UX Artifacts Component Library

A comprehensive set of reusable components for documenting UX process, research, and design work in portfolio case studies.

## Quick Start

1. **Include the styles** in your main SCSS file:
```scss
@import 'ux-artifacts';
```

2. **Use components** in your EJS templates:
```ejs
<%- include('components/ux-artifacts/research-insights', { insights: [...] }) %>
```

## Available Components

### 1. Research & Discovery

#### Research Insights
Displays key findings from user research, stakeholder interviews, and discovery work.

```ejs
<%- include('components/ux-artifacts/research-insights', { 
  insights: [
    {
      type: "User Interview",
      title: "Complex workflows cause frustration",
      description: "Users struggle with multi-step processes that lack clear progress indicators.",
      quote: "I never know how many more steps there are or if I'm doing it right.",
      source: "User #3, Product Manager",
      impact: "Led to simplified 3-step flow design"
    }
  ]
}) %>
```

**Data Structure:**
- `type`: Category of insight (User Interview, Analytics, etc.)
- `title`: Key finding headline
- `description`: Detailed explanation
- `quote` (optional): Direct user quote
- `source` (optional): Quote attribution
- `impact` (optional): How this insight influenced design

#### User Journey Map
Documents current or future state user journeys with emotions, pain points, and opportunities.

```ejs
<%- include('components/ux-artifacts/user-journey', {
  journey: {
    title: "Content Publishing Journey",
    persona: "Marketing Manager at mid-size SaaS company",
    phases: [
      {
        title: "Content Planning",
        icon: "📝",
        actions: ["Research topics", "Create content calendar"],
        thoughts: ["What should I write about?", "When should this be published?"],
        pain_points: ["No visibility into what engineering is working on"],
        opportunities: ["Automated topic suggestions based on product roadmap"],
        emotion: {
          level: "medium",
          icon: "😐",
          label: "Neutral"
        }
      }
    ]
  }
}) %>
```

### 2. Process & Ideation

#### Process Timeline
Shows design process phases with deliverables and timeframes.

```ejs
<%- include('components/ux-artifacts/process-timeline', {
  phases: [
    {
      title: "Discovery & Research",
      duration: "2 weeks",
      description: "Stakeholder interviews, user research, competitive analysis",
      deliverables: ["User personas", "Journey maps", "Requirements doc"]
    },
    {
      title: "Ideation & Concept",
      duration: "1 week", 
      description: "Design studio sessions, rapid prototyping, concept validation",
      deliverables: ["Wireframes", "User flows", "Concept prototypes"]
    }
  ]
}) %>
```

#### Design Principles
Documents the key principles that guided design decisions.

```ejs
<%- include('components/ux-artifacts/design-principles', {
  principles: [
    {
      title: "Progressive Disclosure",
      description: "Present information in layers, showing only what's needed at each step.",
      example: "Start with summary view, allow drill-down to details",
      impact: "Reduced cognitive load and improved task completion rates"
    }
  ]
}) %>
```

#### Wireframe Evolution
Shows design iteration with rationale for changes.

```ejs
<%- include('components/ux-artifacts/wireframe-evolution', {
  evolution: {
    title: "Dashboard Layout Evolution",
    iterations: [
      {
        title: "Initial Concept",
        date: "Week 1",
        image: "./wireframe-v1.png",
        description: "Three-column layout with navigation sidebar",
        changes: ["Added main navigation", "Created widget grid system"],
        rationale: "Followed standard dashboard patterns",
        feedback: ["Too much information at once", "Navigation unclear"]
      },
      {
        title: "Simplified Layout", 
        date: "Week 2",
        image: "./wireframe-v2.png",
        description: "Two-column layout with clearer hierarchy",
        changes: ["Removed sidebar", "Simplified navigation", "Larger primary content area"],
        rationale: "Focus user attention on primary tasks",
        feedback: ["Much clearer", "Easier to scan information"]
      }
    ],
    final_outcome: "Final design increased task completion by 40% in usability testing"
  }
}) %>
```

### 3. Design System & Visual

#### Component Showcase
Displays design system components with usage guidelines.

```ejs
<%- include('components/ux-artifacts/component-showcase', {
  components: [
    {
      name: "Button Component",
      description: "Primary and secondary actions with consistent styling",
      image: "./button-component.png",
      variants: ["Primary", "Secondary", "Ghost", "Destructive"],
      usage_stats: {
        "Times Used": "50+",
        "Teams": "4",
        "Products": "8"
      },
      guidelines: [
        "Use primary for main actions only",
        "Maximum 2 primary buttons per screen",
        "Ghost buttons for tertiary actions"
      ]
    }
  ]
}) %>
```

#### System Architecture
Documents technical architecture and integration points.

```ejs
<%- include('components/ux-artifacts/system-architecture', {
  architecture: {
    title: "Design System Architecture",
    diagram: "./architecture-diagram.png",
    layers: [
      {
        name: "Design Tokens",
        description: "Core visual properties: colors, typography, spacing",
        components: ["Color palette", "Type scale", "Spacing units"]
      },
      {
        name: "Component Library", 
        description: "Reusable UI components built on design tokens",
        components: ["Buttons", "Forms", "Navigation", "Data display"]
      }
    ],
    integrations: [
      {
        name: "Figma Integration",
        icon: "🎨",
        description: "Automated sync between Figma and code components",
        challenge: "Maintaining consistency across design and development"
      }
    ],
    constraints: [
      {
        type: "Technical",
        description: "Must work across React, Vue, and Angular frameworks",
        solution: "Web Components architecture for framework-agnostic approach"
      }
    ]
  }
}) %>
```

### 4. Testing & Validation

#### Testing Results
Documents usability testing, A/B tests, and validation methods.

```ejs
<%- include('components/ux-artifacts/testing-results', {
  testing: {
    title: "Usability Testing Results",
    methods: [
      {
        name: "Moderated Usability Testing",
        icon: "👥",
        description: "1-on-1 sessions testing core user flows",
        participants: "8 users",
        duration: "60 minutes each"
      },
      {
        name: "A/B Testing",
        icon: "🧪", 
        description: "Split test of old vs new navigation design",
        participants: "2,000 users",
        duration: "2 weeks"
      }
    ],
    key_findings: [
      {
        title: "Navigation confusion",
        priority: "high",
        description: "60% of users couldn't find the settings page",
        evidence: "Task completion rate: 40%",
        action_taken: "Redesigned navigation with clearer labels"
      }
    ],
    metrics: [
      {
        label: "Task Success Rate",
        value: "85%",
        baseline: "60%",
        change: {
          direction: "up", 
          amount: "+25%"
        }
      }
    ],
    iterations: [
      {
        title: "Navigation Redesign",
        description: "Simplified main navigation based on user feedback",
        changes: ["Reduced menu items from 8 to 5", "Added icons to text labels"],
        result: "Task success rate improved from 60% to 85%"
      }
    ]
  }
}) %>
```

### 5. Impact & Results

#### Impact Metrics
Showcases business and user impact with detailed methodology.

```ejs
<%- include('components/ux-artifacts/impact-metrics', {
  metrics: {
    title: "Project Impact & Results",
    primary: [
      {
        value: "$2.5M",
        unit: "/year",
        label: "Engineering Cost Savings",
        timeframe: "First year post-launch",
        description: "Reduced support tickets and faster feature development",
        icon: "💰",
        category: "business"
      },
      {
        value: "250x",
        label: "Faster Publishing",
        timeframe: "3-week cycles → same-day",
        description: "Content publishing cycle time improvement",
        icon: "⚡",
        category: "efficiency"
      }
    ],
    secondary: [
      {
        value: "90%",
        label: "Reduction in Support Tickets",
        trend: "positive",
        description: "Fewer user questions about publishing process"
      }
    ],
    timeline: [
      {
        date: "Q1 2020",
        title: "Design System Launch",
        description: "Initial component library released to 3 teams",
        metrics: [
          { value: "24", label: "Components" },
          { value: "3", label: "Teams" }
        ]
      }
    ],
    methodology: {
      description: "Impact measured through analytics, user feedback, and business metrics",
      data_sources: [
        "Google Analytics dashboard metrics",
        "Customer support ticket volume",
        "Development velocity tracking",
        "User satisfaction surveys (quarterly)"
      ],
      limitations: [
        "Self-reported data from user surveys",
        "Cannot isolate design impact from other product changes",
        "Limited baseline data for some metrics"
      ]
    }
  }
}) %>
```

### 6. Reflection & Learning

#### Before/After Comparison
Visual comparison showing transformation achieved.

```ejs
<%- include('components/ux-artifacts/before-after', {
  comparison: {
    title: "Publishing Workflow Transformation",
    before: {
      image: "./before-workflow.png",
      description: "Manual, 3-week publishing cycle with multiple handoffs",
      pain_points: [
        "Engineering bottleneck for every content change",
        "No preview capability",
        "Frequent publishing errors"
      ],
      metrics: [
        { value: "3 weeks", label: "Cycle Time" },
        { value: "45%", label: "Error Rate" }
      ]
    },
    after: {
      image: "./after-workflow.png", 
      description: "Self-service publishing with real-time preview",
      improvements: [
        "Marketing team can publish independently",
        "Live preview before publishing",
        "Automated error checking"
      ],
      metrics: [
        { value: "Same day", label: "Cycle Time" },
        { value: "5%", label: "Error Rate" }
      ]
    }
  }
}) %>
```

#### Stakeholder Quotes
Testimonials from team members and stakeholders.

```ejs
<%- include('components/ux-artifacts/stakeholder-quotes', {
  quotes: [
    {
      text: "This design system has transformed how quickly we can build new features. What used to take weeks now takes days.",
      name: "Sarah Chen",
      role: "Senior Frontend Engineer",
      company: "Human Interest",
      avatar: "./sarah-avatar.jpg",
      context: "Feedback after 6 months using the design system"
    }
  ]
}) %>
```

#### Reflection & Learnings
Documents what worked, challenges, and future opportunities.

```ejs
<%- include('components/ux-artifacts/reflection-learnings', {
  reflection: {
    what_worked: [
      {
        title: "Early stakeholder involvement",
        description: "Including engineering and product teams in design reviews prevented major issues later",
        impact: "95% of designs were implemented without changes",
        takeaway: "Cross-functional collaboration is critical for design success"
      }
    ],
    challenges: [
      {
        title: "Legacy system constraints",
        description: "Had to work within existing technical architecture limitations",
        solution: "Created hybrid approach that gradually replaced legacy components",
        outcome: "Successfully migrated 80% of legacy UI within 6 months",
        learning: "Sometimes incremental change is more effective than complete redesign"
      }
    ],
    would_do_differently: [
      {
        title: "More user testing early in process",
        description: "Would conduct usability testing on wireframes, not just final designs",
        reason: "Discovered major usability issues late in design process",
        expected_impact: "Could have saved 2-3 weeks of design iterations"
      }
    ],
    key_learnings: [
      {
        title: "Design systems require ongoing evangelism",
        description: "Building the system is only half the work - adoption requires constant communication",
        application: "Will create adoption roadmaps and regular training sessions for future projects"
      }
    ],
    next_steps: [
      {
        title: "Advanced component patterns",
        priority: "high",
        description: "Develop more complex components like data tables and charts",
        timeline: "Next 2 quarters",
        potential_impact: "Could enable faster development of dashboard features"
      }
    ]
  }
}) %>
```

## Styling Customization

The components use CSS custom properties that can be customized:

```scss
:root {
  --primary-color: #ff6b35;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --error-color: #dc3545;
  --text-primary: #333;
  --text-secondary: #666;
  --card-bg: #fff;
  --secondary-bg: #f8f9fa;
  --border-color: #dee2e6;
}
```

## Best Practices

### 1. Content Guidelines
- **Be specific**: Use concrete examples rather than vague descriptions
- **Show impact**: Include metrics and outcomes where possible
- **Tell a story**: Connect artifacts to create a coherent narrative
- **Use visuals**: Include images, diagrams, and screenshots

### 2. Data Structure
- **Keep it simple**: Use flat objects rather than deeply nested data
- **Be consistent**: Use the same property names across similar components
- **Plan for missing data**: Make optional fields truly optional
- **Validate content**: Ensure all required fields are populated

### 3. Performance
- **Optimize images**: Compress screenshots and diagrams
- **Progressive enhancement**: Ensure content works without JavaScript
- **Mobile-first**: Test all components on small screens
- **Lazy loading**: Consider loading images only when visible

### 4. Accessibility
- **Alt text**: Provide descriptive alt text for all images
- **Color contrast**: Ensure sufficient contrast for all text
- **Keyboard navigation**: Test with keyboard-only navigation
- **Screen readers**: Use semantic HTML and proper headings

## Component Combinations

Recommended component combinations for different case study sections:

### Research & Discovery Section
```ejs
<%- include('components/ux-artifacts/research-insights', { insights: [...] }) %>
<%- include('components/ux-artifacts/user-journey', { journey: {...} }) %>
<%- include('components/ux-artifacts/design-principles', { principles: [...] }) %>
```

### Design Process Section
```ejs
<%- include('components/ux-artifacts/process-timeline', { phases: [...] }) %>
<%- include('components/ux-artifacts/wireframe-evolution', { evolution: {...} }) %>
<%- include('components/ux-artifacts/before-after', { comparison: {...} }) %>
```

### Results & Impact Section
```ejs
<%- include('components/ux-artifacts/testing-results', { testing: {...} }) %>
<%- include('components/ux-artifacts/impact-metrics', { metrics: {...} }) %>
<%- include('components/ux-artifacts/stakeholder-quotes', { quotes: [...] }) %>
```

### Reflection Section
```ejs
<%- include('components/ux-artifacts/reflection-learnings', { reflection: {...} }) %>
```

## File Structure

```
themes/san-diego/source/components/ux-artifacts/
├── README.md                    # This file
├── research-insights.ejs        # Research findings component
├── process-timeline.ejs         # Design process timeline
├── before-after.ejs            # Before/after comparison
├── design-principles.ejs       # Design principles documentation
├── user-journey.ejs            # User journey mapping
├── stakeholder-quotes.ejs      # Testimonials and feedback
├── wireframe-evolution.ejs     # Design iteration showcase
├── component-showcase.ejs      # Design system components
├── system-architecture.ejs     # Technical architecture
├── testing-results.ejs         # Usability testing results
├── impact-metrics.ejs          # Business impact metrics
└── reflection-learnings.ejs    # Project reflection
```

```
themes/san-diego/source/styles/
└── _ux-artifacts.scss          # Complete styling for all components
```

Remember to import the styles in your main SCSS file:
```scss
@import 'ux-artifacts';
```