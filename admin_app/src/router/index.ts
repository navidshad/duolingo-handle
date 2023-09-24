import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'voucher' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/voucher',
      name: 'voucher',
      component: () => import('../views/voucher/VoucherIndex.vue'),
      redirect: { name: 'voucher-list' },
      children: [
        {
          path: 'list',
          name: 'voucher-list',
          component: () => import('../views/voucher/VoucherListView.vue')
        },
        {
          path: 'create',
          name: 'voucher-create',
          component: () => import('../views/voucher/VoucherCreateView.vue')
        }
        // {
        //   path: 'edit/:id',
        //   name: 'voucher-edit',
        //   component: () => import('../views/voucher/VoucherEditView.vue')
        // },
      ]
    }
  ]
})

export default router
