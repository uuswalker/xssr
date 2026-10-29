import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const SCAN_DIRS = ["app", "lib", "components"];
const ALLOWED_EXTS = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".html"]);

// Strict Whitelist - Zero Tolerance for Foreign Contact Info
const WHITELIST_PHONES = new Set([
  "087778999141",     // Official Sales Solo Raya
  "6287778999141",    // Official Sales Solo Raya (intl)
  "08170010820",      // Official XL Axiata WhatsApp Care
  "628170010820",     // Official XL Axiata WhatsApp Care (intl)
  "08170123442",      // Official XL Axiata Call Center (Non-XL)
  "081234567890",     // Dummy UI form input placeholder
]);

const WHITELIST_WAME_PREFIXES = [
  "wa.me/6287778999141",
  "wa.me/xlhomesolo",
  "wa.me/628170010820",
  "wa.me/${NOMOR_WA_SALES}",
  "wa.me/${PHONE_INTL}",
  "wa.me/", // empty fallback in share component
];

const PHONE_REGEX = /(?:\+?62|0)8[0-9\-]{8,15}/g;
const WAME_REGEX = /wa\.me\/[^\s"'<>`)]+/g;

let violations = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(rootDir, filePath);

  // Check phone numbers
  let match;
  while ((match = PHONE_REGEX.exec(content)) !== null) {
    const raw = match[0];
    const digits = raw.replace(/\D/g, "");
    if (digits.length >= 10 && !WHITELIST_PHONES.has(digits)) {
      violations.push({
        type: "UNAUTHORIZED_PHONE",
        file: relPath,
        found: raw,
        clean: digits,
      });
    }
  }

  // Check wa.me links
  while ((match = WAME_REGEX.exec(content)) !== null) {
    const raw = match[0].replace(/[.,;:!?]+$/, ""); // strip trailing punctuation
    const isWhitelisted = WHITELIST_WAME_PREFIXES.some((prefix) =>
      raw.startsWith(prefix)
    );
    if (!isWhitelisted) {
      violations.push({
        type: "UNAUTHORIZED_WAME",
        file: relPath,
        found: raw,
      });
    }
  }
}

function traverse(dir) {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) return;

  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  for (const entry of entries) {
    const subPath = path.join(fullPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next") {
        traverse(path.join(dir, entry.name));
      }
    } else if (entry.isFile() && ALLOWED_EXTS.has(path.extname(entry.name))) {
      scanFile(subPath);
    }
  }
}

console.log("🛡️  Running Contact Integrity Guard (Zero Tolerance for Competitor Leaks)...");
for (const dir of SCAN_DIRS) {
  traverse(dir);
}

if (violations.length > 0) {
  console.error("\n❌ FATAL: UNAUTHORIZED CONTACT DETECTED IN CODEBASE!");
  console.error("Only sales contact 0877-7899-9141 / wa.me/xlhomesolo is permitted.\n");
  for (const v of violations) {
    console.error(`  [${v.type}] in ${v.file}: "${v.found}"`);
  }
  console.error("\n🛑 Build rejected to protect official sales revenue and brand integrity.\n");
  process.exit(1);
} else {
  console.log("✅ Contact Integrity Guard Passed: 100% clean. Only official sales contacts verified.\n");
}
