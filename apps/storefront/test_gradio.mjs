import { Client, handle_file } from '@gradio/client';
import fs from 'fs';

async function test() {
  try {
    const app = await Client.connect("yisol/IDM-VTON");
    
    // We will just fetch a public image from the internet that is a good full body shot
    console.log("Fetching test images...");
    const personRes = await fetch("https://raw.githubusercontent.com/yisol/IDM-VTON/main/images/person/00008_00.jpg");
    const personBlob = await personRes.blob();
    
    const garmRes = await fetch("https://raw.githubusercontent.com/yisol/IDM-VTON/main/images/garment/00044_00.jpg");
    const garmBlob = await garmRes.blob();

    console.log("Predicting...");
    const result = await app.predict("/tryon", [
      { background: handle_file(personBlob), layers: [], composite: null },
      handle_file(garmBlob),
      "A white t-shirt",
      true,
      false,
      30,
      42
    ]);

    console.log("Result:", result.data);
  } catch (err) {
    console.error("Test Error:", err);
  }
}

test();
