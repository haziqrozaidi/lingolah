<template>
  <div>
    <FlashcardFilter />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <FlashcardItem v-for="flashcard in flashcards" :key="flashcard.id" :flashcard="flashcard" />
    </div>

    <div v-if="flashcards.length === 0" class="text-center py-8">
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
  data() {
    return {
      flashcards: [
        {
          id: 1,
          frontText: 'What is Vue.js?',
          backText: 'A progressive JavaScript framework for building user interfaces',
          difficulty: 'Easy',
          setName: 'Web Development',
        },
        {
          id: 2,
          frontText: 'What is Tailwind CSS?',
          backText: 'A utility-first CSS framework for rapidly building custom designs',
          difficulty: 'Medium',
          setName: 'Web Development',
        },
        {
          id: 3,
          frontText: 'What is a component in Vue?',
          backText: 'Reusable Vue instances with a name',
          difficulty: 'Medium',
          setName: 'Vue Basics',
        },
        {
          id: 4,
          frontText: 'What are Vue directives?',
          backText: 'Special attributes with the v- prefix',
          difficulty: 'Hard',
          setName: 'Vue Advanced',
        },
        {
          id: 5,
          frontText: 'What is Vuex?',
          backText: 'State management pattern + library for Vue.js applications',
          difficulty: 'Hard',
          setName: 'Vue Advanced',
        },
        {
          id: 6,
          frontText: 'What is Vue Router?',
          backText: 'The official router for Vue.js',
          difficulty: 'Medium',
          setName: 'Vue Basics',
        },
      ],
    }
  },
}
</script>
