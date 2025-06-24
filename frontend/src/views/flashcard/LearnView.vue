<script setup>
import { ref, onMounted, computed } from 'vue'
import FlashcardQuizView from './FlashcardQuizView.vue'
import { FlashcardSetService } from '@/services/flashcardSetService'
import { FlashcardService } from '@/services/flashcardService'

// Import extracted components
import CategoryTabs from '@/components/flashcard/learn-flashcard/CategoryTabs.vue'
import FlashcardSetsList from '@/components/flashcard/learn-flashcard/FlashcardSetsList.vue'
import FlashcardSetModal from '@/components/flashcard/learn-flashcard/FlashcardSetModal.vue'
import EmptyState from '@/components/flashcard/learn-flashcard/EmptyState.vue'

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
        <CategoryTabs 
          :categories="categories" 
          :selectedCategory="selectedCategory" 
          @select-category="selectCategory" 
        />

        <!-- Flashcard sets grid -->
        <FlashcardSetsList 
          v-if="selectedCategory && selectedCategory.sets.length > 0" 
          :flashcardSets="selectedCategory.sets"
          @set-click="handleSetClick" 
        />

        <!-- Empty state (shown when a category has no sets) -->
        <EmptyState
          v-if="selectedCategory && selectedCategory.sets.length === 0"
          title="No flashcard sets available"
          message="There are no flashcard sets in this category yet."
          icon="pi pi-inbox"
        />
      </div>

      <!-- Flashcard Set Modal -->
      <FlashcardSetModal
        :isOpen="isModalOpen"
        :isLoading="isLoading"
        :error="error"
        :selectedSet="selectedSet"
        :selectedCategory="selectedCategory"
        :flashcards="selectedSetFlashcards"
        @close="closeModal"
        @start-learning="startLearning"
      />
    </div>
  </div>
</template>
