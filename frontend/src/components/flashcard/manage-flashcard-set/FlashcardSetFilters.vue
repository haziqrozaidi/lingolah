<template>
  <div class="mb-6 flex flex-col sm:flex-row gap-4">
    <!-- Search Bar -->
    <div class="flex-grow">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by title..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          @input="emitSearchChange"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="w-full sm:w-64">
      <select
        v-model="selectedCategory"
        class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        @change="emitCategoryChange"
      >
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.description }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlashcardSetFilters',
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
    }
  },
  methods: {
    emitSearchChange() {
      this.$emit('search-change', this.searchQuery)
    },
    emitCategoryChange() {
      this.$emit('category-change', this.selectedCategory)
    },
  },
}
</script>
