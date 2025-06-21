<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Create New Flashcard</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Form Content -->
      <div class="px-6 py-4">
        <form @submit.prevent="handleSubmit">
          <!-- Front Text -->
          <div class="mb-4">
            <label for="frontText" class="block text-sm font-medium text-gray-700 mb-1"
              >Front Text</label
            >
            <textarea
              id="frontText"
              v-model="flashcard.frontText"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter text for front of card"
            ></textarea>
          </div>

          <!-- Back Text -->
          <div class="mb-4">
            <label for="backText" class="block text-sm font-medium text-gray-700 mb-1"
              >Back Text</label
            >
            <textarea
              id="backText"
              v-model="flashcard.backText"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter text for back of card"
            ></textarea>
          </div>

          <!-- Difficulty -->
          <div class="mb-4">
            <label for="difficulty" class="block text-sm font-medium text-gray-700 mb-1"
              >Difficulty</label
            >
            <select
              id="difficulty"
              v-model="flashcard.difficulty"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <!-- Flashcard Set -->
          <div class="mb-4">
            <label for="set" class="block text-sm font-medium text-gray-700 mb-1">Set</label>
            <select
              id="set"
              v-model="flashcard.setId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Select flashcard set</option>
              <option v-for="set in flashcardSets" :key="set.id" :value="set.id">
                {{ set.name }}
              </option>
            </select>
          </div>
        </form>
      </div>

      <!-- Footer with Buttons -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button
          @click="closeModal"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlashcardCreateModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      flashcard: {
        frontText: '',
        backText: '',
        difficulty: '',
        setId: '',
      },
      // Mock data for flashcard sets
      flashcardSets: [
        { id: 1, name: 'Basic Vue Concepts' },
        { id: 2, name: 'JavaScript Fundamentals' },
        { id: 3, name: 'CSS Properties' },
        { id: 4, name: 'HTML Elements' },
      ],
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
      this.resetForm()
    },
    handleSubmit() {
      // Here we would typically send data to an API, but since no functionality is needed
      // we'll just log the data and close the modal
      console.log('Flashcard data:', this.flashcard)
      this.$emit('save', this.flashcard)
      this.closeModal()
    },
    resetForm() {
      this.flashcard = {
        frontText: '',
        backText: '',
        difficulty: '',
        setId: '',
      }
    },
  },
}
</script>
