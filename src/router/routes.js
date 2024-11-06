import MainLayout from 'layouts/MainLayout.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue')
      }
    ]
  },
  // Si quieres agregar una ruta de "404 Not Found"
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
