<script setup>
import { ref, computed } from 'vue'

// Dummy data for the flashcard set
const flashcards = ref([
  {
    id: 1,
    malay: 'Selamat pagi',
    english: 'Good morning',
    difficulty: null // null = not rated yet, 1 = hard, 2 = good, 3 = easy
  },
  {
    id: 2,
    malay: 'Terima kasih',
    english: 'Thank you',
    difficulty: null
  },
  {
    id: 3,
    malay: 'Apa khabar?',
    english: 'How are you?',
    difficulty: null
  },
  {
    id: 4,
    malay: 'Selamat malam',
    english: 'Good night',
    difficulty: null
  }
])

// Current card index
const currentCardIndex = ref(0)

// Current flashcard
const currentFlashcard = computed(() => flashcards.value[currentCardIndex.value])

// Track if answer is shown
const isAnswerRevealed = ref(false)

// Track card flip animation state
const isFlipping = ref(false)

// Define props for component
const props = defineProps({
  setId: {
    type: Number,
    default: 101
  }
})

// Define emits
const emit = defineEmits(['close'])

// Function to reveal answer
const revealAnswer = () => {
  isFlipping.value = true
  setTimeout(() => {
    isAnswerRevealed.value = true
    isFlipping.value = false
  }, 300)
}

// Function to rate card difficulty and move to next
const rateCard = (difficulty) => {
  // Save the difficulty rating
  flashcards.value[currentCardIndex.value].difficulty = difficulty
  
  // Move to next card or end session
  moveToNextCard()
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
      // End of session logic would go here
      // For now, just loop back to first card
      currentCardIndex.value = 0
    }
    
    isFlipping.value = false
  }, 300)
}

// Calculate progress percentage
const progressPercentage = computed(() => {
  return Math.round((currentCardIndex.value / flashcards.value.length) * 100)
})

// Function to go back to the learn view
const goBack = () => {
  emit('close')
}
</script>

<template>
  <div class="container mx-auto max-w-2xl py-8">
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
      class="bg-white border border-gray-200 rounded-2xl shadow-md h-64 flex items-center justify-center mb-8 perspective cursor-pointer"
      :class="{ 'animate-flip': isFlipping }"
      @click="!isAnswerRevealed && revealAnswer()"
    >
      <div class="text-center p-6 w-full" v-if="!isAnswerRevealed">
        <!-- Front side - Malay term -->
        <span class="text-sm font-medium text-blue-600 block mb-4">MALAY TERM</span>
        <h2 class="text-3xl font-bold text-gray-900">{{ currentFlashcard.malay }}</h2>
        <p class="mt-6 text-gray-500 text-sm">
          Tap to reveal the translation
        </p>
      </div>
      <div class="text-center p-6 w-full" v-else>
        <!-- Back side - English translation -->
        <span class="text-sm font-medium text-green-600 block mb-4">ENGLISH TRANSLATION</span>
        <h2 class="text-3xl font-bold text-gray-900">{{ currentFlashcard.english }}</h2>
        <p class="mt-6 text-gray-500 text-sm">
          How well did you know this?
        </p>
      </div>
    </div>

    <!-- Rating buttons (only shown when answer is revealed) -->
    <div class="space-y-3 mb-6" v-if="isAnswerRevealed">
      <div class="grid grid-cols-3 gap-4">
        <button
          @click="rateCard(1)"
          class="py-4 px-3 rounded-xl text-center transition-all border font-medium text-lg bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
        >
          Hard
        </button>
        
        <button
          @click="rateCard(2)"
          class="py-4 px-3 rounded-xl text-center transition-all border font-medium text-lg bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
        >
          Good
        </button>
        
        <button
          @click="rateCard(3)"
          class="py-4 px-3 rounded-xl text-center transition-all border font-medium text-lg bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
        >
          Easy
        </button>
      </div>
    </div>

    <!-- Reveal button (only shown when answer is not revealed) -->
    <div class="mb-6" v-if="!isAnswerRevealed">
      <button
        @click="revealAnswer"
        class="w-full py-4 px-6 rounded-xl text-center transition-all border font-medium text-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        Reveal Answer
      </button>
    </div>

    <!-- Mini tutorial hint -->
    <div class="mt-10 text-center text-sm text-gray-500">
      <p v-if="!isAnswerRevealed">Tap card or click "Reveal Answer" to see the translation</p>
      <p v-else>Rate how well you knew this card to continue</p>
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
