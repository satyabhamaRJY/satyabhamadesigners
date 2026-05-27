import { Client, handle_file } from '@gradio/client';

async function testKolors() {
  try {
    console.log("Connecting to Kwai-Kolors/Kolors-Virtual-Try-On...");
    const app = await Client.connect("Kwai-Kolors/Kolors-Virtual-Try-On");
    
    console.log("Fetching test images...");
    const personRes = await fetch("https://raw.githubusercontent.com/yisol/IDM-VTON/main/images/person/00008_00.jpg");
    const personBlob = await personRes.blob();
    
    const garmRes = await fetch("https://raw.githubusercontent.com/yisol/IDM-VTON/main/images/garment/00044_00.jpg");
    const garmBlob = await garmRes.blob();

    console.log("Predicting...");
    // Kolors VTON takes: person_img, garment_img, seed, randomize_seed
    const result = await app.predict("/tryon", [
      handle_file(personBlob), // person image
      handle_file(garmBlob),   // garment image
      0,                       // seed
      true                     // randomize seed
    ]);

    console.log("Result:", result.data);
  } catch (err) {
    console.error("Test Error:", err);
  }
}

testKolors();
