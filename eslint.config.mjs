import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig({
  extends: ["next/core-web-vitals", "next/typescript"],
  ignorePatterns: [
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
});
