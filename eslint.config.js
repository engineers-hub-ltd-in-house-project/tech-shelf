import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        global: 'readonly',
        console: 'readonly',
        URL: 'readonly',
        HTMLDivElement: 'readonly',
        window: 'readonly',
        document: 'readonly',
        CustomEvent: 'readonly',
        globalThis: 'readonly',
        FormData: 'readonly',
        fetch: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        DragEvent: 'readonly',
        Buffer: 'readonly',
        alert: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      ...ts.configs['recommended']?.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: 'module',
        extraFileExtensions: ['.svelte'],
      },
      globals: {
        global: 'readonly',
        console: 'readonly',
        URL: 'readonly',
        HTMLDivElement: 'readonly',
        window: 'readonly',
        document: 'readonly',
        CustomEvent: 'readonly',
        globalThis: 'readonly',
        FormData: 'readonly',
        fetch: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        DragEvent: 'readonly',
        Buffer: 'readonly',
        alert: 'readonly',
      },
    },
    plugins: {
      svelte,
    },
    rules: {
      ...svelte.configs['recommended']?.[0]?.rules,
      'svelte/no-at-html-tags': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: [
      'node_modules/',
      '.svelte-kit/',
      'build/',
      'dist/',
      'prisma/migrations/',
      'prisma/seed.ts',
      'coverage/',
      '*.config.js',
      '*.config.ts',
      'vitest-setup.ts',
    ],
  },
];
