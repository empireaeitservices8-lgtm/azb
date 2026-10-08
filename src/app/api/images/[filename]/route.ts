import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  // Check public/images first
  const publicPath = path.join(process.cwd(), 'public', 'images', filename);
  if (fs.existsSync(publicPath)) {
    const buffer = fs.readFileSync(publicPath);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  }

  // Fallback to user uploaded paths
  const uploadedMap: Record<string, string> = {
    'shoe_shine_wipes.jpg': 'C:/Users/SONA/.gemini/antigravity-ide/brain/e42121a6-72a8-4e36-a182-1238949c8196/.user_uploaded/media_1791455345834.jpg',
    'shoe_shine_wipes_banner.jpg': 'C:/Users/SONA/.gemini/antigravity-ide/brain/e42121a6-72a8-4e36-a182-1238949c8196/.user_uploaded/media_1791455356755.jpg',
    'laundry_pod.jpg': 'C:/Users/SONA/.gemini/antigravity-ide/brain/e42121a6-72a8-4e36-a182-1238949c8196/.user_uploaded/media_1791455367955.jpg',
    'laundry_pod_banner.jpg': 'C:/Users/SONA/.gemini/antigravity-ide/brain/e42121a6-72a8-4e36-a182-1238949c8196/.user_uploaded/media_1791455452731.jpg',
  };

  const uploadPath = uploadedMap[filename];
  if (uploadPath && fs.existsSync(uploadPath)) {
    const buffer = fs.readFileSync(uploadPath);
    // Also copy to public/images
    try {
      const publicDir = path.join(process.cwd(), 'public', 'images');
      if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
      fs.writeFileSync(publicPath, buffer);
    } catch {}

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  }

  return new NextResponse('Image not found', { status: 404 });
}
