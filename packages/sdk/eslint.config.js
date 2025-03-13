import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.turbo'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    files: ['**/*.{ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I']
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase']
        }
      ],
      
      // General code quality rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-unused-expressions': 'error',
    },
  },
) 