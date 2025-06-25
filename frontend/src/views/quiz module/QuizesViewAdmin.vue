<template>
  <div class="admin-quizzes-page">
    <h1>Quiz Management</h1>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="toggleShowCreateModal" class="btn-primary">
        ➕ Create New Quiz
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="loader"></div>
      <p class="mt-4 text-gray-600">Loading quizzes...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-box">
      <p>{{ error }}</p>
      <button @click="loadQuizzes" class="btn-retry">Try again</button>
    </div>

    <!-- Quizzes Table -->
    <div v-else class="quiz-table-container">
      <table class="quiz-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Difficulty</th>
            <th>Type</th>
            <th>Questions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="quiz in quizzes" :key="quiz.id">
            <td>{{ quiz.title }}</td>
            <td>{{ quiz.description || '-' }}</td>
            <td>
              <span class="difficulty-badge" :class="quiz.difficulty">
                {{ quiz.difficulty }}
              </span>
            </td>
            <td>{{ quiz.type }}</td>
            <td>{{ quiz.questions.length }}</td>
            <td class="actions">
              <button @click="editQuiz(quiz)" class="btn-icon">✏️</button>
              <button @click="confirmDelete(quiz.id)" class="btn-icon danger">🗑️</button>
              <button @click="viewQuestions(quiz.id)" class="btn-icon">📋</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal">
        <h2>{{ isEditing ? 'Edit Quiz' : 'Create New Quiz' }}</h2>

        <div class="form-group">
          <label for="quiz-title">Title</label>
          <input id="quiz-title" v-model="currentQuiz.title" type="text" />
        </div>

        <div class="form-group">
          <label for="quiz-description">Description</label>
          <textarea id="quiz-description" v-model="currentQuiz.description" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label for="quiz-difficulty">Difficulty</label>
          <select id="quiz-difficulty" v-model="currentQuiz.difficulty">
            <option v-for="option in difficultyOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="quiz-type">Type</label>
          <select id="quiz-type" v-model="currentQuiz.type">
            <option v-for="option in typeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="modal-actions">
          <button @click="closeModal" class="btn-secondary">Cancel</button>
          <button @click="saveQuiz" class="btn-primary" :disabled="saving">
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay">
      <div class="modal small">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this quiz?</p>
        <div class="modal-actions">
          <button @click="showDeleteConfirm = false" class="btn-secondary">No</button>
          <button @click="deleteQuiz" class="btn-danger">Yes, Delete</button>
        </div>
      </div>
    </div>

    <!-- Questions Manager Placeholder -->
    <div v-if="showQuestionsModal" class="modal-overlay">
      <div class="modal large">
        <h2>Manage Questions: {{ currentQuizTitle }}</h2>
        <QuestionsManager :quizId="currentQuizId" @close="showQuestionsModal = false" />
        <button @click="showQuestionsModal = false" class="btn-secondary mt-4">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { QuizService } from '@/services/quizService'
import { useUserStore } from '@/stores/userStore'
import QuestionsManager from '@/components/quiz/QuestionsManager.vue'

const userStore = useUserStore()
const userId = userStore.localUserId

const quizzes = ref([])
const loading = ref(true)
const error = ref(null)
const saving = ref(false)

const showCreateModal = ref(false)
const showDeleteConfirm = ref(false)
const showQuestionsModal = ref(false)
const isEditing = ref(false)

const currentQuiz = ref({
  id: null,
  userId: userId,
  title: '',
  description: '',
  difficulty: 'medium',
  type: 'mcq'
})

const currentQuizId = ref(null)
const currentQuizTitle = ref('')

const difficultyOptions = ref([
  { label: 'Beginner', value: 'easy' },
  { label: 'Intermediate', value: 'medium' },
  { label: 'Advanced', value: 'hard' }
])

const typeOptions = ref([
  { label: 'Multiple Choice', value: 'mcq' },
  { label: 'Matching', value: 'match' },
  { label: 'Open Ended', value: 'open' }
])

const loadQuizzes = async () => {
  try {
    loading.value = true
    error.value = null
    quizzes.value = await QuizService.getAllQuizzes()
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load quizzes. Please try again.'
  } finally {
    loading.value = false
  }
}

const toggleShowCreateModal = () => {
  showCreateModal.value = !showCreateModal.value
}

const editQuiz = (quiz) => {
  currentQuiz.value = { ...quiz }
  isEditing.value = true
  showCreateModal.value = true
}

const saveQuiz = async () => {
  try {
    saving.value = true
    currentQuiz.value.userId = userId // Ensure userId is set
    console.log('Saving quiz:', currentQuiz.value)
    if (isEditing.value) {
      await QuizService.updateQuiz(currentQuiz.value.id, currentQuiz.value)
    } else {
      await QuizService.createQuiz(currentQuiz.value)
    }
    await loadQuizzes()
    closeModal()
  } catch (err) {
    console.error(err)
    error.value = `Failed to ${isEditing.value ? 'update' : 'create'} quiz.`
  } finally {
    saving.value = false
  }
}

const confirmDelete = (quizId) => {
  currentQuizId.value = quizId
  showDeleteConfirm.value = true
}

const deleteQuiz = async () => {
  try {
    await QuizService.deleteQuiz(currentQuizId.value)
    await loadQuizzes()
  } catch (err) {
    console.error(err)
    error.value = 'Failed to delete quiz.'
  } finally {
    showDeleteConfirm.value = false
    currentQuizId.value = null
  }
}

const viewQuestions = (quizId) => {
  const quiz = quizzes.value.find(q => q.id === quizId)
  currentQuizId.value = quizId
  currentQuizTitle.value = quiz.title
  showQuestionsModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  currentQuiz.value = {
    id: null,
    title: '',
    description: '',
    difficulty: 'medium',
    type: 'mcq'
  }
  isEditing.value = false
}

onMounted(() => {
  loadQuizzes()
})
</script>

<style scoped>
.admin-quizzes-page {
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

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.btn-primary,
.btn-secondary,
.btn-danger,
.btn-retry {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #163b8d;
  color: white;
}

.btn-primary:hover {
  background-color: #1e4da8;
}

.btn-secondary {
  background-color: #e0e0e0;
}

.btn-danger {
  background-color: #c62828;
  color: white;
}

.btn-retry {
  background-color: #ffcdd2;
  color: #b71c1c;
}

.quiz-table-container {
  overflow-x: auto;
}

.quiz-table {
  width: 100%;
  border-collapse: collapse;
}

.quiz-table th, .quiz-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.quiz-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.difficulty-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.difficulty-badge.easy {
  background-color: #e6f7e6;
  color: #2e7d32;
}

.difficulty-badge.medium {
  background-color: #fff8e1;
  color: #ff8f00;
}

.difficulty-badge.hard {
  background-color: #ffebee;
  color: #c62828;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.btn-icon.danger {
  color: #c62828;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-box {
  background-color: #ffe0e0;
  border-left: 4px solid #c62828;
  padding: 1rem;
  margin-bottom: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.modal.large {
  max-width: 80vw;
}

.modal.small {
  max-width: 400px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
