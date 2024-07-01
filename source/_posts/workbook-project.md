---
title: workbook project
date: 2024-06-30 14:07:00
short: true
---

<style>
	.image-container {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background-color: white;
	}
	img {
		max-width: 100%;
		max-height: 100%;
	}
	.controls {
		display: flex;
		justify-content: space-between;
		width: 100%;
		position: absolute;
		bottom: 12px;
	}
	button {
		padding: 12px 14px;
		border: none;
		border-radius: 100%;
		background-color: #000;
		color: white;
		cursor: pointer;
		font-size: 16px;
	}
	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}
</style>

<div class="image-container">
	<img id="image-viewer" src="https://thomas.design/blog/2024/06/30/workbook-project/00.jpeg" alt="Image Viewer">
	<div class="controls">
		<button id="prev" onclick="showPrev()" disabled="">←</button>
		<button id="next" onclick="showNext()">→</button>
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
		'055.jpeg',
		'056.jpeg',
		'057.jpeg',
		'058.jpeg',
		'059.jpeg',
		'060.jpeg',
		'061.jpeg',
		'062.jpeg',
		'063.jpeg',
		'064.jpeg',
		'065.jpeg',
		'066.jpeg',
		'067.jpeg',
		// Add more image filenames as needed
	];
	let currentIndex = 0;
	function showImage(index) {
		const imageViewer = document.getElementById('image-viewer');
		imageViewer.src = `https://thomas.design/blog/2024/06/30/workbook-project/${images[index]}`;
		document.getElementById('prev').disabled = index === 0;
		document.getElementById('next').disabled = index === images.length - 1;
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
	// Initialize the viewer with the first image
	showImage(currentIndex);
</script>
