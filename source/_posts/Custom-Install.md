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
---

## The Problem

Autodesk's 100+ products each maintained their own custom installer with advanced configuration options. Enterprise customers had to download massive installer files, store them on local servers, and manually manage complex deployment sequences across multiple products. The company was burning millions on duplicate development work while customers struggled with fragmented, offline-only installation processes.

## The Solution

I designed a unified web platform that dynamically generates custom installation interfaces from simple XML files. Product teams define their configuration needs in XML, and the system automatically builds the appropriate UI—no custom development required. The web-based approach eliminated the need for customers to store gigabyte-sized installers locally.

## Key Innovation: Dynamic Multi-Product Configuration System

- **Web-Based Accessibility:** Eliminated need for local installer storage—configs live in the cloud and generate installers on-demand
- **XML-Driven UI Generation:** Product teams maintain simple XML files, system builds custom interfaces automatically
- **Multi-Product Intelligence:** System knows correct installation sequences and dependencies across multiple applications
- **Shared Configuration Library:** Save, duplicate, and share installation packages across teams and regions
- **Dynamic Generation:** Any configuration combination instantly generates a downloadable installer
- **Deployment Flexibility:** Create both standalone installers and enterprise deployment packages
- **Multi-Language Support:** Quickly generate region-specific versions with localized interfaces
- **Lightweight Storage:** CAD/BIM managers store tiny config files instead of massive GB installers

## Impact

- Eliminated separate installer maintenance efforts across all product teams
- Reduced enterprise deployment time from hours to minutes
- Freed up terabytes of local server storage by moving configs to cloud-based library
- Enabled complex multi-product installations with automatic dependency management
- Launched just before COVID-19, providing critical remote accessibility when teams went distributed
- Saved millions in duplicate development costs by consolidating fragmented systems
