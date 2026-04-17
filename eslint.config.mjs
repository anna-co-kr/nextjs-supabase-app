import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 린트 제외 경로
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**", "public/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  eslintConfigPrettier, // Prettier와 충돌하는 ESLint 규칙 비활성화 (항상 마지막)
];

export default eslintConfig;
