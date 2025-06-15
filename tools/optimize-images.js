const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

class ImageOptimizer {
	constructor() {
		this.sourceDir = 'source';
		this.outputDir = 'source';
		this.stats = {
			processed: 0,
			originalSize: 0,
			optimizedSize: 0,
			errors: 0
		};
	}

	async optimize() {
		console.log('🖼️  Starting image optimization...');

		try {
			// Find all images in source directory
			const imageFiles = await this.findImages();
			console.log(`Found ${imageFiles.length} images to optimize`);

			// Process images in batches to avoid memory issues
			const batchSize = 5;
			for (let i = 0; i < imageFiles.length; i += batchSize) {
				const batch = imageFiles.slice(i, i + batchSize);
				await Promise.all(batch.map(file => this.processImage(file)));
			}

			this.printStats();
		} catch (error) {
			console.error('❌ Optimization failed:', error);
			process.exit(1);
		}
	}

	async findImages() {
		try {
			// Skip GIF files as they're not optimized by sharp and can be very large
			return await glob(`${this.sourceDir}/**/*.{jpg,jpeg,png}`);
		} catch (error) {
			throw new Error(`Error finding images: ${error.message}`);
		}
	}

	async processImage(filePath) {
		try {
			const originalStats = await fs.stat(filePath);
			const originalSize = originalStats.size;

			// Skip if already very small
			if (originalSize < 10 * 1024) {
				console.log(`⏭️  Skipping small file: ${filePath}`);
				return;
			}

			const ext = path.extname(filePath).toLowerCase();
			const dir = path.dirname(filePath);
			const basename = path.basename(filePath, ext);

			// Create optimized version
			const image = sharp(filePath);
			const metadata = await image.metadata();

			// Skip if dimensions are reasonable and file is already small
			if (metadata.width <= 1920 && metadata.height <= 1080 && originalSize < 500 * 1024) {
				console.log(`⏭️  Skipping reasonably sized file: ${filePath}`);
				return;
			}

			let outputBuffer;

			if (ext === '.png' && originalSize > 100 * 1024) {
				// Optimize PNG
				outputBuffer = await image
					.png({
						quality: 85,
						compressionLevel: 9,
						progressive: true
					})
					.toBuffer();
			} else if (['.jpg', '.jpeg'].includes(ext)) {
				// Optimize JPEG
				outputBuffer = await image
					.jpeg({
						quality: 85,
						progressive: true,
						mozjpeg: true
					})
					.toBuffer();
			} else {
				console.log(`⏭️  Skipping unsupported format: ${filePath}`);
				return;
			}

			// Only replace if the optimized version is smaller
			if (outputBuffer.length < originalSize) {
				await fs.writeFile(filePath, outputBuffer);

				const savedBytes = originalSize - outputBuffer.length;
				const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

				console.log(`✅ ${filePath}: ${this.formatBytes(originalSize)} → ${this.formatBytes(outputBuffer.length)} (${savedPercent}% smaller)`);

				this.stats.originalSize += originalSize;
				this.stats.optimizedSize += outputBuffer.length;
			} else {
				console.log(`⏭️  No improvement for: ${filePath}`);
				this.stats.originalSize += originalSize;
				this.stats.optimizedSize += originalSize;
			}

			this.stats.processed++;

		} catch (error) {
			console.error(`❌ Error processing ${filePath}:`, error.message);
			this.stats.errors++;
		}
	}

	formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	printStats() {
		const savedBytes = this.stats.originalSize - this.stats.optimizedSize;
		const savedPercent = this.stats.originalSize > 0
			? ((savedBytes / this.stats.originalSize) * 100).toFixed(1)
			: 0;

		console.log('\n📊 Optimization Results:');
		console.log(`   Files processed: ${this.stats.processed}`);
		console.log(`   Original size: ${this.formatBytes(this.stats.originalSize)}`);
		console.log(`   Optimized size: ${this.formatBytes(this.stats.optimizedSize)}`);
		console.log(`   Space saved: ${this.formatBytes(savedBytes)} (${savedPercent}%)`);
		console.log(`   Errors: ${this.stats.errors}`);
	}
}

// Add glob dependency check
try {
	require.resolve('glob');
} catch (e) {
	console.error('❌ Missing dependency: glob');
	console.log('Please run: npm install --save-dev glob');
	process.exit(1);
}

if (require.main === module) {
	const optimizer = new ImageOptimizer();
	optimizer.optimize();
}

module.exports = ImageOptimizer; 