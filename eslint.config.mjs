import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

export default defineConfig([
    js.configs.recommended,
    {
        plugins: {
            '@stylistic': stylistic,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.commonjs,
                ...globals.es2017,
                ...globals.node,
                ...globals.mocha,
            },
            ecmaVersion: 2017,
            sourceType: 'module',
        },
        rules: {
            'no-console': 'off',
            'no-unused-vars': 'off',
            '@stylistic/linebreak-style': ['error', 'unix'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'always'],
        },
    },
    {
        files: ['**/eslint.config.*'],
        languageOptions: {
            ecmaVersion: 2021, // Node 18
        }
    }
]);