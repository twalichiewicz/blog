# UX Artifacts Usage Example

Here's how to add UX artifacts to your case studies:

## 1. Add Research Insights to Foreground Case Study

Open `/source/_posts/foreground.md` and add this after the problem description:

```ejs
<%- include('components/ux-artifacts/research-insights', { 
  insights: [
    {
      type: "Stakeholder Interview",
      title: "Engineering teams reinventing basic components",
      description: "Each team was building their own buttons, forms, and navigation components, leading to inconsistent experiences and wasted effort across the platform.",
      quote: "We spend more time building basic UI components than actual features. It's really frustrating.",
      source: "Senior Frontend Engineer, Core Platform Team",
      impact: "Identified 200+ hours/month of duplicate work across engineering teams"
    },
    {
      type: "Design Audit",
      title: "5 different button styles across products",
      description: "Visual inconsistency was creating cognitive load for users and engineering complexity for teams.",
      impact: "Highlighted urgent need for unified component standards"
    },
    {
      type: "User Feedback",
      title: "Inconsistent interactions cause confusion",
      description: "Support analysis revealed users getting confused when switching between different parts of the product ecosystem.",
      quote: "The save button looks and works differently in every section. I never know what to expect.",
      source: "Customer Support Ticket Analysis",
      impact: "Led to interaction pattern standardization initiative"
    }
  ]
}) %>
```

## 2. Add Impact Metrics to Publishing Pipeline

Add this to your Self-Service Publishing Pipeline case study:

```ejs
<%- include('components/ux-artifacts/impact-metrics', {
  metrics: {
    title: "Self-Service Publishing Impact",
    primary: [
      {
        value: "$6-8M",
        unit: "/year",
        label: "ARR Opportunity Captured",
        timeframe: "First year post-launch",
        description: "Revenue unlocked through 250x faster content publishing cycles",
        icon: "💰",
        category: "business"
      },
      {
        value: "250x",
        label: "Publishing Speed Improvement",
        timeframe: "3-week cycles → same-day",
        description: "From engineering-dependent 3-week cycles to same-day self-service publishing",
        icon: "⚡",
        category: "efficiency"
      }
    ],
    secondary: [
      {
        value: "90%",
        label: "Reduction in Support Tickets",
        trend: "positive",
        description: "Fewer user questions about publishing workflows and errors"
      },
      {
        value: "$2M",
        label: "Engineering Cost Savings",
        trend: "positive", 
        description: "Reduced support overhead and faster feature development"
      }
    ]
  }
}) %>
```

## 3. Add Before/After Comparison

```ejs
<%- include('components/ux-artifacts/before-after', {
  comparison: {
    title: "Publishing Workflow Transformation",
    before: {
      description: "Manual, engineering-dependent 3-week publishing cycle with multiple handoffs and frequent errors",
      pain_points: [
        "Engineering bottleneck for every content change",
        "No preview capability before publish",
        "45% error rate due to manual formatting",
        "3-week minimum turnaround time"
      ],
      metrics: [
        { value: "3 weeks", label: "Cycle Time" },
        { value: "45%", label: "Error Rate" },
        { value: "100%", label: "Eng Dependency" }
      ]
    },
    after: {
      description: "Self-service publishing platform with real-time preview and automated quality checks",
      improvements: [
        "Marketing team can publish independently",
        "Live preview before publishing",
        "Automated error checking and validation",
        "Same-day content publishing capability"
      ],
      metrics: [
        { value: "Same day", label: "Cycle Time" },
        { value: "5%", label: "Error Rate" },
        { value: "0%", label: "Eng Dependency" }
      ]
    }
  }
}) %>
```

## 4. Add Stakeholder Quotes

```ejs
<%- include('components/ux-artifacts/stakeholder-quotes', {
  quotes: [
    {
      text: "This design system has completely transformed how quickly we can build new features. What used to take us weeks now takes days.",
      name: "Sarah Chen",
      role: "Senior Frontend Engineer",
      company: "Human Interest",
      context: "Feedback after 6 months using the Foreground design system"
    },
    {
      text: "The publishing platform gave our marketing team superpowers. We can now respond to market changes in real-time instead of waiting weeks for engineering.",
      name: "Marcus Rodriguez", 
      role: "VP Marketing",
      company: "Autodesk",
      context: "Impact assessment 3 months post-launch"
    }
  ]
}) %>
```

## Quick Start Steps:

1. **Choose 2-3 components** to start with (Research Insights, Impact Metrics, Before/After)
2. **Add to existing case studies** by inserting the EJS include statements
3. **Customize the data** to match your specific project details
4. **Test locally** with `npm run server`
5. **Build and deploy** with `npm run build`

## All Available Components:

- `research-insights` - Key findings from research and discovery
- `process-timeline` - Design process phases and deliverables  
- `before-after` - Visual comparison of transformation
- `design-principles` - Guiding principles for the project
- `user-journey` - User journey maps with emotions and pain points
- `stakeholder-quotes` - Testimonials and feedback
- `wireframe-evolution` - Design iteration process
- `component-showcase` - Design system components
- `system-architecture` - Technical architecture diagrams
- `testing-results` - Usability testing and validation
- `impact-metrics` - Business impact with methodology
- `reflection-learnings` - Project retrospective and learnings

Each component is fully styled and responsive, ready to drop into your case studies!