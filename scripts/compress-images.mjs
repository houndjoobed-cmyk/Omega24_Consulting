/**
 * Script de compression et optimisation des images Hero
 * Réduit les images de 6-14 MB vers ~200-400 KB en WebP
 * 
 * Usage: node scripts/compress-images.mjs
 */

import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT_DIR = join(__dirname, '../src/assets');
const OUTPUT_DIR = join(__dirname, '../src/assets/optimized');

// Créer le dossier de sortie s'il n'existe pas
if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const files = readdirSync(INPUT_DIR).filter(f => {
    const ext = extname(f).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext);
});

console.log(`\n🖼️  ${files.length} images trouvées à optimiser...\n`);

let totalSavedBytes = 0;

for (const file of files) {
    const inputPath = join(INPUT_DIR, file);
    const nameWithoutExt = basename(file, extname(file));
    const outputPath = join(OUTPUT_DIR, `${nameWithoutExt}.webp`);

    try {
        const inputStats = (await import('fs')).statSync(inputPath);
        const inputSizeKB = Math.round(inputStats.size / 1024);

        await sharp(inputPath)
            .resize({
                width: 1920,       // Max largeur pour un écran full HD
                height: 1080,      // Max hauteur
                fit: 'inside',     // Garder le ratio
                withoutEnlargement: true,
            })
            .webp({
                quality: 82,       // Bonne qualité visuelle
                effort: 6,         // Compression maximale (0-6)
            })
            .toFile(outputPath);

        const outputStats = (await import('fs')).statSync(outputPath);
        const outputSizeKB = Math.round(outputStats.size / 1024);
        const savedKB = inputSizeKB - outputSizeKB;
        totalSavedBytes += savedKB * 1024;

        const reduction = Math.round((savedKB / inputSizeKB) * 100);
        console.log(`✅ ${file}`);
        console.log(`   ${inputSizeKB} KB → ${outputSizeKB} KB (-${reduction}%)`);
        console.log(`   → ${outputPath}\n`);
    } catch (err) {
        console.error(`❌ Erreur sur ${file}:`, err.message);
    }
}

const totalSavedMB = (totalSavedBytes / (1024 * 1024)).toFixed(1);
console.log(`\n🎉 Terminé ! Espace économisé : ~${totalSavedMB} MB`);
console.log('\n📌 Prochaine étape :');
console.log('   Remplacez les imports dans Hero.tsx par les versions .webp dans /optimized/\n');
