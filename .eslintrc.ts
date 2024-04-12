module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
    "prettier",
  ],
  plugins: [
    "import",
    "sort-keys-fix",
    "typescript-sort-keys",
    "unused-imports",
  ],
  rules: {
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling"],
          "object",
          "type",
          "index",
        ],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
          {
            pattern: "next/**",
            group: "external",
            position: "before",
          },
          {
            pattern: "API",
            group: "internal",
            position: "before",
          },
          {
            pattern: "graphql/**",
            group: "internal",
            position: "before",
          },
          {
            pattern: "ui-components/**",
            group: "index",
            position: "after",
          },
          {
            pattern: "**\\.css",
            group: "index",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["react", "next/**"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: false },
      },
    ],
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "@next/next/no-img-element": "off",
    "react/jsx-sort-props": "error",
    "sort-keys-fix/sort-keys-fix": "error",
    "typescript-sort-keys/interface": "error",
    "unused-imports/no-unused-imports": "error",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "no-param-reassign": [2, { props: false }],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports" },
    ],
  },
};
