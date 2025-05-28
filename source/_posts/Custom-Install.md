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

Autodesk's 60+ products each maintained their own custom installer with advanced configuration options. This meant 60+ separate codebases, 60+ different user experiences, and enterprise customers struggling to deploy multiple products consistently. The company was burning millions on duplicate development work.

## The Solution

I designed a unified web platform that dynamically generates custom installation interfaces from simple XML files. Product teams define their configuration needs in XML, and the system automatically builds the appropriate UI—no custom development required.

## Key Innovation: The Component System

- **Dynamic UI Generation**: Teams upload XML configs, system builds custom interfaces automatically
- **Shared Configuration Library**: Enterprise customers can save, duplicate, and share installation packages across teams
- **Multi-Product Installers**: For the first time, customers could install multiple Autodesk products in a single workflow instead of running 60+ separate installers

## Impact

- Eliminated 60+ separate installer maintenance efforts across product teams
- Reduced enterprise deployment time from hours to minutes
- Created reusable configurations that organizations could share and standardize
- Enabled multi-product installations that were previously impossible
