import { Client, handle_file } from '@gradio/client';

async function test() {
  try {
    const app = await Client.connect("yisol/IDM-VTON");
    
    console.log("Predicting with URLs...");
    const personUrl = "https://raw.githubusercontent.com/yisol/IDM-VTON/main/images/person/00008_00.jpg";
    const garmUrl = "https://raw.githubusercontent.com/yisol/IDM-VTON/main/images/garment/00044_00.jpg";

    const result = await app.predict("/tryon", [
      { background: handle_file(personUrl), layers: [], composite: null },
      handle_file(garmUrl),
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
