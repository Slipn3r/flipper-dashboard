const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'Device', path: '', component: () => import('pages/Device.vue') }
    ]
  },
  {
    path: '/apps',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'AppsLayout',
        path: '',
        component: () => import('layouts/AppsLayout.vue'),
        children: [
          { name: 'Apps', path: '', component: () => import('pages/Apps.vue') },
          { name: 'AppsCategory', path: 'category/:path', component: () => import('pages/Apps.vue') },
          { name: 'InstalledApps', path: 'installed', component: () => import('pages/InstalledApps.vue') },
          { name: 'AppsPath', path: ':path', component: () => import('pages/App.vue') }
        ]
      }
    ],
    meta: {
      canLoadWithoutFlipper: true
    }
  },
  {
    path: '/archive',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'Archive', path: '', component: () => import('pages/Archive.vue') }
    ]
  },
  {
    path: '/cli',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'CLI',
        path: '',
        component: () => {
          if (window.bridge) {
            return import('pages/CliElectron.vue')
          }
          return import('pages/Cli.vue')
        }
      }
    ]
  },
  {
    path: '/paint',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'Paint', path: '', component: () => import('pages/Paint.vue') }
    ]
  },
  {
    path: '/pulse-plotter',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'PulsePlotter', path: '', component: () => import('pages/Pulseplot.vue') }
    ],
    meta: {
      canLoadWithoutFlipper: true
    }
  },
  {
    path: '/nfc-tools',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'NFCTools', path: '', component: () => import('pages/NfcTools.vue') }
    ],
    meta: {
      canLoadWithoutFlipper: true
    }
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
    meta: {
      canLoadWithoutFlipper: true
    }
  }
]

export default routes
