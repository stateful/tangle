import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['test/**/*.test.ts'],
        /**
         * not to ESM ported packages
         */
        exclude: [
            'dist', '.idea', '.git', '.cache',
            '/test-d',
            '**/node_modules/**'
        ],
        testTimeout: 30 * 1000, // 30s
        coverage: {
            enabled: true,
            exclude: ['**/dist/**', '**/*.test.ts'],
            lines: 93,
            functions: 90,
            branches: 93,
            statements: 93
        }
    }
});
