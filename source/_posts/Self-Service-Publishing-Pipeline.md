---
title: Self-Service Publishing Pipeline
date: 2020-01-21
company: Autodesk
byline: Designed a self-service platform to empower teams to publish user-facing "Insights" and guidance content
tags:
  - portfolio
layout: project_gallery
has_writeup: true
cover_image: /2020/01/21/Self-Service-Publishing-Pipeline/sspp_cover.jpg
summary:
  problem:
    content: "Autodesk's smart support system could monitor user behavior and deliver contextual guidance, but publishing new content required full engineering cycles. Every tutorial, efficiency tip, or onboarding flow needed scheduled meetings, resource allocation, wiki documentation, and cross-team coordination. This meant intelligent features that could help millions of users were bottlenecked by a process designed for major feature releases."
  solution:
    content: "I designed a self-service publishing platform that transforms content creation from engineering projects into simple form submissions. Content creators can now build contextual guidance using a WYSIWYG editor, see live previews, and publish directly to millions of users—all without touching code."
  innovation:
    title: "Engineering-to-Form Transformation"
    bullets:
      - "<strong>Process Mapping:</strong> Analyzed the entire stakeholder lifecycle for creating one 'Insight' and automated every step"
      - "<strong>WYSIWYG Content Builder:</strong> Live preview editor that shows exactly how content will appear in-product"
      - "<strong>Automated Publishing Pipeline:</strong> Form submission triggers the entire technical process that previously required engineering coordination"
      - "<strong>Smart Context Targeting:</strong> Content automatically surfaces to relevant users based on behavioral monitoring"
      - "<strong>Semi-Autonomous Publication:</strong> Built-in review workflows with rollback capabilities eliminate dev dependency"
  impact:
    bullets:
      - "Reduced content publishing time by 60% (weeks to hours)"
      - "Democratized content creation across non-technical teams"
      - "Eliminated engineering bottlenecks for contextual guidance features"
      - "Enabled rapid iteration on user onboarding and support experiences"
      - "Scaled intelligent assistance to millions of users through streamlined content pipeline"
---

## Content creators trapped by engineering cycles

Sarah, a content designer on our team, had identified exactly when users were struggling with a specific workflow. She knew the perfect tutorial to help them, but publishing it meant filing a development ticket, scheduling meetings with three different teams, waiting for engineering resources, and hoping nothing got lost in translation during the handoff process.

> "I can see exactly what users need help with," she told me during research, "but by the time we publish the solution, they've already given up or figured it out themselves."

This was the reality across Autodesk's content teams. Our smart guidance system could detect user struggles and deliver contextual help, but creating that help required treating every tutorial like a software feature—complete with engineering sprints, QA cycles, and release schedules.

I mapped the complete workflow and discovered it took eight people across four teams to publish a single guidance tip. A process that should take hours was taking 3-4 weeks, during which user problems went unaddressed.

## Mapping the bottleneck

During stakeholder interviews, I uncovered the real friction points. Content creators weren't just frustrated by delays—they were making compromises because the process was so cumbersome. Instead of creating targeted, specific guidance, teams were batching requests into generic content that worked for multiple scenarios.

> "We end up writing one tutorial that sort of helps everyone instead of three tutorials that perfectly help different user types," explained James, a senior content strategist.

The technical audit revealed something interesting: our smart guidance platform was already sophisticated enough to handle dynamic content and behavioral targeting. The bottleneck wasn't technical capability but the publishing interface, which required engineering knowledge to operate.

I prototyped a simplified content creation flow and tested it with five content creators. Within minutes, they were building guidance that would have taken weeks through the old process. The key insight: they didn't need technical training—they needed technical complexity hidden behind intuitive interfaces.

## Making complex targeting feel simple

I designed a content editor that feels like writing an email but publishes to millions of users. The interface shows a live preview of exactly how content will appear within product interfaces, eliminating the guesswork that led to multiple revision cycles.

The breakthrough was making behavioral targeting visual rather than technical. Instead of writing code queries, content creators drag and drop conditions: "Show this when users are in the modeling workspace AND haven't used the extrude tool AND have been idle for 30 seconds." The system translates these visual rules into the complex logic our platform requires.

For the publishing workflow, I created a status system that mirrors familiar document collaboration patterns. Content moves through "Draft → Review → Approved → Live" stages with clear handoffs and automatic notifications. Reviewers can provide feedback directly on the preview interface, and creators can make edits without losing context.

The safety features were crucial for adoption. Built-in spell check, broken link detection, and content guidelines prevent common errors. A rollback system lets anyone unpublish problematic content instantly, removing the fear that kept teams dependent on engineering oversight.

## From quarterly releases to real-time publishing

The first week after launch, our content team published twelve new guidance tips—more than they'd published in the previous quarter. Sarah, the content designer from my research, told me: "I can finally respond to user feedback in real time instead of adding it to next quarter's backlog."

Content iteration cycles shortened dramatically. When user research revealed confusion about a specific feature, teams could test different guidance approaches within days rather than planning multi-sprint development work. This led to better solutions and more confident content decisions.

The engineering team reclaimed an estimated 200 hours per quarter previously spent on content publishing tasks. They could focus on platform improvements while content creators took full ownership of the user guidance experience.

Usage metrics showed the impact: contextual guidance engagement increased 40% as content became more relevant and timely. More importantly, user feedback shifted from requesting missing help to suggesting improvements to existing guidance—a sign that coverage was finally keeping pace with user needs.

## Amplifying expertise, not replacing it

This project taught me that enterprise tools don't have to feel enterprisey. Content creators needed professional capabilities delivered through consumer-grade experiences. The challenge wasn't simplifying their work but removing the technical barriers that prevented them from doing their best work.

The visual approach to behavioral targeting surprised me with its effectiveness. Rather than dumbing down the logic, the drag-and-drop interface actually made more sophisticated targeting accessible to people who understood user behavior better than anyone else.

Looking back, I wish I'd involved the engineering team earlier in the design process. While the final solution worked well, earlier collaboration might have revealed additional automation opportunities that could have made the system even more powerful.

The project reinforced my belief that the best tools amplify human expertise rather than replacing it. Content creators didn't need AI to write their guidance—they needed technology to get out of their way so they could solve user problems as quickly as they could identify them.
