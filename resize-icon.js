import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const publicDir = path.join(__dirname, 'public');
const iconPath = path.join(publicDir, 'manifest-icon.png');

async function resizeIcon() {
  try {
    console.log('Resizing icon to PWA sizes...');
    
    // Resize to 192x192
    await sharp(iconPath)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(publicDir, 'icon-192x192.png'));
    console.log('✓ Created icon-192x192.png');

    // Resize to 512x512
    await sharp(iconPath)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(publicDir, 'icon-512x512.png'));
    console.log('✓ Created icon-512x512.png');
    
    console.log('Icon resizing complete!');
  } catch (error) {
    console.error('Error resizing icon:', error);
    process.exit(1);
  }
}

resizeIcon();
