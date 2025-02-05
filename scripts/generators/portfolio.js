hexo.extend.generator.register('portfolio', function(locals) {
    return {
        path: 'portfolio/index.html',
        layout: ['portfolio', 'index'],
        data: {
            title: 'Portfolio',
            posts: locals.posts.filter(post => post.layout === 'portfolio')
        }
    };
});
