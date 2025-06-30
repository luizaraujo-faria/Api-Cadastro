import { defineConfig } from "eslint/config"
import js from "@eslint/js"

export default defineConfig([
  {
    ignores: [
      "src/generated/prisma/**",
      "node_modules/**",
      "dist/**",
      "build/**"
    ]
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        browser: true,
        node: true,
        console: true,
        process: true,
        require: true,
        module: true,
        exports: true,
        __dirname: true,
      }
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "no-console": "off"
    }
  }
])