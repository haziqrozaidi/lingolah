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

    <!-- Flashcard Sets List -->
    <FlashcardSetList
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
    handleSearchChange(query) {
      this.searchQuery = query
    },
    handleCategoryChange(categoryId) {
      this.categoryFilter = categoryId
    },
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
