<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Create New Flashcard Set</h3>
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
          <!-- Title Field -->
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1"
              >Title <span class="text-red-500">*</span></label
            >
            <input
              id="title"
              v-model="flashcardSet.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter flashcard set title"
            />
          </div>

          <!-- Description Field -->
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1"
              >Description</label
            >
            <textarea
              id="description"
              v-model="flashcardSet.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter description (optional)"
            ></textarea>
          </div>

          <!-- Category Field -->
          <div class="mb-4">
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1"
              >Category <span class="text-red-500">*</span></label
            >
            <select
              id="category"
              v-model="flashcardSet.categoryId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Select category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.description }}
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
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlashcardSetCreateModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    categories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      flashcardSet: {
        title: '',
        description: '',
        categoryId: ''
      }
    }
  },
  methods: {
    closeModal() {
      // Reset form data
      this.resetForm();
      // Emit close event
      this.$emit('close');
    },
    handleSubmit() {
      // Emit create event with form data
      this.$emit('create', { ...this.flashcardSet });
      // Reset form data
      this.resetForm();
      // Close modal
      this.$emit('close');
    },
    resetForm() {
      this.flashcardSet = {
        title: '',
        description: '',
        categoryId: ''
      };
    }
  },
  watch: {
    show(newValue) {
      // Reset form when modal is opened
      if (newValue) {
        this.resetForm();
      }
    }
  }
}
</script>
