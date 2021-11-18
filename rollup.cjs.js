import typescript from '@rollup/plugin-typescript';
import config, { createPackageJSON } from './rollup.esm';

config.output.format = 'cjs';
config.output.dir = 'dist/cjs';
config.plugins = [
    ...config.plugins.slice(0, 2),
    typescript({
        tsconfig: './tsconfig.json',
        outDir: 'dist/cjs',
        declarationDir: './dist/cjs',
    }),
    createPackageJSON('cjs', 'commonjs'),
    ...config.plugins.slice(4)
];
export default config;
