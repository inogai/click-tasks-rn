import antfu from '@antfu/eslint-config'
import i18next from 'eslint-plugin-i18next'
import i18nextDefaultOpts from 'eslint-plugin-i18next/lib/options/defaults.js'
import noAutoFix from 'eslint-plugin-no-autofix'
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
      'perfectionist/sort-named-imports': 'off',
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

          // Side effect imports and polyfills.
          ['^\\u0000', '^web-streams-polyfill'],

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
  {
    rules: {
      'no-console': 'warn',
      'unused-imports/no-unused-vars': 'warn',
      'perfectionist/sort-jsx-props': ['warn', {
        groups: [
          'unknown',
          'shorthand',
          'multiline',
          'callback',
        ],
        customGroups: {
          callback: '^(on|render).*',
        },
      }],
    },
  },
  {
    plugins: {
      'no-autofix': noAutoFix,
    },
    rules: {
      'eslint-comments/no-unused-enable': 'off',
      'no-autofix/eslint-comments/no-unused-enable': 'warn',
    },
  },
  ...tailwindRules,
  ...importSortRules,
  {
    plugins: {
      i18next,
    },
    rules: {
      'i18next/no-literal-string': ['warn', {
        ...i18nextDefaultOpts,
        // see: https://github.com/edvardchen/eslint-plugin-i18next/blob/main/docs/rules/no-literal-string.md
        'mode': 'all',
        'jsx-attributes': { include: ['label'] },
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
