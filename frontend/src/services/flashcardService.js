const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const FlashcardService = {
  /**
   * Get all flashcards
   */
  getAllFlashcards: async () => {
    try {
      const response = await fetch(`${API_URL}/flashcards`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching flashcards:', error)
      throw error
    }
  },

  /**
   * Get a single flashcard by ID
   */
  getFlashcardById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/flashcards/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching flashcard ${id}:`, error)
      throw error
    }
  },

  /**
   * Get flashcards by set ID
   */
  getFlashcardsBySetId: async (setId) => {
    try {
      const response = await fetch(`${API_URL}/flashcards/set/${setId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching flashcards for set ${setId}:`, error)
      throw error
    }
  },

  /**
   * Create a new flashcard
   */
  createFlashcard: async (flashcardData) => {
    try {
      const response = await fetch(`${API_URL}/flashcards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          frontText: flashcardData.frontText,
          backText: flashcardData.backText,
          difficulty: flashcardData.difficulty,
          setId: flashcardData.setId
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error creating flashcard:', error)
      throw error
    }
  },

  /**
   * Update a flashcard
   */
  updateFlashcard: async (id, flashcardData) => {
    try {
      const response = await fetch(`${API_URL}/flashcards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          frontText: flashcardData.frontText,
          backText: flashcardData.backText,
          difficulty: flashcardData.difficulty,
          setId: flashcardData.setId
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error updating flashcard ${id}:`, error)
      throw error
    }
  },

  /**
   * Delete a flashcard
   */
  deleteFlashcard: async (id) => {
    try {
      const response = await fetch(`${API_URL}/flashcards/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! Status: ${response.status}`)
      }
      return true
    } catch (error) {
      console.error(`Error deleting flashcard ${id}:`, error)
      throw error
    }
  },

  /**
   * Get all flashcard sets
   */
  getAllFlashcardSets: async () => {
    try {
      const response = await fetch(`${API_URL}/flashcard-sets`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching flashcard sets:', error)
      throw error
    }
  }
}
