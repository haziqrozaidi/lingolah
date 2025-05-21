import { createRouter, createWebHistory } from 'vue-router'
import LearnView from '../views/flashcard/LearnView.vue'
import DashboardView from '../views/DashboardView.vue'
import ReviewView from '../views/flashcard/ReviewView.vue'
import VideoView from '../views/video/VideoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/learn',
      name: 'learn',
      component: LearnView,
    },
    {
      path: '/review',
      name: 'review',
      component: ReviewView,
    },
    {
      path: '/video',
      name: 'video',
      component: VideoView,
    },
  ],
})

export default router
