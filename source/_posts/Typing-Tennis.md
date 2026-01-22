---
title: Typing Tennis
date: 2026-01-18 22:15:28
tags:
  - blog
short: true
slug: Typing-Tennis
---

{% raw %}
<div id="tt-embed-root" style="margin: 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div class="tt-card" style="background: #151515; border-radius: 12px; padding: 20px; display: grid; grid-template-columns: auto 1fr; gap: 24px; align-items: center; border: 1px solid #333; box-shadow: 0 10px 30px rgba(0,0,0,0.3); position: relative; overflow: hidden;">
        
        <!-- Art Container (The Box) -->
        <div class="tt-box-container" style="perspective: 1000px; width: 80px; height: 120px; flex-shrink: 0; padding: 0; margin: 0; position: relative;">
            <div class="tt-back-layer" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #222; border-radius: 4px; z-index: -1; transition: transform 0.1s ease-out; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>
            <div class="tt-art-wrapper" style="position: relative; border-radius: 4px; overflow: hidden; width: 100%; height: 100%; box-shadow: 0 5px 15px rgba(0,0,0,0.5); transform-style: preserve-3d; transition: transform 0.1s ease-out; background: #000; padding: 0; margin: 0;">
                 <img src="/img/typingTennisPromo.jpg" style="width: 100%; height: 100%; object-fit: fill; display: block; margin: 0 !important; border-radius: 1px; padding: 0 !important; transform: none !important; transition: none !important;" alt="Typing Tennis">
                 
                 <!-- Interactive Lighting Overlay (Now inside the box wrapper) -->
                 <div class="tt-shine" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 2; background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 60%); mix-blend-mode: soft-light; pointer-events: none;"></div>
                 
                 <!-- Static Gloss -->
                 <div style="position: absolute; top: 0; left: 0; right: 0; height: 50%; background: linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%); pointer-events: none; z-index: 3;"></div>
            </div>
        </div>

        <!-- Content -->
        <div style="display: flex; flex-direction: column; gap: 8px; position: relative;">
            <h3 style="margin: 0; color: oklch(85.2% 0.199 91.936); font-size: 22px; font-weight: 800; line-height: 1.1; letter-spacing: -0.02em;">TYPING TENNIS</h3>
            <p style="margin: 0; color: #888; font-size: 12px; line-height: 1.5;">A retro-style typing game where you play tennis with words.</p>
            
            <a href="https://typingtennis.com" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: fit-content; margin-top: 6px; padding: 10px 24px; background: oklch(85.2% 0.199 91.936); color: #151515; border: 2px solid oklch(85.2% 0.199 91.936); text-decoration: none; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px; transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1); box-shadow: none; position: relative; overflow: hidden;" onmouseover="this.style.boxShadow='0 0 20px oklch(85.2% 0.199 91.936 / 0.4)';" onmouseout="this.style.boxShadow='none';">
                Play Game
            </a>
        </div>
    </div>
</div>

<script>
(function() {
    const root = document.getElementById('tt-embed-root');
    const card = root.querySelector('.tt-card');
    const box = root.querySelector('.tt-art-wrapper');
    const back = root.querySelector('.tt-back-layer');
    const shine = root.querySelector('.tt-shine');
    
    let isTicking = false;
    
    card.addEventListener('mousemove', (e) => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                const rect = box.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate percentages for gradients (relative to the box)
                const xPct = (x / rect.width) * 100;
                const yPct = (y / rect.height) * 100;
                
                // Calculate rotation based on cursor relative to box center
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Cap rotation at 15 degrees
                const rotateY = Math.max(-15, Math.min(15, ((x - centerX) / centerX) * 20)); 
                const rotateX = Math.max(-15, Math.min(15, ((centerY - y) / centerY) * 20));
                
                box.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                
                // Move back layer opposite to mouse to create depth/thickness illusion
                // We use the clamped rotation values as a proxy for the translation 
                // to ensure the back layer stops moving when the rotation caps at 15deg.
                const backX = -(rotateY / 20) * centerX * 0.05;
                const backY = (rotateX / 20) * centerY * 0.05;
                
                // Apply same rotation as foreground to match deformation
                back.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${backX}px, ${backY}px)`;
                
                shine.style.setProperty('--mouse-x', `${xPct}%`);
                shine.style.setProperty('--mouse-y', `${yPct}%`);
                
                isTicking = false;
            });
            isTicking = true;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        box.style.transform = 'rotateX(0) rotateY(0)';
        back.style.transform = 'rotateX(0) rotateY(0) translate(0, 0)';
        shine.style.setProperty('--mouse-x', '50%');
        shine.style.setProperty('--mouse-y', '50%');
    });
})();
</script>
{% endraw %}
