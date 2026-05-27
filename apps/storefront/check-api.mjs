import { Client } from '@gradio/client';

async function checkApi() {
  try {
    const app = await Client.connect("yisol/IDM-VTON");
    const apiInfo = await app.view_api();
    console.log(JSON.stringify(apiInfo, null, 2));
  } catch (err) {
    console.error(err);
  }
}

checkApi();
