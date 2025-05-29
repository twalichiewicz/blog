---
title: Custom Install
has_writeup: true
company: Autodesk
byline: Replaced 60+ fragmented installer systems with a single platform that generates custom UIs from XML—saving Autodesk millions in duplicate development work
date: 2019-08-30 20:52:01
cover_image: /2019/08/30/Custom-Install/customInstall-preview.png
tags:
  - portfolio
layout: project_gallery
gallery_images:
  - url: /2019/08/30/Custom-Install/000_customInstall.jpg
    type: image
  - url: /2019/08/30/Custom-Install/010_customInstall.jpg
    type: image
  - url: /2019/08/30/Custom-Install/011_customInstall.jpg
    type: image
  - url: /2019/08/30/Custom-Install/012_customInstall.jpg
    type: image
  - url: /2019/08/30/Custom-Install/020_customInstall.jpg
    type: image
  - url: /2019/08/30/Custom-Install/021_customInstall.jpg
    type: image
  - url: /2019/08/30/Custom-Install/030_customInstall.png
    type: image
summary:
  problem:
    content: "Autodesk's 100+ products each maintained their own custom installer with advanced configuration options. Enterprise customers had to download massive installer files, store them on local servers, and manually manage complex deployment sequences across multiple products. The company was burning millions on duplicate development work while customers struggled with fragmented, offline-only installation processes."
  solution:
    content: "I designed a unified web platform that dynamically generates custom installation interfaces from simple XML files. Product teams define their configuration needs in XML, and the system automatically builds the appropriate UI—no custom development required. The web-based approach eliminated the need for customers to store gigabyte-sized installers locally."
  innovation:
    title: "Dynamic Multi-Product Configuration System"
    bullets:
      - "<strong>Web-Based Accessibility:</strong> Eliminated need for local installer storage—configs live in the cloud and generate installers on-demand"
      - "<strong>XML-Driven UI Generation:</strong> Product teams maintain simple XML files, system builds custom interfaces automatically"
      - "<strong>Multi-Product Intelligence:</strong> System knows correct installation sequences and dependencies across multiple applications"
      - "<strong>Shared Configuration Library:</strong> Save, duplicate, and share installation packages across teams and regions"
      - "<strong>Dynamic Generation:</strong> Any configuration combination instantly generates a downloadable installer"
      - "<strong>Deployment Flexibility:</strong> Create both standalone installers and enterprise deployment packages"
      - "<strong>Multi-Language Support:</strong> Quickly generate region-specific versions with localized interfaces"
      - "<strong>Lightweight Storage:</strong> CAD/BIM managers store tiny config files instead of massive GB installers"
  impact:
    bullets:
      - "Eliminated separate installer maintenance efforts across all product teams"
      - "Reduced enterprise deployment time from hours to minutes"
      - "Freed up terabytes of local server storage by moving configs to cloud-based library"
      - "Enabled complex multi-product installations with automatic dependency management"
      - "Launched just before COVID-19, providing critical remote accessibility when teams went distributed"
      - "Saved millions in duplicate development costs by consolidating fragmented systems"
---

## The Problem

Enterprise IT administrators were drowning in complexity. Every Autodesk product came with its own installer—different interfaces, different configuration options, different failure modes. Companies needed dedicated server rooms just to store the massive installer files, and deploying a full workflow meant orchestrating dozens of separate processes that frequently broke.

One CAD manager told me: "We spend more time managing installations than using the software. When something fails, we start over from scratch."

The business impact was severe. We were burning millions maintaining separate codebases while frustrated customers evaluated competitors with simpler deployment solutions.

## Research & Discovery

I audited installation experiences across all product lines and interviewed enterprise administrators to understand their workflows. The research revealed a crucial insight: despite surface differences, most installers solved identical problems—managing dependencies, handling configurations, ensuring proper sequences.

Administrators didn't want dumbed-down tools; they wanted consistent, powerful interfaces that followed predictable patterns. They also desperately needed to eliminate the local storage burden that was forcing them to maintain dedicated infrastructure.

## The Solution

I designed a web-based platform that generates custom installation interfaces from XML files. Instead of maintaining separate codebases, product teams define their requirements in simple configuration files that automatically create consistent interfaces.

The system understands installation dependencies and sequences, enabling multi-product deployments for the first time. Administrators can save and share configurations across teams, turning individual solutions into organizational knowledge. The web-based approach eliminates local storage needs—administrators store tiny config files instead of gigabyte installers.

When product teams update their XML requirements, the interface changes automatically flow to all customer installations, creating a truly dynamic system.

## Results & Impact

The platform eliminated maintenance efforts across 100+ product teams and freed terabytes of customer server storage. Enterprise deployment time dropped from hours to minutes, and multi-product installations became possible for the first time.

The timing proved crucial—launching just before COVID-19 provided essential remote deployment capabilities when teams went distributed. The system achieved complete adoption across Autodesk's portfolio and saved millions annually in duplicate development costs.

## Reflection

This project taught me that the highest-impact design work often happens at the infrastructure level. Instead of optimizing individual installers, we reimagined the entire deployment ecosystem. The XML-driven approach influenced other platform initiatives and demonstrated how systems thinking can create value that compounds across an organization.

The platform continues to serve as Autodesk's deployment foundation, proving that solving fundamental infrastructure problems creates more lasting value than surface-level interface improvements.
