import globals from "globals";
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";
import reactNativePlugin from "eslint-plugin-react-native";
import importPlugin from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config({ ignores: ["dist"] }, prettierConfig, {
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    "prettier"
  ],
  files: ["**/*.{ts,tsx}"],
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
    import: importPlugin
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
    "space-before-function-paren": ["error", "never", { anonymous: false }],
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
    ]
  }
});
