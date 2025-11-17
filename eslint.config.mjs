import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import tsParser from '@typescript-eslint/parser'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactHooks from 'eslint-plugin-react-hooks'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    ignores: ['**/node_modules', '**/lib']
  },
  ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),
  {
    plugins: { 'react-refresh': reactRefresh, 'react-hooks': reactHooks },
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node
      },
      ecmaVersion: 2020,
      parserOptions: {
        project: './tsconfig.eslint.json'
      }
    },

    rules: {
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-constant-condition': [
        'error',
        {
          checkLoops: false
        }
      ],

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
      'no-dupe-class-members': 'off',
      'no-undef': 'off'
    }
  }
]
