const fs = require('fs');
let code = fs.readFileSync('components/tools/Speedtest.tsx', 'utf8');

const newCode = `
  const runDownloadTest = useCallback((): Promise<number> => {
    return new Promise((resolve) => {
      setPhase("Download...");
      const CONNECTIONS = 4;
      const xhrs: XMLHttpRequest[] = [];
      const loaded = new Array(CONNECTIONS).fill(0);
      let lastSpeed = 0;
      let active = CONNECTIONS;
      
      const startTime = performance.now();
      
      const finish = () => {
        xhrs.forEach(x => x.abort());
        
        // Safeguard untuk mobile: kalkulasi akhir
        const totalLoaded = loaded.reduce((a, b) => a + b, 0);
        const duration = (performance.now() - startTime) / 1000;
        if (totalLoaded > 0 && duration > 0.1) {
            const speedBps = (totalLoaded * 8) / duration;
            const finalCalculated = speedBps / 1000000;
            if (finalCalculated > 0) lastSpeed = finalCalculated;
        }
        
        resolve(lastSpeed);
      };
      
      const timeoutId = setTimeout(finish, 8000); // 8 detik max
      
      for(let i = 0; i < CONNECTIONS; i++) {
        const xhr = new XMLHttpRequest();
        xhrs.push(xhr);
        const url = \`https://speed.cloudflare.com/__down?bytes=25000000&r=\${Math.random()}&c=\${i}\`;
        
        xhr.open("GET", url, true);
        xhr.onprogress = (e) => {
          loaded[i] = e.loaded;
          const totalLoaded = loaded.reduce((a, b) => a + b, 0);
          const duration = (performance.now() - startTime) / 1000;
          if (duration > 0.2) {
            const speedBps = (totalLoaded * 8) / duration;
            lastSpeed = speedBps / 1000000;
            setBig(fmt(lastSpeed));
            setFill(Math.min(100, (lastSpeed / 500) * 100));
          }
        };
        xhr.onload = (e) => {
          // Fallback jika onprogress di-throttle oleh iOS Safari
          loaded[i] = xhr.response ? xhr.response.length : (e as any).loaded || 25000000;
          active--;
          if (active === 0) {
            clearTimeout(timeoutId);
            finish();
          }
        };
        xhr.onerror = () => {
          active--;
          if (active === 0) {
            clearTimeout(timeoutId);
            finish();
          }
        };
        xhr.send();
      }
      
      // Save for cleanup
      // @ts-ignore
      xhrRef.current = { abort: () => { clearTimeout(timeoutId); xhrs.forEach(x => x.abort()); } };
    });
  }, []);

  const runUploadTest = useCallback((): Promise<number> => {
    return new Promise((resolve) => {
      setPhase("Upload...");
      // KECILKAN UKURAN CHUNK agar totalUploaded bisa update cepat di mobile (slow network)
      const CHUNK_SIZE = 250000; // 250 KB per chunk (vs 5MB sebelumnya)
      const CONNECTIONS = 4; // 4 concurrent workers
      let totalUploaded = 0;
      let lastSpeed = 0;
      let running = true;
      
      const payload = new Uint8Array(CHUNK_SIZE);
      for(let i=0; i<payload.length; i+=65536) {
        window.crypto.getRandomValues(payload.subarray(i, Math.min(i + 65536, payload.length)));
      }
      const blob = new Blob([payload], { type: 'application/octet-stream' });
      
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
      
      const timeoutId = setTimeout(finish, 8000);
      
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
            }
          } catch (e) {
            await new Promise(r => setTimeout(r, 100));
          }
        }
      };
      
      for(let i = 0; i < CONNECTIONS; i++) {
        worker();
      }
      
      // Save for cleanup
      // @ts-ignore
      xhrRef.current = { abort: () => { clearTimeout(timeoutId); finish(); } };
    });
  }, []);
`;

// Replace from 'const runDownloadTest' to '}, []);' (second occurrence)
const regex = /const runDownloadTest = useCallback[\s\S]*?const runUploadTest = useCallback[\s\S]*?xhrRef\.current = { abort: finish };\n    }\);\n  }, \[\]\);/g;

code = code.replace(regex, newCode.trim());

fs.writeFileSync('components/tools/Speedtest.tsx', code);
