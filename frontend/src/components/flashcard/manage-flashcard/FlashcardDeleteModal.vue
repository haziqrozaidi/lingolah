<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Delete Flashcard</h3>
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
      <div class="px-6 py-4">
        <div v-if="formError" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{{ formError }}</p>
        </div>
        
        <p class="text-gray-700">Are you sure you want to delete this flashcard?</p>
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
          @click="confirmDelete"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          :disabled="isDeleting"
        >
          <span v-if="isDeleting">Deleting...</span>
          <span v-else>Delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlashcardDeleteModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    flashcard: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isDeleting: false,
      formError: '',
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
      this.formError = ''
    },
    async confirmDelete() {
      if (!this.flashcard || !this.flashcard.id) {
        this.formError = 'Invalid flashcard data'
        return
      }

      this.isDeleting = true
      try {
        await this.$emit('delete', this.flashcard)
      } catch (error) {
        this.formError = `Failed to delete: ${error.message}`
      } finally {
        this.isDeleting = false
      }
    },
  },
}
</script>
