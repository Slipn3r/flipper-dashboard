import { RouteRecordRaw } from 'vue-router'

const routes: readonly RouteRecordRaw[] = [
  {
    path: '/',
    component: async () => (await import('src/app/layouts/Main')).MainLayout,
    children: [
      {
        name: 'Device',
        path: '',
        component: async () => (await import('pages/Device')).Device
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
            component: async () => (await import('pages/Apps')).Apps
          },
          {
            name: 'AppsCategory',
            path: 'category/:path',
            component: async () => (await import('pages/Apps')).Apps
          },
          {
            name: 'AppsPath',
            path: ':path',
            component: async () => (await import('pages/Apps')).App
          },
          {
            name: 'InstalledApps',
            path: 'installed',
            component: async () => (await import('pages/Apps')).InstalledApps
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
        component: async () => (await import('pages/Archive')).Archive
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
        component: async () => (await import('pages/Cli')).Cli
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
        component: async () => (await import('pages/Nfc')).Nfc
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
        component: async () => (await import('pages/Paint')).Paint
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
        component: async () => (await import('pages/Pulseplot')).Pulseplot
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: async () => (await import('pages/ErrorNotFound')).ErrorNotFound
  }
]

export default routes
