<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { FlashcardService } from '@/services/flashcardService'
import { FlashcardSetService } from '@/services/flashcardSetService'
import { ProgressService } from '@/services/progressService'

// Get current user data from store
const userStore = useUserStore()

// User data with progress
const user = ref({
  progress: {
    flashcardsLearned: 0,
    totalFlashcards: 0,
    flashcardsPercentage: 0,
    quizzesCompleted: 8,
    totalQuizzes: 20,
    quizzesPercentage: 40,
    videosWatched: 5,
    totalVideos: 15,
    videosPercentage: 33,
  },
})

// Recently reviewed flashcard sets
const recentSets = ref([])

// Dummy recent activity data
const recentActivities = ref([
  {
    id: 1,
    type: 'quiz',
    title: 'Daily Conversations Quiz',
    date: '2025-05-20',
    score: '8/10',
    icon: 'pi pi-check-circle',
  },
  {
    id: 2,
    type: 'flashcard',
    title: 'Beginner Vocabulary - Greetings',
    date: '2025-05-19',
    cards: 25,
    icon: 'pi pi-book',
  },
  {
    id: 3,
    type: 'video',
    title: 'Malaysian Pronunciation Basics',
    date: '2025-05-18',
    duration: '12:30',
    icon: 'pi pi-video',
  },
  {
    id: 4,
    type: 'forum',
    title: 'Asked: Help with informal greetings',
    date: '2025-05-17',
    replies: 3,
    icon: 'pi pi-comments',
  },
])

// Quick access module data
const modules = ref([
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Learn vocabulary with interactive flashcards',
    icon: 'pi pi-book',
    color: 'bg-blue-500',
    link: '/learn',
  },
  {
    id: 'quizzes',
    title: 'Quizzes',
    description: 'Test your knowledge with fun quizzes',
    icon: 'pi pi-check-square',
    color: 'bg-green-500',
    link: '/quizzes',
  },
  {
    id: 'videos',
    title: 'Videos',
    description: 'Watch instructional videos by native speakers',
    icon: 'pi pi-video',
    color: 'bg-purple-500',
    link: '/videos',
  },
  {
    id: 'forum',
    title: 'Forum',
    description: 'Discuss and ask questions with the community',
    icon: 'pi pi-comments',
    color: 'bg-amber-500',
    link: '/forum',
  },
])

// Loading state
const isLoading = ref(true)
const error = ref(null)

// Format date function
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Function to load flashcard data
const loadFlashcardData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Check if user is authenticated
    if (userStore.isUserLoaded && userStore.userId) {
      // Get all flashcard sets
      const allSets = await FlashcardSetService.getAllFlashcardSets()
      
      // Count total flashcards
      let totalFlashcards = 0
      let reviewedFlashcards = 0
      
      // Process sets to find totals and recently reviewed
      const processedSets = allSets.map(set => {
        const cardCount = set.flashcards ? set.flashcards.length : 0
        totalFlashcards += cardCount
        
        // For this example, assume some percentage of cards have been reviewed
        // In a real implementation, we would use ProgressService.getFlashcardProgress
        const randomReviewed = Math.floor(Math.random() * cardCount)
        reviewedFlashcards += randomReviewed
        
        return {
          ...set,
          reviewedCards: randomReviewed,
          totalCards: cardCount,
          lastReviewed: new Date().toISOString()
        }
      })
      
      // Sort by last reviewed date (in a real app, this would be accurate data)
      const sortedSets = processedSets.sort((a, b) => 
        new Date(b.lastReviewed) - new Date(a.lastReviewed)
      )
      
      // Take the 3 most recently reviewed sets
      recentSets.value = sortedSets.slice(0, 3)
      
      // Update user progress data
      user.value.progress.totalFlashcards = totalFlashcards
      user.value.progress.flashcardsLearned = reviewedFlashcards
      user.value.progress.flashcardsPercentage = totalFlashcards > 0 
        ? Math.round((reviewedFlashcards / totalFlashcards) * 100) 
        : 0
        
      // In a production app, we would use ProgressService.getDueFlashcards()
      // to get actual progress data
    }
  } catch (err) {
    console.error('Error loading flashcard data:', err)
    error.value = 'Failed to load flashcard data'
  } finally {
    isLoading.value = false
  }
}

