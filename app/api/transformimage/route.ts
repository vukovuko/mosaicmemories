import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import nearestColor from 'nearest-color';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const inputImage = Buffer.from(buffer);

    // Define your color palette
    const palette = {
      black: '#000000',
      white: '#FFFFFF',
      red: '#FF0000',
      green: '#00FF00',
      blue: '#0000FF',
      // Add more colors if needed
    };

    const numColors = 5; // Number of colors in the palette
    const outputWidth = 100; // Desired width for pixelation

    // Initialize nearest-color with the palette
    const nearest = nearestColor.from(palette);

    // Resize the image to pixelate it
    const pixelatedImageBuffer = await sharp(inputImage)
      .resize({ width: outputWidth }) // Resize to desired pixelation
      .ensureAlpha() // Ensure alpha channel is present
      .toBuffer();

    // Get raw pixel data
    const { data, info } = await sharp(pixelatedImageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixelData = data;
    const colorCounts: { [key: string]: number } = {};

    // Map each pixel to the nearest color in the palette
    for (let i = 0; i < pixelData.length; i += info.channels) {
      const r = pixelData[i];
      const g = pixelData[i + 1];
      const b = pixelData[i + 2];
      const a = info.channels === 4 ? pixelData[i + 3] : 255; // Default alpha to 255 if not present

      // Skip fully transparent pixels
      if (a === 0) continue;

      const { name, value } = nearest({ r, g, b });

      // Update pixel data with the nearest palette color
      const hex = value.replace('#', '');
      pixelData[i] = parseInt(hex.substr(0, 2), 16);
      pixelData[i + 1] = parseInt(hex.substr(2, 2), 16);
      pixelData[i + 2] = parseInt(hex.substr(4, 2), 16);

      // Count the colors
      colorCounts[name] = (colorCounts[name] || 0) + 1;
    }

    // Reconstruct the image from modified pixel data
    const outputImageBuffer = await sharp(Buffer.from(pixelData), {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels,
      },
    })
      .png()
      .toBuffer();

    // Convert the image buffer to a base64 string
    const transformedImageBase64 = outputImageBuffer.toString('base64');

    return NextResponse.json({
      transformedImage: `data:image/png;base64,${transformedImageBase64}`,
      colorSummary: colorCounts,
    });
  } catch (error) {
    console.error('Error during image processing:', error);
    return NextResponse.json({ error: 'Error during image processing' }, { status: 500 });
  }
}
