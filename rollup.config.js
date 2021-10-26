import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const extensions = [".js", ".ts"];

export default {
  input: "src/lib/vrx.ts",
  output: [
    { file: "./dist/vrx.cjs.js", format: "cjs" },
    { file: "./dist/vrx.esm.js", format: "es" },
  ],
  plugins: [
    resolve({ extensions }),
    babel({
      babelHelpers: "bundled",
      include: ["src/lib/**/*.ts"],
      extensions,
      exclude: "./node_modules/**",
    }),
  ],
};
