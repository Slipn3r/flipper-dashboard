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
    ]
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
    ]
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
        name: 'Pulseplot',
        path: '',
        component: async () => (await import('pages/Pulseplot')).PulseplotPage
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: async () => (await import('pages/ErrorNotFound')).ErrorNotFoundPage
  }
]

export default routes
