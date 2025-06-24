import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const userId = ref(null)
  const localUserId = ref(null) // This can be used to store a local user ID if needed
  const username = ref(null)
  const email = ref(null)
  const role = ref(null)
  const isUserLoaded = ref(false)

  // Set user from Clerk and extract data
  const setUserData = async (clerkUser) => {
    if (clerkUser) {
      userId.value = clerkUser.id
      username.value =
        clerkUser.username ||
        clerkUser.firstName ||
        clerkUser.primaryEmailAddress?.emailAddress.split('@')[0]
      email.value = clerkUser.primaryEmailAddress?.emailAddress

      // Extract role from publicMetadata if it exists, otherwise assign 'member'
      if (clerkUser.publicMetadata && clerkUser.publicMetadata.role) {
        role.value = clerkUser.publicMetadata.role
      } else {
        role.value = 'member'
      }

      isUserLoaded.value = true

      // Send user data to backend
      await sendUserDataToBackend()
    }
  }

  // Send user data to backend using Fetch API
  const sendUserDataToBackend = async () => {
    try {
      console.log('Sending user data to backend:', {
        clerkUserId: userId.value,
        username: username.value,
        email: email.value,
        role: role.value,
      })

      const response = await fetch('http://localhost:3000/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkUserId: userId.value,
          username: username.value,
          email: email.value,
          role: role.value,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log('User data sent successfully')
      const data = await response.json()
      localUserId.value = data.user.id 
    } catch (error) {
      console.error('Failed to sync user data with backend:', error)
    }
  }

  return {
    // State
    userId,
    localUserId,
    username,
    email,
    role,
    isUserLoaded,
    // Actions
    setUserData,
    sendUserDataToBackend,
  }
})
