---
title: apple intelligence writing UI
date: 2024-07-30 07:54:40
short: true
tags:
  - blog
---

<style>
    .alert {
    align-items: center;
  }
  #divider {
    height: 45px;
    width: 1px;
    margin: 0 12px;
  }
 #toggleIcon {
   background: none;
   border: none;
   box-shadow: none;
 }
</style>

![A screenshot showing a Apple Intelligence Writing UI](/2024/07/30/apple-intelligence-writing-UI/appleAIWritingUI.png)

<div class="alert">
    <span id="textSpan" class="alert__content"></span>
 <hr id="divider"/>
    <button id="toggleIcon" aria-label="Show another quote">
        🔄
    </button>
</div>

<script>
    const texts = [
        "Ah, yes, the 'let's cram everything into one tiny box' approach.",
        "A design so sleek, it's nearly impossible to figure out what's happening.",
        "Who needs clear labels when you have tiny, confusing icons?",
        "Because squinting at my screen is exactly what I wanted to do today."
    ];
    let usedTexts = [];

    function getRandomText() {
        if (usedTexts.length === texts.length) {
            usedTexts = [];
        }
        let availableTexts = texts.filter(text => !usedTexts.includes(text));
        let randomText = availableTexts[Math.floor(Math.random() * availableTexts.length)];
        usedTexts.push(randomText);
        return randomText;
    }

    function updateText() {
        const textSpan = document.getElementById('textSpan');
        textSpan.style.opacity = '0';

        setTimeout(() => {
            textSpan.innerText = getRandomText();
            textSpan.style.opacity = '1';
        }, 200);
    }

    document.getElementById('toggleIcon').addEventListener('click', updateText);

    // Set initial text when page loads
    window.addEventListener('load', updateText);
</script>

<style>
#textSpan {
    transition: opacity 0.2s ease;
}

#toggleIcon {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--text-color);
    display: flex;
    align-items: center;
    transition: transform 0.2s ease;
}

#toggleIcon:hover {
    transform: rotate(45deg);
}
</style>
