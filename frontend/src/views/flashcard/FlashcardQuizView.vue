<script setup>
import { ref } from 'vue'

// Dummy data for the flashcard quiz
const currentFlashcard = ref({
  id: 1,
  malay: 'Selamat pagi',
  correctAnswer: 'Good morning',
  options: ['Good morning', 'Good evening', 'How are you?', 'Thank you'],
})

// Track the selected option
const selectedOption = ref(null)

// Function to handle selecting an option
const selectOption = (option) => {
  selectedOption.value = option
}

// Function to handle the "I don't know" button
const handleDontKnow = () => {
  selectedOption.value = 'dontknow'
}

// Function to move to the next card
const nextCard = () => {
  // This would typically fetch the next card
  // For now, just reset the selection
  selectedOption.value = null
}
</script>

<template>
  <div class="container mx-auto max-w-2xl py-8">
    <!-- Progress bar -->
    <div class="mb-6">
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-blue-600 h-2.5 rounded-full" style="width: 25%"></div>
      </div>
      <div class="flex justify-between mt-2 text-sm text-gray-600">
        <span>1/4</span>
        <span>Card 1</span>
      </div>
    </div>

    <!-- Flashcard question -->
    <div class="mb-8 text-center">
      <span class="text-sm font-medium text-blue-600 block mb-2">TRANSLATE THIS PHRASE</span>
      <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ currentFlashcard.malay }}</h2>
      <div class="text-gray-500 mb-2">Select the correct translation</div>
    </div>

    <!-- Answer options -->
    <div class="space-y-3 mb-6">
      <button
        v-for="(option, index) in currentFlashcard.options"
        :key="index"
        @click="selectOption(option)"
        :class="[
          'w-full py-4 px-6 rounded-xl text-left transition-all border font-medium text-lg',
          selectedOption === option
            ? 'bg-blue-100 border-blue-500 text-blue-900 shadow'
            : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50',
        ]"
      >
        <div class="flex items-center">
          <div
            class="flex justify-center items-center w-6 h-6 rounded-full mr-3 text-sm"
            :class="
              selectedOption === option ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
            "
          >
            {{ String.fromCharCode(65 + index) }}
          </div>
          {{ option }}
        </div>
      </button>

      <!-- "I don't know" button -->
      <button
        @click="handleDontKnow"
        :class="[
          'w-full py-4 px-6 rounded-xl text-left transition-all border font-medium text-lg',
          selectedOption === 'dontknow'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50',
        ]"
      >
        <div class="flex items-center">
          <div
            class="flex justify-center items-center w-6 h-6 rounded-full mr-3 text-sm bg-gray-100 text-gray-500"
          >
            ?
          </div>
          I don't know
        </div>
      </button>
    </div>

    <!-- Navigation buttons -->
    <div class="flex justify-between mt-8">
      <button
        class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
      >
        Skip
      </button>
      <button
        @click="nextCard"
        :disabled="!selectedOption"
        :class="[
          'px-8 py-3 rounded-xl font-medium shadow-sm transition-colors flex items-center',
          selectedOption
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed',
        ]"
      >
        Check Answer <i class="pi pi-check ml-2"></i>
      </button>
    </div>

    <!-- Mini tutorial hint -->
    <div class="mt-10 text-center text-sm text-gray-500">
      <p>Select your answer and click "Check Answer" to continue</p>
    </div>
  </div>
</template>

<style scoped>
/* Any additional styles if needed */
</style>
