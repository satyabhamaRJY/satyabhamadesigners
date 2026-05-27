import { NextResponse } from 'next/server';
import { Client, handle_file } from '@gradio/client';

export async function POST(req: Request) {
  try {
    const { capturedImage, productImage } = await req.json();

    if (!capturedImage || !productImage) {
      return NextResponse.json({ success: false, error: "Missing images" }, { status: 400 });
    }

    console.log("Preparing images for Hugging Face Gradio API...");
    // 1. Process captured webcam image (base64 to Blob)
    const base64Data = capturedImage.split(',')[1];
    const userBuffer = Buffer.from(base64Data, 'base64');
    const userBlob = new Blob([userBuffer], { type: 'image/jpeg' });

    // 2. Process product image
    const productUrl = productImage.startsWith('http') 
      ? productImage 
      : `http://localhost:3000${productImage}`;
    
    const garmResponse = await fetch(productUrl);
    if (!garmResponse.ok) {
      throw new Error(`Failed to fetch product image from ${productUrl}`);
    }
    const garmBlob = await garmResponse.blob();

    console.log("Connecting to Hugging Face Space: yisol/IDM-VTON...");
    const client = await Client.connect("yisol/IDM-VTON");
    
    console.log("Sending prediction request. This may take a minute...");
    // Gradio endpoint for IDM-VTON
    const result = await client.predict("/tryon", [
      { background: handle_file(userBlob), layers: [], composite: null }, // dict
      handle_file(garmBlob), // garm_img
      "Luxury Indian Saree", // garment_des
      true, // is_checked
      false, // is_checked_crop (MUST BE FALSE for webcam partial body shots to avoid IndexError)
      30, // denoise_steps
      42, // seed
    ]);

    console.log("Prediction complete!");
    
    // Gradio usually returns URLs for the generated files or file objects.
    // Ensure we extract the correct URL.
    const output = result.data as any[];
    const finalImageUrl = output[0]?.url || output[0];

    if (!finalImageUrl) {
       throw new Error("Invalid response format from Gradio API.");
    }

    return NextResponse.json({ success: true, resultUrl: finalImageUrl });

  } catch (error: any) {
    console.error("Gradio API Error:", error);
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
}
