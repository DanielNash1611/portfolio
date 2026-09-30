import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  // New React Compiler diagnostics are advisory during this framework migration.
  // Keep existing initialization behavior; evaluate behavior refactors separately.
  { rules: { "react-hooks/set-state-in-effect": "warn", "react-hooks/refs": "warn" } },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
