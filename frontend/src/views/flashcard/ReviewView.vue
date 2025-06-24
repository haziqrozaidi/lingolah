<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { ProgressService } from '@/services/progressService'
import { FlashcardSetService } from '@/services/flashcardSetService'
import { FlashcardService } from '@/services/flashcardService'

// Router for navigation
const router = useRouter()
// User store for authentication status
const userStore = useUserStore()

// Data refs
const isLoading = ref(true)
const errorMessage = ref('')
const dueFlashcards = ref([])
const progressData = ref([])
const allSets = ref([])

// Toggle to show/hide English translation
const revealedCards = ref({})
const toggleReveal = (cardId) => {
  revealedCards.value[cardId] = !revealedCards.value[cardId]
}

// Get status color class based on difficulty
const getStatusClass = (difficulty) => {
  switch (difficulty) {
    case '1':
    case 1:
      return 'bg-red-100 text-red-800'
    case '2':
    case 2:
      return 'bg-yellow-100 text-yellow-800'
    case '3':
    case 3:
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Format date function - accepts a Date object or date string
const formatDate = (dateValue) => {
  if (!dateValue) return 'Never'
  
  const date = new Date(dateValue)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

// Calculate days until next review
const getDaysUntilNextReview = (nextReviewDate) => {
  if (!nextReviewDate) return 'Unknown'
  
  const now = new Date()
  const nextReview = new Date(nextReviewDate)
  const diffTime = nextReview - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return 'Due now'
  } else if (diffDays === 0) {
    return 'Due today'
  } else if (diffDays === 1) {
    return 'Tomorrow'
  } else {
    return `In ${diffDays} days`
  }
}

// Helper function to get difficulty dots
const getFilledDots = (percentage) => {
  return Math.min(5, Math.floor(percentage / 20))
}

const getEmptyDots = (percentage) => {
  return Math.max(0, 5 - Math.floor(percentage / 20))
}

// Group flashcards by their set
const groupedDueFlashcards = computed(() => {
  const grouped = {}
  
  dueFlashcards.value.forEach(item => {
    const setId = item.card.setId
    const setTitle = item.card.set?.title || 'Unknown Set'
    
    if (!grouped[setId]) {
      grouped[setId] = {
        id: setId,
        title: setTitle,
        description: item.card.set?.description || '',
        category: item.card.set?.category?.description || 'Uncategorized',
        cards: []
      }
    }
    
    grouped[setId].cards.push(item)
  })
  
  return Object.values(grouped)
})

// Function to handle reviewing a flashcard
const reviewCard = async (card, difficulty) => {
  try {
    await ProgressService.updateFlashcardProgress(card.card.id, difficulty)
    
    // Remove the reviewed card from the list
    dueFlashcards.value = dueFlashcards.value.filter(
      item => item.card.id !== card.card.id
    )
    
    // Show success notification or feedback
  } catch (error) {
    console.error('Failed to update card progress:', error)
    errorMessage.value = 'Failed to update your progress. Please try again.'
  }
}

// Navigate to a specific flashcard set for review
const navigateToSetReview = (setId) => {
  router.push({
    name: 'flashcard-set-review',
    params: { id: setId }
  })
}

// Load due flashcards and progress data
const loadData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // Only load data if user is authenticated
    if (userStore.userId && userStore.isUserLoaded) {
      // Get all flashcard sets using FlashcardSetService instead of dummy data
      allSets.value = await FlashcardSetService.getAllFlashcardSets()
      
      // Process sets to ensure they have the required properties
      allSets.value = allSets.value.map(set => ({
        id: set.id,
        name: set.title,
        description: set.description || 'No description available',
        cardCount: set.flashcards?.length || 0
      }))
      
      // Get due flashcards from API
      dueFlashcards.value = await ProgressService.getDueFlashcards()
      
      // Process progress data
      const progressMetrics = {}
      
      // Initialize progress data for all sets
      allSets.value.forEach(set => {
        progressMetrics[set.id] = {
          ...set,
          reviewedCards: 0,
          masteredCards: 0,
          progressPercentage: 0,
          lastReviewed: null,
          nextReviewDate: null
        }
      })
      
      // Update progress metrics based on due flashcards
      dueFlashcards.value.forEach(item => {
        const setId = item.card.setId
        
        if (progressMetrics[setId]) {
          // Increment reviewed cards count
          progressMetrics[setId].reviewedCards++
          
          // Update last and next review dates if this is more recent
          const lastReviewDate = new Date(item.lastReview)
          if (!progressMetrics[setId].lastReviewed || lastReviewDate > new Date(progressMetrics[setId].lastReviewed)) {
            progressMetrics[setId].lastReviewed = item.lastReview
          }
          
          // Set the next review date to the earliest due date
          const nextReviewDate = new Date(item.nextReview)
          if (!progressMetrics[setId].nextReviewDate || nextReviewDate < new Date(progressMetrics[setId].nextReviewDate)) {
            progressMetrics[setId].nextReviewDate = item.nextReview
          }
          
          // Increment mastered cards if difficulty is 3 (Easy)
          if (item.card.difficulty === 3) {
            progressMetrics[setId].masteredCards++
          }
        }
      })
      
      // For sets that don't have any entries in dueFlashcards,
      // fetch their card counts to calculate progress percentages accurately
      for (const setId in progressMetrics) {
        if (!progressMetrics[setId].reviewedCards) {
          try {
            // Fetch flashcards for this set to get accurate counts
            const setFlashcards = await FlashcardService.getFlashcardsBySetId(setId)
            progressMetrics[setId].cardCount = setFlashcards.length
            
            // Also check if any of these cards have progress records
            for (const card of setFlashcards) {
              try {
                const progress = await ProgressService.getFlashcardProgress(card.id)
                if (progress) {
                  progressMetrics[setId].reviewedCards++
                  
                  // Update lastReviewed date if it's more recent
                  const lastReviewDate = new Date(progress.lastReview)
                  if (!progressMetrics[setId].lastReviewed || lastReviewDate > new Date(progressMetrics[setId].lastReviewed)) {
                    progressMetrics[setId].lastReviewed = progress.lastReview
                  }
                  
                  // Set the next review date
                  const nextReviewDate = new Date(progress.nextReview)
                  if (!progressMetrics[setId].nextReviewDate || nextReviewDate < new Date(progressMetrics[setId].nextReviewDate)) {
                    progressMetrics[setId].nextReviewDate = progress.nextReview
                  }
                  
                  // Count mastered cards
                  if (card.difficulty === 3) {
                    progressMetrics[setId].masteredCards++
                  }
                }
              } catch (err) {
                console.warn(`Could not fetch progress for card ${card.id}`, err)
              }
            }
          } catch (err) {
            console.warn(`Could not fetch flashcards for set ${setId}`, err)
          }
        }
      }
      
      // Calculate progress percentages
      Object.values(progressMetrics).forEach(set => {
        if (set.cardCount > 0) {
          // Calculate percentage of reviewed cards
          set.progressPercentage = Math.round((set.reviewedCards / set.cardCount) * 100)
        }
      })
      
      // Convert to array for template rendering
      progressData.value = Object.values(progressMetrics)
    } else {
      // If user is not authenticated, show appropriate message
      errorMessage.value = 'Please sign in to view your flashcard progress.'
    }
  } catch (error) {
    console.error('Error loading flashcard progress data:', error)
    errorMessage.value = 'Failed to load your progress data. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Initialize component
onMounted(() => {
  loadData()
})

// Current date display
const currentDate = ref(
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)
</script>

<template>
  <div class="container mx-auto">
    <!-- Page Header - Matching LearnView style -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Review Flashcards</h1>
      <p class="text-gray-600">
        Review your progress and practice cards you need to work on to improve your language skills.
        <span class="text-sm text-gray-500 ml-2">{{ currentDate }}</span>
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error message -->
    <div v-else-if="errorMessage" class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-8">
      <div class="flex items-center">
        <i class="pi pi-exclamation-circle mr-3 text-red-500"></i>
        <span>{{ errorMessage }}</span>
      </div>
      <button 
        @click="loadData" 
        class="mt-2 text-red-700 hover:text-red-900 text-sm font-medium"
      >
        Try Again
      </button>
    </div>

    <div v-else>
      <!-- Due Cards Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">
            <i class="pi pi-exclamation-circle text-yellow-500 mr-2"></i>
            Cards Due for Review
          </h2>
          <span class="text-blue-600 font-medium text-sm">
            {{ dueFlashcards.length }} cards due
          </span>
        </div>

        <!-- Due Cards Grid -->
        <div v-if="dueFlashcards.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="card in dueFlashcards"
            :key="card.progressId"
            class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start mb-3">
              <span
                :class="[
                  getStatusClass(card.card.difficulty),
                  'px-2.5 py-0.5 rounded-full text-xs font-medium',
                ]"
              >
                {{ card.card.difficulty === 1 ? 'Hard' : card.card.difficulty === 2 ? 'Medium' : 'Easy' }}
              </span>
              <span class="text-xs text-gray-500">Last: {{ formatDate(card.lastReview) }}</span>
            </div>

            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ card.card.frontText }}</h3>

            <div class="mb-4">
              <p v-if="revealedCards[card.card.id]" class="text-gray-600 animate-fade-in">
                {{ card.card.backText }}
              </p>
              <button
                v-else
                @click="toggleReveal(card.card.id)"
                class="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Show answer
              </button>
            </div>

            <div class="flex justify-between items-center">
              <div class="text-xs text-gray-500">
                {{ card.card.set?.title || 'Unknown Set' }}
              </div>
              <div class="flex space-x-2">
                <button 
                  @click="reviewCard(card, 1)" 
                  class="text-red-600 hover:text-red-800 font-medium text-sm px-2 py-1 border border-red-200 rounded hover:bg-red-50"
                >
                  Hard
                </button>
                <button 
                  @click="reviewCard(card, 2)" 
                  class="text-yellow-600 hover:text-yellow-800 font-medium text-sm px-2 py-1 border border-yellow-200 rounded hover:bg-yellow-50"
                >
                  Good
                </button>
                <button 
                  @click="reviewCard(card, 3)" 
                  class="text-green-600 hover:text-green-800 font-medium text-sm px-2 py-1 border border-green-200 rounded hover:bg-green-50"
                >
                  Easy
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Due Cards -->
        <div v-else class="bg-gray-50 rounded-lg p-8 text-center">
          <div class="text-gray-400 text-5xl mb-4">
            <i class="pi pi-check-circle"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-700 mb-2">No cards due for review</h3>
          <p class="text-gray-500 mb-4">Great job! You're all caught up with your reviews.</p>
        </div>
      </div>

      <!-- Progress by Flashcard Set Section -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">
            <i class="pi pi-chart-line text-blue-600 mr-2"></i>
            Your Flashcard Progress
          </h2>
          <div class="text-sm text-gray-600">Showing {{ progressData.length }} sets</div>
        </div>

        <!-- Progress Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="set in progressData"
            :key="set.id"
            class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            @click="navigateToSetReview(set.id)"
          >
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-semibold text-gray-800">{{ set.name }}</h3>
              <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {{ set.reviewedCards }}/{{ set.cardCount }} cards
              </span>
            </div>

            <p class="text-gray-600 mb-2">{{ set.description }}</p>

            <!-- Progress bar -->
            <div class="w-full h-2 bg-gray-200 rounded-full mb-2">
              <div
                class="h-full bg-blue-600 rounded-full"
                :style="{ width: `${set.progressPercentage}%` }"
              ></div>
            </div>

            <div class="flex justify-between items-center">
              <div class="flex space-x-1">
                <template v-for="n in getFilledDots(set.progressPercentage)" :key="`filled-${n}`">
                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                </template>
                <template v-for="n in getEmptyDots(set.progressPercentage)" :key="`empty-${n}`">
                  <span class="w-2 h-2 bg-gray-200 rounded-full"></span>
                </template>
              </div>
              <button class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                Review <i class="pi pi-arrow-right ml-1"></i>
              </button>
            </div>

            <div class="flex justify-between text-xs text-gray-500 mt-3">
              <span v-if="set.lastReviewed">Last: {{ formatDate(set.lastReviewed) }}</span>
              <span v-else>Never reviewed</span>
              <span v-if="set.nextReviewDate">Next: {{ getDaysUntilNextReview(set.nextReviewDate) }}</span>
            </div>
          </div>
        </div>

        <!-- Empty state (shown when there are no sets with progress) -->
        <div v-if="progressData.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
          <div class="text-gray-400 text-5xl mb-4">
            <i class="pi pi-inbox"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-700 mb-2">No progress data available</h3>
          <p class="text-gray-500 mb-4">Start learning with flashcards to track your progress.</p>
          <button 
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            @click="$router.push({ name: 'flashcard-learn' })"
          >
            Start Learning
          </button>
        </div>
      </div>

      <!-- Group by Set Section -->
      <div class="mt-10" v-if="groupedDueFlashcards.length > 0">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">
            <i class="pi pi-folder text-amber-600 mr-2"></i>
            Due Cards by Set
          </h2>
        </div>
        
        <div class="space-y-6">
          <div 
            v-for="group in groupedDueFlashcards" 
            :key="group.id"
            class="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <div 
              class="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
              @click="navigateToSetReview(group.id)"
            >
              <div>
                <h3 class="font-medium text-gray-800">{{ group.title }}</h3>
                <p class="text-sm text-gray-600">{{ group.description }}</p>
                <span class="text-xs text-gray-500">{{ group.category }}</span>
              </div>
              <div class="flex flex-col items-end">
                <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {{ group.cards.length }} cards due
                </span>
                <button class="text-blue-600 hover:text-blue-800 text-sm mt-2">
                  Review All <i class="pi pi-arrow-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
