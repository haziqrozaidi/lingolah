<script>
import QuestionsList from '@/components/quiz/QuestionsList.vue'
import TermQuestion from '@/components/quiz/TermQuestion.vue'
import McqQuestion from '@/components/quiz/McqQuestion.vue'
import MatchQuestion from '@/components/quiz/MatchQuestion.vue'
import { QuizService } from '@/services/quizService'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import confetti from 'canvas-confetti'
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'QuizQuestionsView',
  components: {
    QuestionsList,
    TermQuestion,
    McqQuestion,
    MatchQuestion,
  },
  setup() {
    const questions = ref([])
    const userAnswers = ref({})
    const wrongAnswers = ref([])
    const route = useRoute()
    const quizId = route.params.quizId
    const quiz = ref({})
    const isSubmitted = ref(false)
    const score = ref(0)
    const totalQuestions = ref(0)
    const wrongAnswersCount = ref(0)
    const userStore = useUserStore()
    const userId = userStore.localUserId

    // Fetch questions from the service
    const fetchQuestions = async () => {
      quiz.value = await QuizService.getQuizById(quizId)
      questions.value = quiz.value.questions
      totalQuestions.value = questions.value.length

      // Initialize user answers object
      userAnswers.value = questions.value.reduce((acc, question) => {
        acc[question.id] = null
        return acc
      }, {})
    }

    const launchConfetti = () => {
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    const submitQuiz = async () => {
      isSubmitted.value = true
      let correctCount = 0

      // Validate each answer
      questions.value.forEach((question) => {
        const userAnswer = userAnswers.value[question.id]

        if (question.type === 'mcq') {
          const correctChoice = question.choices.find((choice) => choice.isCorrect)
          if (userAnswer === correctChoice?.text) {
            correctCount++
          } else wrongAnswers.value.push(question.id)
        } else if (question.type === 'match') {
          // For match questions, we'd need to compare the matched pairs
          // This is simplified - you might need a more complex comparison
          const allCorrect = question.matchPairs.every((pair) =>
            userAnswer?.some(
              (userPair) => userPair.left === pair.leftItem && userPair.right === pair.rightItem,
            ),
          )
          if (allCorrect) correctCount++
          else wrongAnswers.value.push(question.id)
        } else if (question.type === 'term' || question.type === 'open') {
          // For open-ended questions, simple text comparison
          // You might want more sophisticated comparison (case insensitive, etc.)
          if (userAnswer?.toLowerCase() === question.correctAnswer?.toLowerCase()) {
            correctCount++
          } else wrongAnswers.value.push(question.id)
        }
      })

      score.value = correctCount
      wrongAnswersCount.value = totalQuestions.value - correctCount

      if (!userId) console.error('No user ID available - is user logged in?')

      // Here you could also save the attempt to your database
      await QuizService.submitQuizAttempt(quizId, userId, correctCount)
      if (correctCount > 0) {
        launchConfetti()
      }
    }

    const updateAnswer = (questionId, answer) => {
      userAnswers.value[questionId] = answer
    }

    const percentage = computed(() => {
      if (totalQuestions.value === 0) return 0
      return Math.round((score.value / totalQuestions.value) * 100)
    })

    const showResultPopup = ref(true)

    const toggleResultPopup = () => {
      showResultPopup.value = !showResultPopup.value
    }

    onMounted(() => {
      fetchQuestions()
    })

    return {
      questions,
      quiz,
      isSubmitted,
      score,
      totalQuestions,
      wrongAnswersCount,
      userAnswers,
      wrongAnswers,
      percentage,
      userId,
      showResultPopup,
      submitQuiz,
      updateAnswer,
      toggleResultPopup,
    }
  },
  methods: {
    goToQuestion(event) {
      const questionNumber = Number(event.target.textContent)
      const targetId = `${questionNumber}`
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'auto', block: 'center' })
      }
    },
  },
}
</script>

