<script setup>
import { ref, onMounted, computed } from 'vue'
import FlashcardQuizView from './FlashcardQuizView.vue'
import { FlashcardSetService } from '@/services/flashcardSetService'
import { FlashcardService } from '@/services/flashcardService'

// State variables
const categories = ref([])
const selectedCategory = ref(null)
const isLoading = ref(true)
const error = ref(null)

// Modal state
const isModalOpen = ref(false)
const selectedSet = ref(null)
const selectedSetFlashcards = ref([])

// Quiz view state
const showQuizView = ref(false)

// Function to load all categories
const loadCategories = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Fetch all categories
    const categoriesData = await FlashcardSetService.getAllCategories()
    categories.value = categoriesData.map(category => ({
      ...category,
      id: category.id,
      name: category.description,
      description: `Collection of ${category.description.toLowerCase()} flashcards`,
      icon: getCategoryIcon(category.description),
      color: getCategoryColor(category.description),
      sets: [], // Will be populated later
      loading: false
    }))

    // Fetch all flashcard sets to populate categories
    const flashcardSets = await FlashcardSetService.getAllFlashcardSets()
    
    // Group sets by category
    categories.value.forEach(category => {
      const categoryFlashcardSets = flashcardSets.filter(set => set.categoryId === category.id)
      category.sets = categoryFlashcardSets.map(set => ({
        id: set.id,
        name: set.title,
        description: set.description || 'No description available',
        cardCount: set.flashcards ? set.flashcards.length : 0
      }))
    })

    // Select the first category with sets by default
    const firstCategoryWithSets = categories.value.find(cat => cat.sets.length > 0) || categories.value[0]
    if (firstCategoryWithSets) {
      selectedCategory.value = firstCategoryWithSets
    }
    
  } catch (err) {
    console.error('Error loading categories:', err)
    error.value = 'Failed to load flashcard categories and sets. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Function to handle clicking on a flashcard set
const handleSetClick = async (set) => {
  try {
    selectedSet.value = set
    isLoading.value = true
    error.value = null
    
    // Fetch flashcards for this set
    const flashcards = await FlashcardService.getFlashcardsBySetId(set.id)
    selectedSetFlashcards.value = flashcards.map(card => ({
      id: card.id,
      malay: card.frontText, // Assuming frontText contains the Malay text
      english: card.backText, // Assuming backText contains the English translation
      difficulty: card.difficulty
    }))
    
    isModalOpen.value = true
    showQuizView.value = false // Reset quiz view when opening modal
  } catch (err) {
    console.error(`Error loading flashcards for set ${set.id}:`, err)
    error.value = 'Failed to load flashcards. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Function to close the modal
const closeModal = () => {
  isModalOpen.value = false
}

// Function to start learning (show quiz view)
const startLearning = () => {
  isModalOpen.value = false
  showQuizView.value = true
}

// Function to go back from quiz view to learn view
const goBackToLearnView = () => {
  showQuizView.value = false
}

// Function to select a category
const selectCategory = (category) => {
  selectedCategory.value = category
}

// Helper function to assign category icons based on category name/description
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase()
  if (name.includes('beginner') || name.includes('basic')) return 'pi pi-book'
  if (name.includes('grammar') || name.includes('structure')) return 'pi pi-file-edit'
  if (name.includes('conversation') || name.includes('speaking')) return 'pi pi-comments'
  if (name.includes('vocabulary') || name.includes('thematic')) return 'pi pi-list'
  if (name.includes('culture') || name.includes('expression')) return 'pi pi-globe'
  return 'pi pi-bookmark' // default icon
}

// Helper function to assign category colors based on category name/description
const getCategoryColor = (categoryName) => {
  const name = categoryName.toLowerCase()
  if (name.includes('beginner') || name.includes('basic')) return 'bg-blue-100'
  if (name.includes('grammar') || name.includes('structure')) return 'bg-purple-100'
  if (name.includes('conversation') || name.includes('speaking')) return 'bg-green-100'
  if (name.includes('vocabulary') || name.includes('thematic')) return 'bg-yellow-100'
  if (name.includes('culture') || name.includes('expression')) return 'bg-red-100'
  return 'bg-gray-100' // default color
}

// Helper functions to calculate difficulty dots
const getFilledDots = (cardCount) => {
  return Math.min(5, Math.floor(cardCount / 10))
}

const getEmptyDots = (cardCount) => {
  return Math.max(0, 5 - Math.floor(cardCount / 10))
}

// Load data on component mount
onMounted(async () => {
  await loadCategories()
})
</script>

<template>
  <div class="container mx-auto">
    <!-- Show FlashcardQuizView when in quiz mode -->
    <div v-if="showQuizView">
      <!-- Back button -->
      <div class="mb-4">
        <button
          @click="goBackToLearnView"
          class="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <i class="pi pi-arrow-left mr-2"></i> Back to flashcard sets
        </button>
      </div>

      <FlashcardQuizView :setId="selectedSet?.id" @close="showQuizView = false" />
    </div>

    <!-- Regular view when not in quiz mode -->
    <div v-else>
      <!-- Page header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Learn Malay</h1>
        <p class="text-gray-600">
          Browse through our collection of flashcard sets to build your vocabulary and improve your
          Malay language skills.
        </p>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error message -->
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p>{{ error }}</p>
        <button
          @click="loadCategories"
          class="mt-2 text-sm font-medium text-red-700 hover:text-red-900"
        >
          Try again
        </button>
      </div>

      <!-- Content when data is loaded -->
      <div v-else>
        <!-- Category tabs -->
        <div class="mb-6 overflow-x-auto" v-if="selectedCategory && categories.length > 0">
          <div class="flex space-x-2 pb-2">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectCategory(category)"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                selectedCategory.id === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              <i :class="[category.icon, 'mr-2']"></i>
              {{ category.name }}
            </button>
          </div>
        </div>

        <!-- Category description -->
        <div class="mb-6" v-if="selectedCategory">
          <div :class="['p-4 rounded-lg', selectedCategory.color]">
            <h2 class="text-xl font-semibold text-gray-800">{{ selectedCategory.name }}</h2>
            <p class="text-gray-700">{{ selectedCategory.description }}</p>
          </div>
        </div>

        <!-- Flashcard sets grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" v-if="selectedCategory">
          <div
            v-for="set in selectedCategory.sets"
            :key="set.id"
            @click="handleSetClick(set)"
            class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-semibold text-gray-800">{{ set.name }}</h3>
              <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >{{ set.cardCount }} cards</span
              >
            </div>
            <p class="text-gray-600 mb-4">{{ set.description }}</p>
            <div class="flex justify-between items-center">
              <div class="flex space-x-1">
                <template v-for="n in getFilledDots(set.cardCount)" :key="`filled-${n}`">
                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                </template>
                <template v-for="n in getEmptyDots(set.cardCount)" :key="`empty-${n}`">
                  <span class="w-2 h-2 bg-gray-200 rounded-full"></span>
                </template>
              </div>
              <button class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                Start Learning <i class="pi pi-arrow-right ml-1"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state (shown when a category has no sets) -->
        <div
          v-if="selectedCategory && selectedCategory.sets.length === 0"
          class="bg-gray-50 rounded-lg p-8 text-center"
        >
          <div class="text-gray-400 text-5xl mb-4">
            <i class="pi pi-inbox"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-700 mb-2">No flashcard sets available</h3>
          <p class="text-gray-500 mb-4">There are no flashcard sets in this category yet.</p>
        </div>
      </div>

      <!-- Improved Flashcard Set Modal -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 flex items-center justify-center z-50"
        @click.self="closeModal"
      >
        <div class="absolute inset-0 bg-gray-800 opacity-50"></div>
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden relative z-10"
        >
          <!-- Loading indicator inside modal -->
          <div v-if="isLoading" class="flex justify-center items-center py-12 flex-grow">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

          <template v-else>
            <!-- Modal Header with visual improvements -->
            <div class="p-6 border-b border-gray-100">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-2xl font-semibold text-gray-800">{{ selectedSet?.name }}</h3>
                  <p class="text-gray-600 mt-1">{{ selectedSet?.description }}</p>
                </div>
                <button
                  @click="closeModal"
                  class="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <i class="pi pi-times text-xl"></i>
                </button>
              </div>

              <!-- Category badge -->
              <div
                class="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700"
                v-if="selectedCategory"
              >
                <i :class="[selectedCategory.icon, 'mr-1 text-sm']"></i>
                {{ selectedCategory.name }}
              </div>
            </div>

            <!-- Modal Body with improved card design -->
            <div class="p-6 overflow-y-auto flex-grow">
              <div class="mb-4">
                <h4 class="text-lg font-semibold text-gray-800 mb-3">Flashcards in this set</h4>
                <p class="text-gray-600">
                  Click "Start Learning" to begin your study session with these flashcards.
                </p>
              </div>

              <!-- Error message in modal -->
              <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p>{{ error }}</p>
              </div>

              <!-- Empty state for no flashcards -->
              <div
                v-else-if="selectedSetFlashcards.length === 0"
                class="bg-gray-50 rounded-lg p-6 text-center mb-4"
              >
                <div class="text-gray-400 text-3xl mb-3">
                  <i class="pi pi-inbox"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-700 mb-2">No flashcards available</h3>
                <p class="text-gray-500">This set doesn't contain any flashcards yet.</p>
              </div>

              <!-- Preview of flashcards with improved styling -->
              <div v-else class="space-y-3 mt-6">
                <div
                  v-for="card in selectedSetFlashcards"
                  :key="card.id"
                  class="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="text-xl font-medium text-gray-800 mb-1">{{ card.malay }}</div>
                      <div class="text-gray-600">{{ card.english }}</div>
                    </div>
                    <div
                      class="ml-4 flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1.5 rounded-full"
                    >
                      {{ card.difficulty || 'Medium' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer with just the button -->
            <div class="p-6 border-t border-gray-100 flex justify-end">
              <button
                @click="startLearning"
                class="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                :disabled="selectedSetFlashcards.length === 0"
                :class="{ 'opacity-50 cursor-not-allowed': selectedSetFlashcards.length === 0 }"
              >
                Start Learning <i class="pi pi-arrow-right ml-2"></i>
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
