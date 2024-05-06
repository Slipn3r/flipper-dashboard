const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'Device', path: '', component: () => import('pages/Device/index.vue') }
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
          { name: 'Apps', path: '', component: () => import('pages/Apps/index.vue') },
          { name: 'AppsCategory', path: 'category/:path', component: () => import('pages/Apps/index.vue') },
          { name: 'InstalledApps', path: 'installed', component: () => import('pages/InstalledApps/index.vue') },
          { name: 'AppsPath', path: ':path', component: () => import('pages/App/index.vue') }
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
      { name: 'Archive', path: '', component: () => import('pages/Archive/index.vue') }
    ]
  },
  {
    path: '/cli',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'CLI', path: '', component: () => import('pages/Cli/index.vue') }
    ]
  },
  {
    path: '/paint',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'Paint', path: '', component: () => import('pages/Paint/index.vue') }
    ]
  },
  {
    path: '/pulse-plotter',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'PulsePlotter', path: '', component: () => import('pages/Pulseplot/index.vue') }
    ],
    meta: {
      canLoadWithoutFlipper: true
    }
  },
  {
    path: '/nfc-tools',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'NFCTools', path: '', component: () => import('pages/NfcTools/index.vue') }
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
