---
title: apple intelligence writing UI
date: 2024-07-30 07:54:40
short: true
tags:
  - blog
---

![A screenshot showing a Apple Intelligence Writing UI](/2024/07/30/apple-intelligence-writing-UI/appleAIWritingUI.png)

<div class="alert">
    <span id="textSpan" class="alert__content"></span>
    <button id="toggleIcon" aria-label="Show another quote">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M2 12C2 6.47715 6.47715 2 12 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 3"/>
            <path d="M2 4L5 7M5 7L8 4M5 7V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
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
