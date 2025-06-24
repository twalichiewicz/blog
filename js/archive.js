document.getElementById('show-all').addEventListener('click', function() {
	document.querySelectorAll('.post-list-item').forEach(item => item.style.display = 'block');
	setActiveButton(this);
});

document.getElementById('show-blog').addEventListener('click', function() {
	document.querySelectorAll('.post-list-item').forEach(item => {
		if (item.classList.contains('blog')) {
			item.style.display = 'block';
		} else {
			item.style.display = 'none';
		}
	});
	setActiveButton(this);
});

document.getElementById('show-portfolio').addEventListener('click', function() {
	document.querySelectorAll('.post-list-item').forEach(item => {
		if (item.classList.contains('portfolio')) {
			item.style.display = 'block';
		} else {
			item.style.display = 'none';
		}
	});
	setActiveButton(this);
});

function setActiveButton(button) {
	document.querySelectorAll('.archive-toggle button').forEach(btn => btn.classList.remove('active'));
	button.classList.add('active');
}

function loadPost(path) {
	fetch(path)
		.then(response => response.text())
		.then(html => {
			document.getElementById('post-details').innerHTML = html;
			});
}