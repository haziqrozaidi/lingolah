<script setup>
import { ref, onMounted } from 'vue'
import { flashcardCategories, getFlashcards } from '@/data/flashcardData'

// Selected category (initially the first one)
const selectedCategory = ref(null)

// Function to select a category
const selectCategory = (category) => {
  selectedCategory.value = category
}

// Set initial selected category on mount
onMounted(() => {
  selectedCategory.value = flashcardCategories.value[0]
})

// Modal state
const isModalOpen = ref(false)
const selectedSet = ref(null)
const selectedSetFlashcards = ref([])

// Function to handle clicking on a flashcard set
const handleSetClick = (set) => {
  selectedSet.value = set
  selectedSetFlashcards.value = getFlashcards(set.id)
  isModalOpen.value = true
}

// Function to close the modal
const closeModal = () => {
  isModalOpen.value = false
}

// Helper functions to calculate difficulty dots
const getFilledDots = (cardCount) => {
  return Math.min(5, Math.floor(cardCount / 10))
}

const getEmptyDots = (cardCount) => {
  return Math.max(0, 5 - Math.floor(cardCount / 10))
}
</script>

<template>
  <div class="container mx-auto">
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Learn Malay</h1>
      <p class="text-gray-600">
        Browse through our collection of flashcard sets to build your vocabulary and improve your
        Malay language skills.
      </p>
    </div>

    <!-- Category tabs -->
    <div class="mb-6 overflow-x-auto" v-if="selectedCategory">
      <div class="flex space-x-2 pb-2">
        <button
          v-for="category in flashcardCategories"
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

          <!-- Preview of flashcards with improved styling -->
          <div class="space-y-3 mt-6">
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
                  {{ card.id }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer with just the button -->
        <div class="p-6 border-t border-gray-100 flex justify-end">
          <button
            class="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center shadow-sm"
          >
            Start Learning <i class="pi pi-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
