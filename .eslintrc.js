module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module"
  },
  ignorePatterns: ["node_modules/*", ".next/*", ".out/*", "!.prettierrc.js"],
  extends: ["eslint:recommended"],
  overrides: [{
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
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:prettier/recommended",
    ],
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "jsx-a11y/anchor-is-valid": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    },
  }],
}
