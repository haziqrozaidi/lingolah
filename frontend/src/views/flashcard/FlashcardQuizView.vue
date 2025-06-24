<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { FlashcardService } from '@/services/flashcardService'
import { FlashcardSetService } from '@/services/flashcardSetService'
import { ProgressService } from '@/services/progressService'
import { useUserStore } from '@/stores/userStore'

// Get user store
const userStore = useUserStore()

// State variables
const flashcards = ref([])
const currentCardIndex = ref(0)
const isAnswerRevealed = ref(false)
const isFlipping = ref(false)
const loading = ref(true)
const error = ref(null)
const setTitle = ref('')
const showCompletionModal = ref(false)
const progressUpdating = ref(false)
const authError = ref(null)

// Define props for component
const props = defineProps({
  setId: {
    type: String,
    required: true
  }
})

// Define emits
const emit = defineEmits(['close'])

// Watch for changes in the setId prop
watch(() => props.setId, (newSetId) => {
  if (newSetId) {
    loadFlashcards(newSetId)
  }
})

// Current flashcard computed property
const currentFlashcard = computed(() => {
  if (flashcards.value.length === 0) return null
  return flashcards.value[currentCardIndex.value]
})

// Calculate progress percentage
const progressPercentage = computed(() => {
  if (flashcards.value.length === 0) return 0
  return Math.round((currentCardIndex.value / flashcards.value.length) * 100)
})

// Check if user is authenticated
const isAuthenticated = computed(() => {
  return userStore.isUserLoaded && userStore.userId
})

// Load flashcards for the given set ID
const loadFlashcards = async (setId) => {
  try {
    loading.value = true
    error.value = null
    showCompletionModal.value = false
    
    // Fetch the flashcard set to get its title
    const setData = await FlashcardSetService.getFlashcardSetById(setId)
    setTitle.value = setData.title
    
    // Fetch all flashcards for this set
    const flashcardsData = await FlashcardService.getFlashcardsBySetId(setId)
    
    // Reset state variables
    currentCardIndex.value = 0
    isAnswerRevealed.value = false
    
    // Update flashcards with data from API, and add difficulty property
    flashcards.value = flashcardsData.map(card => ({
      ...card,
      difficulty: null // null = not rated yet, 1 = hard, 2 = good, 3 = easy
    }))
  } catch (err) {
    console.error('Error loading flashcards:', err)
    error.value = 'Failed to load flashcards. Please try again.'
  } finally {
    loading.value = false
  }
}

// Function to reveal answer
const revealAnswer = () => {
  isFlipping.value = true
  setTimeout(() => {
    isAnswerRevealed.value = true
    isFlipping.value = false
  }, 300)
}

// Function to rate card difficulty and move to next
const rateCard = async (difficulty) => {
  // Check if user is authenticated
  if (!isAuthenticated.value) {
    authError.value = 'You must be logged in to save your progress.'
    // Still continue and move to next card, but don't save progress
    flashcards.value[currentCardIndex.value].difficulty = difficulty
    moveToNextCard()
    return
  }

  // Save the difficulty rating
  flashcards.value[currentCardIndex.value].difficulty = difficulty
  progressUpdating.value = true
  authError.value = null
  
  try {
    // Update progress in the backend based on difficulty
    await ProgressService.updateFlashcardProgress(
      currentFlashcard.value.id, 
      difficulty
    )
  } catch (err) {
    console.error('Error updating flashcard progress:', err)
    if (err.message === 'User not authenticated') {
      authError.value = 'You must be logged in to save your progress.'
    }
    // Continue anyway, don't block the user experience
  } finally {
    progressUpdating.value = false
    // Move to next card or end session
    moveToNextCard()
  }
}

// Function to move to the next card
const moveToNextCard = () => {
  isFlipping.value = true
  
  setTimeout(() => {
    isAnswerRevealed.value = false
    
    // Check if there are more cards
    if (currentCardIndex.value < flashcards.value.length - 1) {
      currentCardIndex.value++
    } else {
      // Show completion modal instead of alert
      showCompletionModal.value = true
    }
    
    isFlipping.value = false
  }, 300)
}

// Function to restart quiz
const restartQuiz = () => {
  // Reset state
  currentCardIndex.value = 0
  isAnswerRevealed.value = false
  showCompletionModal.value = false
  authError.value = null
  
  // Reset difficulty ratings
  flashcards.value = flashcards.value.map(card => ({
    ...card,
    difficulty: null
  }))
}

// Function to go back to the learn view
const goBack = () => {
  emit('close')
}

// Load flashcards when component is mounted
onMounted(() => {
  if (props.setId) {
    loadFlashcards(props.setId)
  }
})
</script>

