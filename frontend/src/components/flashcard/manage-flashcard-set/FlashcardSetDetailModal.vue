<template>
  <div
    v-if="show && selectedSet"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Flashcard Set Details</h3>
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

      <!-- Content -->
      <div class="px-6 py-4 max-h-[70vh] overflow-y-auto">
        <!-- Set Info -->
        <div class="mb-6">
          <h3 class="text-xl font-medium text-gray-900">{{ selectedSet.title }}</h3>
          <div class="mt-2 text-sm text-gray-600">
            {{ selectedSet.description || 'No description available' }}
          </div>
          <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
                  />
                </svg>
              </div>
              <span class="text-sm text-gray-600">
                Category:
                <span class="font-medium">{{ getCategoryName(selectedSet.categoryId) }}</span>
              </span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <span class="text-sm text-gray-600">
                Created: <span class="font-medium">{{ formatDate(selectedSet.createdAt) }}</span>
              </span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <span class="text-sm text-gray-600">
                Updated: <span class="font-medium">{{ formatDate(selectedSet.updatedAt) }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Flashcards -->
        <div class="mt-6">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-medium text-gray-900">
              Flashcards ({{ selectedSet.flashcards.length }})
            </h4>
            <button
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Add Card
            </button>
          </div>

          <div class="divide-y divide-gray-200">
            <div v-if="selectedSet.flashcards.length === 0" class="text-center py-6 text-gray-500">
              No flashcards in this set yet
            </div>
            <div v-for="(card, index) in selectedSet.flashcards" :key="card.id" class="py-4">
              <div class="flex justify-between">
                <div class="flex-1 pr-4">
                  <div class="flex items-start">
                    <div
                      class="bg-gray-100 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-1"
                    >
                      <span class="text-xs font-medium">{{ index + 1 }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ card.frontText }}</div>
                      <div class="mt-1 text-sm text-gray-600">{{ card.backText }}</div>
                      <div class="mt-1">
                        <span
                          :class="{
                            'bg-green-100 text-green-800': card.difficulty === 'Easy',
                            'bg-yellow-100 text-yellow-800': card.difficulty === 'Medium',
                            'bg-red-100 text-red-800': card.difficulty === 'Hard',
                          }"
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        >
                          {{ card.difficulty }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  @click.stop="deleteCard(card.id)"
                  class="text-red-600 hover:text-red-800"
                  title="Remove Card"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button
          @click="closeModal"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlashcardSetDetailModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    selectedSet: {
      type: Object,
      default: null,
    },
    categories: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date)
    },
    getCategoryName(categoryId) {
      const category = this.categories.find((cat) => cat.id === categoryId)
      return category ? category.description : 'Unknown'
    },
    closeModal() {
      this.$emit('close')
    },
    deleteCard(cardId) {
      this.$emit('delete-card', cardId)
    },
  },
}
</script>
