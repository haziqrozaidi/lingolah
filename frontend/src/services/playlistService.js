const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_BASE_URL = `${API_URL}/api/playlists`

// Get all playlists for a user
export const getUserPlaylists = async (clerkUserId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${clerkUserId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch user playlists')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching user playlists:', error)
    throw error
  }
}

// Get a specific playlist with videos
export const getPlaylist = async (playlistId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${playlistId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch playlist')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching playlist:', error)
    throw error
  }
}

// Get a specific playlist with videos and watch status for a user
export const getPlaylistWithWatchStatus = async (playlistId, clerkUserId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${playlistId}/with-progress/${clerkUserId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch playlist with watch status')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching playlist with watch status:', error)
    throw error
  }
}

// Create a new playlist
export const createPlaylist = async (clerkUserId, title) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clerkUserId, title }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create playlist')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating playlist:', error)
    throw error
  }
}

// Update playlist title
export const updatePlaylist = async (playlistId, title) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${playlistId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update playlist')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error updating playlist:', error)
    throw error
  }
}

// Delete a playlist
export const deletePlaylist = async (playlistId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${playlistId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete playlist')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error deleting playlist:', error)
    throw error
  }
}

// Add video to playlist
export const addVideoToPlaylist = async (playlistId, videoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${playlistId}/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to add video to playlist')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error adding video to playlist:', error)
    throw error
  }
}

// Remove video from playlist
export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${playlistId}/videos/${videoId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to remove video from playlist')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error removing video from playlist:', error)
    throw error
  }
}
