import { createRouter, createWebHistory } from 'vue-router'
import LearnView from '../views/flashcard/LearnView.vue'
import DashboardView from '../views/DashboardView.vue'
import ReviewView from '../views/flashcard/ReviewView.vue'
import ForumView from '../views/ForumView.vue'
import QuizesView from '@/views/quiz module/QuizesView.vue'
import QuizView from '@/views/quiz module/QuizQuestionsView.vue'
import VideoView from '../views/video/VideoView.vue'
import YoutubeLooper from '@/views/video/YoutubeLooper.vue'

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
      path: '/forum',
      name: 'forum',
      component: ForumView,
    },
    {
      path: '/quizes',
      name: 'quizes',
      component: QuizesView,
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: QuizView,
    },
    {
      path: '/video',
      name: 'video',
      component: VideoView,
    },
    {
      path: '/video/looper',
      name: 'youtube-looper',
      component: YoutubeLooper,
    }
  ],
})

export default router
