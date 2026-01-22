'use strict';

const fs = require('fs/promises');
const path = require('path');

function hasWaresTag(post) {
	if (!post || !post.tags) return false;
	const tags = post.tags.toArray ? post.tags.toArray() : post.tags;
	if (!Array.isArray(tags)) return false;
	return tags.some(tag => (tag && tag.name) ? tag.name === 'wares' : tag === 'wares');
}

async function copyDirIfExists(sourceDir, destDir) {
	try {
		const stat = await fs.stat(sourceDir);
		if (!stat.isDirectory()) return;
		await fs.mkdir(destDir, { recursive: true });
		await fs.cp(sourceDir, destDir, { recursive: true });
	} catch (error) {
		// Ignore missing directories; surface other errors in debug mode.
		if (error && error.code !== 'ENOENT') {
			console.warn('[copy-ware-assets] Failed to copy assets:', sourceDir, '->', destDir, error.message);
		}
	}
}

hexo.extend.filter.register('after_generate', async () => {
	const posts = hexo.locals.get('posts').toArray();
	const waresPosts = posts.filter(post => post.layout === 'ware' || hasWaresTag(post));

	await Promise.all(waresPosts.map(async (post) => {
		if (!post || !post.source) return;

		const sourcePath = path.join(hexo.source_dir, post.source);
		const assetDir = sourcePath.replace(/\.[^/.]+$/, '');
		const outputPath = post.path || '';
		const outputDir = outputPath.endsWith('.html')
			? path.join(hexo.public_dir, path.dirname(outputPath))
			: path.join(hexo.public_dir, outputPath);

		await copyDirIfExists(assetDir, outputDir);
	}));
});
