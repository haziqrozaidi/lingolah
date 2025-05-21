<script>
import QuestionsList from '@/components/quiz/QuestionsList.vue'
import TermQuestion from '@/components/quiz/TermQuestion.vue'
import McqQuestion from '@/components/quiz/McqQuestion.vue'
import MatchQuestion from '@/components/quiz/MatchQuestion.vue'

// import { $ } from 'jquery'
// import { ref } from 'vue'

const questions = [
  // Term questions (English to Malay)
  {
    id: 1,
    type: 'term',
    answer: 'Good night',
    term: 'Selamat malam',
    explanation: 'Used when greeting someone in the evening or before going to sleep',
  },
  {
    id: 2,
    type: 'term',
    answer: 'How are you?',
    term: 'Apa khabar?',
    explanation: 'Literally means "What news?" but used like "How are you?"',
  },
  {
    id: 3,
    type: 'term',
    answer: 'I love you',
    term: 'Saya sayang awak',
    explanation: 'Common way to express love to someone',
  },

  // MCQ questions
  {
    id: 4,
    type: 'mcq',
    term: 'What is the Malay word for "market"?',
    options: ['Sekolah', 'Pejabat', 'Pasar', 'Hospital'],
    correctIndex: 2,
    explanation: '"Pasar" is the Malay word for market',
  },
  {
    id: 5,
    type: 'mcq',
    term: 'How do you say "delicious" in Malay?',
    options: ['Sedap', 'Lapar', 'Haus', 'Mahal'],
    correctIndex: 0,
    explanation: '"Sedap" means delicious or tasty',
  },
  {
    id: 6,
    type: 'mcq',
    term: 'What does "Tolong" mean in English?',
    options: ['Thank you', 'Please', 'Help', 'Sorry'],
    correctIndex: 2,
    explanation: '"Tolong" means "help" but can also be used to say "please" in requests',
  },

  // Matching questions
  {
    id: 7,
    type: 'match',
    leftItems: ['Book', 'Chair', 'Table', 'Pen'],
    rightItems: ['Kerusi', 'Buku', 'Meja', 'Pensel', 'Kertas'],
    correctPairs: [
      [0, 1], // Book - Buku
      [1, 0], // Chair - Kerusi
      [2, 2], // Table - Meja
      [3, 3], // Pen - Pensel
    ],
    explanation: 'Book = Buku, Chair = Kerusi, Table = Meja, Pen = Pensel',
  },
  {
    id: 8,
    type: 'match',
    leftItems: ['Five', 'Seven', 'Nine', 'Ten'],
    rightItems: ['Tujuh', 'Lima', 'Sembilan', 'Sepuluh', 'Enam'],
    correctPairs: [
      [0, 1], // Five - Lima
      [1, 0], // Seven - Tujuh
      [2, 2], // Nine - Sembilan
      [3, 3], // Ten - Sepuluh
    ],
    explanation: 'Five = Lima, Seven = Tujuh, Nine = Sembilan, Ten = Sepuluh',
  },
  {
    id: 9,
    type: 'match',
    leftItems: ['Mother', 'Father', 'Sister', 'Brother'],
    rightItems: ['Bapa', 'Ibu', 'Abang', 'Kakak', 'Adik'],
    correctPairs: [
      [0, 1], // Mother - Ibu
      [1, 0], // Father - Bapa
      [2, 3], // Sister - Kakak
      [3, 2], // Brother - Abang
    ],
    explanation: 'Mother = Ibu, Father = Bapa, Sister = Kakak, Brother = Abang',
  },
]

export default {
  name: 'QuizQuestionsView',
  components: {
    QuestionsList,
    TermQuestion,
    McqQuestion,
    MatchQuestion,
  },
  setup() {
    return {
      questions,
    }
  },
  methods: {
    goToQuestion(event) {
      const questionNumber = Number(event.target.textContent)
      const targetId = `${questionNumber}`
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'auto' /*or smooth*/, block: 'center' })
      }
    },
  },
}
</script>

<template>
  <div class="main-container">
    <QuestionsList v-bind:goTo="goToQuestion" v-bind:questionNumber="questions.length" />
    <div class="question-container">
      <div v-for="question in questions" :key="question.id">
        <div v-if="question.type === 'term'">
          <TermQuestion :id="question.id" :term="question.term" />
        </div>
        <div v-else-if="question.type === 'mcq'">
          <McqQuestion :id="question.id" :term="question.term" :options="question.options" />
        </div>
        <div v-else-if="question.type === 'match'">
          <MatchQuestion
            :id="question.id"
            :leftItems="question.leftItems"
            :rightItems="question.rightItems"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.main-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.question-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: auto;
}
</style>
