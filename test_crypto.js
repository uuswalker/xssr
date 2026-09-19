const { webcrypto } = require('crypto');
const start = performance.now();
const payload = new Uint8Array(15000000);
for(let i=0; i<payload.length; i+=65536) {
  webcrypto.getRandomValues(payload.subarray(i, Math.min(i + 65536, payload.length)));
}
console.log("Time:", performance.now() - start, "ms");
