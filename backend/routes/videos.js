const express = require("express");
const router = express.Router();
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Get all videos
router.get("/", async (req, res) => {
  try {
    const videos = await prisma.video.findMany();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all videos with watch status for a specific user
router.get("/with-progress/:clerkUserId", async (req, res) => {
  try {
    const { clerkUserId } = req.params;

    // First, find the user by clerkUserId
    const user = await prisma.user.findFirst({
      where: { clerkUserId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all videos with their progress status for this user
    const videos = await prisma.video.findMany({
      include: {
        progress: {
          where: {
            userId: user.id
          }
        }
      }
    });

    // Transform the data to include a simple 'watched' boolean
    const videosWithWatchStatus = videos.map(video => ({
      ...video,
      watched: video.progress.length > 0,
      watchDate: video.progress.length > 0 ? video.progress[0].watchDate : null
    }));

    res.json(videosWithWatchStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark a video as watched by a user
router.post("/mark-watched", async (req, res) => {
  try {
    const { clerkUserId, videoId } = req.body;

    if (!clerkUserId || !videoId) {
      return res.status(400).json({ error: 'User ID and Video ID are required' });
    }

    // First, find the user by clerkUserId
    const user = await prisma.user.findFirst({
      where: { clerkUserId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if progress already exists
    const existingProgress = await prisma.videoProgress.findFirst({
      where: {
        userId: user.id,
        videoId
      }
    });

    if (existingProgress) {
      // Update existing progress
      await prisma.videoProgress.update({
        where: {
          userId_videoId: {
            userId: user.id,
            videoId
          }
        },
        data: {
          watchDate: new Date()
        }
      });
    } else {
      // Create new progress record
      await prisma.videoProgress.create({
        data: {
          userId: user.id,
          videoId,
          watchDate: new Date()
        }
      });
    }

    res.json({ success: true, message: 'Video marked as watched' });
  } catch (error) {
    console.error('Error marking video as watched:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a video by its YouTube ID
router.get("/youtube/:youtubeId", async (req, res) => {
  try {
    const { youtubeId } = req.params;

    // Search for the video by the YouTube ID extracted from the URL
    const video = await prisma.video.findFirst({
      where: {
        url: {
          contains: youtubeId,
        },
      },
    });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new video
router.post("/", async (req, res) => {
  try {
    const { title, url, description, topic, subtitles } = req.body;
    const video = await prisma.video.create({
      data: { title, url, description, topic, subtitles },
    });
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a video
router.delete("/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    
    console.log('Deleting video with ID:', videoId); // Debug log
    
    await prisma.video.delete({ where: { id: videoId } }); // Use 'id' instead of 'video_id'
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a video
router.put("/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, url, description, topic, subtitles } = req.body;
    
    console.log('Updating video with ID:', videoId); // Debug log
    
    const updated = await prisma.video.update({
      where: { id: videoId }, // Use 'id' instead of 'video_id' since that's the Prisma field name
      data: { title, url, description, topic, subtitles },
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