<template>
  <div class="container mx-auto max-w-2xl py-8">
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading flashcards...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <p class="text-red-700">{{ error }}</p>
      <button 
        @click="loadFlashcards(props.setId)" 
        class="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
      >
        Try again
      </button>
    </div>

    <div v-else-if="flashcards.length === 0" class="text-center py-16">
      <p class="text-lg text-gray-600">No flashcards found in this set.</p>
      <button 
        @click="goBack" 
        class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>

    <div v-else>
      <!-- Set title display -->
      <h1 class="text-2xl font-bold text-center mb-6">{{ setTitle }}</h1>

      <!-- Authentication warning if not logged in -->
      <div v-if="!isAuthenticated" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p class="text-yellow-700">
          <span class="font-bold">Not logged in:</span> Your progress won't be saved. Please log in to track your learning.
        </p>
      </div>

      <!-- Auth error display -->
      <div v-if="authError" class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
        <p class="text-amber-700">{{ authError }}</p>
      </div>

      <!-- Progress bar -->
      <div class="mb-6">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
        <div class="flex justify-between mt-2 text-sm text-gray-600">
          <span>{{ currentCardIndex + 1 }}/{{ flashcards.length }}</span>
          <span>Card {{ currentCardIndex + 1 }}</span>
        </div>
      </div>

      <!-- Flashcard -->
      <div 
        v-if="currentFlashcard && !showCompletionModal"
        class="bg-white border border-gray-200 rounded-2xl shadow-md h-64 flex items-center justify-center mb-8 perspective cursor-pointer"
        :class="{ 'animate-flip': isFlipping }"
        @click="!isAnswerRevealed && revealAnswer()"
      >
        <div class="text-center p-6 w-full" v-if="!isAnswerRevealed">
          <!-- Front side - Question -->
          <span class="text-sm font-medium text-blue-600 block mb-4">QUESTION</span>
          <h2 class="text-3xl font-bold text-gray-900">{{ currentFlashcard.frontText }}</h2>
          <p class="mt-6 text-gray-500 text-sm">
            Tap to reveal the answer
          </p>
        </div>
        <div class="text-center p-6 w-full" v-else>
          <!-- Back side - Answer -->
          <span class="text-sm font-medium text-green-600 block mb-4">ANSWER</span>
          <h2 class="text-3xl font-bold text-gray-900">{{ currentFlashcard.backText }}</h2>
          <p class="mt-6 text-gray-500 text-sm">
            How well did you know this?
          </p>
        </div>
      </div>

      <!-- Completion Modal -->
      <div v-if="showCompletionModal" class="mb-8">
        <div class="bg-white border border-gray-200 rounded-2xl shadow-md p-8 text-center">
          <div class="mb-4 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p class="text-gray-600 mb-6">
            You've completed the quiz for "{{ setTitle }}". 
            <span v-if="isAuthenticated">Your progress has been saved and the review schedule has been updated based on your responses.</span>
            <span v-else>Please log in to save your progress for future study sessions.</span>
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="restartQuiz"
              class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Restart Quiz
            </button>
            <button
              @click="goBack"
              class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      <!-- Rating buttons (only shown when answer is revealed and not in completion modal) -->
      <div class="space-y-3 mb-6" v-if="isAnswerRevealed && !showCompletionModal">
        <div class="grid grid-cols-3 gap-4">
          <button
            @click="rateCard(1)"
            :disabled="progressUpdating"
            class="py-4 px-3 rounded-xl text-center transition-all border font-medium text-lg bg-red-50 border-red-200 text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            Hard
          </button>
          
          <button
            @click="rateCard(2)"
            :disabled="progressUpdating"
            class="py-4 px-3 rounded-xl text-center transition-all border font-medium text-lg bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 disabled:opacity-50"
          >
            Good
          </button>
          
          <button
            @click="rateCard(3)"
            :disabled="progressUpdating"
            class="py-4 px-3 rounded-xl text-center transition-all border font-medium text-lg bg-green-50 border-green-200 text-green-700 hover:bg-green-100 disabled:opacity-50"
          >
            Easy
          </button>
        </div>
      </div>

      <!-- Reveal button (only shown when answer is not revealed and not in completion modal) -->
      <div class="mb-6" v-if="!isAnswerRevealed && !showCompletionModal">
        <button
          @click="revealAnswer"
          class="w-full py-4 px-6 rounded-xl text-center transition-all border font-medium text-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Reveal Answer
        </button>
      </div>

      <!-- Back button -->
      <div class="mt-6 text-center" v-if="!showCompletionModal">
        <button
          @click="goBack"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Exit Quiz
        </button>
      </div>

      <!-- Mini tutorial hint -->
      <div class="mt-10 text-center text-sm text-gray-500" v-if="!showCompletionModal">
        <p v-if="!isAnswerRevealed">Tap card or click "Reveal Answer" to see the answer</p>
        <p v-else>Rate how well you knew this card to continue</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective {
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.animate-flip {
  transform: rotateY(180deg);
  transition: transform 0.3s;
}

@keyframes flip {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(180deg);
  }
}
</style>
