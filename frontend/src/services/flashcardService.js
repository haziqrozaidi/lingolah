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

  // Note: Create, Update, and Delete methods are not implemented yet as requested
}
