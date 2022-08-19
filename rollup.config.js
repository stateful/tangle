import fs from 'fs';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import multi from 'rollup-plugin-multi-input';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js', '.ts'];

export const createPackageJSON = (dir = 'esm', type = 'module') => ({
    name: 'create-package-json',
    writeBundle: () => fs.promises.writeFile(
        path.join(__dirname, 'dist', dir, 'package.json'),
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
        ...(process.env.NODE_ENV === 'production'
            ? { plugins: [terser()] }
            : {}
        )
    },
    plugins: [
        multi(),
        resolve({ extensions }),
        typescript({
            tsconfig: './tsconfig.json',
            outDir: 'dist/esm',
            declarationDir: './dist/esm',
            sourceMap: true,
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
            declarationDir: './dist/cjs',
        }),
        createPackageJSON('cjs', 'commonjs'),
        ...esm.plugins.slice(4)
    ]
};

export default [ cjs, esm ];
