---
title: Common Project Administration
date: 2019-09-15
company: Autodesk
byline: Created a standaardized project management tool for web-based Autodesk products
cover_image: /2019/09/15/Common-Project-Administration/cpa-preview.png
tags:
  - portfolio
layout: project_gallery
has_writeup: true
gallery_images:
  - url: /2019/09/15/Common-Project-Administration/000_cpa.png
    type: image
  - url: /2019/09/15/Common-Project-Administration/001_cpa.png
    type: image
  - url: /2019/09/15/Common-Project-Administration/010_cpa.png
    type: image
  - url: /2019/09/15/Common-Project-Administration/011_cpa.png
    type: image
summary:
  problem:
    content: "With Autodesk's pivot to cloud-based products, administrators faced a fragmented experience managing multiple web instances or 'hubs' across different products. Each product required manual setup and management in separate locations, forcing administrators to navigate disparate systems that didn't align with their mental model of unified project management."
  solution:
    content: "I designed a centralized administration portal within the Autodesk Account tool that consolidates all web instance management into a single, unified interface. The system standardizes project administration across all Autodesk cloud products while respecting how administrators naturally think about project management."
  innovation:
    title: "Unified Hub Administration System"
    bullets:
      - "<strong>Centralized Management Portal:</strong> Single interface for managing instances, roles, permissions, and memberships across all cloud products"
      - "<strong>Standardized Workflows:</strong> Consistent administrative patterns that work across diverse product ecosystems"
      - "<strong>Mental Model Alignment:</strong> Interface design that mirrors real-world administrative thinking and processes"
      - "<strong>Cross-Product Integration:</strong> Unified permissions and role management that works seamlessly across different Autodesk tools"
      - "<strong>Streamlined Setup:</strong> Automated configuration processes that eliminate manual, product-by-product administration"
  impact:
    bullets:
      - "Eliminated fragmented administration experience across multiple product hubs"
      - "Reduced administrative overhead and minimized configuration errors"
      - "Created consistent user experience for enterprise customers managing complex environments"
      - "Established new standard for cloud-based administration within Autodesk"
      - "Improved adoption rates among enterprise customers through intuitive, unified workflows"
credits:
  - role: Role
    name: Lead Product Designer, Platform Services - Analytics & Data
  - role: Timeline
    name: 1.5 years
  - role: Cross-functional partners
    name: 15 product teams, Platform Engineering
  - role: Users impacted
    name: 2,000+ enterprise administrators across 500+ organizations
  - role: Technical scope
    name: Unified permissions across 15 cloud products
  - role: Current status
    name: Foundation for all Autodesk cloud administration
---

## Understanding Administrative Mental Models

The transition to cloud-based products created an unexpected challenge: administrators who excelled at managing complex enterprise environments suddenly found themselves struggling with fragmented interfaces that didn't match their established workflows.

Through interviews and shadowing sessions, I discovered that administrators naturally think about project management as a unified, hierarchical system. They expect to see all their projects, permissions, and team members in one place, with clear relationships between different components.

## Research & Discovery Process

I conducted workflow analysis sessions with administrators managing multiple Autodesk cloud products. The research revealed that the fragmentation wasn't just inconvenient—it was creating real business problems as administrators struggled to maintain consistent access control and project organization across platforms.

The key insight was that administrators weren't asking for more features; they were asking for coherent structure. They needed a system that matched their mental models of how project administration should work.

## Design & Architecture

The centralized portal design focused on creating logical groupings that matched administrative thinking patterns. Instead of forcing administrators to understand the technical differences between products, the interface presented a unified view organized around projects, teams, and access levels.

I designed the permissions system to work consistently across all products while still respecting the unique requirements of different tools. This required close collaboration with engineering teams to create an abstraction layer that maintained flexibility while providing administrative simplicity.

## Implementation & Results

The Common Project Administration system transformed how enterprise customers managed their Autodesk cloud environments. Instead of juggling multiple interfaces and inconsistent permission systems, administrators could manage everything from a single, coherent dashboard.

The positive reception from enterprise customers validated the approach of designing around mental models rather than technical architecture. The system became the foundation for future cloud administration features across Autodesk's product portfolio.