<template>
  <div class="main-container">
    <QuestionsList
      :goTo="goToQuestion"
      :questionNumber="questions.length"
      :userAnswers="userAnswers"
      :wrongAnswers="wrongAnswers"
      :isSubmitted="isSubmitted"
      :questions="questions"
    />

    <!-- <pre>{{ questions }}</pre> -->

    <div class="question-container">
      <div v-for="question in questions" :key="question.id" :id="question.order">
        <!-- Term/Open Question -->
        <div v-if="question.type === 'term' || question.type === 'open'">
          <TermQuestion
            :id="question.order"
            :term="question.question"
            :disabled="isSubmitted"
            @answer="(ans) => updateAnswer(question.id, ans)"
          />
          <div v-if="isSubmitted" class="answer-feedback">
            <p>Your answer: {{ userAnswers[question.id] || 'No answer provided' }}</p>
            <p>Correct answer: {{ question.correctAnswer }}</p>
            <p
              v-if="
                userAnswers[question.id]?.toLowerCase() === question.correctAnswer?.toLowerCase()
              "
              class="correct"
            >
              ✓ Correct
            </p>
            <p v-else class="incorrect">✗ Incorrect</p>
          </div>
        </div>

        <!-- MCQ Question -->
        <div v-else-if="question.type === 'mcq'">
          <McqQuestion
            :id="question.order"
            :term="question.question"
            :options="
              question.choices.map((choice) => ({
                text: choice.text,
                isCorrect: choice.isCorrect,
              }))
            "
            :disabled="isSubmitted"
            @answer="(ans) => updateAnswer(question.id, ans)"
          />
          <div v-if="isSubmitted" class="answer-feedback">
            <p>Your answer: {{ userAnswers[question.id] || 'No answer provided' }}</p>
            <p>Correct answer: {{ question.choices.find((c) => c.isCorrect)?.text }}</p>
            <p
              v-if="userAnswers[question.id] === question.choices.find((c) => c.isCorrect)?.text"
              class="correct"
            >
              ✓ Correct
            </p>
            <p v-else class="incorrect">✗ Incorrect</p>
          </div>
        </div>

        <!-- Match Question -->
        <div v-else-if="question.type === 'match'">
          <MatchQuestion
            :id="question.order"
            :leftItems="question.matchPairs.map((pair) => pair.leftItem)"
            :rightItems="question.matchPairs.map((pair) => pair.rightItem)"
            :disabled="isSubmitted"
            @answer="(ans) => updateAnswer(question.id, ans)"
          />
          <div v-if="isSubmitted" class="answer-feedback">
            <p>Correct pairs:</p>
            <ul>
              <li v-for="pair in question.matchPairs" :key="pair.id">
                {{ pair.leftItem }} → {{ pair.rightItem }}
              </li>
            </ul>
            <p v-if="wrongAnswers.includes(question.id)" class="incorrect">✗ Incorrect</p>
            <p v-else class="correct">✓ Correct</p>
          </div>
        </div>
      </div>

      <div class="quiz-actions">
        <button v-if="!isSubmitted" @click="submitQuiz" class="submit-button">Submit Quiz</button>
      </div>
    </div>

    <!-- Result Popup Modal -->
    <div v-if="isSubmitted && showResultPopup" class="result-popup">
      <button class="close-btn" @click="toggleResultPopup">✖</button>
      <h2>🎉 Quiz Completed!</h2>
      <div class="score-circle">
        <svg viewBox="0 0 36 36" class="circular-chart">
          <path
            class="circle-bg"
            d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="circle"
            :stroke-dasharray="percentage + ', 100'"
            d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" class="percentage-text">{{ percentage }}%</text>
        </svg>
      </div>

      <p class="score-summary">
        You answered <strong>{{ score }}</strong> out of
        <strong>{{ totalQuestions }}</strong> questions correctly.
      </p>

      <div class="result-bar">
        <div class="result-bar-fill" :style="{ width: percentage + '%' }"></div>
      </div>

      <p class="final-remark" v-if="percentage >= 80">🌟 Excellent work!</p>
      <p class="final-remark" v-else-if="percentage >= 50">👍 Good effort, keep practicing!</p>
      <p class="final-remark" v-else>💪 Don’t give up — try again!</p>
    </div>

    <!-- Floating button to reopen popup -->
    <button
      v-if="isSubmitted && !showResultPopup"
      class="floating-result-btn"
      @click="toggleResultPopup"
    >
      📊 Show Results
    </button>
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
  gap: 2rem;
  padding: 1rem;
}
.answer-feedback {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  border-left: 5px solid #dcdcdc;
  transition: all 0.4s ease;
}

.answer-feedback .user-answer,
.answer-feedback .correct-answer {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.answer-feedback .correct {
  color: green;
  font-weight: bold;
}

.answer-feedback .incorrect {
  color: red;
  font-weight: bold;
}

.answer-feedback .feedback-icon {
  font-size: 1.2rem;
  margin-top: 0.5rem;
}

.quiz-results-panel {
  margin-top: 3rem;
  padding: 2rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f0f4ff, #ffffff);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: fadeIn 1s ease forwards;
}

.score-circle {
  margin: 1rem auto;
  width: 150px;
  height: 150px;
}

.circular-chart {
  display: block;
  margin: 10px auto;
  max-width: 100%;
  max-height: 250px;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke: #4caf50;
  stroke-width: 3.8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s ease;
}

.percentage-text {
  fill: #333;
  font-family: sans-serif;
  font-size: 0.6em;
  text-anchor: middle;
}

.score-summary {
  font-size: 1.2rem;
  margin-top: 1rem;
}

.result-bar {
  background-color: #ddd;
  border-radius: 6px;
  overflow: hidden;
  height: 20px;
  width: 80%;
  margin: 1rem auto;
}

.result-bar-fill {
  background-color: #4caf50;
  height: 100%;
  transition: width 1s ease-in-out;
}

.final-remark {
  font-size: 1.3rem;
  font-weight: bold;
  margin-top: 1rem;
}

.result-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.35);
  z-index: 99999; /* Highest priority */
  text-align: center;
  animation: popupFadeIn 0.5s ease forwards;
}

.floating-result-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s;
  z-index: 9999; /* Under popup */
}
.close-btn {
  position: absolute;
  /* color: #000; */
  top: 12px;
  right: 12px;
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
}

.floating-result-btn:hover {
  background-color: #43a047;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45a049;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@keyframes popupFadeIn {
  0% {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}
</style>
