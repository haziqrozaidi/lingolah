<template>
  <div class="container mx-auto px-4 py-6">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Flashcard Sets Administration</h1>
        <p class="text-gray-600">Manage all flashcard sets in the system</p>
      </div>
      <!-- New Flashcard Set Button -->
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        New Flashcard Set
      </button>
    </div>

    <!-- Filters Section -->
    <FlashcardSetFilters
      :categories="categories"
      @search-change="handleSearchChange"
      @category-change="handleCategoryChange"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-gray-600">Loading flashcard sets...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {{ error }}
          </p>
          <button @click="loadData" class="mt-2 text-sm text-red-700 underline hover:text-red-900">
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- Flashcard Sets List -->
    <FlashcardSetList
      v-else
      :flashcardSets="filteredFlashcardSets"
      :categories="categories"
      :hasFilters="!!searchQuery || !!categoryFilter"
      @show-details="showDetails"
      @open-edit="openEditModal"
      @open-delete="openDeleteConfirm"
    />

    <!-- Flashcard Set Details Modal -->
    <FlashcardSetDetailModal
      :show="showDetailsModal"
      :selectedSet="selectedSet"
      :categories="categories"
      @close="showDetailsModal = false"
      @delete-card="deleteCard"
    />

    <!-- Delete Confirmation Modal -->
    <FlashcardSetDeleteModal
      :show="showDeleteModal"
      :selectedSet="selectedSet"
      @cancel="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <!-- Create Flashcard Set Modal -->
    <FlashcardSetCreateModal
      :show="showCreateModal"
      :categories="categories"
      @close="showCreateModal = false"
      @create="handleCreateSubmit"
    />

    <!-- NEW: Edit Flashcard Set Modal -->
    <FlashcardSetEditModal
      :show="showEditModal"
      :selectedSet="selectedSet"
      :categories="categories"
      @close="showEditModal = false"
      @save="handleEditSubmit"
    />
  </div>
</template>

<script>
import FlashcardSetFilters from '@/components/flashcard/manage-flashcard-set/FlashcardSetFilters.vue'
import FlashcardSetList from '@/components/flashcard/manage-flashcard-set/FlashcardSetList.vue'
import FlashcardSetDetailModal from '@/components/flashcard/manage-flashcard-set/FlashcardSetDetailModal.vue'
import FlashcardSetDeleteModal from '@/components/flashcard/manage-flashcard-set/FlashcardSetDeleteModal.vue'
import FlashcardSetCreateModal from '@/components/flashcard/manage-flashcard-set/FlashcardSetCreateModal.vue'
import FlashcardSetEditModal from '@/components/flashcard/manage-flashcard-set/FlashcardSetEditModal.vue'
import { FlashcardSetService } from '@/services/flashcardSetService'

export default {
  name: 'FlashcardSetAdminPage',
  components: {
    FlashcardSetFilters,
    FlashcardSetList,
    FlashcardSetDetailModal,
    FlashcardSetDeleteModal,
    FlashcardSetCreateModal,
    FlashcardSetEditModal,
  },
  data() {
    return {
      searchQuery: '',
      categoryFilter: '',
      flashcardSets: [],
      categories: [],
      selectedSet: null,
      showDetailsModal: false,
      showDeleteModal: false,
      showCreateModal: false,
      showEditModal: false,
      isLoading: false,
      error: null,
    }
  },
  computed: {
    filteredFlashcardSets() {
      let filtered = this.flashcardSets

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (set) =>
            set.title.toLowerCase().includes(query) ||
            (set.description && set.description.toLowerCase().includes(query)),
        )
      }

      // Filter by category
      if (this.categoryFilter) {
        filtered = filtered.filter((set) => set.categoryId === this.categoryFilter)
      }

      return filtered
    },
  },
  created() {
    // Load data from backend when component is created
    this.loadData()
  },
  methods: {
    async loadData() {
      this.isLoading = true
      this.error = null

      try {
        // Load flashcard sets and categories from the backend
        const [flashcardSets, categories] = await Promise.all([
          FlashcardSetService.getAllFlashcardSets(),
          FlashcardSetService.getAllCategories(),
        ])

        this.flashcardSets = flashcardSets
        this.categories = categories
      } catch (error) {
        console.error('Error loading data:', error)
        this.error = 'Failed to load flashcard sets. Please try again later.'
      } finally {
        this.isLoading = false
      }
    },
    handleSearchChange(query) {
      this.searchQuery = query
    },
    handleCategoryChange(categoryId) {
      this.categoryFilter = categoryId
    },
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
      this.selectedSet = set
      this.showDetailsModal = true
    },
    openEditModal(set) {
      // Set the selected set and show the edit modal
      this.selectedSet = set
      this.showEditModal = true
    },
    openDeleteConfirm(set) {
      this.selectedSet = set
      this.showDeleteModal = true
    },
    confirmDelete() {
      // In a real application, this would delete the set from the database
      console.log('Delete flashcard set:', this.selectedSet)
      this.showDeleteModal = false
      alert(`Delete functionality for "${this.selectedSet.title}" would go here (UI only)`)
    },
    deleteCard(cardId) {
      // In a real application, this would delete the card from the database
      console.log('Delete flashcard:', cardId)
      alert(`Delete card functionality would go here (UI only)`)
    },
    handleCreateSubmit(newFlashcardSet) {
      // In a real application, this would create a new flashcard set
      console.log('Create flashcard set:', newFlashcardSet)

      // Generate a mock ID and add created/updated timestamps
      const newSet = {
        ...newFlashcardSet,
        id: `set${this.flashcardSets.length + 1}`,
        userId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        flashcards: [],
      }

      // Show confirmation
      alert(`Flashcard set "${newSet.title}" would be created here (UI only)`)
      this.showCreateModal = false
    },
    handleEditSubmit(updatedFlashcardSet) {
      // In a real application, this would update the flashcard set in the database
      console.log('Update flashcard set:', updatedFlashcardSet)

      // Update the timestamp
      updatedFlashcardSet.updatedAt = new Date().toISOString()

      // Update the local copy (simulate database update)
      const index = this.flashcardSets.findIndex((set) => set.id === updatedFlashcardSet.id)
      if (index !== -1) {
        // Replace the set with the updated version
        this.$set(this.flashcardSets, index, updatedFlashcardSet)
      }

      this.showEditModal = false
    },
  },
}
</script>
