import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import cleanup from 'rollup-plugin-cleanup';
import { terser } from "rollup-plugin-terser";

const extensions = [".js", ".ts"];

export default {
  input: "src/vrx.ts",
  output: [
    { file: "./dist/vrx.cjs.js", format: "cjs", plugins: [terser()] },
    { file: "./dist/vrx.esm.js", format: "es", plugins: [terser()] },
  ],
  plugins: [
    resolve({ extensions }),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    cleanup({
      comments: 'none',
    }),
  ],
};
