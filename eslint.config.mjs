import nextVitals from "eslint-config-next/core-web-vitals";

// Flat config (ESLint 9). Next 16 removed `next lint`; run `npm run lint`.
export default [
  ...nextVitals,
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx}"],
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/set-state-in-render": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/globals": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/incompatible-library": "warn",
      "react-hooks/error-boundaries": "warn",
      "react-hooks/use-memo": "warn",
      "react-hooks/unsupported-syntax": "warn",
      "react-hooks/component-hook-factories": "warn",
      "react-hooks/static-components": "warn"
    },
  },
  { ignores: [".next/**", "out/**", "node_modules/**", ".wrangler/**", ".open-next/**", "next-env.d.ts"] },
];
