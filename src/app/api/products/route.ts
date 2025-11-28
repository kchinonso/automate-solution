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

    // Get user's store
    const store = await Store.findOne({ userId: user._id });
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found. Please create a store first.' },
        { status: 404 }
      );
    }

    const productData = await request.json();

    // Add product to store
    store.products.push(productData);
    await store.save();

    return NextResponse.json(
      { 
        message: 'Product added successfully', 
        product: productData 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Product creation error:', error);
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

    // Get user's store with products
    const store = await Store.findOne({ userId: user._id });
    
    if (!store) {
      return NextResponse.json(
        { products: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { products: store.products || [] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Products fetch error:', error);
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
    const store = await Store.findOne({ userId: user._id });
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    const productData = await request.json();

    // Find product index
    const productIndex = store.products.findIndex((p: any) => 
      p._id?.toString() === productData._id
    );

    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product
    store.products[productIndex] = {
      ...store.products[productIndex],
      ...productData,
    };

    await store.save();

    return NextResponse.json(
      { 
        message: 'Product updated successfully', 
        product: productData 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    const { productId } = await request.json();

    // Remove product
    store.products = store.products.filter((p: any) => 
      p._id?.toString() !== productId
    );

    await store.save();

    return NextResponse.json(
      { 
        message: 'Product deleted successfully'
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}