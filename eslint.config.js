// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      eslintPluginPrettierRecommended
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/no-unused-expressions': ['error', {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false,
      }],
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      "prettier/prettier": ["error", {
        "endOfLine": "auto",
        "singleQuote": true,
        "trailingComma": "all"
      }],
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "optim",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "optim",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      eslintPluginPrettierRecommended
    ],
    rules: {
        "prettier/prettier": ["error", { "parser": "angular", "endOfLine": "auto" }],
        "@angular-eslint/template/alt-text": "error",
        "@angular-eslint/template/attributes-order": "error",
        "@angular-eslint/template/banana-in-box": "error",
        // "@angular-eslint/template/button-has-type": "error",
        "@angular-eslint/template/click-events-have-key-events": "error",
        "@angular-eslint/template/conditional-complexity": "error",
        "@angular-eslint/template/cyclomatic-complexity": "error",
        "@angular-eslint/template/elements-content": "error",
        "@angular-eslint/template/eqeqeq": "error",
        // "@angular-eslint/template/i18n": "error",
        "@angular-eslint/template/interactive-supports-focus": "error",
        "@angular-eslint/template/label-has-associated-control": "error",
        "@angular-eslint/template/mouse-events-have-key-events": "error",
        "@angular-eslint/template/no-any": "error",
        "@angular-eslint/template/no-autofocus": "error",
        "@angular-eslint/template/no-call-expression": "off",
        "@angular-eslint/template/no-distracting-elements": "error",
        "@angular-eslint/template/no-duplicate-attributes": "error",
        "@angular-eslint/template/no-inline-styles": "error",
        "@angular-eslint/template/no-interpolation-in-attributes": "error",
        "@angular-eslint/template/no-negated-async": "error",
        "@angular-eslint/template/no-positive-tabindex": "error",
        "@angular-eslint/template/prefer-control-flow": "error",
        "@angular-eslint/template/prefer-ngsrc": "error",
        "@angular-eslint/template/prefer-self-closing-tags": "error",
        "@angular-eslint/template/role-has-required-aria": "error",
        "@angular-eslint/template/table-scope": "error",
        "@angular-eslint/template/use-track-by-function": "error",
        "@angular-eslint/template/valid-aria": "error"
    }
  }
);
