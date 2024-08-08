import { RouteRecordRaw } from 'vue-router'

const routes: readonly RouteRecordRaw[] = [
  {
    path: '/',
    component: async () => (await import('src/app/layouts/Main')).MainLayout,
    children: [
      {
        name: 'Device',
        path: '',
        component: async () => (await import('pages/Device')).DevicePage
      }
    ]
  },

  {
    path: '/apps',
    component: async () => (await import('src/app/layouts/Main')).MainLayout,
    children: [
      {
        path: '',
        component: async () => (await import('pages/Apps')).AppsLayout,
        children: [
          {
            name: 'Apps',
            path: '',
            component: async () => (await import('pages/Apps')).AppsPage
          },
          {
            name: 'AppsCategory',
            path: 'category/:path',
            component: async () => (await import('pages/Apps')).AppsPage
          },
          {
            name: 'AppsPath',
            path: ':path',
            component: async () => (await import('pages/Apps')).AppPage
          },
          {
            name: 'InstalledApps',
            path: 'installed',
            component: async () => (await import('pages/Apps')).InstalledAppsPage
          }
        ]
      }
    ],
    meta: {
      canLoadWithoutFlipper: true
    }
  },

  {
    path: '/archive',
    component: async () => (await import('src/app/layouts/Main')).MainLayout,
    children: [
      {
        name: 'Archive',
        path: '',
        component: async () => (await import('pages/Archive')).ArchivePage
      }
    ]
  },

  {
    path: '/cli',
    component: async () => (await import('src/app/layouts/Main')).MainLayout,
    children: [
      {
        name: 'Cli',
        path: '',
        component: async () => (await import('pages/Cli')).CliPage
      }
    ]
  },

  {
    path: '/nfc-tools',
    component: async () => (await import('src/app/layouts/Main')).MainLayout,
    children: [
      {
        name: 'NfcTools',
        path: '',
        component: async () => (await import('pages/Nfc')).NfcPage
      }
    ],
    meta: {
      canLoadWithoutFlipper: true
    }
  },

  {
    path: '/paint',
    component: async () => (await import('src/app/layouts/Main')).MainLayout,
    children: [
      {
        name: 'Paint',
        path: '',
        component: async () => (await import('pages/Paint')).PaintPage
      }
    ]
  },

  {
    path: '/pulse-plotter',
    component: async () => (await import('src/app/layouts/Main')).MainLayout,
    children: [
      {
        name: 'PulsePlotter',
        path: '',
        component: async () => (await import('pages/PulsePlotter')).PulsePlotterPage
      }
    ],
    meta: {
      canLoadWithoutFlipper: true
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: async () => (await import('pages/ErrorNotFound')).ErrorNotFoundPage,
    meta: {
      canLoadWithoutFlipper: true
    }
  }
]

export default routes
