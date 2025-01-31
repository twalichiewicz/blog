---
title: apple intelligence writing UI
date: 2024-07-30 07:54:40
short: true
---

<style>
    .apple-intelligence-writing-ui #textSpan {
        display: flex;
        flex-direction: column;
        font-size: 15px;
        margin-top: 24px;
        text-align: center;
        width: 100%;
    }
    .apple-intelligence-writing-ui #toggleIcon {
        border: solid 1px rgba(0,0,0,0.3);
        padding: 3px;
        border-radius: 100%;
        margin-top: 24px;
        margin-left: auto;
        margin-right: auto;
        cursor: pointer;
          color: blue;
          display: inline-block;
          transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        width: 24px;
        height: 24px;
        user-select: none;
    }
    .apple-intelligence-writing-ui .disabled {
      pointer-events: none;
      opacity: 0.3;
      transition: all 150ms ease;
    }
</style>

![](appleAIWritingUI.png)

<span id="textSpan">So intuitive, you’ll spend more time finding the right button than writing.
<span id="toggleIcon" class="toggle-icon">![](refresh.png)</span></span>
<script>
    const texts = [
     "Ah, yes, the 'let's cram everything into one tiny box' approach.",
     "A design so sleek, it’s nearly impossible to figure out what’s happening.",
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
    document.getElementById('toggleIcon').addEventListener('click', function() {
        document.getElementById('textSpan').innerText = getRandomText();
    });
</script>
