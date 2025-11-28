import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Store } from '@/models/Store';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Store slug is required' },
        { status: 400 }
      );
    }

    const store = await Store.findOne({ 
      storeSlug: slug,
      isPublic: true 
    }).select('storeName whatsappNumber currency');

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ store });
  } catch (error: any) {
    console.error('Store fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}