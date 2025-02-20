/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

import { defineConfig } from '#q-app/wrappers'

import path from 'path'

import { flipperzeroProtobufUpdate, compileProtofiles } from './configs/hooks'

const removeInvalidEnvKeys = (env: NodeJS.ProcessEnv) => {
  const validKeyRE = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/

  Object.keys(env).forEach((key) => {
    if (!validKeyRE.test(key)) {
      delete env[key]
    }
  })
}

removeInvalidEnvKeys(process.env)

export default defineConfig((ctx) => {
  return {
    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ['~/src/app/boot/axios'],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ['~/src/app/styles/app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      'mdi-v7',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      alias: {
        '@': path.join(__dirname, './src'),
        assets: path.join(__dirname, './src/shared/assets'),
        boot: path.join(__dirname, './src/app/boot'),
        stores: path.join(__dirname, './src/app/stores'),
        // app: path.join(__dirname, './src/app'),
        pages: path.join(__dirname, './src/pages'),
        widgets: path.join(__dirname, './src/widgets'),
        features: path.join(__dirname, './src/features'),
        entity: path.join(__dirname, './src/entities'),
        shared: path.join(__dirname, './src/shared'),
        layouts: path.join(__dirname, './src/app/layouts'),
        components: path.join(__dirname, './src/shared/ui')
      },
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node20'
      },

      beforeDev: async () => {
        await flipperzeroProtobufUpdate()
        await compileProtofiles()
      },

      beforeBuild: async () => {
        // NOTE: REQUIRED_PROTOBUF_UPDATE must be added to .env.local
        if (process.env.REQUIRED_PROTOBUF_UPDATE === 'true') {
          await flipperzeroProtobufUpdate()
        }
        await compileProtofiles()
      },

      vueRouterMode: 'history', // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      // analyze: true,
      env: {
        DEBUGGING: ctx.debug,
        ...process.env
      },
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      // useFilenameHashes: true,

      // extendViteConf (viteConf) {},
      // viteVuePluginOptions: {},

      assets: '~/src/app/styles',

      eslint: {
        // fix: true,
        // include: [],
        // exclude: [],
        // cache: false,
        // rawEsbuildEslintOptions: {},
        // rawWebpackEslintPluginOptions: {},
        warnings: true,
        errors: true
      },

      typescript: {
        strict: true, // (recommended) enables strict settings for TypeScript
        vueShim: true // required when using ESLint with type-checked rules, will generate a shim file for `*.vue` files
        // extendTsConfig(tsConfig) {
        //   // You can use this hook to extend tsConfig dynamically
        //   // For basic use cases, you can still update the usual tsconfig.json file to override some settings
        // }
      },

      vitePlugins: [
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
            eslint: {
              lintCommand:
                'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
              useFlatConfig: true
            }
          },
          { server: false }
        ]
      ]
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      server: {
        type: 'http'
      },
      port: 8080,
      open: false
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {},

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ['Notify']
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    sourceFiles: {
      rootComponent: 'src/app/App.vue',
      router: 'src/app/router/index',
      store: 'src/app/stores/index',
      // registerServiceWorker: 'src-pwa/register-service-worker',
      // serviceWorker: 'src-pwa/custom-service-worker',
      // pwaManifestFile: 'src-pwa/manifest.json',
      // electronMain: 'src-electron/electron-main',
      preloadScripts: ['electron-preload']
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        'render' // keep this as last one
      ]
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'GenerateSW', // or 'InjectManifest'
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false
      // extendGenerateSWOptions (cfg) {}
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      inspectPort: 5858,

      bundler: 'builder', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        arch: ['arm64', 'x64']
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'com.flipperdevices.flipper-lab',
        compression: ctx.dev ? 'store' : 'maximum',
        dmg: {
          sign: false
        },
        publish: {
          provider: 'github',
          publishAutoUpdate: false
        },
        extraFiles: [
          {
            from: 'src-electron/extraResources/',
            to: 'extraResources',
            filter: ['**/*']
          }
        ],
        linux: {
          icon: 'src-electron/icons/icon.png'
        },
        win: {
          publisherName: 'Flipper Devices Inc.'
        },
        mac: {
          category: 'public.app-category.utilities',

          notarize: false,
          target: [
            {
              target: 'dmg',
              arch: ['arm64', 'x64']
            }
          ]
        }
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      extraScripts: ['my-content-script']

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    }
  }
})
