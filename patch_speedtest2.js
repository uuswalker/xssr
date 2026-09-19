const fs = require('fs');
let code = fs.readFileSync('components/tools/Speedtest.tsx', 'utf8');

const multiDownTest = `
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
        xhr.onload = () => {
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
      xhrRef.current = { abort: () => xhrs.forEach(x => x.abort()) };
    });
  }, []);
`;

const multiUpTest = `
  const runUploadTest = useCallback((): Promise<number> => {
    return new Promise((resolve) => {
      setPhase("Upload...");
      const CONNECTIONS = 2;
      const xhrs: XMLHttpRequest[] = [];
      const loaded = new Array(CONNECTIONS).fill(0);
      let lastSpeed = 0;
      let active = CONNECTIONS;
      
      // Generate non-compressible random data (prevents falsely high speeds)
      const payload = new Uint8Array(10000000); // 10MB per conn
      for(let i=0; i<payload.length; i+=65536) {
        window.crypto.getRandomValues(payload.subarray(i, Math.min(i + 65536, payload.length)));
      }
      
      const startTime = performance.now();
      
      const finish = () => {
        xhrs.forEach(x => x.abort());
        resolve(lastSpeed);
      };
      
      const timeoutId = setTimeout(finish, 8000);
      
      for(let i = 0; i < CONNECTIONS; i++) {
        const xhr = new XMLHttpRequest();
        xhrs.push(xhr);
        const url = \`https://speed.cloudflare.com/__up?r=\${Math.random()}&c=\${i}\`;
        
        xhr.open("POST", url, true);
        xhr.upload.onprogress = (e) => {
          loaded[i] = e.loaded;
          const totalLoaded = loaded.reduce((a, b) => a + b, 0);
          const duration = (performance.now() - startTime) / 1000;
          if (duration > 0.2) {
            const speedBps = (totalLoaded * 8) / duration;
            lastSpeed = speedBps / 1000000;
            setUp(fmt(lastSpeed));
            setFill(Math.min(100, (lastSpeed / 200) * 100));
          }
        };
        xhr.onload = () => {
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
        xhr.send(payload);
      }
      
      // Save for cleanup
      // @ts-ignore
      xhrRef.current = { abort: () => xhrs.forEach(x => x.abort()) };
    });
  }, []);
`;

// use regex to replace both functions
code = code.replace(/const runDownloadTest = useCallback\(\(\): Promise<number> => \{[\s\S]*?\}, \[\]\);/, multiDownTest.trim());
code = code.replace(/const runUploadTest = useCallback\(\(\): Promise<number> => \{[\s\S]*?\}, \[\]\);/, multiUpTest.trim());

fs.writeFileSync('components/tools/Speedtest.tsx', code);
