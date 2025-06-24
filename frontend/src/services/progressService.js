import { useUserStore } from '@/stores/userStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const ProgressService = {
  /**
   * Update flashcard progress after user review
   * @param {string} cardId - ID of the flashcard
   * @param {number} difficulty - Difficulty rating (1=Hard, 2=Good, 3=Easy)
   * @returns {Promise} - Promise with the updated progress data
   */
  updateFlashcardProgress: async (cardId, difficulty) => {
    try {
      const userStore = useUserStore()
      
      // Ensure user is authenticated
      if (!userStore.userId || !userStore.isUserLoaded) {
        throw new Error('User not authenticated')
      }

      const response = await fetch(`${API_URL}/progress/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-ID': userStore.userId // Send user ID in the header
        },
        body: JSON.stringify({
          cardId,
          difficulty,
          userId: userStore.userId // Also include in the body for API flexibility
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! Status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating flashcard progress:', error)
      throw error
    }
  },

  /**
   * Get progress for a specific flashcard
   * @param {string} cardId - ID of the flashcard
   * @returns {Promise} - Promise with the progress data
   */
  getFlashcardProgress: async (cardId) => {
    try {
      const userStore = useUserStore()
      
      // Ensure user is authenticated
      if (!userStore.userId || !userStore.isUserLoaded) {
        throw new Error('User not authenticated')
      }
      
      const response = await fetch(`${API_URL}/progress/card/${cardId}`, {
        headers: {
          'User-ID': userStore.userId
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching progress for flashcard ${cardId}:`, error)
      throw error
    }
  },

  /**
   * Get all due flashcards for the current user
   * @returns {Promise} - Promise with the due flashcards data
   */
  getDueFlashcards: async () => {
    try {
      const userStore = useUserStore()
      
      // Ensure user is authenticated
      if (!userStore.userId || !userStore.isUserLoaded) {
        throw new Error('User not authenticated')
      }
      
      const response = await fetch(`${API_URL}/progress/due`, {
        headers: {
          'User-ID': userStore.userId
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching due flashcards:', error)
      throw error
    }
  }
}
