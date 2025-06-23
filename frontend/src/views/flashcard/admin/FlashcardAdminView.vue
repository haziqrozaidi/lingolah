<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Flashcard Management</h1>
      <button
        @click="openCreateModal"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Create New Flashcard
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
    >
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <FlashcardList
      v-else
      :flashcards="flashcards"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />

    <!-- Create Flashcard Modal -->
    <FlashcardCreateModal
      :isOpen="isCreateModalOpen"
      :flashcardSets="flashcardSets"
      @close="closeCreateModal"
      @save="handleSaveFlashcard"
    />

    <!-- Edit Flashcard Modal -->
    <FlashcardEditModal
      :isOpen="isEditModalOpen"
      :flashcard="selectedFlashcard"
      :flashcardSets="flashcardSets"
      @close="closeEditModal"
      @update="handleUpdateFlashcard"
    />

    <!-- Delete Flashcard Modal -->
    <FlashcardDeleteModal
      :isOpen="isDeleteModalOpen"
      :flashcard="selectedFlashcard"
      @close="closeDeleteModal"
      @delete="handleDeleteFlashcard"
    />
  </div>
</template>

<script>
import FlashcardList from '../../../components/flashcard/manage-flashcard/FlashcardList.vue'
import FlashcardCreateModal from '../../../components/flashcard/manage-flashcard/FlashcardCreateModal.vue'
import FlashcardEditModal from '../../../components/flashcard/manage-flashcard/FlashcardEditModal.vue'
import FlashcardDeleteModal from '../../../components/flashcard/manage-flashcard/FlashcardDeleteModal.vue'
import { FlashcardService } from '../../../services/flashcardService'

export default {
  name: 'FlashcardAdminView',
  components: {
    FlashcardList,
    FlashcardCreateModal,
    FlashcardEditModal,
    FlashcardDeleteModal,
  },
  data() {
    return {
      flashcards: [],
      flashcardSets: [],
      loading: true,
      error: null,
      isCreateModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      selectedFlashcard: null,
    }
  },
  async created() {
    try {
      await Promise.all([
        this.fetchFlashcards(),
        this.fetchFlashcardSets()
      ])
    } catch (error) {
      console.error('Error during initialization:', error)
    }
  },
  methods: {
    async fetchFlashcards() {
      try {
        this.loading = true
        this.error = null
        this.flashcards = await FlashcardService.getAllFlashcards()
      } catch (error) {
        this.error = `Failed to load flashcards: ${error.message}`
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async fetchFlashcardSets() {
      try {
        this.flashcardSets = await FlashcardService.getAllFlashcardSets()
      } catch (error) {
        console.error('Failed to load flashcard sets:', error)
        // Fallback to empty array
        this.flashcardSets = []
      }
    },
    openCreateModal() {
      this.isCreateModalOpen = true
    },
    closeCreateModal() {
      this.isCreateModalOpen = false
    },
    openEditModal(flashcard) {
      this.selectedFlashcard = flashcard
      this.isEditModalOpen = true
    },
    closeEditModal() {
      this.isEditModalOpen = false
      this.selectedFlashcard = null
    },
    openDeleteModal(flashcard) {
      this.selectedFlashcard = flashcard
      this.isDeleteModalOpen = true
    },
    closeDeleteModal() {
      this.isDeleteModalOpen = false
      this.selectedFlashcard = null
    },
    async handleSaveFlashcard(flashcard) {
      try {
        this.loading = true
        await FlashcardService.createFlashcard(flashcard)
        await this.fetchFlashcards()
        this.closeCreateModal()
      } catch (error) {
        this.error = `Failed to create flashcard: ${error.message}`
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async handleUpdateFlashcard(flashcard) {
      try {
        this.loading = true
        await FlashcardService.updateFlashcard(flashcard.id, flashcard)
        await this.fetchFlashcards()
        this.closeEditModal()
      } catch (error) {
        this.error = `Failed to update flashcard: ${error.message}`
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async handleDeleteFlashcard(flashcard) {
      try {
        this.loading = true
        await FlashcardService.deleteFlashcard(flashcard.id)
        await this.fetchFlashcards()
        this.closeDeleteModal()
      } catch (error) {
        this.error = `Failed to delete flashcard: ${error.message}`
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
