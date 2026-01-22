---
title: Typing Tennis
date: 2026-01-18 22:15:28
tags:
  - blog
short: true
slug: Typing-Tennis
---

<div id="tt-embed-root" style="perspective: 1000px; margin: 3rem 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div class="tt-card" style="background: #151515; border-radius: 12px; padding: 20px; display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: center; border: 1px solid #333; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5); transform-style: preserve-3d; transition: transform 0.1s ease-out; position: relative; overflow: hidden;">
        
        <!-- Interactive Lighting Overlay -->
        <div class="tt-shine" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 2; background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 60%); mix-blend-mode: soft-light; pointer-events: none;"></div>

        <!-- Art Container -->
        <div class="tt-art-wrapper" style="position: relative; border-radius: 6px; overflow: hidden; height: 100px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); transform: translateZ(20px); z-index: 3;">
             <img src="/2026/01/18/Typing-Tennis/typingTennisPromo.jpg" style="width: 100%; height: 100%; object-fit: cover; display: block;" alt="Typing Tennis">
             <!-- Gloss -->
             <div style="position: absolute; top: 0; left: 0; right: 0; height: 50%; background: linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%); pointer-events: none;"></div>
        </div>

        <!-- Content -->
        <div style="display: flex; flex-direction: column; gap: 10px; transform: translateZ(10px); z-index: 3; position: relative;">
            <h3 style="margin: 0; color: oklch(85.2% 0.199 91.936); font-size: 22px; font-weight: 800; line-height: 1.1; letter-spacing: -0.02em;">TYPING TENNIS</h3>
            <p style="margin: 0; color: #888; font-size: 12px; line-height: 1.5;">A retro-style typing game where you play tennis with words.</p>
            
            <a href="https://typingtennis.com" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: fit-content; margin-top: 6px; padding: 10px 24px; background: transparent; color: oklch(85.2% 0.199 91.936); border: 2px solid oklch(85.2% 0.199 91.936); text-decoration: none; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px; transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1); box-shadow: 0 0 10px rgba(255, 100, 100, 0); position: relative; overflow: hidden;" onmouseover="this.style.background='oklch(85.2% 0.199 91.936)'; this.style.color='#151515'; this.style.boxShadow='0 0 20px oklch(85.2% 0.199 91.936 / 0.4)';" onmouseout="this.style.background='transparent'; this.style.color='oklch(85.2% 0.199 91.936)'; this.style.boxShadow='none';">
                Play Game
            </a>
        </div>
    </div>
</div>

<script>
(function() {
    const root = document.getElementById('tt-embed-root');
    const card = root.querySelector('.tt-card');
    const shine = root.querySelector('.tt-shine');
    
    // Throttled mouse move for performance
    let isTicking = false;
    
    root.addEventListener('mousemove', (e) => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                const rect = root.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate percentages for gradients
                const xPct = (x / rect.width) * 100;
                const yPct = (y / rect.height) * 100;
                
                // Calculate rotation (subtle effect)
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                // Reverse rotation for "looking at" effect vs "tipping" effect
                const rotateY = ((x - centerX) / centerX) * 3; 
                const rotateX = ((centerY - y) / centerY) * 3;
                
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                shine.style.setProperty('--mouse-x', `${xPct}%`);
                shine.style.setProperty('--mouse-y', `${yPct}%`);
                
                isTicking = false;
            });
            isTicking = true;
        }
    });
    
    root.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0) rotateY(0)';
        // Reset shine to center but fade it out or keep it subtle
        shine.style.setProperty('--mouse-x', '50%');
        shine.style.setProperty('--mouse-y', '50%');
    });
})();
</script>