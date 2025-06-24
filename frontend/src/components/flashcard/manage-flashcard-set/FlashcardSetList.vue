<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Table Header -->
    <div class="hidden md:flex bg-gray-50 border-b border-gray-200">
      <div class="px-6 py-3 text-left w-5/12">
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Title & Info</span>
      </div>
      <div class="px-6 py-3 text-left w-2/12">
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</span>
      </div>
      <div class="px-6 py-3 text-left w-2/12">
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Created</span>
      </div>
      <div class="px-6 py-3 text-left w-2/12">
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</span>
      </div>
      <div class="px-6 py-3 text-center w-1/12">
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
      </div>
    </div>

    <!-- Table Body -->
    <div v-if="flashcardSets.length > 0">
      <div
        v-for="set in flashcardSets"
        :key="set.id"
        class="border-b border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <div class="flex flex-col md:flex-row">
          <!-- Title & Info Column -->
          <div class="px-6 py-4 w-full md:w-5/12 cursor-pointer" @click="showDetails(set)">
            <div class="flex flex-col">
              <div class="text-sm font-medium text-blue-600">{{ set.title }}</div>
              <div class="text-sm text-gray-500 mt-1 line-clamp-2">
                {{ set.description || 'No description available' }}
              </div>
              <div class="text-xs text-gray-500 mt-1 md:hidden">
                <span class="font-medium">Category:</span> {{ getCategoryName(set.categoryId) }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                <span class="font-medium">Cards:</span> {{ set.flashcards.length }}
              </div>
            </div>
          </div>

          <!-- Category Column -->
          <div
            class="hidden md:flex px-6 py-4 w-2/12 items-center cursor-pointer"
            @click="showDetails(set)"
          >
            <div class="text-sm text-gray-900">{{ getCategoryName(set.categoryId) }}</div>
          </div>

          <!-- Created Date Column -->
          <div
            class="hidden md:flex px-6 py-4 w-2/12 items-center cursor-pointer"
            @click="showDetails(set)"
          >
            <div class="text-sm text-gray-900">{{ formatDate(set.createdAt) }}</div>
          </div>

          <!-- Updated Date Column -->
          <div
            class="hidden md:flex px-6 py-4 w-2/12 items-center cursor-pointer"
            @click="showDetails(set)"
          >
            <div class="text-sm text-gray-900">{{ formatDate(set.updatedAt) }}</div>
          </div>

          <!-- Actions Column -->
          <div
            class="px-6 py-4 flex justify-end md:justify-center w-full md:w-1/12 items-center space-x-2"
          >
            <button
              @click.stop="openEdit(set)"
              class="text-blue-600 hover:text-blue-800"
              title="Edit Flashcard Set"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>
            <button
              @click.stop="openDelete(set)"
              class="text-red-600 hover:text-red-800"
              title="Delete Flashcard Set"
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

        <!-- Mobile View for Dates -->
        <div
          class="px-6 py-2 md:hidden bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between"
        >
          <div><span class="font-medium">Created:</span> {{ formatDate(set.createdAt) }}</div>
          <div><span class="font-medium">Updated:</span> {{ formatDate(set.updatedAt) }}</div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="px-6 py-12 text-center">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No flashcard sets found</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ hasFilters ? 'Try adjusting your filters' : 'No flashcard sets have been created yet' }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlashcardSetList',
  props: {
    flashcardSets: {
      type: Array,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    hasFilters: {
      type: Boolean,
      default: false,
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
    showDetails(set) {
      this.$emit('show-details', set)
    },
    openEdit(set) {
      this.$emit('open-edit', set)
    },
    openDelete(set) {
      this.$emit('open-delete', set)
    },
  },
}
</script>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
