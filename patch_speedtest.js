const fs = require('fs');

let code = fs.readFileSync('components/tools/Speedtest.tsx', 'utf8');

const newDownloadTest = `
  const runDownloadTest = useCallback((): Promise<number> => {
    return new Promise((resolve, reject) => {
      setPhase("Download...");
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;
      
      const url = \`https://speed.cloudflare.com/__down?bytes=50000000&r=\${Math.random()}\`;
      const startTime = performance.now();
      let lastSpeed = 0;
      
      const timeoutId = setTimeout(() => {
        xhr.abort();
        resolve(lastSpeed);
      }, 8000); // 8 seconds max

      xhr.open("GET", url, true);
      xhr.onprogress = (e) => {
        if (e.loaded > 0) {
          const duration = (performance.now() - startTime) / 1000;
          if (duration > 0.1) {
            const speedBps = (e.loaded * 8) / duration;
            lastSpeed = speedBps / 1000000;
            setBig(fmt(lastSpeed));
            setFill(Math.min(100, (lastSpeed / 500) * 100));
          }
        }
      };
      xhr.onload = () => {
        clearTimeout(timeoutId);
        resolve(lastSpeed);
      };
      xhr.onerror = () => {
        clearTimeout(timeoutId);
        if (lastSpeed > 0) resolve(lastSpeed); else reject(new Error("Download failed"));
      };
      xhr.onabort = () => {
        // Abort is called by timeout
      };
      xhr.send();
    });
  }, []);
`;

const newUploadTest = `
  const runUploadTest = useCallback((): Promise<number> => {
    return new Promise((resolve, reject) => {
      setPhase("Upload...");
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;
      
      const url = \`https://speed.cloudflare.com/__up?r=\${Math.random()}\`;
      const payload = new Uint8Array(15000000);
      
      const startTime = performance.now();
      let lastSpeed = 0;

      const timeoutId = setTimeout(() => {
        xhr.abort();
        resolve(lastSpeed);
      }, 8000); // 8 seconds max
      
      xhr.open("POST", url, true);
      xhr.upload.onprogress = (e) => {
        if (e.loaded > 0) {
          const duration = (performance.now() - startTime) / 1000;
          if (duration > 0.1) {
            const speedBps = (e.loaded * 8) / duration;
            lastSpeed = speedBps / 1000000;
            setUp(fmt(lastSpeed));
            setFill(Math.min(100, (lastSpeed / 200) * 100));
          }
        }
      };
      xhr.onload = () => {
        clearTimeout(timeoutId);
        resolve(lastSpeed);
      };
      xhr.onerror = () => {
        clearTimeout(timeoutId);
        if (lastSpeed > 0) resolve(lastSpeed); else reject(new Error("Upload failed"));
      };
      xhr.onabort = () => {};
      xhr.send(payload);
    });
  }, []);
`;

// use regex to replace both functions
code = code.replace(/const runDownloadTest = useCallback\(\(\): Promise<number> => \{[\s\S]*?\}, \[\]\);/, newDownloadTest.trim());
code = code.replace(/const runUploadTest = useCallback\(\(\): Promise<number> => \{[\s\S]*?\}, \[\]\);/, newUploadTest.trim());

fs.writeFileSync('components/tools/Speedtest.tsx', code);
