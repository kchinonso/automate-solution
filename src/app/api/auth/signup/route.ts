import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { email, password, companyName } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      companyName: companyName || undefined,
    });

    // Don't send password back
    const userWithoutPassword = {
      id: user._id,
      email: user.email,
      companyName: user.companyName,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}