import fs from 'fs';
import path from 'path';

export function ensureImages() {
  const images = [
    {
      src: 'C:/Users/SONA/.gemini/antigravity-ide/brain/e42121a6-72a8-4e36-a182-1238949c8196/.user_uploaded/media_1791455345834.jpg',
      dest: 'shoe_shine_wipes.jpg'
    },
    {
      src: 'C:/Users/SONA/.gemini/antigravity-ide/brain/e42121a6-72a8-4e36-a182-1238949c8196/.user_uploaded/media_1791455356755.jpg',
      dest: 'shoe_shine_wipes_banner.jpg'
    },
    {
      src: 'C:/Users/SONA/.gemini/antigravity-ide/brain/e42121a6-72a8-4e36-a182-1238949c8196/.user_uploaded/media_1791455367955.jpg',
      dest: 'laundry_pod.jpg'
    },
    {
      src: 'C:/Users/SONA/.gemini/antigravity-ide/brain/e42121a6-72a8-4e36-a182-1238949c8196/.user_uploaded/media_1791455452731.jpg',
      dest: 'laundry_pod_banner.jpg'
    }
  ];

  try {
    const targetDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    for (const img of images) {
      const destPath = path.join(targetDir, img.dest);
      if (fs.existsSync(img.src)) {
        fs.copyFileSync(img.src, destPath);
      }
    }
  } catch (err) {
    console.error('Failed to sync images:', err);
  }
}
