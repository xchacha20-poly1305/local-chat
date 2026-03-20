import { defineConfig } from "eslint/config";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

const warnRule = (rule) => {
  if (rule === 0 || rule === "off") return rule;
  if (rule === 1 || rule === 2 || rule === "warn" || rule === "error") return "warn";
  if (Array.isArray(rule)) {
    const [level, ...options] = rule;
    if (level === 0 || level === "off") return rule;
    return ["warn", ...options];
  }
  return "warn";
};

const warnifyConfig = (config) =>
  config.rules
    ? {
        ...config,
        rules: Object.fromEntries(
          Object.entries(config.rules).map(([name, rule]) => [name, warnRule(rule)])
        ),
      }
    : config;

export default defineConfig(
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  ...tseslint.configs.recommendedTypeChecked.map(warnifyConfig),
  {
    files: ["src/**/*.{ts,tsx}", "vite.config.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "import/no-deprecated": "warn",
    },
  }
);
