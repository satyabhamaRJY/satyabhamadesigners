import { Client } from '@gradio/client';

async function discover() {
  try {
    const app = await Client.connect("yisol/IDM-VTON");
    const api = await app.view_api();
    console.log(JSON.stringify(api, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

discover();
