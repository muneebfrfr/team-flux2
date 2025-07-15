// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend Next.js default rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ❌ Ignore specific folders/files
  {
    ignores: [
      "src/generated/**", // ignore Prisma-generated code
      "src/pages/api/**", // ignore API route handlers
      "src/types/**",
      ".next/**" // ignore global type declarations
    ],
  },
];

export default eslintConfig;
