<template>
  <div>
    <FlashcardFilter @filter="handleFilter" />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <FlashcardItem
        v-for="flashcard in filteredFlashcards"
        :key="flashcard.id"
        :flashcard="formatFlashcardForDisplay(flashcard)"
        @edit="$emit('edit', flashcard)"
        @delete="$emit('delete', flashcard)"
      />
    </div>

    <div v-if="filteredFlashcards.length === 0" class="text-center py-8">
      <p class="text-gray-500">No flashcards found.</p>
    </div>
  </div>
</template>

<script>
import FlashcardItem from './FlashcardItem.vue'
import FlashcardFilter from './FlashcardFilter.vue'

export default {
  name: 'FlashcardList',
  components: {
    FlashcardItem,
    FlashcardFilter,
  },
  props: {
    flashcards: {
      type: Array,
      required: true,
    },
  },
  emits: ['edit', 'delete'],
  data() {
    return {
      filterOptions: {
        difficulty: '',
        setId: '',
        searchTerm: '',
      },
    }
  },
  computed: {
    filteredFlashcards() {
      if (!this.flashcards) {
        return []
      }

      return this.flashcards.filter((card) => {
        // Filter by difficulty
        if (this.filterOptions.difficulty && card.difficulty !== this.filterOptions.difficulty) {
          return false
        }

        // Filter by set ID
        if (this.filterOptions.setId && card.setId !== this.filterOptions.setId) {
          return false
        }

        // Filter by search term
        if (this.filterOptions.searchTerm) {
          const searchTerm = this.filterOptions.searchTerm.toLowerCase()
          const frontText = card.frontText ? card.frontText.toLowerCase() : ''
          const backText = card.backText ? card.backText.toLowerCase() : ''

          if (!frontText.includes(searchTerm) && !backText.includes(searchTerm)) {
            return false
          }
        }

        return true
      })
    },
  },
  methods: {
    handleFilter(filterOptions) {
      this.filterOptions = filterOptions
    },
    formatFlashcardForDisplay(flashcard) {
      // Format the flashcard for display in the FlashcardItem component
      return {
        id: flashcard.id,
        frontText: flashcard.frontText,
        backText: flashcard.backText,
        difficulty: flashcard.difficulty,
        setName: flashcard.set ? flashcard.set.title : 'Unknown Set',
      }
    },
  },
}
</script>
