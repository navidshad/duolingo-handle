import { authentication } from '@modular-rest/client'
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

router.beforeEach(async (to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)

  // Logout if path is login
  // because we want to login with new session.
  if (to.path === '/login') {
    authentication.logout()
  }

  // Try to login with last session
  // if authRequired is true
  if (authRequired && !authentication.isLogin) {
    await authentication.loginWithLastSession()
  }

  // Otherwise, redirect to login page
  if (authRequired && !authentication.isLogin) {
    return next('/login')
  }

  next()
})

export default router
