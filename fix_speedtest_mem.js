const fs = require('fs');
let code = fs.readFileSync('components/tools/Speedtest.tsx', 'utf8');

const newCode = `
  const runDownloadTest = useCallback((): Promise<number> => {
    return new Promise((resolve) => {
      setPhase("Download...");
      const CONNECTIONS = 2; // Kurangi ke 2 agar mobile (Android/iOS) tidak kepanasan / memory leak
      let totalLoaded = 0;
      let lastSpeed = 0;
      let running = true;
      let active = CONNECTIONS;
      
      const startTime = performance.now();
      
      const finish = () => {
        if (!running) return;
        running = false;
        const duration = (performance.now() - startTime) / 1000;
        if (totalLoaded > 0 && duration > 0.1) {
            const speedBps = (totalLoaded * 8) / duration;
            lastSpeed = Math.max(lastSpeed, speedBps / 1000000);
        }
        resolve(lastSpeed);
      };
      
      const timeoutId = setTimeout(finish, 8000); // 8 detik max
      
      const uiInterval = setInterval(() => {
        if (!running) return clearInterval(uiInterval);
        const duration = (performance.now() - startTime) / 1000;
        if (duration > 0.2 && totalLoaded > 0) {
          const speedMbps = ((totalLoaded * 8) / duration) / 1000000;
          lastSpeed = speedMbps;
          setBig(fmt(speedMbps));
          setFill(Math.min(100, (speedMbps / 500) * 100));
        }
      }, 250);
      
      const worker = async (index: number) => {
        try {
          const url = \`https://speed.cloudflare.com/__down?bytes=25000000&r=\${Math.random()}&c=\${index}\`;
          const res = await fetch(url, { cache: 'no-store' });
          if (!res.body) throw new Error("No stream");
          
          const reader = res.body.getReader();
          while(running) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              totalLoaded += value.length;
            }
          }
        } catch (e) {
          console.warn("Worker download fail", e);
        } finally {
          active--;
          if (active === 0) {
            clearTimeout(timeoutId);
            clearInterval(uiInterval);
            finish();
          }
        }
      };
      
      for(let i = 0; i < CONNECTIONS; i++) {
        worker(i);
      }
      
      // @ts-ignore
      xhrRef.current = { abort: () => { running = false; clearTimeout(timeoutId); clearInterval(uiInterval); finish(); } };
    });
  }, []);

  const runUploadTest = useCallback((): Promise<number> => {
    return new Promise((resolve) => {
      setPhase("Upload...");
      const CHUNK_SIZE = 200000; // 200 KB per chunk (sangat aman untuk koneksi lambat di mobile)
      const CONNECTIONS = 2; // 2 concurrent workers untuk mencegah bufferbloat / RTO di HP
      let totalUploaded = 0;
      let lastSpeed = 0;
      let running = true;
      let active = CONNECTIONS;
      
      const payload = new Uint8Array(CHUNK_SIZE);
      for(let i=0; i<payload.length; i+=65536) {
        window.crypto.getRandomValues(payload.subarray(i, Math.min(i + 65536, payload.length)));
      }
      const blob = new Blob([payload], { type: 'application/octet-stream' });
      
      const startTime = performance.now();
      
      const finish = () => {
        if (!running) return;
        running = false;
        const duration = (performance.now() - startTime) / 1000;
        if (totalUploaded > 0 && duration > 0.1) {
            const speedBps = (totalUploaded * 8) / duration;
            lastSpeed = Math.max(lastSpeed, speedBps / 1000000);
        }
        resolve(lastSpeed);
      };
      
      const timeoutId = setTimeout(finish, 8000);
      
      const uiInterval = setInterval(() => {
        if (!running) return clearInterval(uiInterval);
        const duration = (performance.now() - startTime) / 1000;
        if (duration > 0.2 && totalUploaded > 0) {
          const speedMbps = ((totalUploaded * 8) / duration) / 1000000;
          lastSpeed = speedMbps;
          setUp(fmt(speedMbps));
          setFill(Math.min(100, (speedMbps / 200) * 100));
        }
      }, 250);
      
      const worker = async () => {
        while(running) {
          try {
            const res = await fetch(\`https://speed.cloudflare.com/__up?r=\${Math.random()}\`, {
              method: 'POST',
              body: blob,
              cache: 'no-store'
            });
            if (res.ok && running) {
              totalUploaded += CHUNK_SIZE;
            } else if (!res.ok) {
               await new Promise(r => setTimeout(r, 500));
            }
          } catch (e) {
            await new Promise(r => setTimeout(r, 500));
          }
        }
        active--;
        if (active === 0) {
            clearTimeout(timeoutId);
            clearInterval(uiInterval);
            finish();
        }
      };
      
      for(let i = 0; i < CONNECTIONS; i++) {
        worker();
      }
      
      // @ts-ignore
      xhrRef.current = { abort: () => { running = false; clearTimeout(timeoutId); clearInterval(uiInterval); finish(); } };
    });
  }, []);
`;

const regex = /const runDownloadTest = useCallback[\s\S]*?const runUploadTest = useCallback[\s\S]*?xhrRef\.current = { abort: .*?finish\(\); } };\n    }\);\n  }, \[\]\);/g;

code = code.replace(regex, newCode.trim());

fs.writeFileSync('components/tools/Speedtest.tsx', code);
