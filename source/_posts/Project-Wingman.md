---
title: Desktop install platform
company: Autodesk
byline: Standardized Autodesk's full suite of products to use a single install SDK
date: 2019-6-30 20:52:01
tags: [portfolio]
layout: project_gallery
has_writeup: true
gallery_images:
  - url: /2019/06/30/Project-Wingman/wingmanInstaller.mp4
    type: video
    poster: /2019/06/30/Project-Wingman/wingmanInstaller_poster.jpg
cover_image: /2019/06/30/Project-Wingman/wingmanInstaller_poster.jpg
cover_video_poster: /2019/06/30/Project-Wingman/wingmanInstaller_poster.jpg
stats:
  - value: "100+"
    label: "Unified Installers"
  - value: "Millions"
    label: "Users Impacted"
credits:
  - role: Role
    name: Lead Product Designer, Access Experience
  - role: Timeline
    name: 8 months
  - role: Collaborators
    name: Platform Engineering, 6 major product teams (AutoCAD, Maya, 3ds Max, Inventor, Revit, Fusion)
  - role: Technical scope
    name: Progressive loading architecture, unified SDK across 60+ products
  - role: Users impacted
    name: Millions of Autodesk users globally
  - role: Executive mandate
    name: Company-wide initiative to standardize installation framework
---

## The Installation Nightmare

Autodesk users faced a deployment gauntlet that would break even the most patient professionals. Installing a complete workflow meant downloading and running dozens of separate installers—each with different interfaces, installation sequences, and customization options. CAD and BIM managers had to carefully orchestrate installation order because some products required specific plugins or shared components to be installed first, creating complex dependency chains that frequently broke.

Each product team had built their own installer over years of independent development, resulting in wildly inconsistent experiences. Users couldn't install multiple products together, and each installer blocked productivity until completion. For professionals who needed Maya, AutoCAD, and Inventor for a single project, this meant hours of sequential installations and potential compatibility issues.

## Research with Real Administrators

Through quarterly sessions with a cohort of CAD administrators who volunteered for our research program, I developed a deep understanding of their daily frustrations. These professionals managed software deployments for entire organizations and had intimate knowledge of what broke, what worked, and what they desperately needed.

I shared mental model presentations and early design concepts with this group, documenting their needs and showing how requirements aligned across different organizations. This helped establish the holistic perspective needed to design for the entire ecosystem rather than individual products.

The research revealed a clear divide: most end users just wanted software to install cleanly and quickly, while administrators needed sophisticated control over configurations and deployments. This insight became fundamental to the design strategy.

## Designing the Framework

The breakthrough came from studying the macOS installer model and applying it to enterprise software. As shown in the interface demonstration, the final design presents users with a clean, minimal experience—the Maya installer shows just the essential legal agreement and a simple checkbox interface, with a streamlined "Next" button progression.

This simplicity was achieved by establishing clear boundaries: novice users would use the standalone installer with essential options only, while CAD and BIM administrators would be directed to the Custom Install web tool for complex configurations. This division allowed us to optimize each experience for its intended audience.

Working with engineering teams across six major products (AutoCAD, Maya, 3ds Max, Inventor, Revit, Fusion), I designed a framework that gave product teams controlled flexibility. They could choose their five essential options while conforming to the unified visual standard that aligned with Autodesk's broader strategy of moving from distinct brand identities to one cohesive experience.

## Managing Organizational Complexity

The most challenging aspect wasn't technical—it was navigating competing requirements from multiple organizations with conflicting goals. I used "disagree and commit" decision-making, documenting how I processed each team's feedback so they understood their input wasn't ignored, even when not implemented.

My presentations included slides showing "last time you told me this was a problem, here's how I've addressed it over the past several months." This transparency built trust and demonstrated that the design decisions were informed by their expertise rather than arbitrary design preferences.

The key was designing a framework that allowed teams to maintain some control while achieving our standardization goals. Product teams could still serve their unique user needs within the consistent structure.

## From Chaos to Clarity

The transformation is visible in the streamlined interface—gone are the overwhelming option grids and product-specific branding, replaced by a clean experience that focuses on getting users to productivity quickly. Progressive loading technology allows applications to launch as soon as core components install, while extended features continue loading in the background.
The system eliminated complex dependency management that had plagued enterprise deployments. Multi-product installations became possible for the first time, with automatic sequencing ensuring compatibility across entire workflows.

Engineering teams were freed from maintaining separate installer codebases, allowing them to focus on core product development. The unified framework became critical infrastructure when COVID-19 forced organizations to deploy software to distributed home offices.

This project demonstrated that sophisticated enterprise software doesn't require complex interfaces. By understanding user workflows, conducting thorough research with real administrators, and designing frameworks that balance control with consistency, we created an installation experience that felt consumer-grade while maintaining enterprise-level capability.
