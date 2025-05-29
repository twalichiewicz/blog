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
cover_image: /2020/02/15/Overlay/overlayPreview_cover.jpg
--- 

## The Problem

Autodesk's array of desktop products operated as completely isolated silos. Users lost context switching between applications, couldn't access shared functionality across their workflows, and had to relearn basic tasks in every product. Meanwhile, engineering teams rebuilt identical features dozens of times—smart assistance in one product remained trapped there while users struggled with the same problems in adjacent tools.

## The Solution

I designed a universal overlay system that runs as a cloud-connected singleton across all Autodesk desktop applications. Like Steam's overlay for gaming, this creates a persistent application layer that follows users everywhere—enabling shared functionality, contextual assistance, and seamless workflows while maintaining bidirectional communication with host applications.

## Key Innovation: Cross-Application Intelligence Platform

- **Universal React Architecture:** Single codebase deploys components across different desktop applications with native-feeling integration
- **Persistent Cloud State:** User context, preferences, and work history synchronize across entire product ecosystem in real-time
- **Bidirectional Communication:** Overlay can read application state, trigger host actions, and respond to application events seamlessly
- **Contextual Intelligence Engine:** System understands current user tasks and proactively surfaces relevant tools, shortcuts, and guidance
- **Adaptive Integration:** Overlay respects each product's unique interface language while maintaining consistent core functionality
