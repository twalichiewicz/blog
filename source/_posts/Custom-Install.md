---
title: Custom Install
display_name: "Deploy at Scale"
display_description: "Enterprise software deployment transformed from hours to minutes"
has_writeup: true
company: Autodesk
byline: Replaced 60+ fragmented installer systems with a single platform that generates custom UIs from XML—saving Autodesk millions in duplicate development work
date: 2021-08-30 20:52:01
cover_image: ./customInstall-preview.png
tags:
  - portfolio
layout: project_gallery
notebook_color: "dark-lime-green"
demo_component: "custom-install-demo"
notebook_stickers:
  - text: "🌲"
    color: "#2e7d32"
    bg: "#fff"
    rotate: "-2deg"
    shape: "circle"
    style: "regular"
    bottom: "30px"
    right: "30px"
    top: "auto"
    left: "auto"
  - text: "DEMO"
    color: "#fff"
    bg: "#000000"
    rotate: "2deg"
    style: "die-cut"
    shape: "circle"
notebook_sticker_image: "/img/stickers/bonsai.svg"
notebook_sticker_image_width: "45px"
notebook_sticker_image_height: "45px"
notebook_sticker_image_bottom: "25px"
notebook_sticker_image_right: "25px"
notebook_sticker_image_rotate: "-3deg"
stats:
  - value: "$3-5M"
    label: "Annual Savings"
  - value: "90%"
    label: "Faster Deployments"
  - value: "85%"
    label: "Fewer Support Tickets"
project_stats:
  - label: "Problem"
    value: "60+ duplicate installer systems consuming millions in redundant development"
    type: "problem"
  - label: "Solution"
    value: "Single platform generating custom deployment UIs from XML configuration"
    type: "solution"
  - label: "Timeline"
    value: "18 months (2019-2020)"
  - label: "Platform"
    value: "Cloud-based React application"
  - label: "Team"
    value: 
      - "Lead Product Designer (me)"
      - "Product Manager & Product Owner"
      - "Engineering team (5-6 people)"
    type: "list"
  - label: "Leadership"
    value: ["Cross-Functional Influence (8 people)", "Process Innovation: Research Partnership Program", "Strategic Impact: Platform Transformation", "Stakeholder Education: Delta Deployment Group", "Change Management: Enterprise Adoption"]
    type: "tags"
  - label: "Skills"
    value: ["Enterprise UX", "Design Systems", "Accessibility", "Cross-platform Design", "Service Design", "React"]
    type: "tags"
---


## The Problem

In 2020, major architecture firms sent Autodesk an open letter that shook our leadership. Firms representing $22M+ in revenue cited our platform fragmentation as a critical failure, with some questioning Autodesk's value entirely. The root cause? Our installation nightmare.

Enterprise IT administrators were managing 100+ separate installers, each with unique interfaces and configuration requirements. A single version mismatch could corrupt entire projects, forcing exact-match installations across complex workflows. One CAD manager told me: "We're storing 12TB of installer files and spending more time managing installations than using the software."

The business impact was staggering: $3-5M annually in duplicate development costs, 40-60% longer enterprise sales cycles, and mounting support tickets that overwhelmed our teams.

## Research & Discovery

I approached this challenge systematically, knowing that understanding the full scope was critical to finding the right solution.

**Pattern Inventory**: I audited all 100+ installers, documenting every interface element and workflow. By creating Venn diagrams of functionality, I surfaced the repeat atoms—"licensing," "paths," "dependencies"—that appeared across products. This analysis revealed that despite surface differences, most installers were solving identical problems with slightly different implementations.

{% carousel [{"src":"./000_customInstall.jpg","alt":"Early research mapping installer patterns and workflows across Autodesk's product suite"},{"src":"./010_customInstall.jpg","alt":"Legacy installer interfaces showing fragmented approaches to the same core functionality"}] %}

**Data Triangulation**: I analyzed support logs, chat transcripts, and forum discussions, building PowerBI dashboards to identify where users were failing. The instrumentation data showed clear patterns: version mismatches, licensing errors, and extension conflicts accounted for 73% of installation failures. These became our leverage points.

**Regular Feedback Sessions**: I established the "Delta Deployment Group"—a cohort of CAD administrators managing enterprise deployments. Every quarter, we'd workshop their workflows, and crucially, I'd show how their previous feedback had been incorporated. This transparency built trust and developed a shared mental model that helped me think like an IT administrator, not just a designer.

## The Solution

The research insights led to a radical simplification: a unified web platform that generates custom installation interfaces from XML files. Product teams define their requirements in simple configuration files, and the system automatically generates consistent, powerful interfaces—no custom development required.

The platform introduced several breakthrough capabilities:

- **Multi-product intelligence** that understands dependencies and installation sequences
- **Cloud-based configuration library** eliminating local storage needs entirely
- **Shared configurations** that turn individual solutions into organizational knowledge
- **On-demand generation** creating installers for any configuration combination instantly

{% carousel [{"src":"./011_customInstall.jpg","alt":"Unified package library interface showing cloud-based configuration management"},{"src":"./012_customInstall.jpg","alt":"Product selection interface with intelligent dependency resolution"},{"src":"./020_customInstall.jpg","alt":"Advanced configuration options with collapsible sections for complex enterprise setups"},{"src":"./021_customInstall.jpg","alt":"Version and language configuration interface streamlining deployment workflows"},{"src":"./030_customInstall.png","alt":"Final platform architecture showing the complete transformation from fragmented to unified system"}] %}

The design focused on the three critical failure points our data identified: version management became automatic, licensing was centralized, and extensions were handled through dependency resolution.

## Results & Impact

The numbers exceeded all projections:

- **90% reduction** in deployment time (from hours to minutes)
- **85% fewer** installation-related support tickets
- **30,000 packages** created in the first 3 months
- **11,000 returning users** duplicating configurations
- **$3-5M annual savings** from unified development

The platform launched in January 2020, becoming critical COVID infrastructure when teams went distributed overnight. It achieved complete adoption across Autodesk's portfolio and directly addressed the Open Letter concerns about "lack of scalability and product performance."

Our Delta Deployment Group became our biggest champions, with one member telling leadership: "This is the first time Autodesk has actually listened to us and delivered what we need, not what they think we need."

## Reflection

Five years later, a Director of Product Management told me: "We're still using your original designs and discovering new ways to leverage them." This longevity validates my process-driven approach: deep research, continuous feedback, and data-informed decisions create solutions that stand the test of time.

This project transformed how I approach design challenges. The pattern inventory method became my go-to technique for finding simplification opportunities in complex systems. The Delta Deployment Group model showed me the power of building true partnerships with users, not just conducting occasional research.

Most importantly, I learned that solving fundamental infrastructure problems requires looking beyond the immediate scope. What started as an installer redesign became a platform transformation that saved millions and fundamentally changed how an entire industry deploys software. Beautiful design in utilitarian contexts doesn't just differentiate—it rebuilds trust and demonstrates customer-centric thinking in spaces where users least expect it.
