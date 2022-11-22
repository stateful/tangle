import fs from 'node:fs';
import url from 'node:url';
import path from 'node:path';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import multi from 'rollup-plugin-multi-input';
import { terser } from 'rollup-plugin-terser';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));
const extensions = ['.js', '.ts'];
export const createPackageJSON = (dir = 'esm', type = 'module') => ({
    name: 'create-package-json',
    writeBundle: () => fs.promises.writeFile(
        path.join(dirname, 'dist', dir, 'package.json'),
        JSON.stringify({ type }, null, 4),
        'utf-8'
    )
});

const esm = {
    input: [
        'src/tangle.ts',
        'src/worker_threads.ts',
        'src/webviews.ts',
        'src/webworkers.ts',
        'src/iframes.ts'
    ],
    output: {
        format: 'esm',
        dir: 'dist/esm',
        exports: 'auto',
        sourcemap: true,
        ...(process.env.NODE_ENV === 'production'
            ? { plugins: [terser()] }
            : {}
        )
    },
    plugins: [
        // @ts-expect-error https://github.com/alfredosalzillo/rollup-plugin-multi-input/issues/61
        multi.default(),
        resolve({ extensions }),
        typescript({
            tsconfig: './tsconfig.json',
            outDir: 'dist/esm',
            declaration: true,
            declarationDir: './dist/esm',
            sourceMap: true
        }),
        createPackageJSON(),
        cleanup({ comments: 'none' })
    ],
};

const cjs = {
    ...esm,
    output: {
        ...esm.output,
        format: 'cjs',
        dir: 'dist/cjs'
    },
    plugins: [
        ...esm.plugins.slice(0, 2),
        typescript({
            tsconfig: './tsconfig.json',
            outDir: 'dist/cjs',
            declaration: true,
            declarationDir: './dist/cjs',
        }),
        createPackageJSON('cjs', 'commonjs'),
        ...esm.plugins.slice(4)
    ]
};

export default [ cjs, esm ];
