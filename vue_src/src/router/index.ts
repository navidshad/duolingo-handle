import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/tools-box',
    name: 'tools-box',
    component: () => import('../views/ToolsBox.vue')
  },
  {
    path: '/words-detector',
    name: 'words-detector',
    component: () => import('../views/WordsDetector.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
