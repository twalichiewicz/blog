---
title: Overlay
display_name: "Universal Intelligence Layer"
display_description: "Cross-application AI that follows users everywhere they create"
date: 2024-06-01
company: Autodesk
byline: Designed a universal cloud overlay system architecture for 60+ Autodesk desktop applications—creating a shared platform layer concept that reached production-ready POC stage
tags: [portfolio]
layout: project_gallery
has_writeup: true
gallery_images:
 - url: overlayExplainer_web.mp4
   type: video
   poster: overlayPreview_poster.jpg
 - url: overlay0.png
   type: image
cover_image: overlayPreview_cover.jpg
trailer:
  type: video
  url: overlayExplainer_web.webm
  poster: overlayPreview_poster.jpg
  autoplay: true
  loop: true
  muted: true
stats:
  - value: "VP-Level"
    label: "Executive Sponsorship"
  - value: "$10M+"
    label: "Identified Savings"
project_stats:
  - label: "Team"
    value: 
      - "Principal Product Designer (me) - Led solo initiative, interviewed teams across the organization to identify commonalities"
    type: "list"
    span: 2
  - label: "Timeline"
    value: "6 months (Early 2024 - Late 2024)"
  - label: "Platform"
    value: "Cross-platform desktop overlay"
  - label: "Skills"
    value: ["Systems Design", "AI/ML Integration", "Cross-platform UX", "Technical Architecture"]
    type: "tags"
    span: 3
notebook_color: crimson
notebook_texture: pristine
notebook_brand: leuchtturm
notebook_pages: notebook-pages.jpg
notebook_stickers:
  - text: "AI/ML"
    color: "#fff"
    bg: "#1a237e"
    rotate: "-4deg"
  - text: "⭐"
    color: "#ffd600"
    bg: "#000"
    rotate: "1deg"
  - text: "POC"
    color: "#000"
    bg: "#00e676"
    rotate: "3deg"
---

## The Problem: Isolated Product Silos

Autodesk's array of desktop products operated as completely isolated silos. Users lost context switching between applications, couldn't access shared functionality across their workflows, and had to relearn basic tasks in every product. Meanwhile, engineering teams rebuilt identical features dozens of times—smart assistance in one product remained trapped there while users struggled with the same problems in adjacent tools.

## Solution: Cross-Application Intelligence Platform

I designed and prototyped a universal overlay system that would run as a cloud-connected singleton across all Autodesk desktop applications. Like Steam's overlay for gaming, this concept creates a persistent application layer that follows users everywhere—enabling shared functionality, contextual assistance, and seamless workflows while maintaining bidirectional communication with host applications.

The Overlay concept represented a fundamental shift in how Autodesk could approach desktop software architecture. Rather than maintaining isolated applications, I designed a shared platform layer that could enhance any desktop product with cloud-connected capabilities.

## Technical Design & Prototyping

Working closely with engineering teams across the organization, I designed a React-based overlay architecture that could theoretically integrate with native desktop applications. The conceptual system uses a singleton pattern to maintain state across applications while respecting each product's unique interface requirements.

The architecture featured several breakthrough innovations:

- **Universal React Architecture:** A conceptual single codebase that could deploy components across different desktop applications with native-feeling integration
- **Persistent Cloud State:** Designed system for user context, preferences, and work history to synchronize across entire product ecosystem in real-time
- **Bidirectional Communication:** Architected overlay to read application state, trigger host actions, and respond to application events seamlessly
- **Contextual Intelligence Engine:** Designed system to understand current user tasks and proactively surface relevant tools, shortcuts, and guidance
- **Adaptive Integration:** Designed overlay to respect each product's unique interface language while maintaining consistent core functionality

The proposed overlay would communicate bidirectionally with host applications through a standardized API, allowing it to both read application state and trigger native actions. This design approach creates experiences that would feel truly integrated rather than bolted-on.

## Envisioned User Experience Impact

The concept's most significant potential was eliminating context loss between applications. Users would access their project history, smart suggestions, and collaborative tools from any Autodesk desktop product, transforming fragmented workflows into cohesive experiences.

The designed contextual intelligence engine would analyze user behavior patterns to proactively surface relevant tools and guidance. Instead of forcing users to remember different workflows across products, the overlay would adapt to their current task and provide consistent assistance.

## Project Impact & Executive Vision

The Overlay initiative secured VP-level sponsorship and achieved critical milestones:

- **Executive Buy-in**: Presented directly to VP of Platform, securing funding and resources for POC development
- **Production-Ready POC**: Delivered fully functional prototype demonstrating cross-application intelligence
- **Architectural Innovation**: Designed framework serving 60+ desktop applications with single codebase
- **$10M+ Savings Potential**: Identified duplicate feature development across teams that platform would eliminate

The project successfully reached production-ready POC stage with demonstrated ROI and technical feasibility. Following a strategic reorganization, the company pivoted to an alternative implementation approach. The foundational architecture and design principles I established continue to influence Autodesk's platform strategy.
