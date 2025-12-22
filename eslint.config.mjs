import globals from "globals";
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";
import reactNativePlugin from "eslint-plugin-react-native";
import importPlugin from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "android/**", "ios/**"] }, 
  prettierConfig,
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended
    ],
  files: ["**/*.{js,jsx,ts,tsx}"],
  languageOptions: {
    ecmaVersion: 2020,
    globals: {
      ...globals.browser,
      ...globals.node
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    }
  },
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
    react: reactPlugin,
    "react-native": reactNativePlugin,
    import: importPlugin,
    "@stylistic": stylistic
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    ...reactPlugin.configs.recommended.rules,
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true }
    ],
    quotes: ["error", "double"],
    "jsx-quotes": ["error", "prefer-double"],
    "react-native/no-unused-styles": "warn",
    "react-native/split-platform-components": "warn",
    "react-native/no-inline-styles": "warn",
    "react-native/no-color-literals": "warn",
    "space-before-function-paren": ["error", "never"],
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always"
      }
    ],
    "@stylistic/jsx-indent": ["error", 2],
    "@stylistic/jsx-indent-props": ["error", 2],
    "@stylistic/jsx-closing-bracket-location": ["error", "tag-aligned"],
    "@stylistic/jsx-closing-tag-location": ["error"],
    "@stylistic/jsx-wrap-multilines": ["error", {
      "declaration": "parens-new-line",
      "assignment": "parens-new-line", 
      "return": "parens-new-line",
      "arrow": "parens-new-line",
      "condition": "parens-new-line",
      "logical": "parens-new-line",
      "prop": "parens-new-line"
    }],
    "@stylistic/jsx-first-prop-new-line": ["error", "multiline"],
    "@stylistic/jsx-max-props-per-line": ["error", { "maximum": 1, "when": "multiline" }],
    "@stylistic/jsx-curly-newline": ["error", {
      "multiline": "forbid",
      "singleline": "forbid"
    }],
    "@stylistic/jsx-curly-spacing": ["error", "never"],
    "@stylistic/object-curly-spacing": ["error", "always"],
    "@stylistic/no-trailing-spaces": "error",
    "@stylistic/no-multiple-empty-lines": ["error", { "max": 1 }],
    "@stylistic/semi": ["error", "always"],
    "@stylistic/keyword-spacing": ["error", { "before": true, "after": true }],
    "@stylistic/indent": ["error", 2]
  }
});
