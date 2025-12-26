---
title: ':near CSS class'
author: Thomas Walichiewicz
tags:
  - blog
short: true
date: 2025-12-26 13:52:53
subtitle:
cover_image:
---

`:near` should be added as a pseudoclass in the CSS specification. Proximity-based styling would be a great addition to the affordance toolkit of designers.  

We actually see this pattern fairly regularly in consumer electronics: you'll bring your hand near a set of controls and either the display will update, the button will glow brighter, etc.

Example:
`
button:near(200px){
	border: solid 1px black;
}
`


**Update:** https://github.com/w3c/csswg-drafts/issues/13271
