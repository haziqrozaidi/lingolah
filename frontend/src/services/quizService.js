const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const QuizService = {
  /**
   * Get all quizzes
   */
  getAllQuizzes: async () => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      throw error
    }
  },

  /**
   * Get a single quiz by ID
   */
  getQuizById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching quiz ${id}:`, error)
      throw error
    }
  },

  /**
   * Create a new quiz
   */
  createQuiz: async (quizData) => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: quizData.title,
          description: quizData.description,
          difficulty: quizData.difficulty,
          type: quizData.type,
          questions: quizData.questions // Array of questions [{ text, options, correctAnswer }]
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error creating quiz:', error)
      throw error
    }
  },

  /**
   * Update a quiz
   */
  updateQuiz: async (id, quizData) => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: quizData.title,
          description: quizData.description,
          difficulty: quizData.difficulty,
          type: quizData.type,
          questions: quizData.questions
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error updating quiz ${id}:`, error)
      throw error
    }
  },

  /**
   * Delete a quiz
   */
  deleteQuiz: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! Status: ${response.status}`)
      }
      return true
    } catch (error) {
      console.error(`Error deleting quiz ${id}:`, error)
      throw error
    }
  }
}
