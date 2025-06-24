<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
      <div class="px-6 py-4">
        <div class="flex items-center justify-center">
          <div class="flex-shrink-0 bg-red-100 rounded-full p-3">
            <svg
              class="h-6 w-6 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Flashcard Set</h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete the flashcard set "{{ selectedSet?.title }}"? This
              action cannot be undone and all associated flashcards will be permanently removed.
            </p>
          </div>
        </div>
      </div>
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button
          @click="cancel"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlashcardSetDeleteModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    selectedSet: {
      type: Object,
      default: null,
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    confirmDelete() {
      this.$emit('confirm')
    },
  },
}
</script>
