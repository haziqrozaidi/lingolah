<template>
  <div class="questions-manager">
    <!-- Header -->
    <div class="header">
      <h2>Manage Questions</h2>
      <p class="quiz-info">Quiz: {{ quizTitle }} ({{ quizType }})</p>
    </div>

    <!-- Actions -->
    <div class="actions">
      <button @click="showQuestionForm(null)">➕ Add Question</button>
      <button @click="$emit('close')">⬅️ Back to Quizzes</button>
    </div>

    <!-- Questions Table -->
    <table class="questions-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Question</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questions" :key="question.id">
          <td>{{ question.order }}</td>
          <td>{{ question.question }}</td>
          <td><span :class="'tag ' + question.type">{{ question.type.toUpperCase() }}</span></td>
          <td>
            <button @click="showQuestionForm(question)">✏️</button>
            <button @click="confirmDelete(question.id)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form Modal -->
    <div v-if="showFormDialog" class="modal-backdrop" @click.self="showFormDialog = false">
      <div class="modal">
        <h3>{{ currentQuestion.id ? 'Edit Question' : 'Add Question' }}</h3>

        <!-- Question Type -->
        <div class="form-group">
          <label>Question Type</label>
          <select v-model="currentQuestion.type" @change="resetAnswerFields">
            <option v-for="qt in questionTypes" :key="qt.value" :value="qt.value">{{ qt.label }}</option>
          </select>
        </div>

        <!-- Question Text -->
        <div class="form-group">
          <label>Question Text</label>
          <input type="text" v-model="currentQuestion.question" placeholder="Enter the question" />
        </div>

        <!-- Order -->
        <div class="form-group">
          <label>Order</label>
          <input type="number" v-model.number="currentQuestion.order" min="1" max="100" />
        </div>

        <!-- MCQ Choices -->
        <div v-if="currentQuestion.type === 'mcq'" class="form-group">
          <label>Multiple Choice Options</label>
          <div v-for="(choice, index) in currentQuestion.choices" :key="index" class="choice-item">
            <input type="text" v-model="choice.text" placeholder="Option text" />
            <label>
              <input type="checkbox" v-model="choice.isCorrect" /> Correct
            </label>
            <button @click="removeChoice(index)" v-if="currentQuestion.choices.length > 2">❌</button>
          </div>
          <button @click="addChoice">➕ Add Option</button>
        </div>

        <!-- Matching Pairs -->
        <div v-if="currentQuestion.type === 'match'" class="form-group">
          <label>Matching Pairs</label>
          <div v-for="(pair, index) in currentQuestion.matchPairs" :key="index" class="pair-item">
            <input type="text" v-model="pair.leftItem" placeholder="Left item" />
            <span>→</span>
            <input type="text" v-model="pair.rightItem" placeholder="Right item" />
            <button @click="removePair(index)" v-if="currentQuestion.matchPairs.length > 1">❌</button>
          </div>
          <button @click="addPair">➕ Add Pair</button>
        </div>

        <!-- Open Answer -->
        <div v-if="currentQuestion.type === 'open'" class="form-group">
          <label>Correct Answer</label>
          <input type="text" v-model="currentQuestion.correctAnswer" placeholder="Enter correct answer" />
        </div>

        <!-- Footer -->
        <div class="form-actions">
          <button @click="showFormDialog = false">Cancel</button>
          <button @click="saveQuestion">{{ currentQuestion.id ? 'Update' : 'Save' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { QuizService } from '@/services/quizService'

const props = defineProps({
  quizId: {
    type: String,
    required: true
  }
})

const questions = ref([])
const quizTitle = ref('')
const quizType = ref('')
const loading = ref(false)
const saving = ref(false)

const showFormDialog = ref(false)
const currentQuestion = ref(createEmptyQuestion())

const questionTypes = ref([
  { label: 'Multiple Choice', value: 'mcq' },
  { label: 'Matching', value: 'match' },
  { label: 'Open Answer', value: 'open' }
])

onMounted(() => {
  loadQuestions()
  loadQuizInfo()
})

const loadQuestions = async () => {
  try {
    loading.value = true
    questions.value = await QuizService.getQuizQuestions(props.quizId)
  } catch (error) {
    console.error('Error loading questions:', error)
  } finally {
    loading.value = false
  }
}

const loadQuizInfo = async () => {
  try {
    const quiz = await QuizService.getQuizById(props.quizId)
    quizTitle.value = quiz.title
    quizType.value = quiz.type
  } catch (error) {
    console.error('Error loading quiz info:', error)
  }
}

function createEmptyQuestion() {
  return {
    id: null,
    quizId: props.quizId,
    type: 'mcq',
    question: '',
    order: questions.value.length + 1,
    correctAnswer: '',
    choices: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    matchPairs: [
      { leftItem: '', rightItem: '' },
      { leftItem: '', rightItem: '' }
    ]
  }
}

const showQuestionForm = (question) => {
  if (question) {
    currentQuestion.value = JSON.parse(JSON.stringify(question))
    if (!currentQuestion.value.choices) {
      currentQuestion.value.choices = [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    }
    if (!currentQuestion.value.matchPairs) {
      currentQuestion.value.matchPairs = [
        { leftItem: '', rightItem: '' }
      ]
    }
  } else {
    currentQuestion.value = createEmptyQuestion()
  }
  showFormDialog.value = true
}

const resetAnswerFields = () => {
  currentQuestion.value.correctAnswer = ''
  currentQuestion.value.choices = [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]
  currentQuestion.value.matchPairs = [
    { leftItem: '', rightItem: '' }
  ]
}

const addChoice = () => {
  currentQuestion.value.choices.push({ text: '', isCorrect: false })
}

const removeChoice = (index) => {
  currentQuestion.value.choices.splice(index, 1)
}

const addPair = () => {
  currentQuestion.value.matchPairs.push({ leftItem: '', rightItem: '' })
}

const removePair = (index) => {
  currentQuestion.value.matchPairs.splice(index, 1)
}

const saveQuestion = async () => {
  try {
    saving.value = true
    const questionData = {
      quizId: props.quizId,
      type: currentQuestion.value.type,
      question: currentQuestion.value.question,
      order: currentQuestion.value.order,
      correctAnswer: currentQuestion.value.correctAnswer
    }

    if (currentQuestion.value.type === 'mcq') {
      questionData.choices = currentQuestion.value.choices.filter(c => c.text.trim() !== '')
    } else if (currentQuestion.value.type === 'match') {
      questionData.matchPairs = currentQuestion.value.matchPairs.filter(
        p => p.leftItem.trim() !== '' && p.rightItem.trim() !== ''
      )
    }

    if (currentQuestion.value.id) {
      await QuizService.updateQuestion(currentQuestion.value.id, questionData)
    } else {
      await QuizService.addQuestionToQuiz(props.quizId, questionData)
    }

    console.log('Question saved:', questionData.choices)
    await loadQuestions()
    showFormDialog.value = false
  } catch (error) {
    console.error('Error saving question:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (questionId) => {
  if (confirm('Are you sure you want to delete this question?')) {
    deleteQuestion(questionId)
  }
}

const deleteQuestion = async (questionId) => {
  try {
    await QuizService.deleteQuestionFromQuiz(props.quizId, questionId)
    await loadQuestions()
  } catch (error) {
    console.error('Error deleting question:', error)
  }
}
</script>

<style scoped>
.questions-manager {
  padding: 1rem;
}

.header h2 {
  color: #163b8d;
}

.quiz-info {
  color: #666;
  font-style: italic;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.questions-table {
  width: 100%;
  border-collapse: collapse;
}

.questions-table th,
.questions-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: left;
}

.tag {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: white;
}

.tag.mcq {
  background-color: #007bff;
}

.tag.match {
  background-color: #ffc107;
}

.tag.open {
  background-color: #28a745;
}

.choice-item,
.pair-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 500px;
  max-width: 95%;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
