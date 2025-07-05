---
title: Code Sandbox Component Demo
date: 2025-07-04 20:00:00
short: true
tags:
  - blog
---

This post demonstrates the reusable Code Sandbox component.

## Basic Usage

{% code_sandbox %}
<div style="padding: 20px; background: #f0f0f0; border-radius: 8px;">
  <h3>Interactive Content</h3>
  <p>This content is wrapped in a code sandbox. Toggle it off to suspend JavaScript execution!</p>
  <button onclick="alert('Hello from sandbox!')">Click me</button>
  <script>
    console.log('Sandbox is active!');
    setInterval(() => {
      console.log('Still running...', new Date().toISOString());
    }, 2000);
  </script>
</div>
{% endcode_sandbox %}

## Custom Label

{% code_sandbox label="Interactive demo" %}
<div style="padding: 20px; background: #e3f2fd; border-radius: 8px;">
  <p>This sandbox has a custom label.</p>
</div>
{% endcode_sandbox %}

## Start Collapsed

{% code_sandbox label="Heavy animation" collapsed=true %}
<div style="padding: 20px; background: #ffebee; border-radius: 8px;">
  <p>This sandbox starts in a collapsed state to prevent lag on page load.</p>
  <canvas id="animation-canvas" width="300" height="200"></canvas>
  <script>
    const canvas = document.getElementById('animation-canvas');
    const ctx = canvas.getContext('2d');
    let x = 0;
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ff5252';
      ctx.fillRect(x, 50, 50, 50);
      x = (x + 2) % canvas.width;
      requestAnimationFrame(animate);
    }
    animate();
  </script>
</div>
{% endcode_sandbox %}

## Disable Auto-Toggle

{% code_sandbox label="Manual control only" auto_toggle=false %}
<div style="padding: 20px; background: #f3e5f5; border-radius: 8px;">
  <p>This sandbox won't automatically toggle based on scroll position.</p>
</div>
{% endcode_sandbox %}

The Code Sandbox component is perfect for wrapping heavy JavaScript demos, preventing them from running when off-screen and improving page performance.