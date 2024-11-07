import MainLayout from 'layouts/MainLayout.vue';
import WelcomePage from 'pages/WelcomePage.vue';

export default [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        component: WelcomePage,
        meta: { requiresAuth: true }
      },
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
];
