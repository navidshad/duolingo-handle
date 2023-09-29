import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/create-bound",
    name: "create-bound",
    component: () => import("../views/CreateBound.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/tools-box",
    name: "tools-box",
    component: () => import("../views/ToolBox.vue"),
  },
  {
    path: "/words-detector",
    name: "words-detector",
    component: () => import("../views/tools/WordsDetector.vue"),
  },
  {
    path: "/writing-guide",
    name: "writing-guide",
    component: () => import("../views/tools/WritingGuide.vue"),
  },
  {
    path: "/voice-recognition",
    name: "voice-recognition",
    component: () => import("../views/tools/VoiceRecognition.vue"),
  },
  {
    path: "/gap-filler",
    name: "gap-filler",
    component: () => import("../views/tools/GapFiller.vue"),
  },
  {
    path: "/conversation",
    name: "conversation",
    component: () => import("../views/tools/Conversation.vue"),
  },
  {
    path: "/speaking",
    name: "speaking",
    component: () => import("../views/tools/Speaking.vue"),
  },
];

const subtoolsRoutes: RouteRecordRaw = {
  path: "/sub",
  name: "subtool",
  children: [
    {
      path: "capture-text",
      name: "capture-text",
      component: () => import("../views/subtools/CaptureText.vue"),
    },
  ],
};

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes: [...routes, subtoolsRoutes],
});

export default router;
