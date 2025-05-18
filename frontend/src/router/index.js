import { createRouter, createWebHistory } from 'vue-router'
import ForumView from '../views/ForumView.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/forum',
      name: 'forum',
      component: ForumView,
    }
  ],
})

export default router
