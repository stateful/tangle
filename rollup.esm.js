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

export default {
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
        }),
        createPackageJSON(),
        cleanup({ comments: 'none' })
    ],
};
