import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Store } from '@/models/Store';
import { User } from '@/models/User';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { storeSlug, customerName, customerPhone, customerEmail, customerAddress, notes, items, totalAmount } = await request.json();

    console.log('📦 Creating order for store:', storeSlug);
    console.log('👤 Customer:', customerName);
    console.log('📞 Phone:', customerPhone);
    console.log('🛍️ Items:', items);
    console.log('💰 Total:', totalAmount);

    // Find store by slug
    const store = await Store.findOne({ storeSlug });
    if (!store) {
      console.error('❌ Store not found:', storeSlug);
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    console.log('✅ Store found:', store.storeName);

    // Transform cart items to order items format
    const orderItems = items.map((item: any) => ({
      productId: item.productId,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
    }));

    // Create order
    const order = await Order.create({
      storeId: store._id,
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      customerAddress: customerAddress || undefined,
      items: orderItems,
      totalAmount,
      notes: notes || undefined,
      orderStatus: 'pending',
      paymentStatus: 'pending',
    });

    console.log('✅ Order created successfully:', order.orderNumber);
    console.log('📊 Order ID:', order._id);
    console.log('🏪 Store ID:', store._id);

    return NextResponse.json(
      { 
        message: 'Order recorded successfully',
        orderId: order._id,
        orderNumber: order.orderNumber,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
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

    console.log('📋 Fetching orders for store:', store.storeName);
    console.log('🏪 Store ID:', store._id);

    // Get orders for the store
    const orders = await Order.find({ storeId: store._id })
      .sort({ createdAt: -1 })
      .select('orderNumber customerName customerPhone customerEmail totalAmount orderStatus paymentStatus createdAt items');

    console.log('✅ Found orders:', orders.length);
    orders.forEach(order => {
      console.log(`   - ${order.orderNumber}: ${order.customerName}, ${order.totalAmount}, ${order.orderStatus}`);
    });

    return NextResponse.json(
      { orders },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Orders fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}