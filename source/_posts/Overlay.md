---
title: Overlay
date: 2020-02-15
company: Autodesk
byline: Built a universal cloud overlay system that runs across 60+ Autodesk desktop applications—creating a shared platform layer that millions of users interact with daily
tags: [portfolio]
layout: project_gallery
has_writeup: true
gallery_images:
  - url: /2020/02/15/Overlay/overlayExplainer_web.mp4
    type: video
    poster: /2020/02/15/Overlay/overlayPreview_poster.jpg
  - url: /2020/02/15/Overlay/overlay0.png
    type: image
cover_image: /2020/02/15/Overlay/overlayPreview_cover.png
--- 

## The Problem

Autodesk's 60+ desktop products operated as completely isolated applications. Users couldn't access shared functionality, maintain consistent workflows, or transfer context between products. Teams rebuilt identical features 60+ times, and users had to relearn basic tasks in every application.

## The Solution

I designed and built a universal overlay system that runs as a cloud-connected singleton across all Autodesk desktop applications. Think Steam's overlay, but for productivity software—a persistent application layer that works everywhere while maintaining bidirectional communication with host applications.

## Key Innovation: Cross-Application Platform Architecture

- **Universal React Components**: Write once, deploy across 60+ different desktop applications
- **Cloud-Synchronized State**: User context, preferences, and workflows persist across all products
- **Bidirectional Communication**: Overlay and host applications can exchange data and trigger actions in both directions
- **Intelligent Context Awareness**: System understands what users are doing and surfaces relevant tools proactively
- **Non-Disruptive Integration**: Overlay respects each product's unique interface while providing consistent functionality

## Impact

- Unified 60+ fragmented applications into a coherent platform experience
- Eliminated duplicate development of common features across product teams
- Created persistent user context that follows users across their entire workflow
- Enabled cross-product workflows that were previously impossible
