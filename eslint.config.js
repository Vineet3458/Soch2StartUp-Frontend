import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  {
    files: ["*.{js,mjs}", "vite.config.js", "eslint.config.js", "test-*.mjs"],
    languageOptions: { globals: { ...globals.node }, sourceType: "module" },
  },
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: { globals: globals.browser, parserOptions: { ecmaFeatures: { jsx: true } }, sourceType: "module" },
    plugins: { react, "react-hooks": hooks },
    settings: { react: { version: "18" } },
    rules: {
      "no-undef": "error",
      "react/jsx-uses-vars": "error", "react/jsx-uses-react": "off",
      "no-unused-vars": ["warn", { varsIgnorePattern: "^_", argsIgnorePattern: "^_", caughtErrors: "none" }],
      "react-hooks/rules-of-hooks": "error", "react-hooks/exhaustive-deps": "off",
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
];
