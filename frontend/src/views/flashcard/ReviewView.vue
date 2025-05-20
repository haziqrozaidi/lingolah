<script setup>
import { ref, onMounted } from 'vue'
import { getAllFlashcardSets } from '@/data/flashcardData'

// Get all flashcard sets to display in the progress section
const allSets = ref([])

// Dummy data for cards the user struggles with
const struggleCards = ref([
  {
    id: 1,
    malay: 'Bagai aur dengan tebing',
    english: 'Like bamboo and riverbank (inseparable)',
    status: 'Weak',
    lastReviewed: '2 days ago',
    set: 'Malay Proverbs',
  },
  {
    id: 2,
    malay: 'Sambil menyelam minum air',
    english: 'Drinking water while diving (doing two things at once)',
    status: 'Improving',
    lastReviewed: '3 days ago',
    set: 'Malay Proverbs',
  },
  {
    id: 3,
    malay: 'Berapa harganya?',
    english: 'How much does it cost?',
    status: 'Weak',
    lastReviewed: '1 day ago',
    set: 'At the Restaurant',
  },
  {
    id: 4,
    malay: 'Adakah diskaun?',
    english: 'Is there a discount?',
    status: 'Weak',
    lastReviewed: '2 days ago',
    set: 'Shopping',
  },
  {
    id: 5,
    malay: 'Terlalu mahal',
    english: 'Too expensive',
    status: 'Improving',
    lastReviewed: '1 day ago',
    set: 'Shopping',
  },
])

// Dummy data for user's progress across flashcard sets
const progressData = ref([])

// Toggle to show/hide English translation
const revealedCards = ref({})
const toggleReveal = (cardId) => {
  revealedCards.value[cardId] = !revealedCards.value[cardId]
}

// Get status color class based on status
const getStatusClass = (status) => {
  switch (status) {
    case 'Weak':
      return 'bg-red-100 text-red-800'
    case 'Improving':
      return 'bg-yellow-100 text-yellow-800'
    case 'Mastered':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Generate dummy progress data
const generateProgressData = () => {
  allSets.value = getAllFlashcardSets()

  // Create dummy progress for each set
  progressData.value = allSets.value.map((set) => {
    const reviewedCards = Math.floor(Math.random() * set.cardCount)
    const masteredCards = Math.floor(Math.random() * reviewedCards)
    const progressPercentage = Math.round((masteredCards / set.cardCount) * 100)

    return {
      ...set,
      reviewedCards,
      masteredCards,
      progressPercentage,
      lastReviewed: getRandomLastReviewedDate(),
    }
  })
}

// Helper function to get difficulty dots (matching LearnView style)
const getFilledDots = (percentage) => {
  return Math.min(5, Math.floor(percentage / 20))
}

const getEmptyDots = (percentage) => {
  return Math.max(0, 5 - Math.floor(percentage / 20))
}

// Helper to generate random "last reviewed" dates
const getRandomLastReviewedDate = () => {
  const days = ['Today', 'Yesterday', '2 days ago', '3 days ago', '1 week ago']
  return days[Math.floor(Math.random() * days.length)]
}

// Initialize component
onMounted(() => {
  generateProgressData()
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
        Review your progress and practice cards you need to work on to improve your Malay language
        skills.
      </p>
    </div>

    <!-- Cards You Struggle With Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          <i class="pi pi-exclamation-circle text-yellow-500 mr-2"></i>
          Cards You Struggle With
        </h2>
        <button class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
          View All <i class="pi pi-arrow-right ml-1"></i>
        </button>
      </div>

      <!-- Struggle Cards Grid - Styled like LearnView card grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="card in struggleCards"
          :key="card.id"
          class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div class="flex justify-between items-start mb-3">
            <span
              :class="[
                getStatusClass(card.status),
                'px-2.5 py-0.5 rounded-full text-xs font-medium',
              ]"
            >
              {{ card.status }}
            </span>
            <span class="text-xs text-gray-500">{{ card.lastReviewed }}</span>
          </div>

          <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ card.malay }}</h3>

          <div class="mb-4">
            <p v-if="revealedCards[card.id]" class="text-gray-600 animate-fade-in">
              {{ card.english }}
            </p>
            <button
              v-else
              @click="toggleReveal(card.id)"
              class="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Show translation
            </button>
          </div>

          <div class="flex justify-between items-center">
            <div class="text-xs text-gray-500">Set: {{ card.set }}</div>
            <button class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
              Review <i class="pi pi-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress by Flashcard Set Section - Styled like LearnView card grid -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          <i class="pi pi-chart-line text-blue-600 mr-2"></i>
          Your Flashcard Progress
        </h2>
        <div class="text-sm text-gray-600">Showing {{ progressData.length }} sets</div>
      </div>

      <!-- Progress Grid - Matching LearnView grid style -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="set in progressData"
          :key="set.id"
          class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold text-gray-800">{{ set.name }}</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {{ set.masteredCards }}/{{ set.cardCount }} cards
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

          <div class="text-xs text-gray-500 mt-3">Last reviewed: {{ set.lastReviewed }}</div>
        </div>
      </div>

      <!-- Empty state (shown when there are no sets with progress) -->
      <div v-if="progressData.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
        <div class="text-gray-400 text-5xl mb-4">
          <i class="pi pi-inbox"></i>
        </div>
        <h3 class="text-xl font-medium text-gray-700 mb-2">No progress data available</h3>
        <p class="text-gray-500 mb-4">Start learning with flashcards to track your progress.</p>
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
