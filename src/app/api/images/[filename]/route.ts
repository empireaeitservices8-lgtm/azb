import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  // Check public/images
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

  return new NextResponse('Image not found', { status: 404 });
}
