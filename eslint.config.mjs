import antfu from '@antfu/eslint-config'
import i18next from 'eslint-plugin-i18next'
import readableTailwind from 'eslint-plugin-readable-tailwind'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tailwind from 'eslint-plugin-tailwindcss'

const tailwindRules = [
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
]

const importSortRules = [
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'perfectionist/sort-imports': 'off',
      'simple-import-sort/imports': ['error', {
        groups: [
          // Type imports
          ['^.+\\u0000$', '^~/components/.+\\u0000$'],

          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ['^@?\\w'],

          // Components
          ['^~/components/.+$'],

          // Other source files.
          ['^~/lib/.+$'],

          // Side effect imports.
          ['^\\u0000'],

          // Others.
        ],
      }],
    },
  },
]

export default antfu(
  {
    react: true,
  },
  ...tailwindRules,
  ...importSortRules,
  {
    plugins: {
      i18next,
    },
    rules: {
      'i18next/no-literal-string': ['warn', {
        'mode': 'all',
        'callees': { include: ['^$'] },
        'object-properties': { include: ['label'] },
      }],
    },
  },
  {
    ignores: [
      'android/**/*',
      'ios/**/*',
    ],
  },
)
