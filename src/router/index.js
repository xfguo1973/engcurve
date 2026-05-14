import { createRouter, createWebHistory } from 'vue-router'
import Overview from '../views/Overview.vue'
import DailyCheckin from '../views/DailyCheckin.vue'
import Listening from '../views/Listening.vue'
import Recite from '../views/Recite.vue'
import Speaking from '../views/Speaking.vue'
import Statistics from '../views/Statistics.vue'
import Calendar from '../views/Calendar.vue'
import Settings from '../views/Settings.vue'

const routes = [
  { path: '/', name: 'overview', component: Overview },
  { path: '/daily', name: 'daily', component: DailyCheckin },
  { path: '/listening', name: 'listening', component: Listening },
  { path: '/recite', name: 'recite', component: Recite },
  { path: '/speaking', name: 'speaking', component: Speaking },
  { path: '/statistics', name: 'statistics', component: Statistics },
  { path: '/calendar', name: 'calendar', component: Calendar },
  { path: '/settings', name: 'settings', component: Settings }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router