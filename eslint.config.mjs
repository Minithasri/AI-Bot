import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  { ignores: ["dist/*", "postcss.config.js", "tailwind.config.js", "src/components/ui"] },
  // Basic parser options
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
  },
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "warn",
      "no-console": "warn",
      //* Avoid Bugs
      "no-undef": "error",
      semi: "error",
      "semi-spacing": "error",
      //* Best Practices
      eqeqeq: "warn",
      "no-invalid-this": "error",
      "no-return-assign": "error",
      "no-unused-expressions": ["error", { allowTernary: true }],
      "no-useless-concat": "error",
      "no-useless-return": "error",
      "no-constant-condition": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "req|res|next|__" }],
      //* Enhance Readability
      indent: ["error", 2, { SwitchCase: 1 }],
      "no-mixed-spaces-and-tabs": "warn",
      "space-before-blocks": "error",
      "space-in-parens": "error",
      "space-infix-ops": "error",
      "space-unary-ops": "error",
      quotes: ["warn", "double"],
      //
      "max-len": ["error", { code: 200 }],
      "max-lines": ["error", { max: 1000 }],
      "keyword-spacing": "error",
      "multiline-ternary": ["error", "never"],
      "no-mixed-operators": "error",
      //
      "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }],
      "no-whitespace-before-property": "error",
      "nonblock-statement-body-position": "error",
      "object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
      //* ES6
      "arrow-spacing": "error",
      "no-confusing-arrow": "error",
      "no-duplicate-imports": "error",
      "no-var": "error",
      "object-shorthand": "off",
      "prefer-const": "error",
      "prefer-template": "warn",
      //* Prettier
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  pluginJs.configs.recommended,
  prettierConfig,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
];
