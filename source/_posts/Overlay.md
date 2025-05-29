---
title: Overlay
date: 2020-02-15
company: Autodesk
byline: Designed a universal cloud overlay system architecture for 60+ Autodesk desktop applications—creating a shared platform layer concept that reached production-ready POC stage
tags: [portfolio]
layout: project_gallery
has_writeup: true
gallery_images:
 - url: /2020/02/15/Overlay/overlayExplainer_web.mp4
   type: video
   poster: /2020/02/15/Overlay/overlayPreview_poster.jpg
 - url: /2020/02/15/Overlay/overlay0.png
   type: image
cover_image: /2020/02/15/Overlay/overlayPreview_cover.jpg
summary:
 problem:
   content: "Autodesk's array of desktop products operated as completely isolated silos. Users lost context switching between applications, couldn't access shared functionality across their workflows, and had to relearn basic tasks in every product. Meanwhile, engineering teams rebuilt identical features dozens of times—smart assistance in one product remained trapped there while users struggled with the same problems in adjacent tools."
 solution:
   content: "I designed and prototyped a universal overlay system that would run as a cloud-connected singleton across all Autodesk desktop applications. Like Steam's overlay for gaming, this concept creates a persistent application layer that follows users everywhere—enabling shared functionality, contextual assistance, and seamless workflows while maintaining bidirectional communication with host applications."
 innovation:
   title: "Cross-Application Intelligence Platform"
   bullets:
     - "<strong>Universal React Architecture:</strong> Conceptual single codebase that could deploy components across different desktop applications with native-feeling integration"
     - "<strong>Persistent Cloud State:</strong> Designed system for user context, preferences, and work history to synchronize across entire product ecosystem in real-time"
     - "<strong>Bidirectional Communication:</strong> Architected overlay to read application state, trigger host actions, and respond to application events seamlessly"
     - "<strong>Contextual Intelligence Engine:</strong> Designed system to understand current user tasks and proactively surface relevant tools, shortcuts, and guidance"
     - "<strong>Adaptive Integration:</strong> Designed overlay to respect each product's unique interface language while maintaining consistent core functionality"
 impact:
   bullets:
     - "Designed architecture to enable shared functionality across 60+ Autodesk desktop applications"
     - "Created framework to eliminate duplicate feature development across product teams"
     - "Prototyped seamless user workflows spanning multiple applications"
     - "Established architectural foundation for cloud-connected desktop experiences"
     - "Reached production-ready POC stage before organizational changes shifted priorities"
---

## Architectural Vision & Design Process

The Overlay concept represented a fundamental shift in how Autodesk could approach desktop software architecture. Rather than maintaining isolated applications, I designed a shared platform layer that could enhance any desktop product with cloud-connected capabilities.

## Technical Design & Prototyping

Working closely with engineering teams across the organization, I designed a React-based overlay architecture that could theoretically integrate with native desktop applications. The conceptual system uses a singleton pattern to maintain state across applications while respecting each product's unique interface requirements.

The proposed overlay would communicate bidirectionally with host applications through a standardized API, allowing it to both read application state and trigger native actions. This design approach creates experiences that would feel truly integrated rather than bolted-on.

## Envisioned User Experience Impact

The concept's most significant potential was eliminating context loss between applications. Users would access their project history, smart suggestions, and collaborative tools from any Autodesk desktop product, transforming fragmented workflows into cohesive experiences.

The designed contextual intelligence engine would analyze user behavior patterns to proactively surface relevant tools and guidance. Instead of forcing users to remember different workflows across products, the overlay would adapt to their current task and provide consistent assistance.

The prototype reached production-ready POC stage, demonstrating the technical feasibility and user experience potential before organizational restructuring shifted company priorities to other initiatives.
