import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { StoreView } from '@/models/StoreView';
import { Store } from '@/models/Store';

// Function to get location data from IP (using free IP API)
async function getLocationFromIP(ip: string) {
  try {
    // Using ipapi.co free tier (1000 requests/day)
    const response = await fetch(`http://ipapi.co/${ip}/json/`);
    const data = await response.json();
    
    return {
      country: data.country_name,
      city: data.city,
      region: data.region,
      timezone: data.timezone,
    };
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { storeSlug, sessionId, landingPage, referrer } = await request.json();

    // Get client IP address (handles various deployment environments)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    console.log('👀 Tracking store view:', { storeSlug, sessionId, ip });

    // Find store by slug
    const store = await Store.findOne({ storeSlug, isPublic: true });
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    // Check if we already tracked this session in the last 30 minutes (unique visit)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const existingView = await StoreView.findOne({
      storeId: store._id,
      sessionId,
      createdAt: { $gte: thirtyMinutesAgo }
    });

    if (existingView) {
      console.log('🔄 Duplicate store view (same session within 30min)');
      return NextResponse.json(
        { message: 'View already tracked for this session' },
        { status: 200 }
      );
    }

    // Get location data (non-blocking)
    let locationData = {};
    if (ip && ip !== '127.0.0.1' && ip !== '::1') {
      try {
        locationData = await getLocationFromIP(ip) || {};
      } catch (error) {
        console.log('⚠️ Could not fetch location data');
      }
    }

    // Create store view record
    const storeView = await StoreView.create({
      storeId: store._id,
      sessionId,
      ipAddress: ip,
      userAgent,
      landingPage,
      referrer: referrer || 'Direct',
      ...locationData,
    });

    console.log('✅ Store view tracked:', {
      store: store.storeName,
      sessionId,
      country: locationData.country || 'Unknown'
    });

    return NextResponse.json(
      { 
        message: 'Store view tracked successfully',
        viewId: storeView._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Store view tracking error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method to fetch analytics data
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const storeSlug = searchParams.get('storeSlug');
    const timeRange = searchParams.get('timeRange') || '30days';

    if (!storeSlug) {
      return NextResponse.json(
        { error: 'Store slug is required' },
        { status: 400 }
      );
    }

    // Find store by slug
    const store = await Store.findOne({ storeSlug });
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      default: // 30 days
        startDate.setDate(now.getDate() - 30);
    }

    // Get store views data
    const storeViews = await StoreView.find({
      storeId: store._id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    // Calculate unique visitors (by session)
    const uniqueSessions = new Set(storeViews.map(view => view.sessionId));
    
    // Calculate views by country
    const viewsByCountry = storeViews.reduce((acc, view) => {
      const country = view.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate views by date (for chart)
    const viewsByDate = storeViews.reduce((acc, view) => {
      const date = view.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate referrers
    const viewsByReferrer = storeViews.reduce((acc, view) => {
      const referrer = view.referrer || 'Direct';
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const analyticsData = {
      totalViews: storeViews.length,
      uniqueVisitors: uniqueSessions.size,
      viewsByCountry: Object.entries(viewsByCountry)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10), // Top 10 countries
      viewsByDate: Object.entries(viewsByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      viewsByReferrer: Object.entries(viewsByReferrer)
        .map(([referrer, count]) => ({ referrer, count }))
        .sort((a, b) => b.count - a.count),
    };

    return NextResponse.json(
      { analytics: analyticsData },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Store views fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}