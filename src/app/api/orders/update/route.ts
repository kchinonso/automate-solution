import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { Store } from '@/models/Store';
import { authOptions } from '../../auth/[...nextauth]/route';

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

    const { orderId, orderStatus, paymentStatus } = await request.json();

    // Find the order and verify it belongs to user's store
    const order = await Order.findById(orderId).populate('storeId');
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify the order belongs to user's store
    const store = await Store.findOne({ userId: user._id });
    if (!store || order.storeId._id.toString() !== store._id.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized to update this order' },
        { status: 403 }
      );
    }

    // Update order
    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    return NextResponse.json(
      { 
        message: 'Order updated successfully',
        order: updatedOrder
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}