import { Client } from '@gradio/client';

async function discover() {
  try {
    console.log("Discovering levihsu/OOTDiffusion...");
    const app = await Client.connect("levihsu/OOTDiffusion");
    console.log(await app.view_api());
  } catch (err) {
    console.error("Error:", err);
  }
}

discover();
