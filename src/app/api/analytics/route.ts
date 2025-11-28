import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import { Store } from '@/models/Store';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { authOptions } from '../auth/[...nextauth]/route';

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

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30days';

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

    // Get orders for the store within the time range
    const orders = await Order.find({
      storeId: store._id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    const totalOrders = orders.length;
    
    // Calculate revenue ONLY from completed orders
    const completedOrders = orders.filter(order => order.orderStatus === 'completed');
    const revenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Calculate orders by status
    const ordersByStatus = [
      { status: 'pending', count: orders.filter(o => o.orderStatus === 'pending').length },
      { status: 'confirmed', count: orders.filter(o => o.orderStatus === 'confirmed').length },
      { status: 'completed', count: orders.filter(o => o.orderStatus === 'completed').length },
      { status: 'cancelled', count: orders.filter(o => o.orderStatus === 'cancelled').length }
    ];

    // Calculate popular products from completed orders only
    const productOrders: { [key: string]: { name: string; orders: number; revenue: number } } = {};
    
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.productId;
        if (!productOrders[productId]) {
          productOrders[productId] = {
            name: item.productName,
            orders: 0,
            revenue: 0
          };
        }
        productOrders[productId].orders += item.quantity;
        productOrders[productId].revenue += item.price * item.quantity;
      });
    });

    const popularProducts = Object.values(productOrders)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    // Recent orders for the table (all orders)
    const recentOrders = orders.slice(0, 10).map(order => ({
      id: order._id,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      status: order.orderStatus,
      createdAt: order.createdAt,
      items: order.items.length
    }));

    const analyticsData = {
      totalProducts: store.products?.length || 0,
      totalOrders,
      revenue,
      popularProducts,
      ordersByStatus,
      recentOrders,
      completedOrdersCount: completedOrders.length
    };

    return NextResponse.json(
      { analytics: analyticsData },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}