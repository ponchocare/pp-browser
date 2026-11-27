import { fileURLToPath } from 'node:url';
import { defineConfig } from 'eslint/config';
import { includeIgnoreFile } from '@eslint/compat';
import openWc from '@open-wc/eslint-config';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default defineConfig([
  includeIgnoreFile(fileURLToPath(new URL('.gitignore', import.meta.url))),
  {
    files: ['**/*.ts', '**/*.html'],
    extends: [openWc, prettier],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      'import-x/no-unresolved': 'off',
      'import-x/extensions': 'off',
    },
  },
  {
    files: ['e2e/**/*.ts'],
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: true },
      ],
    },
  },
]);
