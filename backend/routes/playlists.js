const express = require('express')
const { PrismaClient } = require('../generated/prisma')

const router = express.Router()
const prisma = new PrismaClient()

// Get all playlists for a user
router.get('/user/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params
    
    // First, find the user by clerkUserId
    const user = await prisma.user.findFirst({
      where: { clerkUserId }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    const playlists = await prisma.videoPlaylist.findMany({
      where: { userId: user.id },
      include: {
        videos: {
          include: {
            video: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json(playlists)
  } catch (error) {
    console.error('Error fetching user playlists:', error)
    res.status(500).json({ error: 'Failed to fetch playlists' })
  }
})

// Get a specific playlist with videos
router.get('/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params
    
    const playlist = await prisma.videoPlaylist.findUnique({
      where: { id: playlistId },
      include: {
        user: {
          select: { id: true, username: true }
        },
        videos: {
          include: {
            video: true
          }
        }
      }
    })
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' })
    }
    
    res.json(playlist)
  } catch (error) {
    console.error('Error fetching playlist:', error)
    res.status(500).json({ error: 'Failed to fetch playlist' })
  }
})

// Create a new playlist
router.post('/', async (req, res) => {
  try {
    const { clerkUserId, title } = req.body
    
    if (!clerkUserId || !title) {
      return res.status(400).json({ error: 'Clerk User ID and title are required' })
    }
    
    // First, find the user by clerkUserId
    const user = await prisma.user.findFirst({
      where: { clerkUserId }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    const playlist = await prisma.videoPlaylist.create({
      data: {
        userId: user.id,
        title
      }
    })
    
    res.status(201).json(playlist)
  } catch (error) {
    console.error('Error creating playlist:', error)
    res.status(500).json({ error: 'Failed to create playlist' })
  }
})

// Update playlist title
router.put('/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params
    const { title } = req.body
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }
    
    const playlist = await prisma.videoPlaylist.update({
      where: { id: playlistId },
      data: { title }
    })
    
    res.json(playlist)
  } catch (error) {
    console.error('Error updating playlist:', error)
    res.status(500).json({ error: 'Failed to update playlist' })
  }
})

// Delete a playlist
router.delete('/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params
    
    // Delete playlist items first (handled by cascade)
    await prisma.videoPlaylist.delete({
      where: { id: playlistId }
    })
    
    res.json({ message: 'Playlist deleted successfully' })
  } catch (error) {
    console.error('Error deleting playlist:', error)
    res.status(500).json({ error: 'Failed to delete playlist' })
  }
})

// Add video to playlist
router.post('/:playlistId/videos', async (req, res) => {
  try {
    const { playlistId } = req.params
    const { videoId } = req.body
    
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' })
    }
    
    // Check if video is already in playlist
    const existingItem = await prisma.videoPlaylistItems.findFirst({
      where: {
        playlistId,
        videoId
      }
    })
    
    if (existingItem) {
      return res.status(400).json({ error: 'Video already in playlist' })
    }
    
    const playlistItem = await prisma.videoPlaylistItems.create({
      data: {
        playlistId,
        videoId
      },
      include: {
        video: true
      }
    })
    
    res.status(201).json(playlistItem)
  } catch (error) {
    console.error('Error adding video to playlist:', error)
    res.status(500).json({ error: 'Failed to add video to playlist' })
  }
})

// Remove video from playlist
router.delete('/:playlistId/videos/:videoId', async (req, res) => {
  try {
    const { playlistId, videoId } = req.params
    
    await prisma.videoPlaylistItems.delete({
      where: {
        playlistId_videoId: {
          playlistId,
          videoId
        }
      }
    })
    
    res.json({ message: 'Video removed from playlist' })
  } catch (error) {
    console.error('Error removing video from playlist:', error)
    res.status(500).json({ error: 'Failed to remove video from playlist' })
  }
})

module.exports = router
