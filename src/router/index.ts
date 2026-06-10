import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const TOKEN_KEY = 'auth_token'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/accounts',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: () => import('@/views/AccountListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const isAuthenticated = localStorage.getItem(TOKEN_KEY) !== null

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' }
  }

  // 已登入時不允許再進入登入頁
  if (to.name === 'Login' && isAuthenticated) {
    return { name: 'Accounts' }
  }
})

export default router
