import resolve from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import multi from 'rollup-plugin-multi-input';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js'];
export default {
    input: ['src/app.js'],
    output: {
        format: 'esm',
        dir: 'dist',
        exports: 'auto',
        ...(process.env.NODE_ENV === 'production'
            ? { plugins: [terser()] }
            : {}
        )
    },
    plugins: [
        multi(),
        resolve({ extensions }),
        cleanup({ comments: 'none' })
    ],
};
