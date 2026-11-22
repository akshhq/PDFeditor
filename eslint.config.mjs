import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const filename = fileURLToPath(import.meta.url);
const directory = path.dirname(filename);
const compat = new FlatCompat({
  baseDirectory: directory,
  recommendedConfig: js.configs.recommended,
});

const config = [
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'public/**', 'src-tauri/target/**'],
  },
  ...compat.extends('next/core-web-vitals'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      '@next/next/no-assign-module-variable': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

export default config;
