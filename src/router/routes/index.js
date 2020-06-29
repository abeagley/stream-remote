const routes = [
  {
    path: '/',
    component: () => import('layouts/main-electron'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard'),
        name: 'Dashboard'
      },
      {
        path: 'connections',
        component: () => import('pages/connections'),
        children: [
          {
            path: 'new',
            component: () => import('pages/connections/new'),
            name: 'Connections New'
          },
          {
            path: ':connectionId',
            component: () => import('pages/connections/show'),
            name: 'Connections Show'
          }
        ]
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/errors/not-found')
  }
]

export default routes
