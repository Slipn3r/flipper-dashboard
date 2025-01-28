import { config as eslintConfig } from 'typescript-eslint'
import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginQuasar from '@quasar/app-vite/eslint'
import vueTsEslintConfig from '@vue/eslint-config-typescript'

// import tsParser from '@typescript-eslint/parser'
// import tsPlugin from '@typescript-eslint/eslint-plugin'

// the following is optional, if you want prettier too:
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// import path from 'path'
// import { fileURLToPath } from 'node:url'
// const currentDir = fileURLToPath(new URL('.', import.meta.url))

export default eslintConfig([
  {
    /**
     * Ignore the following files.
     * Please note that pluginQuasar.configs.recommended() already ignores
     * the "node_modules" folder for you (and all other Quasar project
     * relevant folders and files).
     *
     * ESLint requires "ignores" key to be the only one in this object
     */
    ignores: [
      '/src-bex/www',
      '/node_modules',
      // '.eslintrc.cjs',
      'quasar.conf.js',
      '**/protobufCompiled.js',
      '**/untar/'
    ]
  },

  ...pluginQuasar.configs.recommended(),
  js.configs.recommended,

  /**
   * https://eslint.vuejs.org
   *
   * pluginVue.configs.base
   *   -> Settings and rules to enable correct ESLint parsing.
   * pluginVue.configs[ 'flat/essential']
   *   -> base, plus rules to prevent errors or unintended behavior.
   * pluginVue.configs["flat/strongly-recommended"]
   *   -> Above, plus rules to considerably improve code readability and/or dev experience.
   * pluginVue.configs["flat/recommended"]
   *   -> Above, plus rules to enforce subjective community defaults to ensure consistency.
   */
  ...pluginVue.configs['flat/essential'],

  // https://github.com/vuejs/eslint-config-typescript
  ...vueTsEslintConfig({
    // Optional: extend additional configurations from typescript-eslint'.
    // Supports all the configurations in
    // https://typescript-eslint.io/users/configs#recommended-configurations
    extends: [
      // By default, only the recommended rules are enabled.
      'recommended'
      // You can also manually enable the stylistic rules.
      // "stylistic",

      // Other utility configurations, such as 'eslintRecommended', (note that it's in camelCase)
      // are also extendable here. But we don't recommend using them directly.
    ]
  }),

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.browser,
        ...globals.node, // SSR, Electron, config files
        process: 'readonly', // process.env.*
        ga: 'readonly', // Google Analytics
        cordova: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly', // BEX related
        browser: 'readonly' // BEX related
      }
    },

    // add your custom rules here
    rules: {
      'prefer-promise-reject-errors': 'off',
      // '@typescript-eslint/consistent-type-imports': [
      //   'error',
      //   { prefer: 'type-imports' }
      // ],

      // allow debugger during development only
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

      'vue/multi-word-component-names': 'off',

      // TEMP
      'vue/block-lang': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-case-declarations': 'off',
      'no-useless-catch': 'off',
      'no-useless-escape': 'off',
      'no-inline-config': 'off',
      'no-ex-assign': 'off',
      'no-async-promise-executor': 'off'
    }
  },

  // {
  //   files: ['**/*.ts'],

  //   parserOptions: {
  //     // parser: '@typescript-eslint/parser',
  //     project: true,
  //     projectService: true,
  //     // tsconfigRootDir: process.cwd() + '/frontend'
  //     tsconfigRootDir: import.meta.dirname
  //   },

  //   plugins: {
  //     '@typescript-eslint': tsPlugin
  //   }
  // },

  {
    files: ['src-pwa/custom-service-worker.ts'],
    languageOptions: {
      globals: {
        ...globals.serviceworker
      }
    }
  },

  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  },

  prettierSkipFormatting // optional, if you want prettier
])
