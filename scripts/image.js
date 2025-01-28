hexo.extend.tag.register('image', function(args) {
    const src = hexo.route.get(args[0]);
    const alt = args[1] || '';
    return `
        <div class="image-container">
            <img src="${src}" alt="${alt}" class="clickable-image">
        </div>
    `;
}, { ends: false });