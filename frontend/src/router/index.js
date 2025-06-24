import { createRouter, createWebHistory } from 'vue-router'
import LearnView from '../views/flashcard/LearnView.vue'
import DashboardView from '../views/DashboardView.vue'
import ReviewView from '../views/flashcard/ReviewView.vue'
import ForumView from '@/views/Forum/ForumView.vue'
import AdminForumView from '@/views/Forum/AdminForumView.vue'
import AdminCommunityView from '@/views/Forum/CommunityCreateView.vue'
import AdminCommunityRequest from '@/views/Forum/AdminCommunityRequest.vue'
import AdminCommunityDeleteView from '@/views/Forum/AdminCommunityDeleteView.vue'
import QuizesView from '@/views/quiz module/QuizesView.vue'
import QuizView from '@/views/quiz module/QuizQuestionsView.vue'
import VideoView from '../views/video/VideoView.vue'
import ManageFlashcard from '../views/flashcard/admin/FlashcardAdminView.vue'
import ManageFlashcardSet from '../views/flashcard/admin/FlashcardSetAdminPage.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import YoutubeLooper from '../views/video/YoutubeLooper.vue'
import AdminVideoView from '../views/video/AdminVideoView.vue'

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
      path: '/admin/forum',
      name: 'admin-forum',
      component: AdminForumView,
    },
    {
      path: '/admin/community',
      name: 'admin-community',
      component: AdminCommunityView,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/community/request',
      name: 'admin-community-request',
      component: AdminCommunityRequest,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/community/delete',
      name: 'admin-community-delete',
      component: AdminCommunityDeleteView,
      meta: { requiresAdmin: true }
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
      path: '/admin/flashcard',
      name: 'manage-flashcard',
      component: ManageFlashcard,
    },
    {
      path: '/admin/flashcard-set',
      name: 'manage-flashcard-set',
      component: ManageFlashcardSet,
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: { requiresAdmin: true }
    }
    {
      path: '/video/looper',
      name: 'youtube-looper',
      component: YoutubeLooper,
    },
    {
      path: '/admin/video',
      name: 'admin-video',
      component: AdminVideoView,
    },
  ],
})

export default router
