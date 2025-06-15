---
title: How creative mediums find their voice
excerpt: Understanding LLM adoption through the lens of medium evolution
layout: blog_post
long: true
tags:
  - blog
cover_image:
date: 2025-06-14 01:39:23
credits:
  - role: Author
    name: Thomas Walichiewicz
  - role: Year
    name: 2025
---

<style>
/* Bartosz Ciechanowski-inspired interactive styles */
.interactive-container {
  margin: 3rem 0;
  padding: 2rem;
  background: var(--card-bg, #f8f9fa);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}

@media (prefers-color-scheme: dark) {
  .interactive-container {
    background: var(--card-bg-dark, #1a1a1a);
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
}

/* Timeline Visualization */
.evolution-timeline {
  position: relative;
  height: 400px;
  margin: 2rem 0;
  min-height: 400px;
  background: linear-gradient(to bottom, transparent 45%, hsla(43deg, 20%, 60%, 0.05) 50%, transparent 55%);
}

.timeline-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: hsl(43deg 40% 80%); /* Light accent gold */
  transform: translateY(-50%);
  border-radius: 2px;
}

@media (prefers-color-scheme: dark) {
  .timeline-track {
    background: hsl(43deg 40% 30%); /* Darker gold for dark mode */
  }
}

.timeline-phase {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline-phase.active .phase-circle {
  transform: scale(1.5);
  box-shadow: 0 0 0 8px hsla(43deg, 40%, 60%, 0.2);
}

.timeline-phase.active .phase-label {
  font-weight: 700;
  opacity: 1;
}

.phase-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: hsl(43deg 40% 60%); /* Accent gold */
  border: 3px solid var(--bg-color, white);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

@media (prefers-color-scheme: dark) {
  .phase-circle {
    background: hsl(40deg 90% 60%); /* Bright gold for dark mode */
  }
}

.timeline-phase:hover .phase-circle {
  transform: scale(1.3);
  box-shadow: 0 4px 16px hsla(43deg, 40%, 60%, 0.4);
}

.phase-label {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.timeline-phase:hover .phase-label {
  opacity: 1;
}

.phase-years {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

.phase-details {
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  margin: 0 1rem;
  padding: 1.5rem;
  background: hsl(35deg 15% 92%);
  border: 1px solid hsl(43deg 40% 70%);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  opacity: 1;
  transform: translateY(0);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
}

@media (prefers-color-scheme: dark) {
  .phase-details {
    background: hsl(28deg 8% 18%);
    border-color: hsl(43deg 40% 40%);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
}

.phase-details.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.phase-details h4 {
  margin: 0 0 0.5rem 0;
  color: hsl(15deg 70% 40%); /* Warm red-orange link color */
  font-size: 1.125rem;
}

@media (prefers-color-scheme: dark) {
  .phase-details h4 {
    color: hsl(40deg 90% 60%); /* Bright gold for dark mode */
  }
}

.phase-details p {
  margin: 0;
  color: var(--text-primary);
  line-height: 1.6;
}

/* Animated statistics */
.stat-container {
  display: inline;
  position: relative;
  font-weight: 600;
  color: hsl(43deg 40% 50%); /* Accent gold */
}

@media (prefers-color-scheme: dark) {
  .stat-container {
    color: hsl(40deg 90% 60%); /* Bright gold for dark mode */
  }
}

.stat-number {
  display: inline;
  font-weight: 700;
  opacity: 1; /* Start visible */
  transform: none;
  transition: color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-number[data-animated="false"] {
  opacity: 0.3;
}

.stat-number[data-animated="true"] {
  opacity: 1;
}

/* Comparison Slider */
.comparison-slider {
  position: relative;
  height: 400px;
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
  cursor: col-resize;
  user-select: none;
}

.comparison-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comparison-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
}

.comparison-overlay img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  max-width: 100%;
  height: 100%;
  object-fit: cover;
}

.comparison-slider-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  background: white;
  left: 50%;
  transform: translateX(-50%);
  cursor: col-resize;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}

.comparison-slider-handle::before,
.comparison-slider-handle::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.comparison-slider-handle::after {
  width: 20px;
  height: 20px;
  background: hsl(43deg 40% 60%); /* Accent gold */
}

@media (prefers-color-scheme: dark) {
  .comparison-slider-handle::after {
    background: hsl(40deg 90% 60%);
  }
}

.comparison-label {
  position: absolute;
  padding: 0.5rem 1rem;
  background: rgba(0,0,0,0.7);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 4px;
  pointer-events: none;
}

.comparison-label.left {
  top: 1rem;
  left: 1rem;
}

.comparison-label.right {
  top: 1rem;
  right: 1rem;
}

/* Scroll-triggered animations */
.fade-in-up {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Interactive quote */
.interactive-quote {
  position: relative;
  padding: 2rem;
  margin: 2rem 0;
  background: var(--card-bg, #f8f9fa);
  border-left: 4px solid hsl(43deg 40% 60%); /* Accent gold */
  border-radius: 0 8px 8px 0;
  transition: all 0.3s ease;
}

@media (prefers-color-scheme: dark) {
  .interactive-quote {
    background: var(--card-bg-dark, #1a1a1a);
  }
}

.interactive-quote:hover {
  transform: translateX(10px);
  box-shadow: 0 4px 20px hsla(43deg, 40%, 60%, 0.15);
}

.interactive-quote p {
  margin: 0;
  font-style: italic;
  font-size: 1.125rem;
  line-height: 1.8;
}

.interactive-quote cite {
  display: block;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-style: normal;
}
</style>

When photography was invented in 1839, early practitioners pointed their cameras at the same subjects painters had captured for centuries—formal portraits, still lifes, pastoral landscapes. They used soft focus and hand-tinting to make photographs look like paintings. It took nearly 50 years before photographers like Alfred Stieglitz proclaimed that it was "high time that the stupidity and sham in pictorial photography be struck a solarplexus blow." The medium needed to find its own voice.

This pattern—new creative mediums initially imitating their predecessors before discovering unique capabilities—appears throughout history. Cinema spent its first decades as "filmed theater" with static cameras. Early web design mimicked print layouts. Today, we're witnessing the same phenomenon with Large Language Models in design, where <span class="stat-container"><span class="stat-number" data-value="89">89%</span> of designers report using AI</span> in their workflows, yet most applications simply replicate existing creative processes. Understanding this historical pattern offers crucial insights into where AI-assisted design might evolve.

## The predictable arc of creative medium evolution

<div class="interactive-container">
  <div class="evolution-timeline">
    <div class="timeline-track"></div>
    <div class="timeline-phase phase-1" data-phase="1">
      <div class="phase-circle"></div>
      <div class="phase-label">Initial Imitation</div>
      <div class="phase-years">5-15 years</div>
    </div>
    <div class="timeline-phase phase-2" data-phase="2">
      <div class="phase-circle"></div>
      <div class="phase-label">Experimentation</div>
      <div class="phase-years">10-20 years</div>
    </div>
    <div class="timeline-phase phase-3" data-phase="3">
      <div class="phase-circle"></div>
      <div class="phase-label">Unique Voice</div>
      <div class="phase-years">15-30 years</div>
    </div>
    <div class="timeline-phase phase-4" data-phase="4">
      <div class="phase-circle"></div>
      <div class="phase-label">Maturation</div>
      <div class="phase-years">20-30+ years</div>
    </div>
    <div class="phase-details" id="phase-details">
      <h4>Select a phase to explore</h4>
      <p>Click on any phase in the timeline to learn more about how creative mediums evolve through that stage.</p>
    </div>
  </div>
</div>

<style>
.timeline-phase.phase-1 { left: 10%; }
.timeline-phase.phase-2 { left: 35%; }
.timeline-phase.phase-3 { left: 60%; }
.timeline-phase.phase-4 { left: 85%; }
</style>

Media theorists Jay David Bolter and Richard Grusin call this phenomenon "remediation"—the process whereby new media refashion older media forms before developing their own aesthetic language. Their research reveals that creative mediums typically evolve through four distinct phases over 20-30 years:

**Phase 1: Initial Imitation (5-15 years)** - New technologies replicate existing art forms as practitioners, often from traditional backgrounds, apply familiar paradigms to unfamiliar tools.

**Phase 2: Experimentation and Debate (10-20 years)** - Pioneers discover medium-specific techniques through accident or experimentation while heated debates rage about artistic legitimacy.

**Phase 3: Unique Voice Emergence (15-30 years)** - Revolutionary techniques that couldn't exist in other mediums emerge, accompanied by theoretical frameworks explaining the medium's unique properties.

**Phase 4: Maturation and Influence** - The medium influences other art forms while establishing formal education, criticism, and commercial validation.

This pattern reflects what psychologist Colin Martindale identified as the "arousal potential theory"—artists initially work within familiar frameworks before the pressure for novelty drives innovation. The timeline varies, but the arc remains remarkably consistent across mediums.

## Photography's 50-year journey from imitation to independence

The Pictorialism movement (1885-1915) exemplified photography's imitative phase. Henry Peach Robinson, who published "Pictorial Effect in Photography" in 1869, advocated "combination printing"—merging multiple negatives to create painterly compositions. Photographers deliberately used soft focus, hand-coloring, and manipulated printing processes to achieve artistic legitimacy by mimicking established aesthetics.

The transition began through technological accidents and philosophical shifts. Peter Henry Emerson promoted "naturalistic photography" in the 1880s, arguing for sharper focus that better represented how the eye actually sees. But the real breakthrough came with Group f/64 in 1932. Ansel Adams, Edward Weston, and Imogen Cunningham embraced photography's unique capabilities: infinite depth of field, precise detail capture, and the ability to freeze decisive moments.

<div class="comparison-slider" id="photography-comparison">
  <div class="pictorialist-side"></div>
  <div class="comparison-overlay">
    <div class="straight-photography-side"></div>
  </div>
  <div class="comparison-slider-handle"></div>
  <div class="comparison-label left">Pictorialism</div>
  <div class="comparison-label right">Straight Photography</div>
</div>

<style>
.comparison-slider .pictorialist-side {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, hsl(30deg 20% 85%), hsl(30deg 15% 75%));
  overflow: hidden;
}

.comparison-slider .pictorialist-side::before {
  content: '';
  position: absolute;
  inset: 20%;
  background: radial-gradient(ellipse at center, hsla(30deg, 25%, 70%, 0.8), hsla(30deg, 20%, 60%, 0.6));
  filter: blur(40px);
}

.comparison-slider .pictorialist-side::after {
  content: '';
  position: absolute;
  top: 30%;
  left: 20%;
  width: 30%;
  height: 40%;
  background: hsla(30deg, 15%, 50%, 0.3);
  border-radius: 50%;
  filter: blur(20px);
}

.comparison-slider .straight-photography-side {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, hsl(0deg 0% 95%), hsl(0deg 0% 85%));
}

.comparison-slider .straight-photography-side::before {
  content: '';
  position: absolute;
  top: 15%;
  left: 10%;
  width: 35%;
  height: 50%;
  background: hsl(0deg 0% 20%);
  transform: rotate(-5deg);
}

.comparison-slider .straight-photography-side::after {
  content: '';
  position: absolute;
  bottom: 10%;
  right: 10%;
  width: 40%;
  height: 25%;
  background: linear-gradient(135deg, hsl(0deg 0% 30%), hsl(0deg 0% 10%));
}
</style>

<div class="interactive-quote fade-in-up">
  <p>The camera should be used for a recording of life, for rendering the very substance and quintessence of the thing itself.</p>
  <cite>— Edward Weston</cite>
</div>

This wasn't about making photographs look like paintings anymore—it was about discovering what only photography could do.

## Cinema's revolutionary montage moment

Early cinema faced similar challenges. Georges Méliès, the professional magician who began filmmaking in 1896, created elaborate productions that were essentially "artificially arranged scenes"—filmed stage plays with special effects. Even his groundbreaking "A Trip to the Moon" (1902) maintained theatrical staging conventions.

The medium's unique voice emerged through Soviet filmmakers in the 1920s. Sergei Eisenstein developed comprehensive montage theory, demonstrating that meaning could emerge from the collision of images rather than their individual content. His principle—"montage is conflict"—revealed cinema's fundamental power: manipulating time and space through editing to create psychological and emotional effects impossible in theater.

**The Kuleshov Effect proved this definitively**: showing the same actor's face intercut with different images (soup, a coffin, a child) made audiences perceive different emotions on the unchanged face. This wasn't filmed theater anymore—it was a new language of human perception.

## Web design's evolution from print metaphors to responsive reality

The web's evolution compressed centuries of design history into decades. Tim Berners-Lee's first website in 1991 was pure text with basic links—a digital document. By 1996, David Siegel's "Creating Killer Web Sites" advocated using HTML tables and single-pixel GIFs as spacers to recreate print layouts online. He called it "third-generation site design," but it was still fundamentally about making websites look like magazines.

The Flash era (1997-2005) represented web design's experimentation phase. Designers like Hillman Curtis pushed boundaries with rich animations and interactions impossible in print. Yet many Flash sites sacrificed usability for spectacle—the medium searching for its voice through excess.

<div class="interactive-quote fade-in-up">
  <p>Responsive Web Design</p>
  <cite>— Ethan Marcotte, 2010</cite>
</div>

The breakthrough came with Ethan Marcotte's "Responsive Web Design" in 2010. Rather than fixed layouts mimicking print, responsive design embraced the web's fundamental fluidity. Content could adapt to any screen size, reflow dynamically, and respond to user interaction. This wasn't print design on screens—it was design that could only exist on the web.

## Where LLMs stand today: The awkward adolescence of AI-assisted design

Current data reveals we're squarely in Phase 1 of LLM evolution in design. While adoption is nearly universal—<span class="stat-container"><span class="stat-number" data-value="78">78%</span> of designers report AI significantly enhances work efficiency</span>—the applications remain largely imitative:

- Using ChatGPT for copywriting tasks humans previously handled
- Generating mood boards with Midjourney instead of searching stock photos  
- Creating "first drafts" that require extensive human refinement
- Treating AI as a faster version of existing tools rather than something fundamentally new

The numbers tell a revealing story: <span class="stat-container"><span class="stat-number" data-value="84">84%</span> of designers find AI helpful in the exploration phase</span>, but only <span class="stat-container"><span class="stat-number" data-value="39">39%</span> find it useful in final delivery</span>. This mirrors early photography's struggle—the tools are powerful, but we're using them to replicate familiar workflows rather than discovering unique capabilities.

More telling is the emergence of "AI feature fatigue." Research shows only one-third of builders are proud of their shipped AI features, with 72% saying AI plays a minor or non-essential role in their products. We're adding AI because we can, not because we've discovered what it uniquely enables.

## Early experiments hint at the medium's unique voice

Yet pioneering projects suggest what AI-native design might become. MIT's DesignAID system doesn't just generate variations—it uses semantic understanding to combat design fixation by suggesting "related but semantically different" concepts that human designers rarely consider. **In testing, <span class="stat-container"><span class="stat-number" data-value="49">49%</span> of AI-generated webpages were considered replacements for originals</span>, and <span class="stat-container"><span class="stat-number" data-value="64">64%</span> were deemed better than reference designs</span>**.

Microsoft's LLMR framework creates real-time mixed reality experiences through natural language, generating not just content but dynamic spatial interactions with behavioral logic. This isn't replacing existing design tasks—it's enabling entirely new creative possibilities.

The most compelling experiments share key characteristics:
- **Conversational design processes** where natural language becomes the primary creative interface
- **Systematic creativity** that explores design spaces at scales impossible for human cognition
- **Living design systems** that evolve and adapt rather than remaining static
- **Multi-agent collaboration** where specialized AI agents debate and refine ideas

These applications don't simply automate design tasks—they reveal new possibilities for how design thinking itself might work.

## Theoretical frameworks predict a 5-10 year maturation cycle

Everett Rogers' Diffusion of Innovation theory suggests creative tools follow predictable adoption curves. Currently, design's "innovators" (2.5%) and "early adopters" (13.5%) are experimenting with LLMs. The critical "chasm" Geoffrey Moore identified—between early adopters seeking breakthrough advantages and the early majority wanting proven solutions—typically occurs around years 3-5 of a technology's lifecycle.

Given LLMs entered mainstream consciousness with ChatGPT in late 2022, we're approximately 2.5 years into this cycle. Historical patterns suggest:

- **Years 1-3 (2022-2025)**: Remediation phase - imitating existing workflows
- **Years 4-7 (2025-2028)**: Experimentation - discovering AI-specific techniques  
- **Years 8-15 (2028-2035)**: Maturation - full AI-native creative languages emerge

This timeline aligns with Manovich's principles of new media evolution. We're currently in the "numerical representation" and "modularity" phases, where AI handles discrete design tasks. The coming "automation" and "variability" phases will enable infinite design variations and intelligent creative assistance. The final "transcoding" phase—where AI fundamentally transforms creative culture itself—remains years away.

## What this means for designers navigating the transition

Understanding medium evolution offers practical insights for today's designers. First, current frustrations with AI tools aren't failures—they're predictable growing pains. When <span class="stat-container"><span class="stat-number" data-value="96">96%</span> of designers report being self-taught in AI skills</span>, we're collectively fumbling toward the medium's potential without established best practices.

Second, the most valuable explorations likely won't come from making AI better at existing tasks but from discovering what it uniquely enables. Photography found its voice not by better imitating paintings but by embracing infinite depth of field and decisive moments. Cinema discovered montage, not better filmed theater. The web found responsive design, not better print layouts.

For design leaders, this suggests **creating safe spaces for true experimentation** beyond productivity metrics. For individual designers, it means approaching AI as a collaborative partner with alien intelligence rather than a faster version of familiar tools. The designers who thrive won't be those who use AI most efficiently for current workflows but those who discover new creative possibilities.

## Conclusion: Patience and possibility in the age of AI design

We stand at a fascinating moment in design history—early in a new medium's evolution, surrounded by powerful tools whose true capabilities remain largely undiscovered. The overwhelming adoption rates and simultaneous dissatisfaction mirror every creative medium's awkward adolescence.

History suggests patience. Photography needed 50 years to move from soft-focus pictorialism to straight photography. Cinema required 30 years to develop montage theory. The web took 20 years to embrace responsive design. If these patterns hold, we won't see AI's true creative voice until the early 2030s.

But history also suggests inevitability. Every major creative medium eventually discovers its unique capabilities and transforms creative practice. The question isn't whether AI will find its voice in design but what that voice will sound like—and which designers will help discover it.

**The most exciting possibility? We're not just witnessing another medium evolution. We're participating in it**. Every experiment, every failed attempt to make AI "do design better," every unexpected discovery brings us closer to understanding what human-AI creative collaboration might uniquely enable. The awkward phase won't last forever. But the discoveries we make during it will shape creative practice for generations.

<script>
// Interactive timeline functionality
document.addEventListener('DOMContentLoaded', function() {
  const phases = document.querySelectorAll('.timeline-phase');
  const detailsBox = document.getElementById('phase-details');
  
  const phaseData = {
    '1': {
      title: 'Phase 1: Initial Imitation',
      description: 'New technologies replicate existing art forms. Practitioners from traditional backgrounds apply familiar paradigms to unfamiliar tools, often creating literal translations of established mediums.'
    },
    '2': {
      title: 'Phase 2: Experimentation and Debate',
      description: 'Pioneers discover medium-specific techniques through accident or experimentation. Heated debates rage about artistic legitimacy as traditionalists resist while innovators push boundaries.'
    },
    '3': {
      title: 'Phase 3: Unique Voice Emergence',
      description: 'Revolutionary techniques that couldn\'t exist in other mediums emerge. Theoretical frameworks develop to explain the medium\'s unique properties and possibilities.'
    },
    '4': {
      title: 'Phase 4: Maturation and Influence',
      description: 'The medium influences other art forms while establishing formal education, criticism, and commercial validation. It becomes an accepted part of the creative landscape.'
    }
  };
  
  phases.forEach(phase => {
    phase.addEventListener('click', () => {
      const phaseNum = phase.dataset.phase;
      const data = phaseData[phaseNum];
      
      phases.forEach(p => p.classList.remove('active'));
      phase.classList.add('active');
      
      detailsBox.innerHTML = `<h4>${data.title}</h4><p>${data.description}</p>`;
      detailsBox.classList.add('active');
    });
  });
  
  // Comparison slider functionality
  const slider = document.getElementById('photography-comparison');
  if (slider) {
    const overlay = slider.querySelector('.comparison-overlay');
    const handle = slider.querySelector('.comparison-slider-handle');
    let isSliding = false;
    
    const updateSlider = (e) => {
      if (!isSliding) return;
      
      const rect = slider.getBoundingClientRect();
      const x = e.clientX || e.touches[0].clientX;
      const relativeX = x - rect.left;
      const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
      
      overlay.style.width = percentage + '%';
      handle.style.left = percentage + '%';
    };
    
    const startSliding = () => { isSliding = true; };
    const stopSliding = () => { isSliding = false; };
    
    handle.addEventListener('mousedown', startSliding);
    handle.addEventListener('touchstart', startSliding);
    
    document.addEventListener('mousemove', updateSlider);
    document.addEventListener('touchmove', updateSlider);
    
    document.addEventListener('mouseup', stopSliding);
    document.addEventListener('touchend', stopSliding);
    
    slider.addEventListener('click', (e) => {
      const rect = slider.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const percentage = (relativeX / rect.width) * 100;
      
      overlay.style.width = percentage + '%';
      handle.style.left = percentage + '%';
    });
  }
  
  // Scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Animate numbers
        const numbers = entry.target.querySelectorAll('.stat-number');
        numbers.forEach(num => {
          if (num.dataset.animated === 'true') return; // Skip if already animated
          
          const finalValue = parseInt(num.dataset.value);
          const duration = 1500;
          const start = Date.now();
          
          num.dataset.animated = 'false'; // Mark as starting animation
          
          const updateNumber = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(finalValue * easeOut);
            
            num.textContent = current + '%';
            
            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            } else {
              num.dataset.animated = 'true'; // Mark as completed
            }
          };
          
          updateNumber();
        });
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
  });
  
  document.querySelectorAll('.stat-number').forEach(el => {
    observer.observe(el);
  });
});
</script>