// Load data when component mounts
onMounted(() => {
  loadFlashcardData()
})
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">Welcome back, {{ userStore.username }}!</h1>
      <p class="text-gray-600 mt-2">Here's your learning progress and activities.</p>
    </div>

    <!-- Progress Summary Section -->
    <div class="mb-10">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Your Learning Progress</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Flashcards Progress Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="text-lg font-medium text-gray-800">Flashcards</h3>
              <p class="text-gray-500 text-sm">Cards reviewed</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <i class="pi pi-book text-blue-600 text-xl"></i>
            </div>
          </div>
          <div class="mb-2">
            <div class="text-lg font-semibold text-gray-800">
              {{ user.progress.flashcardsLearned }} / {{ user.progress.totalFlashcards }}
              <span v-if="!isLoading && recentSets.length > 0" class="text-green-600 text-sm font-medium ml-2">
                +{{ recentSets[0]?.reviewedCards || 0 }} this week
              </span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              class="bg-blue-600 h-2.5 rounded-full"
              :style="{ width: user.progress.flashcardsPercentage + '%' }"
            ></div>
          </div>
          <div class="text-sm text-gray-500">
            {{ user.progress.flashcardsPercentage }}% complete
          </div>
        </div>

        <!-- Quizzes Progress Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="text-lg font-medium text-gray-800">Quizzes</h3>
              <p class="text-gray-500 text-sm">Completed</p>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <i class="pi pi-check-square text-green-600 text-xl"></i>
            </div>
          </div>
          <div class="mb-2">
            <div class="text-lg font-semibold text-gray-800">
              {{ user.progress.quizzesCompleted }} / {{ user.progress.totalQuizzes }}
              <span class="text-green-600 text-sm font-medium ml-2">+3 this week</span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              class="bg-green-600 h-2.5 rounded-full"
              :style="{ width: user.progress.quizzesPercentage + '%' }"
            ></div>
          </div>
          <div class="text-sm text-gray-500">{{ user.progress.quizzesPercentage }}% complete</div>
        </div>

        <!-- Videos Progress Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="text-lg font-medium text-gray-800">Videos</h3>
              <p class="text-gray-500 text-sm">Watched</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <i class="pi pi-video text-purple-600 text-xl"></i>
            </div>
          </div>
          <div class="mb-2">
            <div class="text-lg font-semibold text-gray-800">
              {{ user.progress.videosWatched }} / {{ user.progress.totalVideos }}
              <span class="text-green-600 text-sm font-medium ml-2">+1 this week</span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              class="bg-purple-600 h-2.5 rounded-full"
              :style="{ width: user.progress.videosPercentage + '%' }"
            ></div>
          </div>
          <div class="text-sm text-gray-500">{{ user.progress.videosPercentage }}% complete</div>
        </div>
      </div>
    </div>

    <!-- Quick Access Modules Section -->
    <div class="mb-10">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Continue Learning</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <RouterLink
          v-for="module in modules"
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

    <!-- Recent Activity Section -->
    <div>
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ul>
          <li
            v-for="(activity, index) in recentActivities"
            :key="activity.id"
            class="border-b border-gray-100 last:border-0"
          >
            <div
              class="flex items-center p-4 hover:bg-gray-50 transition-colors"
              :class="index === 0 ? 'bg-blue-50' : ''"
            >
              <div
                :class="`p-3 rounded-full mr-4 ${
                  activity.type === 'quiz'
                    ? 'bg-green-100'
                    : activity.type === 'flashcard'
                      ? 'bg-blue-100'
                      : activity.type === 'video'
                        ? 'bg-purple-100'
                        : 'bg-amber-100'
                }`"
              >
                <i
                  :class="`${activity.icon} ${
                    activity.type === 'quiz'
                      ? 'text-green-600'
                      : activity.type === 'flashcard'
                        ? 'text-blue-600'
                        : activity.type === 'video'
                          ? 'text-purple-600'
                          : 'text-amber-600'
                  } text-xl`"
                ></i>
              </div>
              <div class="flex-grow">
                <div class="flex justify-between">
                  <h4 class="font-medium text-gray-800">{{ activity.title }}</h4>
                  <span class="text-sm text-gray-500">{{ formatDate(activity.date) }}</span>
                </div>
                <div class="text-sm text-gray-500 mt-1">
                  <template v-if="activity.type === 'quiz'"> Scored {{ activity.score }} </template>
                  <template v-else-if="activity.type === 'flashcard'">
                    Reviewed {{ activity.cards }} cards
                  </template>
                  <template v-else-if="activity.type === 'video'">
                    Watched {{ activity.duration }} minutes
                  </template>
                  <template v-else-if="activity.type === 'forum'">
                    {{ activity.replies }} replies
                  </template>
                </div>
              </div>
              <i class="pi pi-chevron-right text-gray-400 ml-4"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
