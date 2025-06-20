<template>
  <div class="container mx-auto px-4 py-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Flashcard Sets Administration</h1>
      <p class="text-gray-600">Manage all flashcard sets in the system</p>
    </div>

    <!-- Filters Section -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <!-- Search Bar -->
      <div class="flex-grow">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
          v-model="categoryFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.description }}
          </option>
        </select>
      </div>
    </div>

    <!-- Flashcard Sets List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Table Header -->
      <div class="hidden md:flex bg-gray-50 border-b border-gray-200">
        <div class="px-6 py-3 text-left w-5/12">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Title & Info</span
          >
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
      <div v-if="filteredFlashcardSets.length > 0">
        <div
          v-for="set in filteredFlashcardSets"
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
                @click.stop="openEditModal(set)"
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
                @click.stop="openDeleteConfirm(set)"
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
          {{
            searchQuery || categoryFilter
              ? 'Try adjusting your filters'
              : 'No flashcard sets have been created yet'
          }}
        </p>
      </div>
    </div>

    <!-- Flashcard Set Details Modal -->
    <div
      v-if="showDetailsModal && selectedSet"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Flashcard Set Details</h3>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-500">
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
          <!-- Set Info -->
          <div class="mb-6">
            <h3 class="text-xl font-medium text-gray-900">{{ selectedSet.title }}</h3>
            <div class="mt-2 text-sm text-gray-600">
              {{ selectedSet.description || 'No description available' }}
            </div>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
                    />
                  </svg>
                </div>
                <span class="text-sm text-gray-600">
                  Category:
                  <span class="font-medium">{{ getCategoryName(selectedSet.categoryId) }}</span>
                </span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span class="text-sm text-gray-600">
                  Created: <span class="font-medium">{{ formatDate(selectedSet.createdAt) }}</span>
                </span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span class="text-sm text-gray-600">
                  Updated: <span class="font-medium">{{ formatDate(selectedSet.updatedAt) }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Flashcards -->
          <div class="mt-6">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-lg font-medium text-gray-900">
                Flashcards ({{ selectedSet.flashcards.length }})
              </h4>
              <button
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

            <div class="divide-y divide-gray-200">
              <div
                v-if="selectedSet.flashcards.length === 0"
                class="text-center py-6 text-gray-500"
              >
                No flashcards in this set yet
              </div>
              <div v-for="(card, index) in selectedSet.flashcards" :key="card.id" class="py-4">
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
                  <button
                    @click.stop="deleteCard(card.id)"
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

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            @click="showDetailsModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4">
          <div class="flex items-center justify-center">
            <div class="flex-shrink-0 bg-red-100 rounded-full p-3">
              <svg
                class="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <div class="mt-3 text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Flashcard Set</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Are you sure you want to delete the flashcard set "{{ selectedSet?.title }}"? This
                action cannot be undone and all associated flashcards will be permanently removed.
              </p>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlashcardSetAdminPage',
  data() {
    return {
      searchQuery: '',
      categoryFilter: '',
      flashcardSets: [],
      categories: [],
      selectedSet: null,
      showDetailsModal: false,
      showDeleteModal: false,
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
    // Load mock data when component is created
    this.loadMockData()
  },
  methods: {
    loadMockData() {
      // Mock categories
      this.categories = [
        { id: 'cat1', description: 'Web Development' },
        { id: 'cat2', description: 'Programming Languages' },
        { id: 'cat3', description: 'Science' },
        { id: 'cat4', description: 'Mathematics' },
        { id: 'cat5', description: 'Languages' },
      ]

      // Mock flashcard sets
      this.flashcardSets = [
        {
          id: 'set1',
          userId: 'user1',
          title: 'JavaScript Fundamentals',
          description: 'Essential concepts and fundamentals of JavaScript programming language.',
          categoryId: 'cat1',
          createdAt: '2025-05-15T14:30:00Z',
          updatedAt: '2025-06-10T09:15:00Z',
          flashcards: [
            {
              id: 'card1',
              setId: 'set1',
              frontText: 'What is a closure in JavaScript?',
              backText:
                "A closure is a function that has access to its own scope, the outer function's scope, and the global scope.",
              difficulty: 'Medium',
            },
            {
              id: 'card2',
              setId: 'set1',
              frontText: 'Explain the difference between let, const, and var.',
              backText:
                'var is function scoped and can be redeclared. let is block scoped and can be reassigned. const is block scoped and cannot be reassigned.',
              difficulty: 'Easy',
            },
            {
              id: 'card3',
              setId: 'set1',
              frontText: 'What is hoisting in JavaScript?',
              backText:
                "Hoisting is JavaScript's behavior of moving declarations to the top of their containing scope during compilation.",
              difficulty: 'Medium',
            },
          ],
        },
        {
          id: 'set2',
          userId: 'user1',
          title: 'Vue.js Basics',
          description: 'Introduction to Vue.js framework and its core concepts.',
          categoryId: 'cat1',
          createdAt: '2025-04-20T10:00:00Z',
          updatedAt: '2025-06-18T16:45:00Z',
          flashcards: [
            {
              id: 'card4',
              setId: 'set2',
              frontText: 'What is Vue.js?',
              backText:
                'Vue.js is a progressive JavaScript framework for building user interfaces.',
              difficulty: 'Easy',
            },
            {
              id: 'card5',
              setId: 'set2',
              frontText: 'Explain Vue directives.',
              backText:
                'Vue directives are special attributes with the v- prefix that apply special reactive behavior to the rendered DOM.',
              difficulty: 'Medium',
            },
          ],
        },
        {
          id: 'set3',
          userId: 'user2',
          title: 'Python Basics',
          description: 'Fundamental concepts of Python programming language for beginners.',
          categoryId: 'cat2',
          createdAt: '2025-03-05T08:20:00Z',
          updatedAt: '2025-05-22T11:30:00Z',
          flashcards: [
            {
              id: 'card6',
              setId: 'set3',
              frontText: 'What is a list comprehension in Python?',
              backText:
                'List comprehension is a concise way to create lists using a single line of code.',
              difficulty: 'Medium',
            },
            {
              id: 'card7',
              setId: 'set3',
              frontText: 'How do you handle exceptions in Python?',
              backText: 'Use try-except blocks to catch and handle exceptions in Python.',
              difficulty: 'Medium',
            },
            {
              id: 'card8',
              setId: 'set3',
              frontText: 'What are Python decorators?',
              backText:
                'Decorators are functions that modify the behavior of other functions or methods.',
              difficulty: 'Hard',
            },
          ],
        },
        {
          id: 'set4',
          userId: 'user3',
          title: 'Physics Laws',
          description: 'Important laws of physics and their applications.',
          categoryId: 'cat3',
          createdAt: '2025-02-10T13:45:00Z',
          updatedAt: '2025-06-05T14:20:00Z',
          flashcards: [
            {
              id: 'card9',
              setId: 'set4',
              frontText: "Newton's First Law of Motion",
              backText:
                'An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force.',
              difficulty: 'Easy',
            },
            {
              id: 'card10',
              setId: 'set4',
              frontText: "Newton's Second Law of Motion",
              backText:
                'The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass (F=ma).',
              difficulty: 'Medium',
            },
          ],
        },
        {
          id: 'set5',
          userId: 'user2',
          title: 'Spanish Vocabulary',
          description: 'Common Spanish words and phrases for beginners.',
          categoryId: 'cat5',
          createdAt: '2025-01-15T09:30:00Z',
          updatedAt: '2025-06-01T10:15:00Z',
          flashcards: [
            {
              id: 'card11',
              setId: 'set5',
              frontText: 'Hola',
              backText: 'Hello',
              difficulty: 'Easy',
            },
            {
              id: 'card12',
              setId: 'set5',
              frontText: 'Gracias',
              backText: 'Thank you',
              difficulty: 'Easy',
            },
            {
              id: 'card13',
              setId: 'set5',
              frontText: 'Por favor',
              backText: 'Please',
              difficulty: 'Easy',
            },
          ],
        },
      ]
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
      // In a real application, this would navigate to edit page or open edit modal
      console.log('Edit flashcard set:', set)
      alert(`Edit functionality for "${set.title}" would go here (UI only)`)
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
  },
}
</script>

<style>
/* Additional styles if needed */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
