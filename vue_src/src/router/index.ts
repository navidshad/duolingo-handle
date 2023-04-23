import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/create-bound',
    name: 'create-bound',
    component: () => import('../views/CreateBound.vue')
  },
  {
    path: '/tools-box',
    name: 'tools-box',
    component: () => import('../views/ToolsBox.vue')
  },
  {
    path: '/words-detector',
    name: 'words-detector',
    component: () => import('../views/WordsDetector.vue')
  },
  {
    path: '/writing-guide',
    name: 'writing-guide',
    component: () => import('../views/WritingGuide.vue')
  },
  {
    path: '/voice-recognition',
    name: 'voice-recognition',
    component: () => import('../views/VoiceRecognition.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
