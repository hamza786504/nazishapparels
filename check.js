import client from './lib/sanityClient.js';
async function run() {
  const data = await client.fetch('*[_type == "siteSettings"][0]');
  console.log(JSON.stringify(data.adapters, null, 2));
}
run();
