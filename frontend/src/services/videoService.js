const API_BASE_URL = 'http://localhost:3000/api/videos'

// Get all videos
export const getAllVideos = async () => {
  try {
    const response = await fetch(API_BASE_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch videos')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching videos:', error)
    throw error
  }
}

// Get all videos with watch status for a specific user
export const getVideosWithWatchStatus = async (clerkUserId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/with-progress/${clerkUserId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch videos with watch status')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching videos with watch status:', error)
    throw error
  }
}

// Mark a video as watched
export const markVideoAsWatched = async (clerkUserId, videoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mark-watched`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clerkUserId, videoId }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to mark video as watched')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error marking video as watched:', error)
    throw error
  }
}
