// Example data for Self-Service Publishing Pipeline case study
// User Journey Component

const publishingPipelineJourney = {
  title: "Content Publishing Journey - Before Redesign",
  persona: "Marketing Manager at mid-size B2B SaaS company",
  phases: [
    {
      title: "Content Planning",
      icon: "📝",
      actions: [
        "Research blog topics",
        "Create content calendar",
        "Write draft content"
      ],
      thoughts: [
        "What topics will drive leads?",
        "When should this be published?",
        "Is this aligned with product launches?"
      ],
      pain_points: [
        "No visibility into product roadmap",
        "Manual coordination with multiple teams",
        "Unclear content approval process"
      ],
      opportunities: [
        "Automated topic suggestions",
        "Integrated content calendar",
        "Clear approval workflows"
      ],
      emotion: {
        level: "medium",
        icon: "😐",
        label: "Frustrated but motivated"
      }
    },
    {
      title: "Content Creation",
      icon: "✍️",
      actions: [
        "Write content in Google Docs",
        "Add images and formatting",
        "Get stakeholder feedback"
      ],
      thoughts: [
        "How will this look on the website?",
        "Did I get all the technical details right?",
        "Who needs to review this?"
      ],
      pain_points: [
        "No preview of final layout",
        "Multiple review cycles in different tools",
        "Technical accuracy concerns"
      ],
      opportunities: [
        "Live preview capability",
        "Integrated review and approval",
        "Technical fact-checking tools"
      ],
      emotion: {
        level: "low",
        icon: "😟",
        label: "Anxious about accuracy"
      }
    },
    {
      title: "Development Handoff",
      icon: "🔄",
      actions: [
        "Email content to engineering",
        "Explain formatting requirements",
        "Wait for implementation"
      ],
      thoughts: [
        "Did they understand the formatting?",
        "When will this actually be published?",
        "What if there are errors?"
      ],
      pain_points: [
        "3-week engineering bottleneck",
        "Lost formatting in handoff",
        "No control over timeline"
      ],
      opportunities: [
        "Self-service publishing",
        "Template-based formatting",
        "Predictable timelines"
      ],
      emotion: {
        level: "low",
        icon: "😤",
        label: "Frustrated by dependency"
      }
    },
    {
      title: "Publishing & Review",
      icon: "🚀",
      actions: [
        "Wait for engineering deployment",
        "Check published content",
        "Fix any formatting issues"
      ],
      thoughts: [
        "Does this look right?",
        "Are all the links working?",
        "Is the SEO optimized?"
      ],
      pain_points: [
        "Frequent formatting errors",
        "Broken links and images",
        "SEO issues discovered post-publish"
      ],
      opportunities: [
        "Automated quality checks",
        "Pre-publish validation",
        "SEO optimization tools"
      ],
      emotion: {
        level: "medium",
        icon: "😅",
        label: "Relief mixed with concern"
      }
    }
  ]
};

export default publishingPipelineJourney;