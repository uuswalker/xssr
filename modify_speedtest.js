const fs = require('fs');

let code = fs.readFileSync('components/tools/Speedtest.tsx', 'utf8');

if (!code.includes('AnimatePresence')) {
  code = code.replace('import { motion } from "framer-motion";', 'import { motion, AnimatePresence } from "framer-motion";');
}

// Replace the prompt with a copy input toast
// Actually, if we just want a modern toast, we can have a state `toastMsg: string | null`
const toastHook = 'const [toastMsg, setToastMsg] = useState<string | null>(null);\n  const showToast = (msg: string) => {\n    setToastMsg(msg);\n    setTimeout(() => setToastMsg(null), 4000);\n  };\n\n  const [shared, setShared]';
code = code.replace('const [shared, setShared]', toastHook);

// Update share logic
code = code.replace('navigator.clipboard.writeText(url).then(doneFn).catch(() => prompt("Salin link ini:", url));\n    } else {\n      prompt("Salin link ini:", url);\n    }', 'navigator.clipboard.writeText(url).then(doneFn).catch(() => showToast("Gagal menyalin otomatis. Link: " + url));\n    } else {\n      showToast("Link Tes: " + url);\n    }');

// Inject Toast UI at the end of return block
const toastUI = `<AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            style={{
              position: "fixed",
              bottom: 40,
              left: "50%",
              zIndex: 9999,
              background: "#333",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 30,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              fontSize: 14,
              fontWeight: 500,
              textAlign: "center",
              maxWidth: "90vw",
            }}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`;
code = code.replace('    </div>\n  );\n}', toastUI);

fs.writeFileSync('components/tools/Speedtest.tsx', code);
