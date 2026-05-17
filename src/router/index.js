import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Login', component: () => import('../views/Login.vue'), meta: { requiresAuth: false } },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue'), meta: { requiresAuth: false } },
  { path: '/overview', name: 'Overview', component: () => import('../views/Overview.vue'), meta: { requiresAuth: true } },
  { path: '/listening', name: 'Listening', component: () => import('../views/Listening.vue'), meta: { requiresAuth: true } },
  { path: '/recite', name: 'Recite', component: () => import('../views/Recite.vue'), meta: { requiresAuth: true } },
  { path: '/speaking', name: 'Speaking', component: () => import('../views/Speaking.vue'), meta: { requiresAuth: true } },
  { path: '/calendar', name: 'Calendar', component: () => import('../views/Calendar.vue'), meta: { requiresAuth: true } },
  { path: '/statistics', name: 'Statistics', component: () => import('../views/Statistics.vue'), meta: { requiresAuth: true } },
  { path: '/daily-checkin', name: 'DailyCheckin', component: () => import('../views/DailyCheckin.vue'), meta: { requiresAuth: true } },
  { path: '/settings', name: 'Settings', component: () => import('../views/Settings.vue'), meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory('/engcurve/'),
  routes
})

router.beforeEach(function(to, from, next) {
  const currentUser = localStorage.getItem('currentUser')
  const requiresAuth = to.meta.requiresAuth
  if (requiresAuth && !currentUser) {
    next('/')
  } else if (!requiresAuth && currentUser && to.path === '/') {
    next('/overview')
  } else {
    next()
  }
})

export default router
