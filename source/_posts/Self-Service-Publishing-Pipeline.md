---
title: Self-Service Publishing Pipeline
display_name: "Content Velocity Unleashed"
display_description: "3-week engineering cycles reduced to same-day publishing"
date: 2020-01-19
company: Autodesk
byline: Transformed content publishing from 3-week engineering cycles to same-day self-service, unlocking $6-8M in revenue opportunities
tags:
  - portfolio
layout: project_gallery
has_writeup: true
notebook_color: "tangerine"
notebook_brand: "rhodia"
cover_image: sspp_cover.jpg
stats:
  - value: "$6-8M"
    label: "ARR opportunity captured"
  - value: "250x"
    label: "Faster publishing"
  - value: "$2M/year"
    label: "Engineering costs saved"
project_stats:
  - label: "Problem"
    value: "3-4 week publishing cycles blocking $6-8M revenue opportunities"
    type: "problem"
  - label: "Solution"
    value: "Self-service platform enabling same-day content publishing"
    type: "solution"
  - label: "Timeline"
    value: "9 months"
  - label: "Platform"
    value: "CMS with custom creation tool built on top"
  - label: "Team"
    value: 
      - "Lead Product Designer (me)"
      - "1 Product Manager"
      - "Engineering team (7 people)"
      - "Subject matter experts (8 people)"
    type: "list"
  - label: "Leadership"
    value: ["Cross-Functional Influence (9 people)", "Process Innovation: Self-Service Framework", "Strategic Partnership: Business Strategy", "Change Management: Publishing Transformation", "Stakeholder Education: Content Team Enablement"]
    type: "tags"
  - label: "Skills"
    value: ["Service Design", "CMS Design", "Developer Tools", "Business Strategy", "Platform Design", "User Research"]
    type: "tags"
---

## The Problem

Autodesk's smart guidance system could detect when users needed help and deliver contextual tutorials—but only if engineering teams had time to publish them. Our behavioral monitoring showed users struggling with features that generated $6-8M in annual revenue, yet the guidance to help them took 3-4 weeks to publish.

The process was absurd: content creators would identify user problems, write solutions, then wait for engineering sprints to code their tutorials into the product. Sarah, a content designer, captured the frustration perfectly: "I can see exactly what users need help with, but by the time we publish the solution, they've already given up."

The business impact was severe:

- **15% suppression** of Fusion trial-to-paid conversion, leaving $6-8M ARR on the table
- **$2M annually** in engineering time spent on manual publishing tasks
- **3-6 week delays** for new feature guides, stalling adoption at 60%
- **10-point NPS drop** when users encountered outdated content

## Research & Discovery

I mapped the complete content lifecycle and discovered it took eight people across four teams to publish a single guidance tip. The revelation: we were treating every tutorial like a software feature, complete with wiki documentation, engineering tickets, and QA cycles.

**Stakeholder Interviews:** Content creators revealed they were compromising quality due to process friction. James, a senior strategist, explained: "We write one generic tutorial that sort of helps everyone instead of three targeted ones that perfectly help different user types."

**Technical Audit:** Our platform could already handle dynamic content and behavioral targeting. The bottleneck wasn't capability—it was accessibility. The publishing interface required engineering knowledge that content experts didn't have (and shouldn't need).

**Rapid Prototyping:** I tested a simplified flow with five content creators. Within minutes, they were building guidance that would have taken weeks. The validation was immediate: remove technical barriers, unlock content velocity.

## The Solution

I designed a publishing platform that transforms content creation from engineering projects into form submissions. The interface feels like writing an email but publishes to millions of users with sophisticated behavioral targeting.

{% carousel_with_caption [
  {"src":"LINO-0.png","alt":"Self-service publishing platform main interface"},
  {"src":"LINO-SIMPLE.png","alt":"Simplified content creation form view"},
  {"src":"LINO-EXPANDED.png","alt":"Expanded view with behavioral targeting options"}
] %}
Presenting: LINO, the self-service publishing UI
{% endcarousel_with_caption %}


Key innovations:

- **Visual Behavioral Targeting:** Drag-and-drop conditions replace code queries ("Show when user is in modeling AND hasn't used extrude AND idle 30 seconds")
- **WYSIWYG Editor with Live Preview:** See exactly how content appears in-product before publishing
- **Automated Publishing Pipeline:** Form submission triggers the entire technical process
- **Collaborative Review Workflow:** Draft → Review → Approved → Live with inline feedback
- **Safety Features:** Spell check, broken link detection, instant rollback capabilities

The breakthrough was making complex targeting visual. Content creators understand user behavior better than anyone—they just needed tools that spoke their language, not engineering's.

## Results & Impact

The transformation was immediate and measurable:

**Week One Results:**

- 12 new guidance tips published (vs. 3-4 per quarter previously)
- First same-day response to user feedback in product history
- Zero engineering tickets filed for content updates

**Quarterly Metrics:**

- **95% reduction** in publishing time (3-4 weeks → 2 hours)
- **200 hours** of engineering time reclaimed per quarter
- **40% increase** in guidance engagement
- **15% improvement** in trial-to-paid conversion (recovering the $6-8M opportunity)

**Long-term Value:**

- Saved $2M annually in engineering costs
- Democratized content creation across non-technical teams
- Enabled rapid A/B testing of guidance approaches
- Shifted engineering focus from manual tasks to platform improvements

Sarah summed up the impact: "I can finally respond to user problems in real time instead of adding them to next quarter's backlog."

## Reflection

This project reinforced that enterprise tools don't have to feel enterprise-y. Content creators needed professional capabilities delivered through consumer-grade experiences. The challenge wasn't simplifying their work but removing the technical barriers that prevented them from doing their best work.

The visual approach to behavioral targeting exceeded expectations. Rather than dumbing down the logic, the drag-and-drop interface actually made more sophisticated targeting accessible to people who understood user behavior better than engineers ever could.

Looking back, I wish I'd involved the engineering team earlier in the design process. While the final solution eliminated their publishing burden, earlier collaboration might have revealed additional automation opportunities.

The key learning: the best tools amplify human expertise rather than replacing it. Content creators didn't need AI to write their guidance—they needed technology to get out of their way so they could solve user problems as quickly as they could identify them. By removing process friction, we didn't just save time and money—we fundamentally changed how quickly Autodesk could respond to user needs.
