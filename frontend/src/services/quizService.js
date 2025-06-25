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
   * Submit an attempt for a quiz
   */
  submitQuizAttempt: async (quizId, userId, score) => {
    try {
      // Verify userId exists before sending
      if (!userId) {
        throw new Error('userId is required')
      }

      console.log('Submitting with:', { quizId, userId, score }) // Debug log

      const response = await fetch(`${API_URL}/api/quizzes/${quizId}/attempts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // If using auth
        },
        body: JSON.stringify({
          userId: String(userId), // Explicit conversion
          score: Number(score),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Server response error:', errorData)
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error submitting attempt:`, error)
      throw error
    }
  },
  /**
   * Get all attempts for a quiz by a specific user
   */
  getQuizAttempts: async (quizId, userId) => {
    try {
      let url = `${API_URL}/api/quizzes/${quizId}/attempts/${userId}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching attempts for quiz ${quizId}:`, error)
      throw error
    }
  },

  /**
   * Create a new quiz
   */
  createQuiz: async (quizData) => {
    try {
      if (!quizData.userId) {
      quizData.userId = localStorage.getItem('localUserId')
      if (!quizData.userId) {
        throw new Error('userId is required')
      }
      }
      const response = await fetch(`${API_URL}/api/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: quizData.title,
          userId: quizData.userId,
          description: quizData.description,
          difficulty: quizData.difficulty,
          type: quizData.type,
          questions: quizData.questions, // Array of questions [{ text, options, correctAnswer }]
        }),
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
   * Get all questions for a quiz
   */
  getQuizQuestions: async (quizId) => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes/${quizId}/questions`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching questions for quiz ${quizId}:`, error)
      throw error
    }
  },

  /**
   * Delete a question from a quiz
   */
  deleteQuestionFromQuiz: async (quizId, questionId) => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes/${quizId}/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! Status: ${response.status}`)
      }
      return true
    } catch (error) {
      console.error(`Error deleting question ${questionId} from quiz ${quizId}:`, error)
      throw error
    }
  },

  /**
   * Add a question to a quiz
   */
  addQuestionToQuiz: async (quizId, questionData) => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes/${quizId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error adding question to quiz ${quizId}:`, error)
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: quizData.title,
          description: quizData.description,
          difficulty: quizData.difficulty,
          type: quizData.type,
          questions: quizData.questions,
        }),
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
        method: 'DELETE',
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
  },
}
