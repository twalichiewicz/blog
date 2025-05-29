---
title: Company-wide universal install framework
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
cover_image: /2019/06/30/Project-Wingman/wingmanInstaller.mp4
cover_video_poster: /2019/06/30/Project-Wingman/wingmanInstaller_poster.jpg
---

## The Problem

Autodesk users had to download and run separate installers for every product they needed—each with different interfaces, interaction patterns, and customization options built by different teams. Installing a full Autodesk workflow meant managing dozens of separate installer experiences, each requiring user attention and decision-making. Users couldn't install multiple products together, and each installer blocked their work until fully complete.

## The Solution

I designed a universal installer framework that provides one consistent experience across all Autodesk products. The same clean, simplified interface works whether users download a single product or install an entire multi-product suite. Advanced customization was moved to the separate Custom Install web tool, keeping the desktop experience focused and streamlined.

## Key Innovation: Progressive Installation Architecture

- **Unified Visual Design:** Single, clean interface replaced 60+ different installer designs
- **Multi-Product Support:** Users can install entire workflows in one session instead of managing separate installers
- **Progressive Loading:** Products launch as soon as core components install, with secondary features loading in background
- **Simplified Customization:** Limited to 5 essential checkboxes, with advanced options handled via web tool
- **Quiet Install Mode:** Admin-controlled version prevents user modifications for enterprise deployments

## Impact

- Eliminated 60+ separate installer codebases that required individual maintenance
- Reduced time-to-productivity through progressive installation—users can start working while installation continues
- Enabled multi-product workflows for the first time in Autodesk's history
- Standardized installation experience across entire product ecosystem
- Freed engineering resources from maintaining dozens of separate installer interfaces
