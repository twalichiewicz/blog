---
title: Workbook
display_name: "Visual Thinking Archive"
display_description: "Another notebook filled with design explorations and discoveries"
date: 2024-06-30 14:07:00
short: true
draft: true
tags:
  - portfolio
layout: project
---

<style>
    .workbook-project .image-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 522px;
        max-height: 80vh;
        background-color: white;
        margin-top: 12px;
        transition: height 0.3s ease;
        overflow: hidden; /* Hide the scrollbar */
        height: auto;
    }
    .workbook-project img {
        max-width: 100%;
        max-height: 100% !important;
        border: none !important;
        box-shadow: none !important;
    }
    .workbook-project .controls {
        touch-action: manipulation;
        display: flex;
        justify-content: space-between;
        width: 100%;
        position: absolute;
        bottom: 12px;
    }
    .workbook-project button {
        padding: 12px 14px;
        border: none;
        border-radius: 1rem;
        background-color: #000;
        color: white;
        cursor: pointer;
        font-size: 16px;
        margin: auto 12px;
        font-size: 24px;
    }
    .workbook-project button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
    .workbook-project #grid-view {
        display: none;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
        overflow-y: auto; /* Allow scrolling in grid view */
    }
    .workbook-project .grid-item {
        margin: 5px;
        cursor: pointer;
    }
    .workbook-project .grid-item img {
        width: 100px;
        height: 100px;
        object-fit: cover;
    }
    .workbook-project #toggle-view {
        touch-action: manipulation;
        position: relative;
        padding: 3px 6px;
        border: none;
        background-color: transparent;
        color: grey;
        cursor: pointer;
        font-size: 12px;
        border-radius: 5px;
        text-transform: uppercase;
        font-weight: 500;
        text-align: center;
        display: block;
        margin: 12px auto;
    }
    .workbook-project .show-shadow {
        text-shadow: 0 3px 10px rgba(0, 0, 0, 1);
    }
</style>

<div class="workbook-project">
    <div class="image-container" id="image-container">
        <img id="image-viewer" src="https://thomas.design/blog/2024/06/30/workbook-project/00.jpeg" alt="Image Viewer">
        <div class="controls">
            <button id="prev" onclick="showPrev()" disabled="">←</button>
            <button id="next" onclick="showNext()">→</button>
        </div>
        <div id="grid-view"></div>
    </div>
    <button id="toggle-view" onclick="toggleView()">Grid View</button>
    <div>
        <p style="text-align: center;">
            Another notebook down.
        </p>
        <p id="hidden-text" class="hidden-text" style="text-align: center;">
            Made you look.
        </p>
    </div>
</div>

<script>
    const images = [
        '00.jpeg',
        '01.jpeg',
        '02.jpeg',
        '03.jpeg',
        '04.jpeg',
        '05.jpeg',
        '06.jpeg',
        '07.jpeg',
        '08.jpeg',
        '09.jpeg',
        '010.jpeg',
        '011.jpeg',
        '012.jpeg',
        '013.jpeg',
        '014.jpeg',
        '015.jpeg',
        '016.jpeg',
        '017.jpeg',
        '018.jpeg',
        '019.jpeg',
        '020.jpeg',
        '021.jpeg',
        '022.jpeg',
        '023.jpeg',
        '024.jpeg',
        '025.jpeg',
        '026.jpeg',
        '027.jpeg',
        '028.jpeg',
        '029.jpeg',
        '030.jpeg',
        '031.jpeg',
        '032.jpeg',
        '033.jpeg',
        '034.jpeg',
        '035.jpeg',
        '036.jpeg',
        '037.jpeg',
        '038.jpeg',
        '039.jpeg',
        '040.jpeg',
        '041.jpeg',
        '042.jpeg',
        '043.jpeg',
        '044.jpeg',
        '045.jpeg',
        '046.jpeg',
        '047.jpeg',
        '048.jpeg',
        '049.jpeg',
        '050.jpeg',
        '051.jpeg',
        '052.jpeg',
        '053.jpeg',
        '054.jpeg',
        // Add more image filenames as needed
    ];
    let currentIndex = 0;
    let containerHeight = 0;

    function showImage(index) {
        const imageViewer = document.getElementById('image-viewer');
        const imageContainer = document.getElementById('image-container');
        const hiddenText = document.getElementById('hidden-text');
        imageViewer.src = `https://thomas.design/blog/2024/06/30/workbook-project/${images[index]}`;
        document.getElementById('prev').disabled = index === 0;
        document.getElementById('next').disabled = index === images.length - 1;
        imageViewer.onload = () => {
            containerHeight = imageContainer.clientHeight;
            document.getElementById('image-container').style.height = `${containerHeight}px`;
        };
        if (images[index] === '054.jpeg') {
            hiddenText.classList.add('show');
        }
    }

    function showPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            showImage(currentIndex);
        }
    }

    function showNext() {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            showImage(currentIndex);
        }
    }

    function createGrid() {
        const gridView = document.getElementById('grid-view');
        gridView.innerHTML = '';
        images.forEach((img, index) => {
            const div = document.createElement('div');
            div.classList.add('grid-item');
            div.onclick = () => {
                currentIndex = index;
                // Cache the height before switching
                containerHeight = document.getElementById('image-container').clientHeight;
                toggleView();
                showImage(currentIndex);
            };
            const image = document.createElement('img');
            image.src = `https://thomas.design/blog/2024/06/30/workbook-project/${img}`;
            div.appendChild(image);
            gridView.appendChild(div);
        });
    }

    function toggleView() {
        const imageView = document.getElementById('image-viewer');
        const controls = document.querySelector('.controls');
        const gridView = document.getElementById('grid-view');
        const toggleButton = document.getElementById('toggle-view');
        const imageContainer = document.getElementById('image-container');

        // Fade out text
        toggleButton.style.opacity = '0';
        setTimeout(() => {
            if (gridView.style.display === 'none' || !gridView.style.display) {
                gridView.style.display = 'flex';
                imageView.style.display = 'none';
                controls.style.display = 'none';
                imageContainer.style.overflowY = 'auto'; /* Enable scrollbar in grid view */
                imageContainer.style.height = `${containerHeight}px`;
                toggleButton.innerText = 'Single View';
            } else {
                gridView.style.display = 'none';
                imageView.style.display = 'block';
                controls.style.display = 'flex';
                showImage(currentIndex);  // Recalculate the height of the image container
                toggleButton.innerText = 'Grid View';
            }
            // Fade in text with shadow
            toggleButton.style.opacity = '1';
            toggleButton.classList.add('show-shadow');
            setTimeout(() => {
                toggleButton.classList.remove('show-shadow');
            }, 600);
        }, 300);
    }

    // Initialize the viewer with the first image and create the grid
    showImage(currentIndex);
    createGrid();
</script>
