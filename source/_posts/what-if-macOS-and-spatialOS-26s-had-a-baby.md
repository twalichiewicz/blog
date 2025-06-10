---
title: macOS + spatialOS = ?
long: true
layout: blog_post
cover_image: macOSspatialOSPreview.png
excerpt: Apple bringing 3D window management from SpatialOS to macOS has me thinking, why not add a z-axis to desktop interactions?
tags:
  - blog
date: 2025-06-09 22:22:14
credits:
  - role: Author
    name: Thomas Walichiewicz
  - role: Year
    name: 2025
---

Apple bringing 3D window management from SpatialOS to macOS has me thinking: why not add a z-axis to desktop interactions?

The current 2D window stack feels increasingly limiting. We're managing dozens of apps, countless browser tabs, and multiple workspaces (all constrained to x and y coordinates). Meanwhile, our spatial reasoning capabilities remain largely untapped.

Imagine grabbing a window by its title bar and pushing it "back" into space, where it scales down and slides behind your active work. Not hidden, not minimized (just contextually receded). Designers could keep inspiration boards floating behind their canvas. Developers could layer documentation behind their IDE.

{% video macOS26_spatialOS26.webm autoplay loop muted %}
<p style="text-align: center; color: #666; font-size: 0.9em; margin-top: -16px;">A window being dragged "into" the screen, shrinking as it moves behind other windows on the z-axis</p>

Here's where it gets interesting: with shared spatial metadata between macOS and SpatialOS, your window arrangements could persist across devices. And if they leverage their foveated rendering tech, we could get natural parallax effects as you move your cursor (or your head in Vision Pro). Mission Control transforms from a flat grid into a truly spatial command center.

## The <span style="background: linear-gradient(90deg, #9D00FF 0%, #FF00F5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 600;">clever</span> bits

- Window depth as process priority: That Gmail tab five layers back becomes a literal background process. macOS could throttle CPU cycles based on z-position.
- Eye tracking and foveated rendering mean that peripheral windows could render at lower resolution so your computer stops wasting resources on things you're not looking at
- Ultra Wideband positioning could make window arrangements location-aware. Walk into the kitchen with your laptop, and your cooking videos and recipe tabs automatically move forward. Head to the office, and work documents take focus. The z-axis becomes context-aware.

I'm starting to think we've been stuck in flatland for too long.

