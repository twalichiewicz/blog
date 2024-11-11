---
title: kidpix lives
date: 2024-06-18 22:29:51
short: true
---

<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js"></script>

<style>
    .kidpix-lives #hashtagContainer {
        width:100%;
        text-align:center;
    }
    .kidpix-lives #hashtagButton {
        background:none;
        border:none;
        font-size: 1.25rem;
        padding:0;
        margin:24px 0 24px 0;
        cursor: help !important;
    }
    .kidpix-lives #hashtagButton:hover {
        text-decoration: red underline wavy;
    }
    .kidpix-lives img  {
        border:solid 6px white;
        box-shadow: 0 3px 15px rgba(0,0,0,0.18);
    }
</style>

[![](kidPix.png)](https://kidpix.app)

<audio id="stampSound" src="https://thomas.design/blog/2024/06/19/kidpix-lives/stamp0.wav.mp3"></audio>


<div id="hashtagContainer">
<button id="hashtagButton" onclick="popConfetti(event)"><b>#bringbackUISFX</b></button>
</div>

<audio id="oopsSound" src="https://thomas.design/blog/2024/06/19/kidpix-lives/oops2.wav.mp3"></audio>

<script>
	document.getElementById('hashtagButton').addEventListener('click', function() {
		var audio = document.getElementById('oopsSound');
		audio.play();
	});

	var images = document.getElementsByTagName('img');
	for (var i = 0; i < images.length; i++) {
		images[i].addEventListener('click', function() {
			var audio = document.getElementById('stampSound');
			audio.play();
		});
	}

	function popConfetti(event) {
		// Get the button's bounding rectangle
		var rect = event.target.getBoundingClientRect();
		// Calculate the origin for the confetti
		var originX = (rect.left + rect.width / 2) / window.innerWidth;
		var originY = (rect.top + rect.height / 2) / window.innerHeight;

		// Fire the confetti
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { x: originX, y: originY }
		});
	}
</script>
