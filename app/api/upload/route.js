import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary if credentials exist
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'YOUR_CLOUD_NAME' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'YOUR_API_KEY';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!isCloudinaryConfigured) {
      console.warn('Cloudinary not configured. Using data URI fallback.');
      // Convert buffer to data URI
      const base64Data = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64Data}`;
      
      // Let's return the data URI directly as a mock upload URL so it can be previewed locally!
      return NextResponse.json({
        success: true,
        url: dataUri,
        message: 'Upload fallback: returned data URI because Cloudinary credentials are not configured.',
      }, { status: 200 });
    }

    // Upload to Cloudinary using a Promise wrapper around upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'nazishapparels' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    }, { status: 200 });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
