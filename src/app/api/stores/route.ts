import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import { Store } from '@/models/Store';
import { User } from '@/models/User';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find user by email
    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already has a store
    const existingStore = await Store.findOne({ userId: user._id });
    if (existingStore) {
      return NextResponse.json(
        { error: 'Store already exists for this user' },
        { status: 400 }
      );
    }

    const { storeName, storeSlug, storeDescription, currency, welcomeMessage, contactEmail, storeAddress, whatsappNumber } = await request.json();

    // Check if slug is already taken
    const existingSlug = await Store.findOne({ storeSlug });
    if (existingSlug) {
      return NextResponse.json(
        { error: 'Store URL slug is already taken. Please choose a different one.' },
        { status: 400 }
      );
    }

    // Validate WhatsApp number format (basic validation)
    if (!whatsappNumber || !whatsappNumber.trim()) {
      return NextResponse.json(
        { error: 'WhatsApp number is required' },
        { status: 400 }
      );
    }

    // Clean WhatsApp number (remove spaces, dashes, parentheses, etc.)
    const cleanWhatsAppNumber = whatsappNumber.replace(/[\s\-\(\)\+]/g, '');

    // Basic WhatsApp number validation (should contain only digits after cleaning)
    if (!/^\d+$/.test(cleanWhatsAppNumber)) {
      return NextResponse.json(
        { error: 'Please enter a valid WhatsApp number with digits only' },
        { status: 400 }
      );
    }

    // Check if WhatsApp number is already used by another store
    const existingWhatsApp = await Store.findOne({ whatsappNumber: cleanWhatsAppNumber });
    if (existingWhatsApp) {
      return NextResponse.json(
        { error: 'This WhatsApp number is already registered with another store' },
        { status: 400 }
      );
    }

    // Create new store
    const store = await Store.create({
      userId: user._id,
      storeName,
      storeSlug,
      storeDescription,
      currency,
      welcomeMessage,
      contactEmail: contactEmail || undefined,
      storeAddress: storeAddress || undefined,
      whatsappNumber: cleanWhatsAppNumber,
      isPublic: true,
      storeTheme: 'default',
      products: [],
    });

    return NextResponse.json(
      { 
        message: 'Store created successfully', 
        store: {
          id: store._id,
          storeName: store.storeName,
          storeSlug: store.storeSlug,
          currency: store.currency,
          welcomeMessage: store.welcomeMessage,
          whatsappNumber: store.whatsappNumber,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Store creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find user by email
    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's store
    const store = await Store.findOne({ userId: user._id });
    
    if (!store) {
      return NextResponse.json(
        { store: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { store },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Store fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find user by email
    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's store
    const existingStore = await Store.findOne({ userId: user._id });
    if (!existingStore) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    const { storeName, storeSlug, storeDescription, currency, welcomeMessage, contactEmail, storeAddress, whatsappNumber } = await request.json();

    // Check if slug is already taken by another store
    if (storeSlug !== existingStore.storeSlug) {
      const existingSlug = await Store.findOne({ storeSlug, _id: { $ne: existingStore._id } });
      if (existingSlug) {
        return NextResponse.json(
          { error: 'Store URL slug is already taken. Please choose a different one.' },
          { status: 400 }
        );
      }
    }

    // Validate WhatsApp number
    if (!whatsappNumber || !whatsappNumber.trim()) {
      return NextResponse.json(
        { error: 'WhatsApp number is required' },
        { status: 400 }
      );
    }

    // Clean WhatsApp number
    const cleanWhatsAppNumber = whatsappNumber.replace(/[\s\-\(\)\+]/g, '');

    // Basic WhatsApp number validation
    if (!/^\d+$/.test(cleanWhatsAppNumber)) {
      return NextResponse.json(
        { error: 'Please enter a valid WhatsApp number with digits only' },
        { status: 400 }
      );
    }

    // Check if WhatsApp number is already used by another store
    if (cleanWhatsAppNumber !== existingStore.whatsappNumber) {
      const existingWhatsApp = await Store.findOne({ whatsappNumber: cleanWhatsAppNumber, _id: { $ne: existingStore._id } });
      if (existingWhatsApp) {
        return NextResponse.json(
          { error: 'This WhatsApp number is already registered with another store' },
          { status: 400 }
        );
      }
    }

    // Update store
    const updatedStore = await Store.findByIdAndUpdate(
      existingStore._id,
      {
        storeName,
        storeSlug,
        storeDescription,
        currency,
        welcomeMessage,
        contactEmail: contactEmail || undefined,
        storeAddress: storeAddress || undefined,
        whatsappNumber: cleanWhatsAppNumber,
      },
      { new: true }
    );

    return NextResponse.json(
      { 
        message: 'Store updated successfully', 
        store: {
          id: updatedStore._id,
          storeName: updatedStore.storeName,
          storeSlug: updatedStore.storeSlug,
          currency: updatedStore.currency,
          welcomeMessage: updatedStore.welcomeMessage,
          whatsappNumber: updatedStore.whatsappNumber,
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Store update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}