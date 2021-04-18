module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: { ecmaVersion: 8 }, // to enable features such as async/await
  ignorePatterns: ["node_modules/*", ".next/*", ".out/*", "!.prettierrc.js"], // We don't want to lint generated files nor node_modules, but we want to lint .prettierrc.js (ignored by default by eslint)
  extends: ["eslint:recommended"],
  overrides: [
    // {
    //   env: {
    //     browser: true,
    //     node: true,
    //     es6: true,
    //     "jest/globals": true,
    //   },
    //   files: ["__tests__/**/*.js"],
    //   plugins: ["jest", "react"],
    //   parserOptions: {
    //     sourceType: "module",
    //     ecmaFeatures: {
    //       jsx: true,
    //     },
    //   },
    //   extends: [
    //     "eslint:recommended",
    //     "plugin:react/recommended", // React rules
    //     "plugin:prettier/recommended", // Prettier recommended rules
    //   ],
    //   rules: {
    //     "react/react-in-jsx-scope": "off",
    //     "jest/no-disabled-tests": "warn",
    //     "jest/no-focused-tests": "error",
    //     "jest/no-identical-title": "error",
    //     "jest/prefer-to-have-length": "warn",
    //     "jest/valid-expect": "error",
    //   },
    // },
    // This configuration will apply only to TypeScript files
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      settings: { react: { version: "detect" } },
      plugins: ["react", "@typescript-eslint"],
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended", // TypeScript rules
        "plugin:react/recommended", // React rules
        "plugin:react-hooks/recommended", // React hooks rules
        "plugin:jsx-a11y/recommended", // Accessibility rules
        "plugin:prettier/recommended", // Prettier recommended rules
      ],
      rules: {
        // We will use TypeScript's types for component props instead
        "react/prop-types": "off",

        // No need to import React when using Next.js
        "react/react-in-jsx-scope": "off",

        // This rule is not compatible with Next.js's <Link /> components
        "jsx-a11y/anchor-is-valid": "off",

        // Includes .prettierrc.js rules
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],

        // Why would you want unused vars?
        "@typescript-eslint/no-unused-vars": ["error"],

        // I suggest this setting for requiring return types on functions only where useful
        // "@typescript-eslint/explicit-function-return-type": [
        //   "warn",
        //   {
        //     allowExpressions: true,
        //     allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        //   },
        // ],
      },
    },
  ],
}
