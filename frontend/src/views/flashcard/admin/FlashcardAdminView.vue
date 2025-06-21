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

    <FlashcardList @edit="openEditModal" @delete="openDeleteModal" />

    <!-- Create Flashcard Modal -->
    <FlashcardCreateModal
      :isOpen="isCreateModalOpen"
      @close="closeCreateModal"
      @save="handleSaveFlashcard"
    />

    <!-- Edit Flashcard Modal -->
    <FlashcardEditModal
      :isOpen="isEditModalOpen"
      :flashcard="selectedFlashcard"
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
      isCreateModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      selectedFlashcard: null,
    }
  },
  methods: {
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
    handleSaveFlashcard(flashcard) {
      // This would typically save the flashcard to your backend
      console.log('Saving flashcard:', flashcard)

      // For now, just close the modal
      this.closeCreateModal()
    },
    handleUpdateFlashcard(flashcard) {
      // This would typically update the flashcard in your backend
      console.log('Updating flashcard:', flashcard)

      // For now, just close the modal
      this.closeEditModal()
    },
    handleDeleteFlashcard(flashcard) {
      // This would typically delete the flashcard from your backend
      console.log('Deleting flashcard:', flashcard)

      // For now, just close the modal
      this.closeDeleteModal()
    },
  },
}
</script>
