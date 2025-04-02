import antfu from '@antfu/eslint-config'
import i18next from 'eslint-plugin-i18next'
import readableTailwind from 'eslint-plugin-readable-tailwind'
import tailwind from 'eslint-plugin-tailwindcss'

export default antfu(
  {
    react: true,
  },
  {
    plugins: {
      'tailwindcss': tailwind,
      'readable-tailwind': readableTailwind,
    },
    rules: {
    // 'tailwindcss/classnames-order': 'warn',
      'tailwindcss/enforces-negative-arbitrary-values': 'warn',
      'tailwindcss/enforces-shorthand': 'warn',
      'tailwindcss/migration-from-tailwind-2': 'warn',
      'tailwindcss/no-arbitrary-value': 'off',
      'tailwindcss/no-custom-classname': 'warn',
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-unnecessary-arbitrary-value': 'warn',

      'readable-tailwind/multiline': 'warn',
      'readable-tailwind/no-unnecessary-whitespace': 'warn',
      'readable-tailwind/sort-classes': 'warn',
      'readable-tailwind/no-duplicate-classes': 'warn',
    },
  },
  i18next.configs['flat/recommended'],
)
