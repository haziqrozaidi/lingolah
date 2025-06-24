<template>
  <div class="quizzes-page">
    <h1>Malay Language Quizzes</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading quizzes...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <p class="text-red-700">{{ error }}</p>
      <button
        @click="loadQuizzes"
        class="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
      >
        Try again
      </button>
    </div>

    <!-- Quizzes Grid -->
    <div v-else class="quiz-grid">
      <!-- Beginner Level -->
      <div class="difficulty-section" v-if="beginnerQuizzes.length > 0">
        <h2>Beginner Level</h2>
        <div class="quiz-cards">
          <QuizCard
            v-for="quiz in beginnerQuizzes"
            :key="quiz.id"
            :title="quiz.title"
            :description="quiz.description"
            :difficulty="quiz.difficulty"
            :type="quiz.type"
            :question-count="quiz.questions.length"
            @click="startQuiz(quiz.id)"
          />
        </div>
      </div>

      <!-- Intermediate Level -->
      <div class="difficulty-section" v-if="intermediateQuizzes.length > 0">
        <h2>Intermediate Level</h2>
        <div class="quiz-cards">
          <QuizCard
            v-for="quiz in intermediateQuizzes"
            :key="quiz.id"
            :title="quiz.title"
            :description="quiz.description"
            :difficulty="quiz.difficulty"
            :type="quiz.type"
            :question-count="quiz.questions.length"
            @click="startQuiz(quiz.id)"
          />
        </div>
      </div>

      <!-- Advanced Level -->
      <div class="difficulty-section" v-if="advancedQuizzes.length > 0">
        <h2>Advanced Level</h2>
        <div class="quiz-cards">
          <QuizCard
            v-for="quiz in advancedQuizzes"
            :key="quiz.id"
            :title="quiz.title"
            :description="quiz.description"
            :difficulty="quiz.difficulty"
            :type="quiz.type"
            :question-count="quiz.questions.length"
            @click="startQuiz(quiz.id)"
          />
        </div>
      </div>
    </div>

    <!-- Quiz Modal -->
    <QuizModal v-if="activeQuiz" :quiz-type="activeQuiz" @close="activeQuiz = null" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import QuizCard from '@/components/quiz/QuizCard.vue'
import QuizModal from '@/components/quiz/QuizModal.vue'
import { QuizService } from '@/services/quizService' // import your service
import { useRouter } from 'vue-router'

const router = useRouter()

const quizzes = ref([])
const loading = ref(true)
const error = ref(null)
const activeQuiz = ref(null)

// Load quizzes
const loadQuizzes = async () => {
  try {
    loading.value = true
    error.value = null

    const data = await QuizService.getAllQuizzes()
    quizzes.value = data
  } catch (err) {
    console.error('Error loading quizzes:', err)
    error.value = 'Failed to load quizzes. Please try again.'
  } finally {
    loading.value = false
  }
}

// Filtered computed lists by difficulty
const beginnerQuizzes = computed(() => quizzes.value.filter((q) => q.difficulty === 'easy'))

const intermediateQuizzes = computed(() => quizzes.value.filter((q) => q.difficulty === 'medium'))

const advancedQuizzes = computed(() => quizzes.value.filter((q) => q.difficulty === 'hard'))

// Start quiz
const startQuiz = (quizId) => {
  router.push({ name: 'quiz', params: { quizId: quizId } })

  // Alternatively, you can set activeQuiz to open a modal
  // activeQuiz.value = quizId
}
// Load on mount
onMounted(() => {
  loadQuizzes()
})
</script>

<style scoped>
.quizzes-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #163b8d;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.difficulty-section {
  margin-bottom: 3rem;
}

.difficulty-section h2 {
  color: #163b8d;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.quiz-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.quiz-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .quiz-cards {
    grid-template-columns: 1fr;
  }
}
</style>
