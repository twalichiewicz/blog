---
title: testla cyberfuck
date: 2023-12-10 00:23:30
short: true
---

Via [Reuters](https://www.reuters.com/business/autos-transportation/tesla-cybertrucks-stiff-structure-sharp-design-raise-safety-concerns-experts-2023-12-08/):

> "A vehicle of this size, power and huge weight will be lethal to pedestrians and cyclists in a collision," the Brussels-based nonprofit European Transport Safety Council said in a statement.

[hmm.](https://thomas.design/blog/2023/08/24/cyberstupid/)

<p>
<b>Days without incident:</b> <span id="days"></span>
</p>

<script>
	var currentTime = new Date();
	let newMsec = Date.parse(currentTime);
	let eventMsec = Date.parse("November 28, 2023");
	var difference = Math.round(newMsec - eventMsec);
	var daysSinceEvent = Math.round(difference/86400000);
	document.querySelector('#days').innerHTML = daysSinceEvent;
</script>
