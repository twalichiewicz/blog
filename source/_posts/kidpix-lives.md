---
title: kidpix lives
date: 2024-06-18 22:29:51
short: true
---

<style>
	#hashtagContainer {
		width:100%;
		text-align:center;
	}
	#hashtagButton {
		background:none;
		border:none;
		font-size: 1.25rem;
		padding:0;
		margin:24px 0 24px 0;
		cursor: help !important;
	}
	img  {
		border:solid 6px white;
	}
</style>

[![](kidPix.png)](https://kidpix.app)


<div id="hashtagContainer">
<button id="hashtagButton"><b>#bringbackUISFX</b></button>
</div>

<audio id="oopsSound" src="/2024/06/18/kidpix-lives/oops2.wav.mp3"></audio>

<script>
	document.getElementById('hashtagButton').addEventListener('click', function() {
		var audio = document.getElementById('oopsSound');
		audio.play();
	});
</script>

