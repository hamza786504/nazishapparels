import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db.js';
import Collection from '../../../models/Collection';

export async function GET() {
  try {
    await dbConnect();
    const collections = await Collection.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, collections }, { status: 200 });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const collection = await Collection.create(body);
    return NextResponse.json({ success: true, collection }, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
