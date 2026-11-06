import { NextResponse } from 'next/server';
import { fetchLiveSiteSettings } from '@/lib/siteSettings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await fetchLiveSiteSettings();
    return NextResponse.json({
      success: true,
      settings
    });
  } catch (err) {
    console.error('Error in /api/settings route:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve site settings' },
      { status: 500 }
    );
  }
}
