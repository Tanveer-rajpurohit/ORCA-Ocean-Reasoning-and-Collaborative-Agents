import { globalIgnores } from "eslint/config";
import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  globalIgnores([
    // Vendored maplibre worker bundles served from public/.
    "public/**",
  ]),
];
