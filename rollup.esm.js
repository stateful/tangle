import path from 'path';

import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import cleanup from 'rollup-plugin-cleanup';
import multi from 'rollup-plugin-multi-input';
import { terser } from "rollup-plugin-terser";

const extensions = [".js", ".ts"];

export default {
    input: ["src/vrx.ts", "src/worker_threads.ts", "src/webviews.ts"],
    output: {
        format: 'esm',
        dir: 'dist',
        plugins: [terser()],
        exports: 'auto'
    },
    plugins: [
        multi({
            transformOutputPath: function (output) {
                if (!global.IS_CJS) {
                    return output;
                }
                return path.parse(path.basename(output)).name + '.cjs.js';
            }
        }),
        resolve({ extensions }),
        typescript({ tsconfig: './tsconfig.json' }),
        cleanup({ comments: 'none' })
    ],
};
