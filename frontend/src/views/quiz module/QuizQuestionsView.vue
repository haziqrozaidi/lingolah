<script>
import QuestionsList from '@/components/quiz/QuestionsList.vue'
import TermQuestion from '@/components/quiz/TermQuestion.vue'
import McqQuestion from '@/components/quiz/McqQuestion.vue'
// import MatchQuestion from '@/components/quiz/MatchQuestion.vue'
import { QuizService } from '@/services/quizService' // import your service
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'QuizQuestionsView',
  components: {
    QuestionsList,
    TermQuestion,
    McqQuestion,
    // MatchQuestion,
  },
  setup() {
    const questions = ref([])
    const route = useRoute()
    const quizId = route.params.quizId
    const quiz = ref({})

    // Fetch questions from the service
    const fetchQuestions = async () => {
      quiz.value = await QuizService.getQuizById(quizId)
      questions.value = quiz.value.questions
      for (let i = 0; i < questions.value.length; i++) {
        questions.value[i].id = `${i + 1}`
      }
    }

    onMounted(() => {
      fetchQuestions()
    })

    return {
      questions,
      quiz,
      // quizId,
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
    <!-- <QuestionsList v-bind:goTo="goToQuestion" question-number="8" /> -->

    <pre>{{ quiz }}</pre>
    <!-- <pre>{{ numOfQuestions }}</pre> -->
    <!-- <pre>{{ quizId }}</pre> -->
    <div class="question-container">
      <div v-for="question in questions" :key="question.id">
        <div v-if="question.type === 'term'">
          <TermQuestion :id="question.id" :term="question.question" />
        </div>
        <div v-else-if="question.type === 'mcq'">
          <McqQuestion :id="question.id" :term="question.question" :options="question.options" />
        </div>
        <div v-else-if="question.type === 'match'">
          <!-- <MatchQuestion
            :id="question.id"
            :leftItems="question.matchPairs.leftItem"
            :rightItems="question.matchPairs.rightItem"
          /> -->
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
