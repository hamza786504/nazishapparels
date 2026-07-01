import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db.js';
import Admin from '../../../../models/Admin.js';

export async function POST(request) {
  try {
    await dbConnect();

    const { username, email, password, fullName } = await request.json();

    // Validation
    if (!username || !email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }],
    });

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin with this email or username already exists' },
        { status: 409 }
      );
    }

    // Create new admin
    const newAdmin = new Admin({
      username,
      email,
      password, // Will be hashed by pre-save hook
      fullName,
      role: 'admin',
    });

    await newAdmin.save();

    // Return admin without password
    const adminResponse = {
      id: newAdmin._id,
      username: newAdmin.username,
      email: newAdmin.email,
      fullName: newAdmin.fullName,
      role: newAdmin.role,
      status: newAdmin.status,
      createdAt: newAdmin.createdAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Admin registered successfully',
        admin: adminResponse,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Admin registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}