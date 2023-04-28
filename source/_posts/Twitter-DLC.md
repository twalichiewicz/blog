---
title: Twitter DLC
date: 2023-04-27 23:27:54
tags:
short: true
categories: 💬
---

Verified is to Twitter as <select id="metaphorPicker" default="" style="height: 21px; font-size: 14px; line-height: 21px; color: rgb(51,51,51);"><optgroup label="Shitty metaphors"><option id="cosmetics" value="video games">cosmetics</option><option id="skins" value="cars">trim packages</option><option id="hats" value="Team Fortress 2">hats</option></optgroup></select> are to <input type="text" id="selectedMetaphor" value="video games" style="border: none; font-size: 14px;color: rgb(51,51,51);" disabled>

How long until there is a Twitter cosmetic store?

<script>
	document.getElementById('metaphorPicker').onchange = function() {
		 document.getElementById('selectedMetaphor').value = this.value;
	};
</script>
