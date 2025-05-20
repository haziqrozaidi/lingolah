<script setup>
import { ref } from 'vue'

// Dummy data for flashcard sets
const flashcardCategories = ref([
  {
    id: 1,
    name: 'Beginner Vocabulary',
    description: 'Essential words and phrases for absolute beginners',
    icon: 'pi pi-book',
    color: 'bg-blue-100',
    sets: [
      {
        id: 101,
        name: 'Greetings',
        description: 'Common greetings and introductions',
        cardCount: 25,
      },
      { id: 102, name: 'Numbers', description: 'Count from 1 to 100 in Malay', cardCount: 30 },
      { id: 103, name: 'Colors', description: 'Basic color vocabulary', cardCount: 15 },
      { id: 104, name: 'Family', description: 'Family relationship terms', cardCount: 20 },
    ],
  },
  {
    id: 2,
    name: 'Daily Conversations',
    description: 'Practical phrases for everyday situations',
    icon: 'pi pi-comments',
    color: 'bg-green-100',
    sets: [
      {
        id: 201,
        name: 'At the Restaurant',
        description: 'Order food and ask for the bill',
        cardCount: 40,
      },
      {
        id: 202,
        name: 'Shopping',
        description: 'Negotiate prices and make purchases',
        cardCount: 35,
      },
      {
        id: 203,
        name: 'Transportation',
        description: 'Get around using public transport',
        cardCount: 30,
      },
      {
        id: 204,
        name: 'Asking for Directions',
        description: 'Find your way around town',
        cardCount: 25,
      },
    ],
  },
  {
    id: 3,
    name: 'Grammar Concepts',
    description: 'Fundamental grammar rules and patterns',
    icon: 'pi pi-file-edit',
    color: 'bg-purple-100',
    sets: [
      {
        id: 301,
        name: 'Subject Pronouns',
        description: 'Personal pronouns in Malay',
        cardCount: 15,
      },
      {
        id: 302,
        name: 'Verb Affixes',
        description: 'Common verb prefixes and suffixes',
        cardCount: 30,
      },
      {
        id: 303,
        name: 'Question Forms',
        description: 'How to ask different types of questions',
        cardCount: 25,
      },
    ],
  },
  {
    id: 4,
    name: 'Thematic Vocabulary',
    description: 'Words grouped by themes and situations',
    icon: 'pi pi-list',
    color: 'bg-yellow-100',
    sets: [
      {
        id: 401,
        name: 'Weather',
        description: 'Talk about the weather and seasons',
        cardCount: 20,
      },
      {
        id: 402,
        name: 'Food and Cuisine',
        description: 'Malaysian dishes and ingredients',
        cardCount: 45,
      },
      {
        id: 403,
        name: 'Hobbies',
        description: 'Activities and interests vocabulary',
        cardCount: 30,
      },
      {
        id: 404,
        name: 'Professions',
        description: 'Job titles and workplace terms',
        cardCount: 25,
      },
    ],
  },
  {
    id: 5,
    name: 'Cultural Expressions',
    description: 'Idioms, proverbs, and cultural phrases',
    icon: 'pi pi-globe',
    color: 'bg-red-100',
    sets: [
      {
        id: 501,
        name: 'Malay Proverbs',
        description: 'Common proverbs and their meanings',
        cardCount: 30,
      },
      {
        id: 502,
        name: 'Slang and Colloquialisms',
        description: 'Informal expressions used daily',
        cardCount: 40,
      },
      {
        id: 503,
        name: 'Cultural References',
        description: 'Terms related to Malaysian culture',
        cardCount: 35,
      },
    ],
  },
])

// Selected category (initially the first one)
const selectedCategory = ref(flashcardCategories.value[0])

// Function to select a category
const selectCategory = (category) => {
  selectedCategory.value = category
}

// Function to handle clicking on a flashcard set
const handleSetClick = (set) => {
  console.log(`Selected set: ${set.name}`)
  // This would navigate to the specific set view in a real implementation
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
    <div class="mb-6 overflow-x-auto">
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
    <div class="mb-6">
      <div :class="['p-4 rounded-lg', selectedCategory.color]">
        <h2 class="text-xl font-semibold text-gray-800">{{ selectedCategory.name }}</h2>
        <p class="text-gray-700">{{ selectedCategory.description }}</p>
      </div>
    </div>

    <!-- Flashcard sets grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div v-if="selectedCategory.sets.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
      <div class="text-gray-400 text-5xl mb-4">
        <i class="pi pi-inbox"></i>
      </div>
      <h3 class="text-xl font-medium text-gray-700 mb-2">No flashcard sets available</h3>
      <p class="text-gray-500 mb-4">There are no flashcard sets in this category yet.</p>
    </div>
  </div>
</template>
