const fs = require('fs');
let code = fs.readFileSync('components/tools/Speedtest.tsx', 'utf8');

const multiUpTest = `
  const runUploadTest = useCallback((): Promise<number> => {
    return new Promise((resolve) => {
      setPhase("Upload...");
      const CHUNK_SIZE = 5000000; // 5MB per chunk
      const CONNECTIONS = 4; // 4 concurrent workers
      let totalUploaded = 0;
      let lastSpeed = 0;
      let running = true;
      
      // Generate non-compressible random data once
      const payload = new Uint8Array(CHUNK_SIZE);
      for(let i=0; i<payload.length; i+=65536) {
        window.crypto.getRandomValues(payload.subarray(i, Math.min(i + 65536, payload.length)));
      }
      const blob = new Blob([payload], { type: 'text/plain' });
      
      const startTime = performance.now();
      
      const uiInterval = setInterval(() => {
        const duration = (performance.now() - startTime) / 1000;
        if (duration > 0.2 && totalUploaded > 0) {
          const speedMbps = ((totalUploaded * 8) / duration) / 1000000;
          lastSpeed = speedMbps;
          setUp(fmt(speedMbps));
          setFill(Math.min(100, (speedMbps / 200) * 100));
        }
      }, 250);

      const finish = () => {
        if (!running) return;
        running = false;
        clearInterval(uiInterval);
        resolve(lastSpeed);
      };
      
      // Force finish exactly at 8 seconds
      const timeoutId = setTimeout(finish, 8000);
      
      const worker = async () => {
        while(running) {
          try {
            // fetch prevents OS buffer cheating by waiting for full HTTP response
            const res = await fetch(\`https://speed.cloudflare.com/__up?r=\${Math.random()}\`, {
              method: 'POST',
              body: blob,
              cache: 'no-store'
            });
            if (res.ok && running) {
              totalUploaded += CHUNK_SIZE;
            }
          } catch (e) {
            // If network fails, wait a bit before retrying
            await new Promise(r => setTimeout(r, 100));
          }
        }
      };
      
      for(let i = 0; i < CONNECTIONS; i++) {
        worker();
      }
      
      // Save for cleanup
      // @ts-ignore
      xhrRef.current = { abort: finish };
    });
  }, []);
`;

// Replace upload test logic
code = code.replace(/const runUploadTest = useCallback\(\(\): Promise<number> => \{[\s\S]*?\}, \[\]\);/, multiUpTest.trim());

fs.writeFileSync('components/tools/Speedtest.tsx', code);
