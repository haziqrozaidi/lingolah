const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const FlashcardSetService = {
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
  },

  /**
   * Get a single flashcard set by ID
   */
  getFlashcardSetById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/flashcard-sets/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching flashcard set ${id}:`, error)
      throw error
    }
  },

  /**
   * Get all flashcard sets by category
   */
  getFlashcardSetsByCategory: async (categoryId) => {
    try {
      const response = await fetch(`${API_URL}/flashcard-sets/category/${categoryId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching flashcard sets for category ${categoryId}:`, error)
      throw error
    }
  },

  /**
   * Get all categories
   */
  getAllCategories: async () => {
    try {
      const response = await fetch(`${API_URL}/flashcard-sets/categories/all`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  /**
   * Create a new flashcard set
   */
  createFlashcardSet: async (flashcardSetData) => {
    try {
      const response = await fetch(`${API_URL}/flashcard-sets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flashcardSetData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating flashcard set:', error)
      throw error
    }
  },

  /**
   * Update an existing flashcard set
   */
  updateFlashcardSet: async (id, flashcardSetData) => {
    try {
      const response = await fetch(`${API_URL}/flashcard-sets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flashcardSetData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error updating flashcard set ${id}:`, error)
      throw error
    }
  },
}
