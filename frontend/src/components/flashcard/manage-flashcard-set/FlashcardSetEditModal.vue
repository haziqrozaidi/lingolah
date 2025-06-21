<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Edit Flashcard Set</h3>
          <button @click="close" class="text-gray-400 hover:text-gray-500">
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
        <!-- Flashcard Set Information Form -->
        <div class="mb-8">
          <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            Set Information
          </h4>

          <!-- Title Input -->
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="title"
              v-model="editedSet.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter flashcard set title"
            />
          </div>

          <!-- Description Textarea -->
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Description <span class="text-gray-500 text-xs">(optional)</span>
            </label>
            <textarea
              id="description"
              v-model="editedSet.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a description for this flashcard set"
            ></textarea>
          </div>

          <!-- Category Dropdown -->
          <div class="mb-4">
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1"
              >Category</label
            >
            <select
              id="category"
              v-model="editedSet.categoryId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.description }}
              </option>
            </select>
          </div>
        </div>

        <!-- Flashcards Section -->
        <div class="mt-6">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-medium text-gray-900">
              Flashcards ({{ editedSet.flashcards.length }})
            </h4>
            <button
              @click="addNewFlashcard"
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

          <!-- Flashcards List with Updated Styling -->
          <div class="divide-y divide-gray-200">
            <div v-if="editedSet.flashcards.length === 0" class="text-center py-6 text-gray-500">
              No flashcards in this set yet
            </div>
            <div v-for="(card, index) in editedSet.flashcards" :key="card.id" class="py-4">
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
                <div class="flex space-x-2">
                  <!-- Edit Button -->
                  <button
                    @click="editFlashcard(index)"
                    class="text-blue-600 hover:text-blue-800"
                    title="Edit Card"
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

                  <!-- Remove Button -->
                  <button
                    @click="removeFlashcard(index)"
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
      </div>

      <!-- Footer with Buttons -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button
          @click="close"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          @click="saveChanges"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
        >
          <svg
            class="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            ></path>
          </svg>
          Save Changes
        </button>
      </div>
    </div>

    <!-- Flashcard Edit Modal -->
    <FlashcardEditModal
      :isOpen="showFlashcardModal"
      :flashcard="currentFlashcard"
      @close="closeFlashcardModal"
      @update="updateFlashcard"
    />
  </div>
</template>

<script>
import FlashcardEditModal from '@/components/flashcard/manage-flashcard/FlashcardEditModal.vue'

export default {
  name: 'FlashcardSetEditModal',
  components: {
    FlashcardEditModal,
  },
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
  data() {
    return {
      editedSet: {
        id: '',
        userId: '',
        title: '',
        description: '',
        categoryId: '',
        flashcards: [],
      },
      showFlashcardModal: false,
      currentFlashcard: null,
      editingFlashcardIndex: -1,
    }
  },
  watch: {
    selectedSet: {
      handler(newValue) {
        if (newValue) {
          // Deep clone the selected set to avoid modifying the original
          this.editedSet = JSON.parse(JSON.stringify(newValue))
        }
      },
      immediate: true,
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
    close() {
      this.$emit('close')
    },
    saveChanges() {
      // In a real application, this would save changes to the database
      this.$emit('save', this.editedSet)
      console.log('Save changes:', this.editedSet)

      // Show confirmation (UI only)
      alert(`Changes to "${this.editedSet.title}" would be saved here (UI only)`)
      this.close()
    },
    addNewFlashcard() {
      // Create a new flashcard with default values
      const newCard = {
        id: `temp-${Date.now()}`, // Temporary ID for UI purposes
        setId: this.editedSet.id,
        frontText: '',
        backText: '',
        difficulty: 'Medium',
      }

      // Set as current flashcard and open modal
      this.currentFlashcard = newCard
      this.editingFlashcardIndex = -1 // -1 indicates adding new
      this.showFlashcardModal = true
    },
    editFlashcard(index) {
      // Set the current flashcard and open modal
      this.currentFlashcard = { ...this.editedSet.flashcards[index] }
      this.editingFlashcardIndex = index
      this.showFlashcardModal = true
    },
    removeFlashcard(index) {
      // Remove flashcard from the array
      if (
        confirm('Are you sure you want to remove this flashcard? This action cannot be undone.')
      ) {
        this.editedSet.flashcards.splice(index, 1)
      }
    },
    closeFlashcardModal() {
      this.showFlashcardModal = false
      this.currentFlashcard = null
    },
    updateFlashcard(updatedFlashcard) {
      if (this.editingFlashcardIndex >= 0) {
        // Update existing flashcard
        this.editedSet.flashcards[this.editingFlashcardIndex] = updatedFlashcard
      } else {
        // Add new flashcard
        this.editedSet.flashcards.push(updatedFlashcard)
      }
      this.closeFlashcardModal()
    },
  },
}
</script>
