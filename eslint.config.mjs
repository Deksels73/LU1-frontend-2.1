import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  // Next.js, React en React Hooks regels, met TypeScript-regels erbij
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Gegenereerd uit openapi.yaml: nooit met de hand aanpassen of linten
    "types/api.ts",
    // Rapporten van Playwright
    "playwright-report/**",
    "test-results/**",
  ]),

  {
    rules: {
      // Waarschuwing in plaats van fout: op een paar plekken staat nog "any"
      "@typescript-eslint/no-explicit-any": "warn",
      // Een underscore voor een parameter betekent: bewust ongebruikt
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Je useEffects roepen eigen functies aan: laat dit een waarschuwing zijn
      "react-hooks/exhaustive-deps": "warn",
      // localStorage bestaat niet tijdens server-side rendering van Next.js. De
      // ingelogde gebruiker en het token kunnen dus pas na het laden van de pagina
      // (in een effect) worden uitgelezen. Daarom een waarschuwing en geen fout.
      "react-hooks/set-state-in-effect": "warn",
    },
  },

  {
    // In tests is "any" bij mocks gebruikelijk
    files: ["e2e/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
