const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const outputDir = path.join(__dirname, 'assets-compressed');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function compressImage(inputPath, outputPath, filename) {
    const ext = path.extname(filename).toLowerCase();
    const stats = fs.statSync(inputPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`Processing: ${filename} (${sizeMB} MB)`);

    try {
        let pipeline = sharp(inputPath);

        // Get image metadata
        const metadata = await pipeline.metadata();

        // Resize if image is very large (max 1920px width for hero, 800px for others)
        let maxWidth = filename.includes('red') || filename.includes('black') ? 1920 : 800;
        if (metadata.width > maxWidth) {
            pipeline = pipeline.resize(maxWidth, null, {
                withoutEnlargement: true,
                fit: 'inside'
            });
        }

        if (ext === '.webp') {
            // Compress WebP with high quality
            await pipeline
                .webp({ quality: 75, effort: 6 })
                .toFile(outputPath);
        } else if (ext === '.png') {
            // Convert PNG to WebP for better compression
            const webpOutput = outputPath.replace('.png', '.webp');
            await pipeline
                .webp({ quality: 80, effort: 6 })
                .toFile(webpOutput);

            // Also create optimized PNG
            await sharp(inputPath)
                .resize(maxWidth, null, { withoutEnlargement: true, fit: 'inside' })
                .png({ quality: 80, compressionLevel: 9 })
                .toFile(outputPath);
        } else if (ext === '.jpg' || ext === '.jpeg') {
            await pipeline
                .jpeg({ quality: 80, progressive: true })
                .toFile(outputPath);
        }

        const newStats = fs.statSync(outputPath);
        const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2);
        const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);

        console.log(`  ✓ Compressed: ${newSizeMB} MB (${savings}% smaller)`);

    } catch (err) {
        console.error(`  ✗ Error processing ${filename}:`, err.message);
    }
}

async function main() {
    console.log('Starting image compression...\n');

    const files = fs.readdirSync(assetsDir);
    const imageFiles = files.filter(f =>
        ['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(f).toLowerCase())
    );

    for (const file of imageFiles) {
        const inputPath = path.join(assetsDir, file);
        const outputPath = path.join(outputDir, file);
        await compressImage(inputPath, outputPath, file);
    }

    console.log('\n✓ All images compressed!');
    console.log(`Output folder: ${outputDir}`);
    console.log('\nReplace your assets folder with assets-compressed folder.');
}

main();
