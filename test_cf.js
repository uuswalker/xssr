const { webcrypto } = require('crypto');

async function runTest() {
  const payload = new Uint8Array(5000000);
  for(let i=0; i<payload.length; i+=65536) {
    webcrypto.getRandomValues(payload.subarray(i, Math.min(i + 65536, payload.length)));
  }
  const blob = new Blob([payload], { type: 'text/plain' });
  
  try {
    const res = await fetch(`https://speed.cloudflare.com/__up?r=${Math.random()}`, {
      method: 'POST',
      body: blob,
      headers: {
        'Origin': 'https://xssrexperimental.vercel.app'
      }
    });
    console.log("Status:", res.status);
    console.log("Headers:", res.headers);
    const text = await res.text();
    console.log("Response:", text.substring(0, 100));
  } catch (e) {
    console.log("Error:", e.message);
  }
}
runTest();
