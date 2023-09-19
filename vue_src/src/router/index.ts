import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/create-bound',
    name: 'create-bound',
    component: () => import('../views/_CreateBound.vue')
  },
  {
    path: '/tools-box',
    name: 'tools-box',
    component: () => import('../views/_ToolsBox.vue')
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
  {
    path: '/gap-filler',
    name: 'gap-filler',
    component: () => import('../views/GapFiller.vue')
  },
  {
    path: '/conversation',
    name: 'conversation',
    component: () => import('../views/Conversation.vue')
  },
  {
    path: '/speaking',
    name: 'speaking',
    component: () => import('../views/Speaking.vue')
  },
]

const subtoolsRoutes: RouteRecordRaw = {
  path: '/sub',
  name: 'subtool',
  children: [
    {
      path: 'capture-text',
      name: 'capture-text',
      component: () => import('../views/subtools/CaptureText.vue')
    }
  ]
}

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes: [...routes, subtoolsRoutes]
})

export default router
