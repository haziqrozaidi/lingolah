<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const admin = ref({
  name: 'Admin User',
  role: 'Administrator'
})

// Dashboard stats
const flashcardStats = ref({
  totalSets: 0,
  totalCards: 0,
  setsCreatedThisMonth: 0,
  cardsAddedThisMonth: 0,
  mostPopularSet: '',
  mostActiveUser: ''
})
const communityStats = ref({
  totalPosts: 0,
  totalComments: 0,
  reportedPosts: 0,
  resolvedReports: 0,
  newPostsThisWeek: 0,
  newUsers: 0,
  topContributor: ''
})

// Video management statistics
const videoStats = ref({
  totalVideos: 0,
  totalPlaylists: 0,
  videosAddedThisMonth: 0,
  totalWatchTime: 0,
  mostWatchedVideo: '',
  activeViewers: 0
})

const loading = ref(true)
const error = ref(null)

const fetchDashboardStats = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('http://localhost:3000/api/admin/dashboard')
    if (!res.ok) throw new Error('Failed to fetch dashboard stats')
    const data = await res.json()
    flashcardStats.value = data.flashcards
    communityStats.value = data.community
    // Video stats are available but not displayed for now
    if (data.videos) {
      videoStats.value = data.videos
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboardStats)

const manageLinks = ref([
  {
    id: 'manage-flashcards',
    title: 'Manage Flashcards',
    description: 'Edit, delete or create new flashcard sets for users',
    icon: 'pi pi-book',
    color: 'bg-blue-500',
    link: '/admin/flashcard',
  },
  {
    id: 'manage-community',
    title: 'Moderate Community',
    description: 'Review reports, posts, and user discussions',
    icon: 'pi pi-comments',
    color: 'bg-amber-500',
    link: '/admin/forum',
  },
  {
    id: 'manage-videos',
    title: 'Manage Videos',
    description: 'Add, edit, and delete educational videos for learners',
    icon: 'pi pi-video',
    color: 'bg-purple-500',
    link: '/admin/video',
  },
])
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <div class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">Welcome, {{ admin.name }}!</h1>
      <p class="text-gray-600 mt-2">Admin dashboard for managing flashcards and the community.</p>
    </div>

    <div v-if="loading" class="text-gray-500 mb-8">Loading dashboard...</div>
    <div v-else-if="error" class="text-red-500 mb-8">Error: {{ error }}</div>
    <template v-else>
      <!-- Quick Manage Modules -->
      <div class="mb-10">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Quick Management</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink
            v-for="module in manageLinks"
            :key="module.id"
            :to="module.link"
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-transform hover:scale-105 hover:shadow-md"
          >
            <div :class="`${module.color} text-white p-3 rounded-full inline-flex mb-4`">
              <i :class="`${module.icon} text-xl`"></i>
            </div>
            <h3 class="font-semibold text-xl text-gray-800 mb-2">{{ module.title }}</h3>
            <p class="text-gray-600 text-sm">{{ module.description }}</p>
          </RouterLink>
        </div>
      </div>

      <!-- Flashcard Module Section -->
      <div class="mb-10">
        <h2 class="text-xl font-semibold text-blue-700 mb-4 flex items-center">
          <i class="pi pi-book mr-2"></i> Flashcard Module Overview
        </h2>
        <div class="bg-white rounded-xl shadow-sm border border-blue-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div class="text-3xl font-bold text-blue-600">{{ flashcardStats.totalSets }}</div>
            <div class="text-gray-700 mt-1">Total Sets</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-blue-600">{{ flashcardStats.totalCards }}</div>
            <div class="text-gray-700 mt-1">Total Cards</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-blue-600">{{ flashcardStats.setsCreatedThisMonth }}</div>
            <div class="text-gray-700 mt-1">Sets Created This Month</div>
          </div>
          <div>
            <div class="text-lg font-semibold text-blue-700 mt-4">Most Popular Set</div>
            <div class="text-gray-600">{{ flashcardStats.mostPopularSet }}</div>
          </div>
          <div>
            <div class="text-lg font-semibold text-blue-700 mt-4">Cards Added This Month</div>
            <div class="text-gray-600">{{ flashcardStats.cardsAddedThisMonth }}</div>
          </div>
          <div>
            <div class="text-lg font-semibold text-blue-700 mt-4">Most Active User</div>
            <div class="text-gray-600">{{ flashcardStats.mostActiveUser }}</div>
          </div>
        </div>
      </div>

      <!-- Community Module Section -->
      <div class="mb-10">
        <h2 class="text-xl font-semibold text-amber-700 mb-4 flex items-center">
          <i class="pi pi-comments mr-2"></i> Community Module Overview
        </h2>
        <div class="bg-white rounded-xl shadow-sm border border-amber-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div class="text-3xl font-bold text-amber-600">{{ communityStats.totalPosts }}</div>
            <div class="text-gray-700 mt-1">Total Posts</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-amber-600">{{ communityStats.totalComments }}</div>
            <div class="text-gray-700 mt-1">Total Comments</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-amber-600">{{ communityStats.reportedPosts }}</div>
            <div class="text-gray-700 mt-1">Open Reports</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-green-600 mt-4">{{ communityStats.resolvedReports }}</div>
            <div class="text-gray-700">Resolved Reports</div>
          </div>
          <div>
            <div class="text-lg font-semibold text-amber-700 mt-4">New Posts This Week</div>
            <div class="text-gray-600">{{ communityStats.newPostsThisWeek }}</div>
          </div>
          <div>
            <div class="text-lg font-semibold text-amber-700 mt-4">Top Contributor</div>
            <div class="text-gray-600">{{ communityStats.topContributor }}</div>
          </div>
          <div>
            <div class="text-lg font-semibold text-amber-700 mt-4">New Users This Week</div>
            <div class="text-gray-600">{{ communityStats.newUsers }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>