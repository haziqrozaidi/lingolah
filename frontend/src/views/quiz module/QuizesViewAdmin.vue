<template>
  <div class="admin-quizzes-page">
    <h1>Quiz Management</h1>
    
    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="showCreateModal = true" class="btn-primary">
        <i class="pi pi-plus"></i> Create New Quiz
      </button>
    </div>

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
              <button @click="editQuiz(quiz)" class="btn-icon" title="Edit">
                <i class="pi pi-pencil"></i>
              </button>
              <button @click="confirmDelete(quiz.id)" class="btn-icon danger" title="Delete">
                <i class="pi pi-trash"></i>
              </button>
              <button @click="viewQuestions(quiz.id)" class="btn-icon" title="View Questions">
                <i class="pi pi-list"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Quiz Modal -->
    <Dialog v-model:visible="showCreateModal" header="Create New Quiz" :modal="true">
      <div class="form-group">
        <label for="quiz-title">Title</label>
        <InputText id="quiz-title" v-model="currentQuiz.title" />
      </div>
      
      <div class="form-group">
        <label for="quiz-description">Description</label>
        <Textarea id="quiz-description" v-model="currentQuiz.description" rows="3" />
      </div>
      
      <div class="form-group">
        <label for="quiz-difficulty">Difficulty</label>
        <Dropdown 
          id="quiz-difficulty" 
          v-model="currentQuiz.difficulty" 
          :options="difficultyOptions" 
          optionLabel="label"
          optionValue="value"
        />
      </div>
      
      <div class="form-group">
        <label for="quiz-type">Type</label>
        <Dropdown 
          id="quiz-type" 
          v-model="currentQuiz.type" 
          :options="typeOptions" 
          optionLabel="label"
          optionValue="value"
        />
      </div>
      
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" @click="closeModal" class="p-button-text" />
        <Button 
          :label="isEditing ? 'Update' : 'Create'" 
          icon="pi pi-check" 
          @click="saveQuiz" 
          :loading="saving"
        />
      </template>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog 
      v-model:visible="showDeleteConfirm" 
      header="Confirm Deletion" 
      :modal="true"
      :style="{ width: '450px' }"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>Are you sure you want to delete this quiz?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" @click="showDeleteConfirm = false" class="p-button-text" />
        <Button label="Yes" icon="pi pi-check" @click="deleteQuiz" class="p-button-danger" />
      </template>
    </Dialog>

    <!-- Questions Management Dialog -->
    <Dialog 
      v-model:visible="showQuestionsModal" 
      :header="`Manage Questions: ${currentQuizTitle}`" 
      :modal="true"
      :style="{ width: '80vw', maxWidth: '1200px' }"
    >
      <QuestionsManager 
        v-if="showQuestionsModal" 
        :quiz-id="currentQuizId" 
        @close="showQuestionsModal = false"
      />
    </Dialog>
  </div>
</template>

<script setup>
import { ref,  onMounted } from 'vue'
import { QuizService } from '@/services/quizService'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import QuestionsManager from '@/components/admin/QuestionsManager.vue'


const quizzes = ref([])
const loading = ref(true)
const error = ref(null)
const saving = ref(false)

// Modal states
const showCreateModal = ref(false)
const showDeleteConfirm = ref(false)
const showQuestionsModal = ref(false)
const isEditing = ref(false)

// Current quiz being edited
const currentQuiz = ref({
  id: null,
  title: '',
  description: '',
  difficulty: 'medium',
  type: 'mcq'
})

const currentQuizId = ref(null)
const currentQuizTitle = ref('')

// Options for dropdowns
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

// Load quizzes
const loadQuizzes = async () => {
  try {
    loading.value = true
    error.value = null
    quizzes.value = await QuizService.getAllQuizzes()
  } catch (err) {
    console.error('Error loading quizzes:', err)
    error.value = 'Failed to load quizzes. Please try again.'
  } finally {
    loading.value = false
  }
}

// Edit existing quiz
const editQuiz = (quiz) => {
  currentQuiz.value = { ...quiz }
  isEditing.value = true
  showCreateModal.value = true
}

// Save quiz (create or update)
const saveQuiz = async () => {
  try {
    saving.value = true
    
    if (isEditing.value) {
      await QuizService.updateQuiz(currentQuiz.value.id, currentQuiz.value)
    } else {
      await QuizService.createQuiz(currentQuiz.value)
    }
    
    await loadQuizzes()
    closeModal()
  } catch (err) {
    console.error('Error saving quiz:', err)
    error.value = `Failed to ${isEditing.value ? 'update' : 'create'} quiz. Please try again.`
  } finally {
    saving.value = false
  }
}

// Confirm before deleting
const confirmDelete = (quizId) => {
  currentQuizId.value = quizId
  showDeleteConfirm.value = true
}

// Delete quiz
const deleteQuiz = async () => {
  try {
    await QuizService.deleteQuiz(currentQuizId.value)
    await loadQuizzes()
  } catch (err) {
    console.error('Error deleting quiz:', err)
    error.value = 'Failed to delete quiz. Please try again.'
  } finally {
    showDeleteConfirm.value = false
    currentQuizId.value = null
  }
}

// View questions for a quiz
const viewQuestions = (quizId) => {
  const quiz = quizzes.value.find(q => q.id === quizId)
  currentQuizId.value = quizId
  currentQuizTitle.value = quiz.title
  showQuestionsModal.value = true
}

// Close modal
const closeModal = () => {
  showCreateModal.value = false
  currentQuiz.value = {
    id: null,
    title: '',
    description: '',
    difficulty: 'medium',
    type: 'mcq'
  }
}

// Load on mount
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

.btn-primary {
  background-color: #163b8d;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background-color: #1e4da8;
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
  color: #163b8d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}

.btn-icon:hover {
  background-color: #f0f0f0;
}

.btn-icon.danger {
  color: #c62828;
}

.btn-icon.danger:hover {
  background-color: #ffebee;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.confirmation-content {
  display: flex;
  align-items: center;
}
</style>