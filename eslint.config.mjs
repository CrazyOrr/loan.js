import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import { fileURLToPath } from "node:url";
import tsEslint from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  globalIgnores(["demo/*.js"]),
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  eslintConfigPrettier
);
