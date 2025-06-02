---
title: Kid Pix js
date: 2024-06-18 22:29:51
type: link
url: https://kidpix.app
url_label: via kidpix.app
short: true
tags:
  - blog
---

<style>
 #hashtagContainer {
  width: 100%;
  text-align: center;
 }

 #hashtagButton {
  background: #776a5a;
  border: none;
  width: 100%;
  color: currentColor;
  text-align: center;
  justify-content: center;
 }
</style>

<div id="hashtagContainer">
  <button id="hashtagButton" onclick="popConfetti(event)">#bringbackUISFX</button>
</div>

<script type="module">
 import confetti from 'canvas-confetti';

 // Make confetti available globally for the onclick handler
 window.confetti = confetti;

 const hashtagButton = document.querySelector('.kidpix-lives #hashtagButton');
 if (hashtagButton) {
  hashtagButton.addEventListener('click', function() {
   var audio = document.querySelector('.kidpix-lives #oopsSound');
   if (audio) {
    audio.play();
   }
  });
 }

 var images = document.querySelectorAll('.kidpix-lives img');
 for (var i = 0; i < images.length; i++) {
  images[i].addEventListener('click', function() {
   var audio = document.querySelector('.kidpix-lives #stampSound');
   audio.play();
  });
 }

 window.popConfetti = function(event) {
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
