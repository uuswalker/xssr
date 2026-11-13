import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Bukan kode situs: skrip data/worker & tooling agent
    "scripts/**",
    ".agents/**",
  ]),
  {
    // Utang lint yang disengaja: tampil sebagai warning, tidak memblokir CI.
    // Turunkan satu per satu ke "error" setelah dibereskan.
    rules: {
      "@next/next/no-html-link-for-pages": "warn",
      "react/no-unescaped-entities": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "prefer-const": "warn",
    },
  },
]);

export default eslintConfig;
